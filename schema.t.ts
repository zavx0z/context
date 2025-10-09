/**
 * Описание типа поля для схемы контекста
 *
 * @template D JavaScript тип значения
 * @template N Название контекстного типа
 * @template R Является ли поле обязательным (true | false)
 * @template V Значения только для `enum` контекстного типа
 */
interface SchemaTypeBase<
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
  label?: string
  /**
   * **Значения для enum**
   *
   * Используется только для `enum` контекстного типа
   *
   * Значения могут отсутствовать для enum ({@link Types.enum | декларация})
   * {@includeCode ./test/enum.spec.ts#emptySchema}
   */
  values?: V
  /**
   * **Флаг идентификатора** (только для примитивов и enum которые являются обязательными)
   *
   * @remarks Позволяет пометить поле как идентификатор (id)
   */
  id?: true
  /**
   * **Имя таблицы данных** (только для array)
   */
  data?: string
}

export type SchemaType<
  N extends "string" | "number" | "boolean" | "array" | "enum",
  R extends boolean = false,
  D extends unknown = undefined,
  V extends readonly (string | number)[] | never = never
> = [D] extends [undefined] ? SchemaTypeBase<N, R, V> & { default?: D } : SchemaTypeBase<N, R, V> & { default: D }

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
 * - {@link SchemaType.label | название }
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
  | SchemaType<"string", true | false, undefined>
  | SchemaType<"string", true | false, string>
  | SchemaType<"boolean", true | false, undefined>
  | SchemaType<"boolean", true | false, boolean>
  | SchemaType<"number", true | false, undefined>
  | SchemaType<"number", true | false, number>
  | SchemaType<"array", true | false, undefined>
  | SchemaType<"array", true | false, (string | number | boolean)[]>
  | SchemaType<"enum", true | false, undefined, readonly (string | number)[]>
  | SchemaType<"enum", true | false, string | number, readonly (string | number)[]>
>
