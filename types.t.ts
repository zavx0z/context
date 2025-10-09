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
 *   name: types.string.required("Иван", { label: "Имя" }),
 *   age: types.number.optional({ label: "Возраст" }),
 *   tags: types.array.optional({ label: "Теги", data: "user_tags" }),
 *   role: types.enum("user", "admin").required("user", { id: true })
 * }))
 * ```
 *
 * ## Метаданные полей
 *
 * - `label?: string` — заголовок поля для UI
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
   * Строковый тип. Поддерживает значения по умолчанию и метаданные label, id.
   *
   * @example
   * ```ts
   * types.string.required("default", { label: "Имя", id: true })
   * types.string.optional({ label: "Описание" })
   * types.string.optional("default")
   * ```
   */
  string: TypePrimitive<string, "string">

  /**
   * Числовой тип. Поддерживает значения по умолчанию и метаданные label, id.
   *
   * @example
   * ```ts
   * types.number.required(0, { label: "Возраст", id: true })
   * types.number.optional({ label: "Счетчик" })
   * types.number.optional(100)
   * ```
   */
  number: TypePrimitive<number, "number">

  /**
   * Логический тип. Поддерживает значения по умолчанию и метаданные label, id.
   *
   * @example
   * ```ts
   * types.boolean.required(false, { label: "Активен" })
   * types.boolean.optional({ label: "Флаг" })
   * types.boolean.optional(true)
   * ```
   */
  boolean: TypePrimitive<boolean, "boolean">

  /**
   * Массив примитивов. Плоский и однородный. Поддерживает метаданные label, data.
   *
   * @example
   * ```ts
   * types.array.required<string>([], { label: "Теги", data: "tags" })
   * types.array.optional<number>({ label: "Значения" })
   * types.array.optional([1, 2, 3])
   * ```
   */
  array: TypeArray

  /**
   * Перечисления. Однородные значения строк или чисел. Значения могут отсутствовать.
   *
   * @example
   * ```ts
   * types.enum("user", "admin").required("user", { label: "Роль", id: true })
   * types.enum(1, 2, 3).optional({ label: "Приоритет" })
   * types.enum().optional() // без значений
   * ```
   */
  enum: TypeEnum
}

export interface TypePrimitive<T extends string | number | boolean, N extends "string" | "number" | "boolean"> {
  optional(options?: { label?: string }): SchemaType<N, false>
  optional<D extends T>(defaultValue?: D, options?: { label?: string }): SchemaType<N, false, D>

  required: <D extends T>(defaultValue: D, options?: { label?: string; id?: true }) => SchemaType<N, true, D>
}

export type TypeArray = {
  optional: {
    (options?: { label?: string; data?: string }): SchemaType<"array", false>
    <D extends string[] | number[] | boolean[]>(
      defaultValue?: D,
      options?: { label?: string; data?: string }
    ): SchemaType<"array", false, D>
  }
  required: <T extends string | number | boolean>(
    defaultValue: T[],
    options?: { label?: string; data?: string }
  ) => SchemaType<"array", true, T[]>
}

export type TypeEnum = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  optional(options?: { label?: string }): SchemaType<"enum", false, never, T>
  optional<D extends T[number]>(defaultValue?: D, options?: { label?: string }): SchemaType<"enum", false, D, T>
  required: <D extends T[number]>(
    defaultValue: D,
    options?: { label?: string; id?: true }
  ) => SchemaType<"enum", true, D, T>
}
