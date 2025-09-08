import type { Schema } from "./types/index.t"
import type { RequiredStringDefinition } from "./types/string.t"
import type { RequiredNumberDefinition } from "./types/number.t"
import type { RequiredBooleanDefinition } from "./types/boolean.t"
import type { RequiredArrayDefinition } from "./types/array.t"
import type { RequiredEnumDefinition } from "./types/enum.t"
import type { OptionalStringDefinition } from "./types/string.t"
import type { OptionalNumberDefinition } from "./types/number.t"
import type { OptionalBooleanDefinition } from "./types/boolean.t"
import type { OptionalArrayDefinition } from "./types/array.t"
import type { OptionalEnumDefinition } from "./types/enum.t"

export * from "./types.t"

export type ExtractValue<T> = T extends RequiredStringDefinition
  ? string
  : T extends OptionalStringDefinition
  ? string | null
  : T extends RequiredNumberDefinition
  ? number
  : T extends OptionalNumberDefinition
  ? number | null
  : T extends RequiredBooleanDefinition
  ? boolean
  : T extends OptionalBooleanDefinition
  ? boolean | null
  : T extends RequiredArrayDefinition<infer U>
  ? U[]
  : T extends OptionalArrayDefinition<infer U>
  ? U[] | null
  : T extends RequiredEnumDefinition<infer U>
  ? U[number]
  : T extends OptionalEnumDefinition<infer U>
  ? U[number] | null
  : T extends { type: "array"; required: true; default?: number[] }
  ? number[]
  : T extends { type: "array"; required: true; default?: string[] }
  ? string[]
  : T extends { type: "array"; required: true; default?: boolean[] }
  ? boolean[]
  : never

export type Values<C extends Schema> = {
  [K in keyof C]: ExtractValue<C[K]>
}

/**
 * Тип для снимка контекста
 * @template C - Схема контекста
 * @returns Снимок контекста
 */

export type ContextSnapshot<C extends Schema> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K] extends { values: any } ? C[K]["values"] : never
    value: ExtractValue<C[K]>
  }
}

/**
 * Тип для обновления значений в контексте
 * @template C - Схема контекста
 * @param values - Значения для обновления
 * @returns Значения, которые были обновлены
 *
 * {@includeCode ./test/context.basic.spec.ts}
 * {@includeCode ./test/context.types.spec.ts}
 */
export type Update<C extends Schema> = (values: Partial<Values<C>>) => Partial<Values<C>>
/**
 * Тип для подписки на обновления контекста
 * @template C - Схема контекста
 * @param cb - Функция, которая будет вызываться при обновлении контекста
 * @returns Функция для отписки от обновлений
 */

export type OnUpdate<C extends Schema> = (cb: (updated: Partial<Values<C>>) => void) => () => void
/**
 * Интерфейс для экземпляра контекста
 * @template C - Схема контекста
 *
 * {@includeCode ./test/context.basic.spec.ts}
 * {@includeCode ./test/context.metadata.spec.ts}
 */

export interface ContextInstance<C extends Schema> {
  /** Схема контекста (только для чтения) */
  schema: C
  /** Текущее состояние контекста (только для чтения) */
  context: Values<C> & { _title: Record<keyof C, string> }
  /** Обновляет значения в контексте */
  update: Update<C>
  onUpdate: OnUpdate<C>
  /** Снимок контекста (только для чтения) */
  getSnapshot: () => Values<C>
}
