import type { OptionalDefinition, RequiredDefinition } from "./index.t"

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

export interface OptionalArrayDefinition<T extends string | number | boolean>
  extends OptionalDefinition<T[], "array"> {}
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

export interface RequiredArrayDefinition<T extends string | number | boolean>
  extends RequiredDefinition<T[], "array"> {}
