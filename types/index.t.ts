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
 * @template T - Базовое определение типа
 */

export type RequiredDefinition<T> = T & { required: true }
/**
 * Опциональное поле
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
 * Фабрики типов для создания схем контекста
 * @example
 * ```typescript
 * types.string.required('Гость')
 * types.number.optional()
 * types.boolean.required()
 * types.array().optional()
 * types.enum('user', 'admin').required('user')
 * ```
 */
export type ContextTypes = {
  string: StringTypeFactory
  number: NumberTypeFactory
  boolean: BooleanTypeFactory
  array: ArrayTypeFactory
  enum: EnumTypeFactory
}
