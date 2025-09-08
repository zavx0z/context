import type { ArraySchema, ArrayType } from "./array.t"
import type { BooleanType, BooleanSchema } from "./boolean.t"
import type { EnumType, EnumSchema } from "./enum.t"
import type { NumberType, NumberSchema } from "./number.t"
import type { StringType, StringSchema } from "./string.t"
/**
 * Базовое определение схемы типа
 * @template T - Тип значения
 * @template TypeName - Название типа ("string", "number", "boolean", "array", "enum")
 */
export interface BaseTypeSchema<
  T,
  TypeName extends "string" | "number" | "boolean" | "array" | "enum",
  Required extends boolean = false
> {
  type: TypeName
  required: Required
  title?: string
  default?: T | undefined
}

/**
 * Схема контекста - объект, где ключи - это имена полей, а значения - определения типов
 *
 * @example
 * ```typescript
 * const schema: Schema = {
 *   name: { type: "string", required: true, default: "Anonymous" },
 *   age: { type: "number", required: true, default: 18 },
 *   isActive: { type: "boolean", required: true, default: false },
 *   userIds: { type: "array", required: true, default: [] },
 *   status: { type: "enum", required: true, values: ["pending", "active"], default: "pending" }
 * }
 * ```
 */
export type SchemaDefinition = Record<string, StringSchema | NumberSchema | BooleanSchema | ArraySchema | EnumSchema>

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
 */
export type Types = {
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
  string: StringType
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
  number: NumberType
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
  boolean: BooleanType
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
  array: ArrayType
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
  enum: EnumType
}
