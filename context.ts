/**
 * Модуль для создания типизированных контекстов и схем параметров
 * @packageDocumentation
 */

import type {
  ContextTypes,
  ContextSchema,
  ExtractValues,
  UpdateValues,
  JsonPatch,
  ContextInstance,
} from "./context.t.js"

export * from "./context.t.js"

const createStringType = {
  required: (params = {}) => ({ type: "string" as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: "string" as const, required: false as const, ...params }),
}
const createNumberType = {
  required: (params = {}) => ({ type: "number" as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: "number" as const, required: false as const, ...params }),
}
const createBooleanType = {
  required: (params = {}) => ({ type: "boolean" as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: "boolean" as const, required: false as const, ...params }),
}
const createArrayType = {
  required: (params = {}) => ({ type: "array" as const, required: true as const, ...params }),
  optional: (params = {}) => ({ type: "array" as const, required: false as const, ...params }),
}

/**
 * Набор фабрик для создания описаний типов параметров контекста.
 * Используется для построения схемы контекста.
 *
 * @example
 * const schema = {
 *   name: types.string.required({ default: 'Гость' }),
 *   age: types.number.optional(),
 *   role: types.enum('user', 'admin').required({ default: 'user' })
 * }
 */
export const types: ContextTypes = {
  string: Object.assign((params = {}) => createStringType.optional(params), createStringType),
  number: Object.assign((params = {}) => createNumberType.optional(params), createNumberType),
  boolean: Object.assign((params = {}) => createBooleanType.optional(params), createBooleanType),
  array: Object.assign((params = {}) => createArrayType.optional(params), createArrayType),
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    const enumBase = {
      required: (options = {}) => ({ type: "enum" as const, required: true as const, values, ...options }),
      optional: (options = {}) => ({ type: "enum" as const, required: false as const, values, ...options }),
    }
    return Object.assign((options = {}) => enumBase.optional(options), enumBase)
  },
}

/**
 * Класс для работы с типизированными контекстами.
 * Позволяет создавать, читать, обновлять и клонировать контекст на основе схемы.
 *
 * @typeParam T - Схема контекста (ContextSchema)
 *
 * @example
 * const schema = {name: types.string.required()}
 * const ctx = new Context(schema)
 * ctx.context // доступ к значениям
 * ctx.update({name: 'Новое имя'})
 */
export class Context<T extends ContextSchema> implements ContextInstance<T> {
  /** @internal */
  private contextData: ExtractValues<T>
  /** @internal */
  private immutableContext: ExtractValues<T>
  /**
   * Список подписчиков на обновления контекста.
   * Каждый подписчик получает массив JSON Patch при изменении.
   * @internal
   */
  private updateSubscribers: Array<(patches: JsonPatch[]) => void> = []

  /**
   * Создает новый экземпляр контекста на основе схемы.
   * @param schema - Схема контекста
   */
  constructor(schema: T) {
    this.contextData = {} as ExtractValues<T>
    this.initializeContext(schema)
    this.immutableContext = this.createImmutableContext()
  }

  /**
   * Инициализирует значения контекста по умолчанию согласно схеме.
   * @param schema - Схема контекста
   */
  private initializeContext(schema: T): void {
    for (const key in schema) {
      const definition = schema[key]
      if (!definition) continue

      if ("default" in definition && definition.default !== undefined) {
        ;(this.contextData as any)[key] = definition.default
      } else {
        switch (definition.type) {
          case "string":
            ;(this.contextData as any)[key] = definition.required ? "" : null
            break
          case "number":
            ;(this.contextData as any)[key] = definition.required ? 0 : null
            break
          case "boolean":
            ;(this.contextData as any)[key] = definition.required ? false : null
            break
          case "array":
            ;(this.contextData as any)[key] = definition.required ? [] : null
            break
          case "enum":
            const enumDef = definition as any
            ;(this.contextData as any)[key] = definition.required ? enumDef.values[0] : null
            break
        }
      }
    }
  }

  /**
   * Создает иммутабельный (только для чтения) прокси-объект для доступа к значениям контекста.
   * @returns Иммутабельный объект контекста
   */
  private createImmutableContext(): ExtractValues<T> {
    const immutableContext = new Proxy({} as ExtractValues<T>, {
      get: (_, prop) => {
        return (this.contextData as any)[prop]
      },
      set: (_, prop) => {
        throw new Error(
          `Прямое изменение контекста запрещено. Используйте метод update() для изменения значений. Попытка изменить: ${String(
            prop
          )}`
        )
      },
      deleteProperty: (_, prop) => {
        throw new Error(`Удаление свойств контекста запрещено. Попытка удалить: ${String(prop)}`)
      },
    })

    Object.freeze(immutableContext)
    return immutableContext
  }

  /**
   * Текущее состояние контекста (только для чтения).
   * @readonly
   */
  get context(): ExtractValues<T> {
    return this.immutableContext
  }

  /**
   * Подписка на обновления контекста.
   * Позволяет получать уведомления о каждом update в виде массива JSON Patch (RFC 6902).
   * Возвращает функцию для отписки.
   *
   * @param callback - функция, вызываемая при обновлении контекста
   * @returns функция для отписки
   *
   * @example
   * const unsubscribe = ctx.onUpdate(patches => {console.log('Изменения:', patches)})
   * // ...
   * unsubscribe() // для отписки
   */
  onUpdate(callback: (patches: JsonPatch[]) => void): () => void {
    this.updateSubscribers.push(callback)
    return () => {
      const idx = this.updateSubscribers.indexOf(callback)
      if (idx !== -1) this.updateSubscribers.splice(idx, 1)
    }
  }

  /**
   * Обновляет значения в контексте.
   * Только переданные значения будут обновлены, остальные останутся без изменений.
   *
   * @param values - Объект с новыми значениями
   * @returns Обновленный контекст
   *
   * @example
   * context.update({name: 'Новое имя', age: 30})
   */
  update(values: UpdateValues<ExtractValues<T>>): ExtractValues<T> {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined)
    ) as Partial<ExtractValues<T>>

    // Формируем JSON Patch только для реально измененных значений
    const patches: JsonPatch[] = []
    for (const [key, value] of Object.entries(filteredValues)) {
      const currentValue = (this.contextData as any)[key]

      // Проверяем, действительно ли значение изменилось
      if (value === null) {
        // Для null — если текущее значение не null, делаем replace с value: null
        if (currentValue !== null) {
          patches.push({ op: "replace", path: `/${key}`, value: null })
        }
      } else {
        // Для обычных значений — сравниваем с текущим
        if (currentValue !== value) {
          patches.push({ op: "replace", path: `/${key}`, value })
        }
      }
    }

    // Обновляем данные только если есть реальные изменения
    if (patches.length > 0) {
      Object.assign(this.contextData, filteredValues)
      // Оповещаем подписчиков
      for (const cb of this.updateSubscribers) {
        try {
          cb(patches)
        } catch {}
      }
    }

    return { ...this.contextData }
  }

  /**
   * Создает новый экземпляр контекста с текущими значениями (глубокое копирование).
   * @returns Новый экземпляр Context
   */
  clone(): Context<T> {
    const newContext = new Context({} as T)
    newContext.contextData = { ...this.contextData }
    newContext.immutableContext = newContext.createImmutableContext()
    return newContext
  }
}

/**
 * Фабричная функция для создания типизированного контекста.
 * Позволяет создавать контекст на основе схемы или функции, принимающей types.
 *
 * @typeParam T - Схема контекста (ContextSchema)
 * @param schema - Схема контекста или функция, принимающая types и возвращающая схему
 * @returns Объект с иммутабельным контекстом и методом update
 *
 * @example
 * const ctx = createContext(types => ({name: types.string.required()}))
 * ctx.context // доступ к значениям
 * ctx.update({name: 'Новое имя'})
 */
export function createContext<const T extends ContextSchema>(
  schema: ((types: ContextTypes) => T) | T
): ContextInstance<T> {
  const actualSchema = typeof schema === "function" ? (schema as any)(types) : (schema as T)
  const contextInstance = new Context(actualSchema)

  return {
    context: contextInstance.context,
    update: contextInstance.update.bind(contextInstance),
    onUpdate: contextInstance.onUpdate.bind(contextInstance),
  }
}
