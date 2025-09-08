import type { RequiredArrayDefinition, OptionalArrayDefinition, ArrayTypeFactory } from "./array.t"
import type { RequiredBooleanDefinition, OptionalBooleanDefinition, BooleanTypeFactory } from "./boolean.t"
import type { RequiredEnumDefinition, OptionalEnumDefinition, EnumTypeFactory } from "./enum.t"
import type { RequiredNumberDefinition, OptionalNumberDefinition, NumberTypeFactory } from "./number.t"
import type { RequiredStringDefinition, OptionalStringDefinition, StringTypeFactory } from "./string.t"

/**
 * Базовое определение типа
 * @template T - Тип значения
 * @template TypeName - Название типа ("string", "number", "boolean", "array", "enum")
 */
export interface BaseDefinition<T, TypeName extends string> {
  type: TypeName
  title?: string
  default?: T | undefined
}

/**
 * Обязательное поле
 *
 * {@includeCode ./index.spec.ts#required}
 *
 * @template T - Базовое определение типа
 */
export type RequiredDefinition<T> = T & { required: true }

/**
 * Опциональное поле
 *
 * {@includeCode ./index.spec.ts#optional}
 *
 * @template T - Базовое определение типа
 */
export type OptionalDefinition<T> = T & { required: false }

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
export type TypesDefinition = Record<
  string,
  | RequiredStringDefinition
  | OptionalStringDefinition
  | RequiredNumberDefinition
  | OptionalNumberDefinition
  | RequiredBooleanDefinition
  | OptionalBooleanDefinition
  | RequiredArrayDefinition<string | number | boolean>
  | OptionalArrayDefinition<string | number | boolean>
  | RequiredEnumDefinition<readonly (string | number)[]>
  | OptionalEnumDefinition<readonly (string | number)[]>
>

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
  string: StringTypeFactory
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
  number: NumberTypeFactory
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
  boolean: BooleanTypeFactory
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
  array: ArrayTypeFactory
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
  enum: EnumTypeFactory
}
