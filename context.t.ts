import type { TypesDefinition } from "./types/index.t"
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

/* ---------------------- Вспомогательные типы/утилиты ---------------------- */
export type Primitive = string | number | boolean | null | undefined | symbol | bigint

export type DeepReadonly<T> = T extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> : T | Primitive

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

/**
 * Значения контекста
 */
export type Values<C extends TypesDefinition> = {
  [K in keyof C]: ExtractValue<C[K]>
}

/**
 * Снимок контекста
 */
export type Snapshot<C extends TypesDefinition> = {
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
 * Сериализованная схема контекста
 */
export type Schema<C extends TypesDefinition> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K] extends { values: any } ? C[K]["values"] : never
  }
}
