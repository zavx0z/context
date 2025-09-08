import type { TypeShort } from "./index.t"
import type { BaseTypeSchema } from "./index.t"

export type StringSchema = BaseTypeSchema<string, "string", true> | BaseTypeSchema<string, "string", false>

/**
 * # Строковый тип
 *
 * Поддерживает 3 варианта определения строкового типа:
 * - {@link TypeShort | Краткая}
 * - {@link StringType.optional | Опциональная}
 * - {@link StringType.required | Обязательная}
 * @group Типы
 */
export interface StringType extends TypeShort<string, "string"> {
  optional: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => BaseTypeSchema<string, "string">) & BaseTypeSchema<string, "string">

  required: <T extends string = string>(
    defaultValue?: T
  ) => ((options?: { title?: string }) => BaseTypeSchema<string, "string", true>) &
    BaseTypeSchema<string, "string", true>
}
