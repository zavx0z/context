import type { BaseTypeSchema } from "./index.t"

export type StringSchema = BaseTypeSchema<string, "string", true> | BaseTypeSchema<string, "string", false>
/**
 * Фабрика для строкового типа
 * @example
 * ```typescript
 * types.string.required('Гость')
 * types.string.optional()
 * types.string('По умолчанию')
 * ```
 */
export type StringType = {
  <T extends string = string>(defaultValue?: T): ((options?: { title?: string }) => BaseTypeSchema<string, "string">) &
    BaseTypeSchema<string, "string">

  optional: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => BaseTypeSchema<string, "string">) & BaseTypeSchema<string, "string">

  required: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => BaseTypeSchema<string, "string", true>) &
    BaseTypeSchema<string, "string", true>
}
