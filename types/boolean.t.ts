import type { BaseTypeSchema } from "./index.t"

export type BooleanSchema = BaseTypeSchema<boolean, "boolean", true> | BaseTypeSchema<boolean, "boolean", false>

export type BooleanType = {
  <T extends boolean = boolean>(defaultValue?: T): BaseTypeSchema<boolean, "boolean"> &
    ((options?: { title?: string }) => BaseTypeSchema<boolean, "boolean">)

  optional: <T extends boolean = boolean>(
    defaultValue?: T
  ) => BaseTypeSchema<boolean, "boolean", false> &
    ((options?: { title?: string }) => BaseTypeSchema<boolean, "boolean", false>)

  required: <T extends boolean = boolean>(
    defaultValue?: T
  ) => BaseTypeSchema<boolean, "boolean", true> &
    ((options?: { title?: string }) => BaseTypeSchema<boolean, "boolean", true>)
}
