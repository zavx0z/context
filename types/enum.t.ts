import type { OptionalDefinition, RequiredDefinition } from "./index.t"

/**
 * Фабрика для типа перечисления
 * @example
 * ```typescript
 * types.enum('user', 'admin').required('user')
 * types.enum('pending', 'active').optional()
 * types.enum('low', 'high')('medium')
 * ```
 */

export type EnumTypeFactory = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  required: (
    defaultValue?: T[number]
  ) => RequiredEnumDefinition<T> & ((options?: { title?: string }) => RequiredEnumDefinition<T>)

  optional: (
    defaultValue?: T[number]
  ) => OptionalEnumDefinition<T> & ((options?: { title?: string }) => OptionalEnumDefinition<T>)

  (defaultValue?: T[number]): OptionalEnumDefinition<T>
}

/**
 * Опциональное поле перечисления
 * @template T - Массив допустимых значений
 * @example
 * ```typescript
 * theme: types.enum.optional(["light", "dark"])
 * language: types.enum.optional(["ru", "en"])
 * ```
 */
export interface OptionalEnumDefinition<T extends readonly (string | number)[]>
  extends OptionalDefinition<T[number], "enum"> {}

/**
 * Обязательное поле перечисления
 * @template T - Массив допустимых значений
 * @example
 * ```typescript-
 * status: types.enum.required(["pending", "active", "blocked"])
 * role: types.enum.required(["user", "admin"])
 * ```
 */
export interface RequiredEnumDefinition<T extends readonly (string | number)[]>
  extends RequiredDefinition<T[number], "enum"> {}
