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

