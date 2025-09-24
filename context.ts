import type { Snapshot, Values } from "./context.t"
import type { NormalizeSchema } from "./schema.t"
import { normalizeSchema } from "./schema"
import { types } from "./types"
import type { Schema } from "./schema.t"
import type { Types } from "./types.t"

/* ------------------------------- утилиты ---------------------------------- */

const isPrimitiveOrNull = (v: unknown): v is string | number | boolean | null =>
  v === null || (typeof v !== "object" && typeof v !== "function")

const assertNonObject = (value: unknown, msg: string) => {
  if (!isPrimitiveOrNull(value)) throw new TypeError(msg)
}

const isFlatPrimitiveArray = (v: unknown): v is Array<string | number | boolean | null> =>
  Array.isArray(v) && v.every(isPrimitiveOrNull)

/** Копия массива с заморозкой (элементы — примитивы, так что глубокая не нужна) */
const freezeArray = <T extends Array<unknown>>(arr: T): T => Object.freeze(arr.slice()) as T

/* -------------------------------- Контекст -------------------------------- */

export class Context<S = any, C extends Schema = NormalizeSchema<S>> {
  protected data!: Values<C>
  /** {@link Schema | Схема контекста} */
  schema!: C
  protected updateSubscribers = new Set<(updated: Partial<Values<C>>) => void>()
  /** Иммутабельный объект значений контекста */
  context!: Values<C>

  constructor(schema: S | ((types: Types) => S))
  constructor(schema: C, options: { raw: true })
  constructor(schema: any, options?: { raw: true }) {
    if (options?.raw) {
      this.schema = schema as C
    } else {
      const raw = typeof schema === "function" ? (schema as (t: Types) => S)(types) : (schema as S)
      const clean = normalizeSchema(raw) as unknown as C
      this.schema = clean
    }
    this.data = {} as Values<C>
    this.initializeContext(this.schema)
  }

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
      ;(this.data as any)[key] = val
    }

    Object.seal(this.data)
    this.context = this.#createReadOnlyContext()
  }

  #createReadOnlyContext(): Values<C> {
    const view: any = {}
    for (const key of Object.keys(this.schema)) {
      Object.defineProperty(view, key, {
        enumerable: true,
        configurable: false,
        get: () => this.data[key as keyof Values<C>],
      })
    }
    return Object.freeze(view)
  }

  /** {@link Update | Обновление значений контекста} */
  update = (values: Partial<Values<C>>): Partial<Values<C>> => {
    const entries = Object.entries(values).filter(([, v]) => v !== undefined) as [string, any][]
    const updated: Partial<Values<C>> = {}

    for (const [key, nextRaw] of entries) {
      if (!(key in this.data)) continue

      const def: any = (this.schema as any)[key]
      let next = nextRaw

      // Проверяем null для required полей
      if (nextRaw === null && def?.required) {
        throw new TypeError(`[Context.update] "${key}": поле не может быть null`)
      }

      if (def?.type === "array") {
        if (nextRaw === null) {
          next = nextRaw // null разрешен для optional массивов
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
          next = nextRaw // null разрешен для optional enum
        } else if (!allowed?.includes(nextRaw as any)) {
          const variants = Array.isArray(allowed) ? allowed.map(String).join("' или '") : String(allowed)
          throw new TypeError(`[Context.update] "${key}": должно быть '${variants}', получено '${String(nextRaw)}'`)
        } else {
          next = nextRaw
        }
      } else {
        assertNonObject(
          nextRaw,
          `[Context.update] "${key}": объекты и функции запрещены (используйте core или сериализуйте).`
        )
      }

      const prev = (this.data as any)[key]
      if (prev !== next) {
        ;(this.data as any)[key] = next
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
   *
   * {@includeCode ./context.spec.ts#onUpdate}
   */
  onUpdate: (callback: (updated: Partial<Values<C>>) => void) => () => void = (callback) => {
    this.updateSubscribers.add(callback)
    return () => this.updateSubscribers.delete(callback)
  }

  /** {@inheritDoc Snapshot} */
  get snapshot() {
    const context: Snapshot<C> = {} as Snapshot<C>
    for (const [key, value] of Object.entries(this.schema)) {
      context[key as keyof C] = {
        type: value.type,
        ...(value.required && { required: true }),
        ...(value.default && value.default !== undefined && { default: value.default }),
        ...(value.title && { title: value.title }),
        ...(value.values && { values: value.values }),
        ...(value.id && { id: true }),
        ...(value.data && { data: value.data }),
        value: this.context[key as keyof C],
      } as any
    }
    return context
  }
}

/**
 * Создать контекст из готовой схемы (без значений). Схема может быть уже нормализована.
 */
export function fromSchema<C extends Schema>(schema: C): Context<C, NormalizeSchema<C>> {
  return new Context<C, NormalizeSchema<C>>(schema as unknown as NormalizeSchema<C>, { raw: true })
}

/**
 * Создать контекст из полного снимка (schema + value)
 */
export function fromSnapshot<C extends Schema>(snapshot: Snapshot<C>): Context<C, NormalizeSchema<C>> {
  // Формируем схему из snapshot без поля value
  const schema: any = {}
  for (const [key, snap] of Object.entries(snapshot as any)) {
    const { value: _value, ...rest } = snap as any
    schema[key] = rest
  }
  const ctx = new Context<C, NormalizeSchema<C>>(schema as NormalizeSchema<C>, { raw: true })
  // Восстановим значения через update(), чтобы применились валидации и freeze массивов
  const values: any = {}
  for (const [key, snap] of Object.entries(snapshot as any)) {
    values[key] = (snap as any).value
  }
  ctx.update(values)
  return ctx
}
