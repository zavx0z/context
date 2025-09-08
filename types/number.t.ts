import type { BaseDefinition, OptionalDefinition, RequiredDefinition } from "./index.t"

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
  ) => RequiredNumberDefinition & ((options?: { title?: string }) => RequiredNumberDefinition)

  optional: <T extends number = number>(
    defaultValue?: T
  ) => OptionalNumberDefinition & ((options?: { title?: string }) => OptionalNumberDefinition)

  <T extends number = number>(defaultValue?: T):
    | (OptionalNumberDefinition & ((options?: { title?: string }) => OptionalNumberDefinition))
    | OptionalNumberDefinition
}
/**
 * Опциональное числовое поле
 * @example
 * ```typescript
 * rating: types.number.optional()
 * priority: types.number.optional()
 * ```
 */

export type OptionalNumberDefinition = OptionalDefinition<BaseNumberDefinition>
/**
 * Обязательное числовое поле
 * @example
 * ```typescript
 * age: types.number.required(18)
 * count: types.number.required(0)
 * ```
 */

export type RequiredNumberDefinition = RequiredDefinition<BaseNumberDefinition>
/**
 * Базовое определение числового типа
 * @property type - Тип поля ("number")
 * @property title - Опциональное название поля для документации
 * @property default - Значение по умолчанию
 */

export interface BaseNumberDefinition extends BaseDefinition<number, "number"> {}
