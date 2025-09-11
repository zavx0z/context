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
 * ### Заголовок
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
  <D extends T>(defaultValue?: D): ((options?: { title?: string }) => SchemaType<T, N>) & SchemaType<T, N, false>
  optional: <D extends T>(
    defaultValue?: D
  ) => ((options?: { title?: string }) => SchemaType<T, N, false>) & SchemaType<T, N, false>

  required: <D extends T>(
    defaultValue: D
  ) => ((options?: { title?: string }) => SchemaType<T, N, true>) & SchemaType<T, N, true>
}

export type TypeArray = {
  <T extends string | number | boolean>(defaultValue?: T[]): SchemaType<T[], "array"> &
    ((options?: { title?: string }) => SchemaType<T[], "array">)
  optional: <T extends string | number | boolean>(
    defaultValue?: T[]
  ) => SchemaType<T[], "array", false> & ((options?: { title?: string }) => SchemaType<T[], "array", false>)
  required: <T extends string | number | boolean>(
    defaultValue: T[]
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
    defaultValue: T[number]
  ) => SchemaType<string | number, "enum", true, T> &
    ((options?: { title?: string }) => SchemaType<string | number, "enum", true, T>)
}
