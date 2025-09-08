import type { OptionalDefinition, RequiredDefinition } from "./index.t"

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

  <T extends number = number>(defaultValue?: T): OptionalNumberDefinition &
    ((options?: { title?: string }) => OptionalNumberDefinition)
}

/**
 * Опциональное числовое поле
 * @example
 * ```typescript
 * rating: types.number.optional()
 * priority: types.number.optional()
 * ```
 */
export interface OptionalNumberDefinition extends OptionalDefinition<number, "number"> {}

/**
 * Обязательное числовое поле
 * @example
 * ```typescript
 * age: types.number.required(18)
 * count: types.number.required(0)
 * ```
 */
export interface RequiredNumberDefinition extends RequiredDefinition<number, "number"> {}
