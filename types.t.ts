/**
 * Типы для фабрик типов и схем контекста
 */

export interface BaseStringDefinition {
  type: "string"
  title?: string
  default?: string
}

export interface BaseNumberDefinition {
  type: "number"
  title?: string
  default?: number
}

export interface BaseBooleanDefinition {
  type: "boolean"
  title?: string
  default?: boolean
}

export interface BaseArrayDefinition<T extends string | number | boolean> {
  type: "array"
  title?: string
  default?: T[]
}

export interface BaseEnumDefinition<T extends readonly (string | number)[]> {
  type: "enum"
  values: T
  title?: string
  default?: T[number]
}

export interface RequiredStringDefinition extends BaseStringDefinition {
  required: true
}

export interface RequiredNumberDefinition extends BaseNumberDefinition {
  required: true
}

export interface RequiredBooleanDefinition extends BaseBooleanDefinition {
  required: true
}

export interface RequiredArrayDefinition<T extends string | number | boolean> extends BaseArrayDefinition<T> {
  required: true
}

export interface RequiredEnumDefinition<T extends readonly (string | number)[]> extends BaseEnumDefinition<T> {
  required: true
}

export interface OptionalStringDefinition extends BaseStringDefinition {
  required: false
}

export interface OptionalNumberDefinition extends BaseNumberDefinition {
  required: false
}

export interface OptionalBooleanDefinition extends BaseBooleanDefinition {
  required: false
}

export interface OptionalArrayDefinition<T extends string | number | boolean> extends BaseArrayDefinition<T> {
  required: false
}

export interface OptionalEnumDefinition<T extends readonly (string | number)[]> extends BaseEnumDefinition<T> {
  required: false
}

export type StringDefinition = RequiredStringDefinition | OptionalStringDefinition
export type NumberDefinition = RequiredNumberDefinition | OptionalNumberDefinition
export type BooleanDefinition = RequiredBooleanDefinition | OptionalBooleanDefinition

export type ArrayDefinition<T extends string | number | boolean = string> =
  | RequiredArrayDefinition<T>
  | OptionalArrayDefinition<T>

export type EnumDefinition<T extends readonly (string | number)[]> =
  | RequiredEnumDefinition<T>
  | OptionalEnumDefinition<T>

export type AnyDefinition =
  | StringDefinition
  | NumberDefinition
  | BooleanDefinition
  | ArrayDefinition<any>
  | EnumDefinition<any>

export type ContextSchema = Record<string, AnyDefinition>
