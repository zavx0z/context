import type { BaseTypeSchema } from "./index.t"

/**
 * Универсальный интерфейс конструктора примитивных типов контекста.
 *
 * Позволяет объявлять типы `string`, `number`, `boolean` и управлять их обязательностью:
 * - Вызов как функции — **необязательный** тип по умолчанию
 * - `.optional()` — явное объявление **необязательного** типа
 * - `.required()` — объявление **обязательного** типа
 *
 * Каждый вариант возвращает `BaseTypeSchema` и поддерживает пост-вызов с опциями для задания метаданных (например, `title`).
 *
 * @template T Тип значения (примитив)
 * @template N Имя типа (`"string" | "number" | "boolean"`)
 *
 *
 */
export interface TypePrimitive<T extends string | number | boolean, N extends "string" | "number" | "boolean"> {
  /**
   * Короткая запись: создаёт **необязательный** тип по умолчанию.
   *
   * @example
   * ```ts
   * const t = types.string;         // TypePrimitive<string,"string">
   * const name = t("John");         // BaseTypeSchema<string,"string",false>
   * const titled = name({ title: "User name" });
   * ```
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<T, N, false>` + функция для задания опций (`title`)
   */
  <D extends T>(defaultValue?: D): ((options?: { title?: string }) => BaseTypeSchema<T, N>) &
    BaseTypeSchema<T, N, false>

  /**
   * Явно **необязательный** тип.
   *
   * @example
   * ```ts
   * const age = types.number.optional();      // BaseTypeSchema<number,"number",false>
   * const withTitle = age({ title: "Age" });
   * ```
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<T, N, false>` + функция для задания опций (`title`)
   */
  optional: <D extends T>(
    defaultValue?: D
  ) => ((options?: { title?: string }) => BaseTypeSchema<T, N, false>) & BaseTypeSchema<T, N, false>

  /**
   * **Обязательный** тип.
   *
   * @example
   * ```ts
   * const isAdmin = types.boolean.required(false); // BaseTypeSchema<boolean,"boolean",true>
   * const meta = isAdmin({ title: "Is admin" });
   * ```
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<T, N, true>` + функция для задания опций (`title`)
   */
  required: <D extends T>(
    defaultValue?: D
  ) => ((options?: { title?: string }) => BaseTypeSchema<T, N, true>) & BaseTypeSchema<T, N, true>
}

export type TypeArray = {
  /**
   * Короткая запись: **необязательный** массив по умолчанию.
   *
   * @param defaultValue Значение по умолчанию (массив примитивов)
   * @returns `BaseTypeSchema<T[], "array", false, T[]>` + функция для задания опций (`title`)
   */
  <T extends string | number | boolean>(defaultValue?: T[]): BaseTypeSchema<T[], "array"> &
    ((options?: { title?: string }) => BaseTypeSchema<T[], "array">)

  /**
   * Явно **необязательный** массив.
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<T[], "array", false>` + функция для задания опций (`title`)
   */
  optional: <T extends string | number | boolean>(
    defaultValue?: T[]
  ) => BaseTypeSchema<T[], "array", false> & ((options?: { title?: string }) => BaseTypeSchema<T[], "array", false>)

  /**
   * **Обязательный** массив.
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<T[], "array", true>` + функция для задания опций (`title`)
   */
  required: <T extends string | number | boolean>(
    defaultValue?: T[]
  ) => BaseTypeSchema<T[], "array", true> & ((options?: { title?: string }) => BaseTypeSchema<T[], "array", true>)
}

export type TypeEnum = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  /**
   * Короткая запись: **необязательный** enum по умолчанию.
   *
   * @param defaultValue Значение по умолчанию (одно из `values`)
   * @returns `BaseTypeSchema<..., "enum", false, T>` + функция опций (`title`)
   */
  (defaultValue?: T[number]): BaseTypeSchema<string | number, "enum", false, T> &
    ((options?: { title?: string }) => BaseTypeSchema<string | number, "enum", false, T>)

  /**
   * Явно **необязательный** enum.
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<..., "enum", false, T>` + функция опций (`title`)
   */
  optional: (
    defaultValue?: T[number]
  ) => BaseTypeSchema<string | number, "enum", false, T> &
    ((options?: { title?: string }) => BaseTypeSchema<string | number, "enum", false, T>)

  /**
   * **Обязательный** enum.
   *
   * @param defaultValue Значение по умолчанию
   * @returns `BaseTypeSchema<..., "enum", true> & { values: T }` + функция опций (`title`)
   */
  required: (
    defaultValue?: T[number]
  ) => BaseTypeSchema<string | number, "enum", true, T> &
    ((options?: { title?: string }) => BaseTypeSchema<string | number, "enum", true, T>)
}
