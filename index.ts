/**
 * @packageDocumentation
 *
 * ## Точка входа
 * - {@link Context | Конструктор контекста}
 *
 * ## Функциональность
 * - {@link Context.update | Обновление значений контекста}
 * - {@link Context.onUpdate | Подписка на обновления значений контекста}
 * - {@link ToDo.editSchema | Редактирование схемы контекста}
 *
 * ## Входные параметры
 * - {@link Types | Типы для описания контекста}
 * - {@link Snapshot | Снимок контекста}
 *
 * ## Выходные параметры
 * - {@link Values | Значения контекста}
 * - {@link Snapshot | Снимок контекста}
 * - {@link Schema | Схема контекста}
 */

export enum ToDo {
  /**
   * Система редактирования схемы контекста
   * - Добавление нового поля
   * - Удаление поля
   * - Изменение заголовка поля
   */
  editSchema = "Редактирование схемы контекста",
  description = "Описание поля (для отображения в UI)",
}

export { Context } from "./context"
export { fromSchema, fromSnapshot } from "./context"
export { types } from "./types"
export type { Types } from "./types.t"
export type { Values, Snapshot, Update } from "./context.t"
export type { Schema, SchemaType } from "./schema.t"
export { contextDefinitionToSchema } from "./schema"
