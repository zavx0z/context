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
  <D extends T>(defaultValue?: D): ((options?: { title?: string }) => BaseTypeSchema<T, N>) & BaseTypeSchema<T, N, false>

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
