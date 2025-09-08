import type { BaseType } from "./index.t"

export type ArrayType =
  | BaseType<(string | number | boolean)[], "array", true>
  | BaseType<(string | number | boolean)[], "array", false>
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
  ) => BaseType<T[], "array", true> & ((options?: { title?: string }) => BaseType<T[], "array", true>)

  optional: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => BaseType<T[], "array", false> & ((options?: { title?: string }) => BaseType<T[], "array", false>)

  <T extends string | number | boolean = string>(defaultValue?: T[]): BaseType<T[], "array"> &
    ((options?: { title?: string }) => BaseType<T[], "array">)
}
