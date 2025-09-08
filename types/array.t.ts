import type { BaseTypeSchema } from "./index.t"

export type ArraySchema =
  | BaseTypeSchema<(string | number | boolean)[], "array", true>
  | BaseTypeSchema<(string | number | boolean)[], "array", false>

export type ArrayType = {
  <T extends string | number | boolean = string>(defaultValue?: T[]): BaseTypeSchema<T[], "array"> &
    ((options?: { title?: string }) => BaseTypeSchema<T[], "array">)

  optional: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => BaseTypeSchema<T[], "array", false> & ((options?: { title?: string }) => BaseTypeSchema<T[], "array", false>)

  required: <T extends string | number | boolean = string>(
    defaultValue?: T[]
  ) => BaseTypeSchema<T[], "array", true> & ((options?: { title?: string }) => BaseTypeSchema<T[], "array", true>)
}
