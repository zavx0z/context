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
export type Update<C extends Schema> = Partial<Values<C>>

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
    : // примитивы — как и раньше
    R extends true
    ? T
    : T | null
  : never
