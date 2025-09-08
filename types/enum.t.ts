import type { BaseType } from "./index.t"

export type EnumType<T extends readonly (string | number)[] = readonly (string | number)[]> =
  | (BaseType<string | number, "enum", true> & { values: T })
  | (BaseType<string | number, "enum", false> & { values: T })

/**
 * Фабрика для типа перечисления
 * @example
 * ```typescript
 * types.enum('user', 'admin').required('user')
 * types.enum('pending', 'active').optional()
 * types.enum('low', 'high')('medium')
 * ```
 */

export type EnumTypeFactory = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  required: (
    defaultValue?: T[number]
  ) => BaseType<string | number, "enum", true> & { values: T } & ((options?: {
      title?: string
    }) => BaseType<string | number, "enum", true> & { values: T })

  optional: (
    defaultValue?: T[number]
  ) => BaseType<string | number, "enum"> & { values: T } & ((options?: {
      title?: string
    }) => BaseType<string | number, "enum"> & { values: T })

  (defaultValue?: T[number]): BaseType<string | number, "enum"> & { values: T } & ((options?: {
      title?: string
    }) => BaseType<string | number, "enum"> & { values: T })
}
