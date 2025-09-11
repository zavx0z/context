import type { SchemaType, Schema } from "./schema.t"

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
 * @readonly
 * Снимок
 *
 * @remarks содержит данные схемы + актуальные значения для каждого поля
 */
export type Snapshot<C extends Schema> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required?: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
    value: Values<C>[K]
  }
}
