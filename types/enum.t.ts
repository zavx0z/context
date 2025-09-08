import type { BaseDefinition, OptionalDefinition, RequiredDefinition } from "./index.t"

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

export type OptionalEnumDefinition<T extends readonly (string | number)[]> = OptionalDefinition<BaseEnumDefinition<T>>
/**
 * Обязательное поле перечисления
 * @template T - Массив допустимых значений
 * @example
 * ```typescript-
 * status: types.enum.required(["pending", "active", "blocked"])
 * role: types.enum.required(["user", "admin"])
 * ```
 */

export type RequiredEnumDefinition<T extends readonly (string | number)[]> = RequiredDefinition<BaseEnumDefinition<T>>
/**
 * Базовое определение типа перечисления
 * @template T - Массив допустимых значений
 * @property type - Тип поля ("enum")
 * @property values - Массив допустимых значений
 * @property title - Опциональное название поля для документации
 * @property default - Значение по умолчанию
 *
 * @example
 * ```typescript
 * // Перечисление статусов
 * status: types.enum.required(["pending", "active", "blocked"])
 *
 * // Перечисление ролей
 * role: types.enum.required(["user", "admin", "moderator"])
 * ```
 */

export interface BaseEnumDefinition<T extends readonly (string | number)[]> extends BaseDefinition<T[number], "enum"> {
  values: T
}
