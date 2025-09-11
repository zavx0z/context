import type { SchemaType, Schema } from "./index.t"

export type NormalizeSchema<S> = {
  [K in keyof S]: S[K] extends SchemaType<infer A, infer N, infer R, infer V>
    ? N extends "string"
      ? SchemaType<string, "string", R>
      : N extends "number"
      ? SchemaType<number, "number", R>
      : N extends "boolean"
      ? SchemaType<boolean, "boolean", R>
      : N extends "array"
      ? A extends readonly (infer E)[]
        ? SchemaType<
            Array<E extends number ? number : E extends string ? string : E extends boolean ? boolean : E>,
            "array",
            R
          >
        : SchemaType<(string | number | boolean)[], "array", R>
      : N extends "enum"
      ? SchemaType<V extends readonly (string | number)[] ? V[number] : string | number, "enum", R, V>
      : never
    : S[K] extends {
        type: infer N extends "string" | "number" | "boolean" | "array" | "enum"
        required: infer R extends boolean
      }
    ? N extends "string"
      ? SchemaType<string, "string", R>
      : N extends "number"
      ? SchemaType<number, "number", R>
      : N extends "boolean"
      ? SchemaType<boolean, "boolean", R>
      : N extends "array"
      ? SchemaType<(string | number | boolean)[], "array", R>
      : N extends "enum"
      ? S[K] extends { values: infer V extends readonly (string | number)[] }
        ? SchemaType<V[number], "enum", R, V>
        : SchemaType<string | number, "enum", R, readonly (string | number)[]>
      : never
    : never
} extends infer T
  ? T extends Record<string, SchemaType<any, any, any, any>>
    ? {
        [K in keyof T]: T[K] extends SchemaType<infer A, infer N, infer R, infer V>
          ? N extends "string"
            ? SchemaType<string, "string", R>
            : N extends "number"
            ? SchemaType<number, "number", R>
            : N extends "boolean"
            ? SchemaType<boolean, "boolean", R>
            : N extends "array"
            ? SchemaType<A, "array", R>
            : N extends "enum"
            ? SchemaType<V extends readonly (string | number)[] ? V[number] : string | number, "enum", R, V>
            : never
          : never
      }
    : never
  : never

// рантайм-очистка (оставляем только поля схемы)
export function normalizeSchema<S>(raw: S): NormalizeSchema<S> {
  const out: any = {}
  for (const [k, def] of Object.entries(raw as Record<string, any>)) {
    if (!def) continue
    const core: any = { type: def.type, required: def.required }
    if ("default" in def && def.default !== undefined) core.default = def.default
    if ("title" in def && def.title !== undefined) core.title = def.title
    if ("values" in def && def.values !== undefined) core.values = def.values
    out[k] = core
  }
  return out
}

export type DeepReadonly<T> = T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : T | string | number | boolean | null | undefined | symbol | bigint

export type ExtractValue<E> = E extends SchemaType<infer T, infer N, infer R, infer V>
  ? N extends "enum"
    ? // для enum берём ЛИТЕРАЛЫ из V[number], а не общий T
      R extends true
      ? V extends readonly (string | number)[]
        ? V[number]
        : T
      : (V extends readonly (string | number)[] ? V[number] : T) | null
    : N extends "array"
    ? // для массива сохраняем точный T (например, number[])
      R extends true
      ? T
      : T | null
    : // примитивы — как и раньше
    R extends true
    ? T
    : T | null
  : never

/**
 * Значения контекста
 *
 * @remarks содержит только актуальные значения каждого поля
 */
export type Values<C extends Schema> = { [K in keyof C]: ExtractValue<C[K]> }

/**
 * @description Снимок
 *
 * @remarks содержит данные схемы + актуальные значения для каждого поля
 */
export type Snapshot<C extends Schema> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
    value: Values<C>[K]
  }
}
