import type { BaseType } from "./index.t"

export type NumberType = BaseType<number, "number", true> | BaseType<number, "number", false>
/**
 * Фабрика для числового типа
 * @example
 * ```typescript
 * types.number.required(18)
 * types.number.optional()
 * types.number(0)
 * ```
 */
export type NumberTypeFactory = {
  required: <T extends number = number>(
    defaultValue?: T
  ) => BaseType<number, "number", true> & ((options?: { title?: string }) => BaseType<number, "number", true>)

  optional: <T extends number = number>(
    defaultValue?: T
  ) => BaseType<number, "number", false> & ((options?: { title?: string }) => BaseType<number, "number", false>)

  <T extends number = number>(defaultValue?: T): BaseType<number, "number"> &
    ((options?: { title?: string }) => BaseType<number, "number">)
}
