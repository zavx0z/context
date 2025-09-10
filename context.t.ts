import type { SchemaDefinition, BaseTypeSchema } from "./index.t"

export type Primitive = string | number | boolean | null | undefined | symbol | bigint

type TypeName = "string" | "number" | "boolean" | "array" | "enum"

/**
 * Преобразуем «сырое» значение из билдера (в т.ч. пересечение с функцией)
 * в чистый BaseTypeSchema c корректным T по полю `type`.
 */
type ToBase<T> = T extends { type: infer N extends TypeName; required: infer R extends boolean }
  ? N extends "string"
    ? BaseTypeSchema<string, "string", R>
    : N extends "number"
    ? BaseTypeSchema<number, "number", R>
    : N extends "boolean"
    ? BaseTypeSchema<boolean, "boolean", R>
    : N extends "array"
    ? BaseTypeSchema<(string | number | boolean)[], "array", R>
    : N extends "enum"
    ? T extends { values: infer V extends readonly (string | number)[] }
      ? BaseTypeSchema<string | number, "enum", R, V>
      : BaseTypeSchema<string | number, "enum", R, readonly (string | number)[]>
    : never
  : never

/** Нормализуем всю схему, приводя каждый ключ к строгому BaseTypeSchema */
export type NormalizeSchema<S> = { [K in keyof S]: ToBase<S[K]> }

export type DeepReadonly<T> = T extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> : T | Primitive

export type ExtractValue<T> = T extends { type: "string"; required: true }
  ? string
  : T extends { type: "string"; required: false }
  ? string | null
  : T extends { type: "number"; required: true }
  ? number
  : T extends { type: "number"; required: false }
  ? number | null
  : T extends { type: "boolean"; required: true }
  ? boolean
  : T extends { type: "boolean"; required: false }
  ? boolean | null
  : T extends { type: "array"; required: true; default?: infer U }
  ? U
  : T extends { type: "array"; required: false; default?: infer U }
  ? U | null
  : T extends { type: "array"; required: true }
  ? (string | number | boolean)[]
  : T extends { type: "array"; required: false }
  ? (string | number | boolean)[] | null
  : T extends { type: "enum"; required: true; values?: infer V extends readonly (string | number)[] }
  ? V[number]
  : T extends { type: "enum"; required: false; values?: infer V extends readonly (string | number)[] }
  ? V[number] | null
  : never

/**
 * Значения
 */
export type Values<C extends SchemaDefinition> = {
  [K in keyof C]: ExtractValue<C[K]>
}

/**
 * Снимок
 */
export type Snapshot<C extends SchemaDefinition> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
    value: ExtractValue<C[K]>
  }
}
/**
 * Схема
 */
export type Schema<C extends SchemaDefinition> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
  }
}
