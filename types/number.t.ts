import type { BaseTypeSchema } from "./index.t"

export type NumberSchema = BaseTypeSchema<number, "number", true> | BaseTypeSchema<number, "number", false>

export type NumberType = {
  <T extends number = number>(defaultValue?: T): BaseTypeSchema<number, "number"> &
    ((options?: { title?: string }) => BaseTypeSchema<number, "number">)

  optional: <T extends number = number>(
    defaultValue?: T
  ) => BaseTypeSchema<number, "number", false> &
    ((options?: { title?: string }) => BaseTypeSchema<number, "number", false>)

  required: <T extends number = number>(
    defaultValue?: T
  ) => BaseTypeSchema<number, "number", true> &
    ((options?: { title?: string }) => BaseTypeSchema<number, "number", true>)
}
