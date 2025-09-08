import type { SchemaDefinition } from "./types/index.t"

/* ---------------------- Вспомогательные типы/утилиты ---------------------- */
export type Primitive = string | number | boolean | null | undefined | symbol | bigint

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
  : T extends { type: "enum"; required: true; values: infer V extends readonly (string | number)[] }
  ? V[number]
  : T extends { type: "enum"; required: false; values: infer V extends readonly (string | number)[] }
  ? V[number] | null
  : never

/**
 * Значения контекста
 */
export type Values<C extends SchemaDefinition> = {
  [K in keyof C]: ExtractValue<C[K]>
}

/**
 * Снимок контекста
 */
export type Snapshot<C extends SchemaDefinition> = {
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
export type Schema<C extends SchemaDefinition> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K] extends { values: any } ? C[K]["values"] : never
  }
}
