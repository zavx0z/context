/**
 * @packageDocumentation
 *
 * ## Точка входа
 * - {@link contextSchema | Создание контекста из функции-схемы}
 * - {@link contextFromSchema | Создание контекста из готовой схемы}
 * - {@link contextFromSnapshot | Создание контекста из снимка}
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

export { contextFromSchema, contextFromSnapshot } from "./context"
export { contextSchema } from "./schema"
export type { Types } from "./types.t"
export type { Context, Values, Snapshot, Update } from "./context.t"
export type { Schema, SchemaType } from "./schema.t"
