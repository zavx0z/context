import type { SchemaType, Schema } from "./schema.t"

/**
 * @readonly
 * Значения контекста
 *
 * @remarks содержит только актуальные значения каждого поля
 */
export type Values<C extends Schema> = { [K in keyof C]: ExtractValue<C[K]> }

/**
 * @readonly
 * Снимок
 *
 * @remarks содержит данные {@link Schema | схемы} + {@link Values | актуальные значения} для каждого поля
 */
export type Snapshot<C extends Schema> = {
  [K in keyof C]: {
    type: C[K]["type"]
    required?: C[K]["required"]
    default?: C[K]["default"]
    title?: C[K]["title"]
    values?: C[K]["values"]
    value: Values<C>[K]
  }
}

/**
 * Обновляет значения в контексте
 *
 * Обновляет только существующие ключи. Игнорирует undefined.
 * {@includeCode ./test/update.spec.ts#undefined}
 *
 * Для optional полей поддерживается установка null
 * {@includeCode ./test/update.spec.ts#optionalNull}
 *
 * @throws {TypeError} `[Context.update] "{field}": поле не может быть null` - при попытке установить null для required поля
 * {@includeCode ./test/update.spec.ts#requiredNull}
 *
 * @throws {TypeError} `[Context.update] "{field}": ожидается плоский массив примитивов` - при попытке установить nested массив или массив с объектами
 * {@includeCode ./test/update.spec.ts#arrayErrors}
 *
 * @throws {TypeError} `[Context.update] "{field}": объекты и функции запрещены` - при попытке установить объект или функцию в примитивное поле
 * {@includeCode ./test/update.spec.ts#primitiveErrors}
 *
 * @throws {TypeError} `[Context.update] "{field}": должно быть '{values}', получено '{value}'` - при попытке установить недопустимое значение для enum поля
 * {@includeCode ./test/update.spec.ts#enumErrors}
 *
 * @param values - Значения для обновления
 * @returns Значения, которые были обновлены
 */
export type Update<C extends Schema> = (values: Partial<Values<C>>) => Partial<Values<C>>

export type ExtractValue<E> = E extends SchemaType<infer T, infer N, infer R, infer V>
  ? N extends "enum"
    ? // для enum берём ЛИТЕРАЛЫ из V[number], а не общий T
      R extends true
      ? V extends readonly (string | number)[]
        ? V[number]
        : T
      : (V extends readonly (string | number)[] ? V[number] : T) | null
    : N extends "array"
    ? // для массива сохраняем точный T (например, number[])
      R extends true
      ? T
      : T | null
    : // примитивы
    R extends true
    ? T
    : T | null
  : never

/**
 * Основной интерфейс контекста. Предоставляет типобезопасный доступ к схеме и значениям,
 * контролируемые обновления и подписки на изменения.
 *
 * @template C - Тип схемы контекста
 *
 * @example Создание и использование контекста
 * ```ts
 * const ctx = fromSchema(contextSchema((t) => ({
 *   name: t.string.required("Гость", { title: "Имя" }),
 *   age: t.number.optional()
 * })))
 *
 * // чтение через иммутабельный объект
 * console.log(ctx.context.name) // "Гость"
 *
 * // обновление с возвратом изменённых полей
 * const changed = ctx.update({ name: "Иван", age: 25 })
 *
 * // подписка на обновления
 * const unsubscribe = ctx.onUpdate((updated) => {
 *   console.log("Changed:", updated)
 * })
 * ```
 */
export interface Context<C extends Schema> {
  /** Схема контекста с метаданными полей */
  schema: C

  /** Иммутабельный объект значений контекста (только для чтения) */
  context: Values<C>

  /**
   * Обновляет значения контекста. Возвращает только реально изменённые поля.
   *
   * @param values - Частичное обновление значений
   * @returns Объект с изменёнными полями
   */
  update: (values: Partial<Values<C>>) => Partial<Values<C>>

  /**
   * Подписка на обновления контекста.
   *
   * @param callback - Функция, вызываемая при изменениях
   * @returns Функция отписки
   */
  onUpdate: (callback: (updated: Partial<Values<C>>) => void) => () => void

  /** Полный снимок контекста с метаданными и текущими значениями */
  snapshot: Snapshot<C>
}
