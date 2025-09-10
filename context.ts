import type { DeepReadonly, Snapshot, Values, NormalizeSchema } from "./context.t"
import { normalizeSchema } from "./context.t"
import { types } from "./types"
import type { Schema } from "./index.t"
import type { Types } from "./index.t"

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

/* ----------------------------`--- Базов`ый класс ---------------------------- */

/**
 * Базовый класс для контекста
 * @template C - Чистая схема (нормализованная)
 */
export abstract class ContextBase<C extends Schema> {
  protected contextData!: Values<C>
  schema!: C
  protected updateSubscribers = new Set<(updated: Partial<Values<C>>) => void>()
  private contextView!: DeepReadonly<Values<C>>

  protected initializeContext(schema: C): void {
    for (const key in schema) {
      const def = schema[key as keyof C] as any
      if (!def) continue

      let val: any
      if ("default" in def && def.default !== undefined) {
        if (def.type === "array") {
          if (!isFlatPrimitiveArray(def.default)) {
            throw new TypeError(
              `[Context] "${String(key)}": default для типа array должен быть плоским массивом примитивов.`
            )
          }
          val = freezeArray(def.default as any)
        } else {
          assertNonObject(
            def.default,
            `[Context] "${String(key)}": default должен быть примитивом или null (объекты запрещены).`
          )
          val = def.default
        }
      } else {
        def.type === "string" && (val = def.required ? "" : null)
        def.type === "number" && (val = def.required ? 0 : null)
        def.type === "boolean" && (val = def.required ? false : null)
        def.type === "enum" && (val = def.required ? def.values?.[0] : null)
        def.type === "array" && (val = def.required ? freezeArray<any>([]) : null)
      }
      ;(this.contextData as any)[key] = val
    }

    Object.seal(this.contextData)
    this.contextView = this.#createReadOnlyView()
  }

  #createReadOnlyView(): DeepReadonly<Values<C>> {
    const view: any = {}
    for (const key of Object.keys(this.schema)) {
      Object.defineProperty(view, key, {
        enumerable: true,
        configurable: false,
        get: () => this.contextData[key as keyof Values<C>],
      })
    }
    return Object.freeze(view)
  }

  /** {@inheritDoc Values} */
  get context(): Values<C> {
    return this.contextView as Values<C>
  }

  /**
   * Обновляет значения в контексте
   * @param values - Значения для обновления
   * @returns Значения, которые были обновлены
   *
   * Обновляет только существующие ключи. Игнорирует undefined.
   *
   */
  update = (values: Partial<Values<C>>): Partial<Values<C>> => {
    const entries = Object.entries(values).filter(([, v]) => v !== undefined) as [string, any][]
    const updated: Partial<Values<C>> = {}

    for (const [key, nextRaw] of entries) {
      if (!(key in this.contextData)) continue

      const def: any = (this.schema as any)[key]
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
          // Проверяем соответствие типов элементов массива
          const defaultArray = (def as any).default
          if (defaultArray && Array.isArray(defaultArray) && defaultArray.length > 0) {
            const expectedType = typeof defaultArray[0]
            const hasTypeMismatch = nextRaw.some((item) => typeof item !== expectedType)
            if (hasTypeMismatch) {
              throw new TypeError(
                `[Context.update] "${key}": ожидается массив элементов типа '${expectedType}', получен массив с элементами разных типов.`
              )
            }
          }
          next = freezeArray(nextRaw)
        }
      } else if (def?.type === "enum") {
        const allowed = (def as any).values as ReadonlyArray<string | number>
        if (nextRaw === null) {
          next = nextRaw
        } else if (!allowed?.includes(nextRaw as any)) {
          const variants = Array.isArray(allowed) ? allowed.map(String).join("' или '") : String(allowed)
          throw new TypeError(`Поле ${key} должно быть '${variants}', получено '${String(nextRaw)}'`)
        } else {
          next = nextRaw
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
  /**
   * Подписка на обновления контекста
   * @template C - Схема контекста
   * @param callback - Функция, которая будет вызываться при обновлении контекста
   * @returns Функция для отписки от обновлений
   */
  onUpdate(callback: (updated: Partial<Values<C>>) => void): () => void {
    this.updateSubscribers.add(callback)
    return () => this.updateSubscribers.delete(callback)
  }

  /** {@inheritDoc Snapshot} */
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

export class Context<S, C extends Schema = NormalizeSchema<S>> extends ContextBase<C> {
  constructor(schema: S | ((types: Types) => S)) {
    super()
    const raw = typeof schema === "function" ? (schema as (t: Types) => S)(types) : schema

    const clean = normalizeSchema(raw) as unknown as C

    this.schema = clean
    this.contextData = {} as Values<C>
    this.initializeContext(this.schema)
  }
}

export class ContextClone<S, C extends Schema = NormalizeSchema<S>> extends ContextBase<C> {
  static fromSnapshot<S, C extends Schema = NormalizeSchema<S>>(snapshot: C): ContextClone<S, C> {
    const ctx = new ContextClone<S, C>()
    ctx.schema = snapshot
    ctx.contextData = {} as Values<C>
    ctx.initializeContext(ctx.schema)
    return ctx
  }

  /** Восстановление значений с валидацией и заморозкой массивов */
  restoreValues(values: Values<C>): void {
    for (const key of Object.keys(this.schema)) {
      const def: any = (this.schema as any)[key]
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
