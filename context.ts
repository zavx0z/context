import type { Context, Snapshot, Values } from "./context.t"
import type { Schema } from "./schema.t"

/**
 * Создает контекст из готовой схемы.
 *
 * @param schema - Схема контекста
 * @returns Функциональный контекст с методами update, onUpdate и иммутабельным доступом
 *
 * @example
 * ```ts
 * const schema = contextSchema((t) => ({
 *   name: t.string.required("Гость", { label: "Имя" }),
 *   age: t.number.optional()
 * }))
 * const ctx = contextFromSchema(schema)
 * ```
 */
export function contextFromSchema<C extends Schema>(schema: C): Context<C> {
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
  /** Сравнение массивов по содержимому (для плоских массивов примитивов) */
  const arraysEqual = (
    a: Array<string | number | boolean | null> | null,
    b: Array<string | number | boolean | null> | null
  ): boolean => {
    if (a === b) return true
    if (!Array.isArray(a) || !Array.isArray(b)) {
      // Если один из них null или не массив, они равны только если оба null или оба не массивы
      return a === b
    }
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false
    }
    return true
  }
  /* ------------------------------- утилиты ---------------------------------- */

  // Приватные данные контекста (замыкание)
  const data = {} as Values<C>
  const updateSubscribers = new Set<(updated: Partial<Values<C>>) => void>()

  // Инициализация контекста
  function initializeContext(schema: C): void {
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
      ;(data as any)[key] = val
    }
    Object.seal(data)
  }

  // Создание read-only контекста
  function createReadOnlyContext(): Values<C> {
    const view: any = {}
    for (const key of Object.keys(schema)) {
      Object.defineProperty(view, key, {
        enumerable: true,
        configurable: false,
        get: () => data[key as keyof Values<C>],
      })
    }
    return Object.freeze(view)
  }

  // Функция обновления
  function update(values: Partial<Values<C>>): Partial<Values<C>> {
    const entries = Object.entries(values).filter(([, v]) => v !== undefined) as [string, any][]
    const updated: Partial<Values<C>> = {}

    for (const [key, nextRaw] of entries) {
      if (!(key in data)) continue

      const def: any = (schema as any)[key]
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

      const prev = (data as any)[key]
      // Для массивов используем сравнение по содержимому, для остальных — по значению
      let hasChanged: boolean
      if (def?.type === "array") {
        // Для массивов сравниваем по содержимому, а не по ссылке
        const prevArray = prev as Array<string | number | boolean | null> | null
        const nextArray = next as Array<string | number | boolean | null> | null
        const areEqual = arraysEqual(prevArray, nextArray)
        hasChanged = !areEqual
      } else {
        hasChanged = prev !== next
      }
      if (hasChanged) {
        ;(data as any)[key] = next
        ;(updated as any)[key] = next
      }
    }

    if (Object.keys(updated).length > 0) {
      for (const cb of updateSubscribers) cb(updated)
    }
    return updated
  }

  function onUpdate(callback: (updated: Partial<Values<C>>) => void): () => void {
    updateSubscribers.add(callback)
    return () => updateSubscribers.delete(callback)
  }

  function clearSubscribers(): void {
    updateSubscribers.clear()
  }

  function getSnapshot(): Snapshot<C> {
    const context: Snapshot<C> = {} as Snapshot<C>
    for (const [key, value] of Object.entries(schema)) {
      context[key as keyof C] = {
        type: value.type,
        ...(value.required && { required: true }),
        ...(value.default && value.default !== undefined && { default: value.default }),
        ...(value.label && { label: value.label }),
        ...(value.values && { values: value.values }),
        ...(value.id && { id: true }),
        ...(value.data && { data: value.data }),
        value: readOnlyContext[key as keyof C],
      } as any
    }
    return context
  }

  // Инициализируем контекст
  initializeContext(schema)
  const readOnlyContext = createReadOnlyContext()

  // Возвращаем объект контекста
  return {
    schema,
    context: readOnlyContext,
    update,
    onUpdate,
    clearSubscribers,
    get snapshot() {
      return getSnapshot()
    },
  }
}
