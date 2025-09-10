import type { TypePrimitive } from "./types.t"

/**
 * Набор конструкторов типов для описания контекста.
 *
 * Все конструкторы возвращают `BaseTypeSchema` соответствующего рода и позволяют
 * дополнительно указать метаданные через вызов с опциями (например, `title`).
 */
export type Types = {
  /**
   * Строковый тип.
   *
   * @example
   * ```ts
   * const userName = types.string.required("MetaFor");
   * const titled = userName({ title: "User name" });
   * ```
   */
  string: TypePrimitive<string, "string">

  /**
   * Числовой тип.
   *
   * @example
   * ```ts
   * const retries = types.number(3); // необязательный по умолчанию
   * ```
   */
  number: TypePrimitive<number, "number">

  /**
   * Булевский тип.
   *
   * @example
   * ```ts
   * const enabled = types.boolean.required(false);
   * ```
   */
  boolean: TypePrimitive<boolean, "boolean">

  /**
   * Массив примитивов (`string | number | boolean`).
   *
   * По умолчанию — **необязательный**. Доступны `.optional()` и `.required()`.
   *
   * @remarks
   * Поддерживаются только **плоские** массивы из простых типов.
   *
   * @example
   * ```ts
   * // Необязательный по умолчанию
   * const tags = types.array<string>(["a", "b"]);
   *
   * // Явно необязательный
   * const list = types.array.optional<number>([1, 2, 3]);
   *
   * // Обязательный
   * const flags = types.array.required<boolean>([true, false]);
   *
   * // Метаданные
   * const titled = flags({ title: "Feature flags" });
   * ```
   */
  array: {
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

  /**
   * Перечисляемый тип из кортежа литералов (`string | number`).
   *
   * Вызов возвращает фабрику, которая:
   * - поддерживает короткую запись (по умолчанию **необязательный**),
   * - имеет варианты `.optional()` и `.required()`,
   * - сохраняет исходные литералы в свойстве `.values` (с точной типизацией).
   *
   * @example
   * ```ts
   * const role = types.enum("admin", "user", "guest");
   *
   * const r1 = role();                // BaseTypeSchema<string | number, "enum"> & { values: ["admin","user","guest"] }
   * const r2 = role.required("admin");// BaseTypeSchema<string | number, "enum", true> & { values: ... }
   * const r3 = r1({ title: "User role" });
   * ```
   *
   *
   */
  enum: <const T extends readonly (string | number)[]>(
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
}
export interface BaseTypeSchema<
  T,
  N extends "string" | "number" | "boolean" | "array" | "enum",
  R extends boolean = false,
  V extends readonly (string | number)[] | undefined = undefined
> {
  type: N
  required: R
  title?: string
  default?: T | undefined
  values?: V
}

export type Schema = Record<
  string,
  | BaseTypeSchema<string, "string", true | false>
  | BaseTypeSchema<boolean, "boolean", true | false>
  | BaseTypeSchema<number, "number", true | false>
  | BaseTypeSchema<(string | number | boolean)[], "array", true | false>
  | BaseTypeSchema<string | number, "enum", true | false, readonly (string | number)[]>
>
