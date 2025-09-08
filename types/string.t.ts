import type { BaseType } from "./index.t"

export type StringType = BaseType<string, "string", true> | BaseType<string, "string", false>
/**
 * Фабрика для строкового типа
 * @example
 * ```typescript
 * types.string.required('Гость')
 * types.string.optional()
 * types.string('По умолчанию')
 * ```
 */
export type StringTypeFactory = {
  <T extends string = string>(defaultValue?: T): ((options?: { title?: string }) => BaseType<string, "string">) &
    BaseType<string, "string">

  optional: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => BaseType<string, "string">) & BaseType<string, "string">

  required: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => BaseType<string, "string", true>) & BaseType<string, "string", true>
}
