import type { BaseTypeSchema } from "./index.t"

export type Primitive = string | number | boolean | null | undefined | symbol | bigint

type TypeName = "string" | "number" | "boolean" | "array" | "enum"

type WidenPrimitive<T> = T extends number ? number : T extends string ? string : T extends boolean ? boolean : T

/**
 * Если пришёл результат билдера (пересечение с функцией), аккуратно
 * извлекаем дженерики. Для массива дополнительно расширяем литералы.
 */
type PreferBase<T> = T extends BaseTypeSchema<infer A, infer N, infer R, infer V>
  ? N extends "array"
    ? A extends readonly (infer E)[]
      ? BaseTypeSchema<Array<WidenPrimitive<E>>, "array", R>
      : BaseTypeSchema<any[], "array", R>
    : N extends "enum"
    ? BaseTypeSchema<V extends readonly (string | number)[] ? V[number] : string | number, "enum", R, V>
    : BaseTypeSchema<A, N, R, V>
  : T extends { type: infer N extends TypeName; required: infer R extends boolean }
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
      ? BaseTypeSchema<V[number], "enum", R, V>
      : BaseTypeSchema<string | number, "enum", R, readonly (string | number)[]>
    : never
  : never

/** Нормализуем всю схему, приводя каждый ключ к строгому BaseTypeSchema */
export type NormalizeSchema<S> = { [K in keyof S]: PreferBase<S[K]> }

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
export type Values<C extends Record<string, BaseTypeSchema<any, any, any, any>>> = {
  [K in keyof C]: C[K] extends BaseTypeSchema<infer T, infer N, infer R, infer V>
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
}

/**
 * Снимок
 */
export type Snapshot<C extends Record<string, BaseTypeSchema<any, any, any, any>>> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
    value: Values<C>[K]
  }
}
/**
 * Схема
 */
export type Schema<C extends Record<string, BaseTypeSchema<any, any, any, any>>> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
  }
}
