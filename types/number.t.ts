import type { BaseTypeSchema } from "./index.t"

export type NumberSchema = BaseTypeSchema<number, "number", true> | BaseTypeSchema<number, "number", false>
/**
 * Фабрика для числового типа
 * @example
 * ```typescript
 * types.number.required(18)
 * types.number.optional()
 * types.number(0)
 * ```
 */
export type NumberType = {
  required: <T extends number = number>(
    defaultValue?: T
  ) => BaseTypeSchema<number, "number", true> &
    ((options?: { title?: string }) => BaseTypeSchema<number, "number", true>)

  optional: <T extends number = number>(
    defaultValue?: T
  ) => BaseTypeSchema<number, "number", false> &
    ((options?: { title?: string }) => BaseTypeSchema<number, "number", false>)

  <T extends number = number>(defaultValue?: T): BaseTypeSchema<number, "number"> &
    ((options?: { title?: string }) => BaseTypeSchema<number, "number">)
}
