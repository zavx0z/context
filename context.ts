import type { ContextInstance, DeepReadonly, Schema, Snapshot, Values } from "./context.t"
import { types } from "./types"
import type { TypesDefinition, Types } from "./types/index.t"

/* ------------------------------- утилиты ---------------------------------- */

const isPrimitiveOrNull = (v: unknown): v is string | number | boolean | null =>
  v === null || (typeof v !== "object" && typeof v !== "function")

const assertNonObject = (value: unknown, msg: string) => {
  if (!isPrimitiveOrNull(value)) {
    throw new TypeError(msg)
  }
}

const isFlatPrimitiveArray = (v: unknown): v is Array<string | number | boolean | null> =>
  Array.isArray(v) && v.every(isPrimitiveOrNull)

/** Копия массива с заморозкой (элементы — примитивы, так что глубокая не нужна) */
const freezeArray = <T extends Array<unknown>>(arr: T): T => Object.freeze(arr.slice()) as T

/* ------------------------------- Базовый класс ---------------------------- */

export abstract class ContextBase<C extends TypesDefinition> implements ContextInstance<C> {
  protected contextData!: Values<C>
  protected schemaDefinition!: C
  protected updateSubscribers = new Set<(updated: Partial<Values<C>>) => void>()
  private contextView!: DeepReadonly<Values<C>>

  protected initializeContext(schema: C): void {
    for (const key in schema) {
      const def = schema[key]
      if (!def) continue

      let val: any

      if ("default" in def && def.default !== undefined) {
        if (def.type === "array") {
          if (!isFlatPrimitiveArray(def.default)) {
            throw new TypeError(`[Context] "${key}": default для типа array должен быть плоским массивом примитивов.`)
          }
          val = freezeArray(def.default as any)
        } else {
          assertNonObject(
            def.default,
            `[Context] "${key}": default должен быть примитивом или null (объекты запрещены).`
          )
          val = def.default
        }
      } else {
        switch (def.type) {
          case "string":
            val = def.required ? "" : null
            break
          case "number":
            val = def.required ? 0 : null
            break
          case "boolean":
            val = def.required ? false : null
            break
          case "enum":
            val = def.required ? (def as any).values[0] : null
            break
          case "array":
            val = def.required ? freezeArray<any>([]) : null
            break
          default:
            val = null
        }
      }

      this.contextData[key as keyof Values<C>] = val
    }

    Object.seal(this.contextData)
    this.contextView = this.#createReadOnlyView()
  }

  #createReadOnlyView(): DeepReadonly<Values<C>> {
    const view: any = {}
    for (const key of Object.keys(this.schemaDefinition)) {
      Object.defineProperty(view, key, {
        enumerable: true,
        configurable: false,
        get: () => this.contextData[key as keyof Values<C>],
      })
    }
    return Object.freeze(view)
  }

  get context(): Values<C> {
    return this.contextView as Values<C>
  }

  get schema(): Schema<C> {
    const serializedSchema = {} as Schema<C>
    for (const [key, definition] of Object.entries(this.schemaDefinition)) {
      const out: any = {
        type: definition.type,
        required: definition.required,
      }
      if ("default" in definition && definition.default !== undefined) out.default = definition.default
      if ("title" in definition && definition.title) out.title = definition.title
      if ("values" in definition && definition.values) out.values = definition.values
      ;(serializedSchema as any)[key] = out
    }
    return serializedSchema
  }

  /**
   * Обновляет значения в контексте
   * @template C - Схема контекста
   * @param values - Значения для обновления
   * @returns Значения, которые были обновлены
   * 
   * Обновляет только существующие ключи. Игнорирует undefined.
   * 
   * {@includeCode ./test/context.basic.spec.ts}
   * {@includeCode ./test/context.types.spec.ts}
   */
  update = (values: Partial<Values<C>>): Partial<Values<C>> => {
    const entries = Object.entries(values).filter(([, v]) => v !== undefined) as [string, any][]
    const updated: Partial<Values<C>> = {}

    for (const [key, nextRaw] of entries) {
      if (!(key in this.contextData)) continue

      const def: any = (this.schemaDefinition as any)[key]
      let next = nextRaw

      // Проверяем null для required полей
      if (nextRaw === null && def?.required) {
        throw new TypeError(`Поле ${key} не может быть null`)
      }

      if (def?.type === "array") {
        if (nextRaw === null) {
          // null разрешен для optional массивов
          next = nextRaw
        } else if (!isFlatPrimitiveArray(nextRaw)) {
          throw new TypeError(
            `[Context.update] "${key}": ожидается плоский массив примитивов (string | number | boolean | null).`
          )
        } else {
          next = freezeArray(nextRaw)
        }
      } else {
        assertNonObject(
          nextRaw,
          `[Context.update] "${key}": объекты и функции запрещены (используйте core или сериализуйте).`
        )
      }

      const prev = (this.contextData as any)[key]
      if (prev !== next) {
        ;(this.contextData as any)[key] = next
        ;(updated as any)[key] = next
      }
    }

    if (Object.keys(updated).length > 0) {
      for (const cb of this.updateSubscribers) cb(updated)
    }
    return updated
  }

  onUpdate(callback: (updated: Partial<Values<C>>) => void): () => void {
    this.updateSubscribers.add(callback)
    return () => this.updateSubscribers.delete(callback)
  }

  get snapshot() {
    const context: Snapshot<C> = {} as Snapshot<C>
    for (const [key, value] of Object.entries(this.schema)) {
      context[key as keyof C] = {
        type: value.type,
        required: value.required,
        default: value.default,
        ...(value.title ? { title: value.title } : {}),
        ...(value.values ? { values: value.values } : {}),
        value: this.context[key as keyof C],
      }
    }
    return context
  }
}

/* -------------------------------- Реализации -------------------------------- */

export class Context<C extends TypesDefinition> extends ContextBase<C> {
  constructor(schema: (types: Types) => C) {
    super()
    this.schemaDefinition = schema(types)
    this.contextData = {} as Values<C>
    this.initializeContext(this.schemaDefinition)
  }
}

export class ContextClone<C extends TypesDefinition> extends ContextBase<C> {
  static fromSnapshot<C extends TypesDefinition>(snapshot: Schema<C>): ContextClone<C> {
    const ctx = new ContextClone<C>()
    ctx.schemaDefinition = snapshot as unknown as C
    ctx.contextData = {} as Values<C>
    ctx.initializeContext(ctx.schemaDefinition)
    return ctx
  }

  /** Восстановление значений с валидацией и заморозкой массивов */
  restoreValues(values: Values<C>): void {
    for (const key of Object.keys(this.schemaDefinition)) {
      const def: any = (this.schemaDefinition as any)[key]
      const v = (values as any)[key]

      if (def?.type === "array") {
        if (v == null) {
          ;(this.contextData as any)[key] = v
        } else if (isFlatPrimitiveArray(v)) {
          ;(this.contextData as any)[key] = freezeArray(v)
        } else {
          throw new TypeError(`[Context.restoreValues] "${key}": ожидается плоский массив примитивов.`)
        }
      } else {
        assertNonObject(v, `[Context.restoreValues] "${key}": объекты запрещены.`)
        ;(this.contextData as any)[key] = v
      }
    }
  }
}
