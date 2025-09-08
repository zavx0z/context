import { createArrayType } from "./array"
import { createBooleanType } from "./boolean"
import { createNumberType } from "./number"
import { createStringType } from "./string"

/**
 * Фабрика типов для создания схемы контекста
 *
 * Предоставляет методы для создания типизированных полей контекста:
 * - `string` - строковые значения
 * - `number` - числовые значения
 * - `boolean` - булевы значения
 * - `array` - массивы (рекомендуется хранить только ID)
 * - `enum` - перечисления
 *
 * Каждый тип поддерживает методы `.required()` и `.optional()` для указания обязательности поля.
 *
 * @example
 * ```typescript
 * .context((types) => ({
 *   // Обязательные поля
 *   name: types.string.required("Anonymous"),
 *   age: types.number.required(18),
 *   isActive: types.boolean.required(false),
 *
 *   // Опциональные поля
 *   email: types.string.optional(),
 *   avatar: types.string.optional(),
 *
 *   // Массивы (храним только ID)
 *   userIds: types.array.required([]),
 *
 *   // Enum
 *   status: types.enum.required(["pending", "active", "blocked"]),
 * }))
 * ```
 *
 * {@includeCode ./test/context.basic.spec.ts#allTypes}
 */

export const types = {
  /**
   * Создает строковый тип
   * @param defaultValue - Значение по умолчанию (создает optional тип)
   * @returns Объект с методами required() и optional()
   *
   * @example
   * ```typescript
   * // Обязательное поле
   * name: types.string.required("Anonymous")
   *
   * // Опциональное поле
   * email: types.string.optional()
   *
   * // С дефолтным значением
   * title: types.string("Default Title")
   * ```
   */
  string: Object.assign((defaultValue?: string) => createStringType.optional(defaultValue), createStringType),

  /**
   * Создает числовой тип
   * @param defaultValue - Значение по умолчанию (создает optional тип)
   * @returns Объект с методами required() и optional()
   *
   * @example
   * ```typescript
   * // Обязательное поле
   * age: types.number.required(18)
   *
   * // Опциональное поле
   * score: types.number.optional()
   *
   * // С дефолтным значением
   * count: types.number(0)
   * ```
   */
  number: Object.assign((defaultValue?: number) => createNumberType.optional(defaultValue), createNumberType),

  /**
   * Создает булевый тип
   * @param defaultValue - Значение по умолчанию (создает optional тип)
   * @returns Объект с методами required() и optional()
   *
   * @example
   * ```typescript
   * // Обязательное поле
   * isActive: types.boolean.required(false)
   *
   * // Опциональное поле
   * isVerified: types.boolean.optional()
   *
   * // С дефолтным значением
   * enabled: types.boolean(true)
   * ```
   */
  boolean: Object.assign((defaultValue?: boolean) => createBooleanType.optional(defaultValue), createBooleanType),

  /**
   * Создает тип массива
   * @param defaultValue - Значение по умолчанию (создает optional тип)
   * @returns Объект с методами required() и optional()
   *
   * @example
   * ```typescript
   * // Обязательное поле
   * userIds: types.array.required([])
   *
   * // Опциональное поле
   * tags: types.array.optional()
   *
   * // С дефолтным значением
   * items: types.array(["default"])
   * ```
   */
  array: Object.assign((defaultValue?: any[]) => createArrayType.optional(defaultValue), createArrayType),

  /**
   * Создает тип перечисления
   * @param values - Массив допустимых значений
   * @returns Функция с дефолтным значением или объект с методами required() и optional()
   *
   * @example
   * ```typescript
   * // Обязательное поле
   * status: types.enum("pending", "active", "blocked").required("pending")
   *
   * // Опциональное поле
   * theme: types.enum("light", "dark").optional()
   *
   * // С дефолтным значением
   * role: types.enum("user", "admin")("user")
   * ```
   */
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    const enumBase = {
      /**
       * Создает обязательный тип перечисления
       * @param defaultValue - Значение по умолчанию
       * @returns Функция для создания типа перечисления с опциями
       *
       * @example
       * ```typescript
       * status: types.enum("pending", "active", "blocked").required("pending")
       * ```
       */
      required: (defaultValue?: T[number]) => {
        const base = { type: "enum" as const, required: true as const, values, default: defaultValue }
        const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
        return Object.assign(configurator, base)
      },
      /**
       * Создает опциональный тип перечисления
       * @param defaultValue - Значение по умолчанию
       * @returns Функция для создания типа перечисления с опциями
       *
       * @example
       * ```typescript
       * theme: types.enum("light", "dark").optional()
       * ```
       */
      optional: (defaultValue?: T[number]) => {
        const base = { type: "enum" as const, required: false as const, values, default: defaultValue }
        const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
        return Object.assign(configurator, base)
      },
    }
    return Object.assign((defaultValue?: T[number]) => enumBase.optional(defaultValue), enumBase)
  },
}
