import type { SchemaType } from "./schema.t"

/**
 * # Типы для описания контекста.
 * 
 * Является фабрикой для создания {@link Schema | схемы контекста}.
 * Каждый тип предоставляет методы `.optional()` и `.required()` с унифицированным API.
 *
 * @example Базовое использование
 * ```ts
 * const schema = contextSchema((types) => ({
 *   name: types.string.required("Иван", { title: "Имя" }),
 *   age: types.number.optional({ title: "Возраст" }),
 *   tags: types.array.optional({ title: "Теги", data: "user_tags" }),
 *   role: types.enum("user", "admin").required("user", { id: true })
 * }))
 * ```
 *
 * ## Метаданные полей
 * 
 * - `title?: string` — заголовок поля для UI
 * - `id?: true` — только для обязательных примитивов и enum (отметка идентификатора)
 * - `data?: string` — только для array (имя таблицы/источника данных)
 *
 * ## Правила типизации
 * 
 * - **Опциональные** поля могут принимать `null` и имеют опциональный default
 * - **Обязательные** поля всегда должны иметь значение по умолчанию
 * - Все параметры передаются в одном вызове: `method(default?, options?)`
 */

export type Types = {
  /**
   * Строковый тип. Поддерживает значения по умолчанию и метаданные title, id.
   * 
   * @example
   * ```ts
   * types.string.required("default", { title: "Имя", id: true })
   * types.string.optional({ title: "Описание" })
   * types.string.optional("default")
   * ```
   */
  string: TypePrimitive<string, "string">

  /**
   * Числовой тип. Поддерживает значения по умолчанию и метаданные title, id.
   * 
   * @example
   * ```ts
   * types.number.required(0, { title: "Возраст", id: true })
   * types.number.optional({ title: "Счетчик" })
   * types.number.optional(100)
   * ```
   */
  number: TypePrimitive<number, "number">

  /**
   * Логический тип. Поддерживает значения по умолчанию и метаданные title, id.
   * 
   * @example
   * ```ts
   * types.boolean.required(false, { title: "Активен" })
   * types.boolean.optional({ title: "Флаг" })
   * types.boolean.optional(true)
   * ```
   */
  boolean: TypePrimitive<boolean, "boolean">

  /**
   * Массив примитивов. Плоский и однородный. Поддерживает метаданные title, data.
   * 
   * @example
   * ```ts
   * types.array.required<string>([], { title: "Теги", data: "tags" })
   * types.array.optional<number>({ title: "Значения" })
   * types.array.optional([1, 2, 3])
   * ```
   */
  array: TypeArray

  /**
   * Перечисления. Однородные значения строк или чисел. Значения могут отсутствовать.
   * 
   * @example
   * ```ts
   * types.enum("user", "admin").required("user", { title: "Роль", id: true })
   * types.enum(1, 2, 3).optional({ title: "Приоритет" })
   * types.enum().optional() // без значений
   * ```
   */
  enum: TypeEnum
}

export interface TypePrimitive<T extends string | number | boolean, N extends "string" | "number" | "boolean"> {
  optional(options?: { title?: string }): SchemaType<T, N, false>
  optional<D extends T>(defaultValue?: D, options?: { title?: string }): SchemaType<T, N, false>

  required: <D extends T>(defaultValue: D, options?: { title?: string; id?: true }) => SchemaType<T, N, true>
}

export type TypeArray = {
  optional: {
    <T extends string | number | boolean>(options?: { title?: string; data?: string }): SchemaType<T[], "array", false>
    <T extends string | number | boolean>(defaultValue?: T[], options?: { title?: string; data?: string }): SchemaType<
      T[],
      "array",
      false
    >
  }
  required: <T extends string | number | boolean>(
    defaultValue: T[],
    options?: { title?: string; data?: string }
  ) => SchemaType<T[], "array", true>
}

export type TypeEnum = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  optional(options?: { title?: string }): SchemaType<string | number, "enum", false, T>
  optional(defaultValue?: T[number], options?: { title?: string }): SchemaType<string | number, "enum", false, T>
  required: (
    defaultValue: T[number],
    options?: { title?: string; id?: true }
  ) => SchemaType<string | number, "enum", true, T>
}
