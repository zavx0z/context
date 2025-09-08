import type { BaseTypeSchema } from "./index.t"

export type BooleanSchema = BaseTypeSchema<boolean, "boolean", true> | BaseTypeSchema<boolean, "boolean", false>

/**
 * Фабрика для булевого типа
 * @example
 * ```typescript
 * types.boolean.required(false)
 * types.boolean.optional()
 * types.boolean(true)
 * ```
 */
export type BooleanType = {
  required: <T extends boolean = boolean>(
    defaultValue?: T
  ) => BaseTypeSchema<boolean, "boolean", true> &
    ((options?: { title?: string }) => BaseTypeSchema<boolean, "boolean", true>)

  optional: <T extends boolean = boolean>(
    defaultValue?: T
  ) => BaseTypeSchema<boolean, "boolean", false> &
    ((options?: { title?: string }) => BaseTypeSchema<boolean, "boolean", false>)

  <T extends boolean = boolean>(defaultValue?: T): BaseTypeSchema<boolean, "boolean"> &
    ((options?: { title?: string }) => BaseTypeSchema<boolean, "boolean">)
}
