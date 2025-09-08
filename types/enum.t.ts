import type { BaseTypeSchema } from "./index.t"

export type EnumSchema<T extends readonly (string | number)[] = readonly (string | number)[]> =
  | (BaseTypeSchema<string | number, "enum", true> & { values: T })
  | (BaseTypeSchema<string | number, "enum", false> & { values: T })

/**
 * Фабрика для типа перечисления
 * @example
 * ```typescript
 * types.enum('user', 'admin').required('user')
 * types.enum('pending', 'active').optional()
 * types.enum('low', 'high')('medium')
 * ```
 */

export type EnumType = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  required: (
    defaultValue?: T[number]
  ) => BaseTypeSchema<string | number, "enum", true> & { values: T } & ((options?: {
      title?: string
    }) => BaseTypeSchema<string | number, "enum", true> & { values: T })

  optional: (
    defaultValue?: T[number]
  ) => BaseTypeSchema<string | number, "enum"> & { values: T } & ((options?: {
      title?: string
    }) => BaseTypeSchema<string | number, "enum"> & { values: T })

  (defaultValue?: T[number]): BaseTypeSchema<string | number, "enum"> & { values: T } & ((options?: {
      title?: string
    }) => BaseTypeSchema<string | number, "enum"> & { values: T })
}
