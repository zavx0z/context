/**
 * @packageDocumentation
 *
 * ## Точка входа
 * - {@link contextSchema | Создание контекста из функции-схемы}
 * - {@link fromSchema | Создание контекста из готовой схемы}
 * - {@link fromSnapshot | Создание контекста из снимка}
 *
 * ## Функциональность
 * - {@link ContextObject.update | Обновление значений контекста}
 * - {@link ContextObject.onUpdate | Подписка на обновления значений контекста}
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

export { fromSchema, fromSnapshot } from "./context"
export { contextSchema } from "./schema"
export type { Context as ContextObject } from "./context"
export { types } from "./types"
export type { Types } from "./types.t"
export type { Values, Snapshot, Update } from "./context.t"
export type { Schema, SchemaType } from "./schema.t"
export { contextSchema as contextDefinitionToSchema } from "./schema"
