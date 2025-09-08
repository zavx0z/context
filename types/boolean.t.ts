import type { BaseType } from "./index.t"

export type BooleanType = BaseType<boolean, "boolean", true> | BaseType<boolean, "boolean", false>

/**
 * Фабрика для булевого типа
 * @example
 * ```typescript
 * types.boolean.required(false)
 * types.boolean.optional()
 * types.boolean(true)
 * ```
 */
export type BooleanTypeFactory = {
  required: <T extends boolean = boolean>(
    defaultValue?: T
  ) => BaseType<boolean, "boolean", true> & ((options?: { title?: string }) => BaseType<boolean, "boolean", true>)

  optional: <T extends boolean = boolean>(
    defaultValue?: T
  ) => BaseType<boolean, "boolean", false> & ((options?: { title?: string }) => BaseType<boolean, "boolean", false>)

  <T extends boolean = boolean>(defaultValue?: T): BaseType<boolean, "boolean"> &
    ((options?: { title?: string }) => BaseType<boolean, "boolean">)
}
