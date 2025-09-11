import type { TypeArray, TypeEnum, TypePrimitive } from "./types.t"

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
  array: TypeArray

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
  enum: TypeEnum
}
/**
 * Описание типа поля для схемы контекста
 *
 * @template T JavaScript тип значения
 * @template N Название контекстного типа
 * @template R Является ли поле обязательным (true | false)
 * @template V Значения только для `enum` контекстного типа
 */
export interface SchemaType<
  T,
  N extends "string" | "number" | "boolean" | "array" | "enum",
  R extends boolean = false,
  V extends readonly (string | number)[] | never = never
> {
  /**
   * @description Тип поля контекста
   */
  type: N
  /**
   * @description Является ли поле обязательным
   *
   * @default false
   */
  required: R
  /**
   * @description Название поля (для отображения в UI)
   */
  title?: string
  /**
   * @description Значение по умолчанию
   *
   * @remarks может быть как для обязательного, так и для необязательного поля
   */
  default?: T
  /**
   * @description Значения для enum
   *
   * @remarks только для `enum` контекстного типа
   */
  values?: V
}

/**
 * Схема контекста
 */
export type Schema = Record<
  string,
  | SchemaType<string, "string", true | false>
  | SchemaType<boolean, "boolean", true | false>
  | SchemaType<number, "number", true | false>
  | SchemaType<(string | number | boolean)[], "array", true | false>
  | SchemaType<string | number, "enum", true | false, readonly (string | number)[]>
>
