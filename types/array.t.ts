import type { BaseTypeSchema } from "./index.t"

export type ArraySchema =
  | BaseTypeSchema<(string | number | boolean)[], "array", true>
  | BaseTypeSchema<(string | number | boolean)[], "array", false>

/**
 * Фабрика для типа массива
 * @example
 * ```typescript
 * types.array.required([])
 * types.array.optional()
 * types.array(['item1', 'item2'])
 * ```
 */
export type ArrayType = {
  required: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => BaseTypeSchema<T[], "array", true> & ((options?: { title?: string }) => BaseTypeSchema<T[], "array", true>)

  optional: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => BaseTypeSchema<T[], "array", false> & ((options?: { title?: string }) => BaseTypeSchema<T[], "array", false>)

  <T extends string | number | boolean = string>(defaultValue?: T[]): BaseTypeSchema<T[], "array"> &
    ((options?: { title?: string }) => BaseTypeSchema<T[], "array">)
}
