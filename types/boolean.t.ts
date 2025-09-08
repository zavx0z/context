import type { BaseDefinition, OptionalDefinition, RequiredDefinition } from "./index.t"

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
  ) => RequiredBooleanDefinition & ((options?: { title?: string }) => RequiredBooleanDefinition)

  optional: <T extends boolean = boolean>(
    defaultValue?: T
  ) => OptionalBooleanDefinition & ((options?: { title?: string }) => OptionalBooleanDefinition)

  <T extends boolean = boolean>(defaultValue?: T): OptionalBooleanDefinition
}
/**
 * Опциональное булево поле
 * @example
 * ```typescript
 * isVerified: types.boolean.optional()
 * isPremium: types.boolean.optional()
 * ```
 */

export type OptionalBooleanDefinition = OptionalDefinition<BaseBooleanDefinition>
/**
 * Обязательное булево поле
 * @example
 * ```typescript
 * isActive: types.boolean.required(false)
 * isLoading: types.boolean.required(false)
 * ```
 */

export type RequiredBooleanDefinition = RequiredDefinition<BaseBooleanDefinition>
/**
 * Базовое определение булевого типа
 * @property type - Тип поля ("boolean")
 * @property title - Опциональное название поля для документации
 * @property default - Значение по умолчанию
 */

export interface BaseBooleanDefinition extends BaseDefinition<boolean, "boolean"> {}
