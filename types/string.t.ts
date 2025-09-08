import type { BaseDefinition, OptionalDefinition, RequiredDefinition } from "./index.t"

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
  ) => RequiredStringDefinition & ((options?: { title?: string }) => RequiredStringDefinition)

  optional: <T extends string = string>(
    defaultValue?: T
  ) => OptionalStringDefinition & ((options?: { title?: string }) => OptionalStringDefinition)

  <T extends string = string>(defaultValue?: T): OptionalStringDefinition
}
/**
 * Опциональное строковое поле
 * @example
 * ```typescript
 * description: types.string.optional()
 * avatar: types.string.optional()
 * ```
 */

export type OptionalStringDefinition = OptionalDefinition<BaseStringDefinition>
/**
 * Обязательное строковое поле
 * @example
 * ```typescript
 * name: types.string.required("Anonymous")
 * email: types.string.required("")
 * ```
 */

export type RequiredStringDefinition = RequiredDefinition<BaseStringDefinition>
/**
 * Базовое определение строкового типа
 * @property type - Тип поля ("string")
 * @property title - Опциональное название поля для документации
 * @property default - Значение по умолчанию
 */

export interface BaseStringDefinition extends BaseDefinition<string, "string"> {}
