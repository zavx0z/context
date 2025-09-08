import type { BaseDefinition, OptionalDefinition, RequiredDefinition } from "./index.t"

/**
 * Фабрика для типа массива
 * @example
 * ```typescript
 * types.array.required([])
 * types.array.optional()
 * types.array(['item1', 'item2'])
 * ```
 */

export type ArrayTypeFactory = {
  required: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => RequiredArrayDefinition<T> & ((options?: { title?: string }) => RequiredArrayDefinition<T>)

  optional: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => OptionalArrayDefinition<T> & ((options?: { title?: string }) => OptionalArrayDefinition<T>)

  <T extends string | number | boolean = string>(defaultValue?: T[]): OptionalArrayDefinition<T>
}
/**
 * Опциональное поле массива
 * @template T - Тип элементов массива
 * @example
 * ```typescript
 * tags: types.array.optional()
 * categories: types.array.optional()
 * ```
 */

export type OptionalArrayDefinition<T extends string | number | boolean> = OptionalDefinition<BaseArrayDefinition<T>>
/**
 * Обязательное поле массива
 * @template T - Тип элементов массива
 * @example
 * ```typescript
 * // Массив ID пользователей
 * userIds: types.array.required([])
 *
 * // Массив ID постов
 * postIds: types.array.required([])
 * ```
 */

export type RequiredArrayDefinition<T extends string | number | boolean> = RequiredDefinition<BaseArrayDefinition<T>>
/**
 * Базовое определение типа массива
 * @template T - Тип элементов массива (string, number, boolean)
 * @property type - Тип поля ("array")
 * @property title - Опциональное название поля для документации
 * @property default - Значение по умолчанию (массив)
 *
 * @example
 * ```typescript
 * // Массив строк (ID пользователей)
 * userIds: types.array.required([])
 *
 * // Массив чисел (ID постов)
 * postIds: types.array.required([])
 * ```
 */

export interface BaseArrayDefinition<T extends string | number | boolean> extends BaseDefinition<T[], "array"> {}
