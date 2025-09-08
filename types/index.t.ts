import type { ArraySchema, ArrayType } from "./array.t"
import type { BooleanType, BooleanSchema } from "./boolean.t"
import type { EnumType, EnumSchema } from "./enum.t"
import type { NumberType, NumberSchema } from "./number.t"
import type { StringType, StringSchema } from "./string.t"

export interface BaseTypeSchema<
  T,
  N extends "string" | "number" | "boolean" | "array" | "enum",
  R extends boolean = false
> {
  type: N
  required: R
  title?: string
  default?: T | undefined
}

export type SchemaDefinition = Record<string, StringSchema | NumberSchema | BooleanSchema | ArraySchema | EnumSchema>

export type Types = {
  string: StringType
  number: NumberType
  boolean: BooleanType
  array: ArrayType
  enum: EnumType
}

/**
 * @template T - Тип значения
 * @template N - Название типа
 *
 * **Пример**
 * {@includeCode ./string.spec.ts#short}
 *
 * **Контекст**
 * {@includeCode ./string.spec.ts#shortContext}
 *
 * **Схема**
 * {@includeCode ./string.spec.ts#shortSchema}
 *
 * **Снимок**
 * {@includeCode ./string.spec.ts#shortSnapshot}
 * 
 * @group Типы
 */
export interface TypeShort<
  T extends string | number | boolean | (string | number | boolean)[],
  N extends "string" | "number" | "boolean" | "array" | "enum"
> {
  /**
   * Краткая запись опционального типа для `string` `number` `boolean` `array`
   */
  <D extends T>(defaultValue?: D): ((options?: { title?: string }) => BaseTypeSchema<T, N>) & BaseTypeSchema<T, N>
}
