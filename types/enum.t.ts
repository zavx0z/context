import type { BaseTypeSchema } from "./index.t"

export type EnumSchema<T extends readonly (string | number)[] = readonly (string | number)[]> =
  | (BaseTypeSchema<string | number, "enum", true> & { values: T })
  | (BaseTypeSchema<string | number, "enum", false> & { values: T })

export type EnumType = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  (defaultValue?: T[number]): BaseTypeSchema<string | number, "enum"> & { values: T } & ((options?: {
      title?: string
    }) => BaseTypeSchema<string | number, "enum"> & { values: T })

  optional: (
    defaultValue?: T[number]
  ) => BaseTypeSchema<string | number, "enum"> & { values: T } & ((options?: {
      title?: string
    }) => BaseTypeSchema<string | number, "enum"> & { values: T })

  required: (
    defaultValue?: T[number]
  ) => BaseTypeSchema<string | number, "enum", true> & { values: T } & ((options?: {
      title?: string
    }) => BaseTypeSchema<string | number, "enum", true> & { values: T })
}
