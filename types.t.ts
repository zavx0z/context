import type { SchemaType } from "./schema.t"

/**
 * # Типы для описания контекста.
 * Является фабрикой для создания {@link Schema | схемы контекста}.
 *
 * > Декларация всех типов однообразна и требует явного указания `.optional()` или `.required()`.
 *
 * ## Ограничения
 * ----
 * ### Опциональный
 * Опциональные поля {@link Context.update | могут принимать значения } `null`.
 * Определяются только через вызов `.optional()`.
 *
 * ### Обязательный
 * Определяются только через вызов `.required()` и должны иметь значение по умолчанию.
 * {@includeCode ./types.spec.ts#requiredDefinition}
 *
 * ## Значение по умолчанию
 * ----
 * Поддерживается возможность передачи значения по умолчанию для опционального и обязательного поля.
 *
 * ### В опциональном поле
 * {@includeCode ./types.spec.ts#defaultValueDefinition}
 *
 * ### В обязательном поле
 * {@includeCode ./types.spec.ts#requiredDefaultValueDefinition}
 *
 * ### Без значения по умолчанию в обязательном поле
 * Обязательное поле **должно** иметь значение по умолчанию.
 * {@includeCode ./types.spec.ts#withoutDefaultValueDefinition}
 *
 * ## Метаданные
 * ----
 * - `title?: string` — заголовок поля
 * - `id?: true` — только для обязательных примитивов и enum (идентификатор)
 * - `data?: string` — только для array (имя таблицы данных)
 * {@includeCode ./types.spec.ts#titleDefinition}
 */

export type Types = {
  /**
   * Строковый тип.
   *
   * {@includeCode ./test/string.spec.ts#stringDefinition}
   */
  string: TypePrimitive<string, "string">

  /**
   * Числовой тип.
   *
   * {@includeCode ./test/number.spec.ts#numberDefinition}
   */
  number: TypePrimitive<number, "number">

  /**
   * Логический тип.
   *
   * {@includeCode ./test/boolean.spec.ts#booleanDefinition}
   */
  boolean: TypePrimitive<boolean, "boolean">

  /**
   * Массив примитивов.
   * Массив плоский и однородный.
   *
   * {@includeCode ./test/array.spec.ts#arrayDefinition}
   */
  array: TypeArray

  /**
   * Перечисления.
   *
   * Перечисления однородные.
   *
   * Значения для enum могут отсутствовать. ({@link SchemaType.values | схема})
   * {@includeCode ./test/enum.spec.ts#emptyType}
   *
   * Варианты декларации.
   * {@includeCode ./test/enum.spec.ts#enumDefinition}
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
