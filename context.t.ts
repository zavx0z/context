/**
 * Типы для библиотеки MetaFor
 * @packageDocumentation
 */

// ==================== БАЗОВЫЕ ОПРЕДЕЛЕНИЯ ТИПОВ ====================

export interface BaseStringDefinition {
  type: 'string'
  title?: string
  default?: string
}
export interface BaseNumberDefinition {
  type: 'number'
  title?: string
  default?: number
}
export interface BaseBooleanDefinition {
  type: 'boolean'
  title?: string
  default?: boolean
}
export interface BaseArrayDefinition<T extends string | number | boolean> {
  type: 'array'
  title?: string
  default?: T[]
}
export interface BaseEnumDefinition<T extends readonly (string | number)[]> {
  type: 'enum'
  values: T
  title?: string
  default?: T[number]
}
// ==================== REQUIRED ОПРЕДЕЛЕНИЯ ====================
export interface RequiredStringDefinition extends BaseStringDefinition { required: true }
export interface RequiredNumberDefinition extends BaseNumberDefinition { required: true }
export interface RequiredBooleanDefinition extends BaseBooleanDefinition { required: true }
export interface RequiredArrayDefinition<T extends string | number | boolean> extends BaseArrayDefinition<T> { required: true }
export interface RequiredEnumDefinition<T extends readonly (string | number)[]> extends BaseEnumDefinition<T> { required: true }
// ==================== OPTIONAL ОПРЕДЕЛЕНИЯ ====================
export interface OptionalStringDefinition extends BaseStringDefinition { required: false }
export interface OptionalNumberDefinition extends BaseNumberDefinition { required: false }
export interface OptionalBooleanDefinition extends BaseBooleanDefinition { required: false }
export interface OptionalArrayDefinition<T extends string | number | boolean> extends BaseArrayDefinition<T> { required: false }
export interface OptionalEnumDefinition<T extends readonly (string | number)[]> extends BaseEnumDefinition<T> { required: false }
// ==================== UNION ТИПЫ ====================
export type StringDefinition = RequiredStringDefinition | OptionalStringDefinition
export type NumberDefinition = RequiredNumberDefinition | OptionalNumberDefinition
export type BooleanDefinition = RequiredBooleanDefinition | OptionalBooleanDefinition
export type ArrayDefinition<T extends string | number | boolean = string> = RequiredArrayDefinition<T> | OptionalArrayDefinition<T>
export type EnumDefinition<T extends readonly (string | number)[]> = RequiredEnumDefinition<T> | OptionalEnumDefinition<T>
// ==================== API ТИПЫ ====================
export type ContextTypes = {
  string: {
    required: <T extends string = string>(params?: { title?: string; default?: T }) => RequiredStringDefinition
    optional: <T extends string = string>(params?: { title?: string; default?: T }) => OptionalStringDefinition
    <T extends string = string>(params?: { title?: string; default?: T }): OptionalStringDefinition
  }
  number: {
    required: <T extends number = number>(params?: { title?: string; default?: T }) => RequiredNumberDefinition
    optional: <T extends number = number>(params?: { title?: string; default?: T }) => OptionalNumberDefinition
    <T extends number = number>(params?: { title?: string; default?: T }): OptionalNumberDefinition
  }
  boolean: {
    required: <T extends boolean = boolean>(params?: { title?: string; default?: T }) => RequiredBooleanDefinition
    optional: <T extends boolean = boolean>(params?: { title?: string; default?: T }) => OptionalBooleanDefinition
    <T extends boolean = boolean>(params?: { title?: string; default?: T }): OptionalBooleanDefinition
  }
  array: {
    required: <T extends string | number | boolean = string>(params?: { title?: string; default?: T[] }) => RequiredArrayDefinition<T>
    optional: <T extends string | number | boolean = string>(params?: { title?: string; default?: T[] }) => OptionalArrayDefinition<T>
    <T extends string | number | boolean = string>(params?: { title?: string; default?: T[] }): OptionalArrayDefinition<T>
  }
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    required: (options?: { title?: string; default?: T[number] }) => RequiredEnumDefinition<T>
    optional: (options?: { title?: string; default?: T[number] }) => OptionalEnumDefinition<T>
    (options?: { title?: string; default?: T[number] }): OptionalEnumDefinition<T>
  }
}
// ==================== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ====================
export type AnyDefinition = StringDefinition | NumberDefinition | BooleanDefinition | ArrayDefinition<any> | EnumDefinition<any>
export type ContextSchema = Record<string, AnyDefinition>
export type ExtractValue<T> =
  T extends RequiredStringDefinition ? string :
  T extends OptionalStringDefinition ? string | null :
  T extends RequiredNumberDefinition ? number :
  T extends OptionalNumberDefinition ? number | null :
  T extends RequiredBooleanDefinition ? boolean :
  T extends OptionalBooleanDefinition ? boolean | null :
  T extends RequiredArrayDefinition<infer U> ? U[] :
  T extends OptionalArrayDefinition<infer U> ? U[] | null :
  T extends RequiredEnumDefinition<infer U> ? U[number] :
  T extends OptionalEnumDefinition<infer U> ? U[number] | null :
  never
export type ExtractValues<S extends ContextSchema> = { [K in keyof S]: ExtractValue<S[K]> }
export type UpdateValues<T> = { [K in keyof T]?: T[K] }

export type JsonPatch =
  | { op: 'replace'; path: string; value: any }
  | { op: 'add'; path: string; value: any }
  | { op: 'remove'; path: string }

// ==================== ТИПЫ ДЛЯ КОНТЕКСТА ====================
export interface ContextInstance<T extends ContextSchema> {
  /** Текущее состояние контекста (только для чтения) */
  context: ExtractValues<T>
  /**
   * Обновляет значения в контексте
   * @param values - объект с новыми значениями
   * @returns Обновленный контекст
   */
  update: (values: UpdateValues<ExtractValues<T>>) => ExtractValues<T>
  /**
   * Подписка на обновления контекста
   * @param cb - функция, вызываемая при обновлении контекста
   * @returns функция для отписки
   */
  onUpdate: (cb: (patches: JsonPatch[]) => void) => () => void
}
