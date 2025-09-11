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
   * **Тип поля контекста**
   */
  type: N
  /**
   * **Является ли поле обязательным**
   *
   * @remarks Присутствует в схеме только для обязательных полей
   */
  required?: R
  /**
   * **Название поля (для отображения в UI)**
   */
  title?: string
  /**
   * **Значение по умолчанию**
   *
   * @remarks может быть как для обязательного, так и для необязательного поля
   */
  default?: T | undefined
  /**
   * **Значения для enum**
   *
   * Используется только для `enum` контекстного типа
   *
   * > Значения могут отсутствовать для enum
   * {@includeCode ./schema.spec.ts#emptyEnumSnapshot}
   */
  values?: V
}

/**
 * # Схема контекста
 *
 * Используется в системе для **хранения** и **передачи** структуры контекста.
 *
 * Формируется в процессе инициализации контекста при помощи {@link Types | деклараций типов}.
 *
 * Описывает {@link SchemaType.type | простые типы} значений контекста.
 * - строка
 * - число
 * - логическое значение
 * - однородный массив примитивов (числа, строки, логические значения)
 * - однородное перечисление (строки, числа)
 *
 * Содержит:
 * - {@link SchemaType.type | имя типа}
 * - {@link SchemaType.required | является ли поле обязательным}
 * - {@link SchemaType.default | значение по умолчанию}
 * - {@link SchemaType.values | значения перечисления}
 *
 * А так же метаданные полей контекста (для отображения в UI):
 * - {@link SchemaType.title | название }
 * - {@link ToDo.description | описание }
 *
 * Структура схемы стремиться быть минимальной для сокращения объёма данных.
 * Минимизация данных позволяет оптимизировать память и скорость работы с данными.
 * - скорость обработки при сериализации и десериализации
 * - объем памяти
 * - объем хранения
 * - сетевой трафик
 */
export type Schema = Record<
  string,
  | SchemaType<string, "string", true | false>
  | SchemaType<boolean, "boolean", true | false>
  | SchemaType<number, "number", true | false>
  | SchemaType<(string | number | boolean)[], "array", true | false>
  | SchemaType<string | number, "enum", true | false, readonly (string | number)[]>
>

export type NormalizeSchema<S> = {
  [K in keyof S]: S[K] extends SchemaType<infer A, infer N, infer R, infer V>
    ? N extends "string"
      ? SchemaType<string, "string", R>
      : N extends "number"
      ? SchemaType<number, "number", R>
      : N extends "boolean"
      ? SchemaType<boolean, "boolean", R>
      : N extends "array"
      ? A extends readonly (infer E)[]
        ? SchemaType<
            Array<E extends number ? number : E extends string ? string : E extends boolean ? boolean : E>,
            "array",
            R
          >
        : SchemaType<(string | number | boolean)[], "array", R>
      : N extends "enum"
      ? SchemaType<V extends readonly (string | number)[] ? V[number] : string | number, "enum", R, V>
      : never
    : S[K] extends {
        type: infer N extends "string" | "number" | "boolean" | "array" | "enum"
        required: infer R extends boolean
      }
    ? N extends "string"
      ? SchemaType<string, "string", R>
      : N extends "number"
      ? SchemaType<number, "number", R>
      : N extends "boolean"
      ? SchemaType<boolean, "boolean", R>
      : N extends "array"
      ? SchemaType<(string | number | boolean)[], "array", R>
      : N extends "enum"
      ? S[K] extends { values: infer V extends readonly (string | number)[] }
        ? SchemaType<V[number], "enum", R, V>
        : SchemaType<string | number, "enum", R, readonly (string | number)[]>
      : never
    : never
} extends infer T
  ? T extends Record<string, SchemaType<any, any, any, any>>
    ? {
        [K in keyof T]: T[K] extends SchemaType<infer A, infer N, infer R, infer V>
          ? N extends "string"
            ? SchemaType<string, "string", R>
            : N extends "number"
            ? SchemaType<number, "number", R>
            : N extends "boolean"
            ? SchemaType<boolean, "boolean", R>
            : N extends "array"
            ? SchemaType<A, "array", R>
            : N extends "enum"
            ? SchemaType<V extends readonly (string | number)[] ? V[number] : string | number, "enum", R, V>
            : never
          : never
      }
    : never
  : never
