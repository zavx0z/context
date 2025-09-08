import type { BaseDefinition } from "./index.t"

/**
 * Опциональное строковое поле
 * @example
 * ```typescript
 * description: types.string.optional()
 * avatar: types.string.optional()
 * ```
 */
export interface OptionalStringDefinition {
  type: "string"
  required: false
  default: string | undefined
  title?: string
}

/**
 * Обязательное строковое поле
 * @example
 * ```typescript
 * name: types.string.required("Anonymous")
 * email: types.string.required("")
 * ```
 */
export interface RequiredStringDefinition {
  type: "string"
  required: true
  default: string | undefined
  title?: string
}

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
  required: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => RequiredStringDefinition) & RequiredStringDefinition

  optional: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => OptionalStringDefinition) & OptionalStringDefinition

  <T extends string = string>(defaultValue?: T): OptionalStringDefinition
}
