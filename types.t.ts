import type { SchemaType } from "./schema.t"

/**
 * # Типы для описания контекста.
 * Является фабрикой для создания {@link Schema | схемы контекста}.
 *
 * > Декларация всех типов однообразна, за небольшим исключением в {@link Types.enum|`enum`}.
 *
 * ## Ограничения
 * ----
 * ### Опциональный
 * Опциональные поля {@link Context.update | могут принимать значения } `null`.
 *
 * Имеет возможность определения в 3 вариантах:
 *
 * 1. В виде ключа типа (опциональный)
 * {@includeCode ./types.spec.ts#simpleDefinition}
 * > Вариант удобен на этапе проектирования - без передачи значений по умолчанию и опциональных параметров.
 *
 * 2. Вызов как функции (опциональный)
 * {@includeCode ./types.spec.ts#simpleDefinitionCall}
 * > Вариант удобен на этапе проектирования с возможностью передачи значений по умолчанию и опциональных параметров.
 *
 * 3. Опциональный
 * {@includeCode ./types.spec.ts#optionalDefinition}
 * > Для удобного визуального восприятия, поддерживая однообразие с `required` вариантом, `.optional()` и `.required()` имеют одинаковую сигнатуру.
 *
 * ### Обязательный
 * {@includeCode ./types.spec.ts#requiredDefinition}
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
   * Логический тип.
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
   * Перечисления.
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

export interface TypePrimitive<T extends string | number | boolean, N extends "string" | "number" | "boolean"> {
  <D extends T>(defaultValue?: D): ((options?: { title?: string }) => SchemaType<T, N>) & SchemaType<T, N, false>
  optional: <D extends T>(
    defaultValue?: D
  ) => ((options?: { title?: string }) => SchemaType<T, N, false>) & SchemaType<T, N, false>

  required: <D extends T>(
    defaultValue?: D
  ) => ((options?: { title?: string }) => SchemaType<T, N, true>) & SchemaType<T, N, true>
}

export type TypeArray = {
  <T extends string | number | boolean>(defaultValue?: T[]): SchemaType<T[], "array"> &
    ((options?: { title?: string }) => SchemaType<T[], "array">)
  optional: <T extends string | number | boolean>(
    defaultValue?: T[]
  ) => SchemaType<T[], "array", false> & ((options?: { title?: string }) => SchemaType<T[], "array", false>)
  required: <T extends string | number | boolean>(
    defaultValue?: T[]
  ) => SchemaType<T[], "array", true> & ((options?: { title?: string }) => SchemaType<T[], "array", true>)
}

export type TypeEnum = <const T extends readonly (string | number)[]>(
  ...values: T
) => {
  (defaultValue?: T[number]): SchemaType<string | number, "enum", false, T> &
    ((options?: { title?: string }) => SchemaType<string | number, "enum", false, T>)
  optional: (
    defaultValue?: T[number]
  ) => SchemaType<string | number, "enum", false, T> &
    ((options?: { title?: string }) => SchemaType<string | number, "enum", false, T>)
  required: (
    defaultValue?: T[number]
  ) => SchemaType<string | number, "enum", true, T> &
    ((options?: { title?: string }) => SchemaType<string | number, "enum", true, T>)
}
