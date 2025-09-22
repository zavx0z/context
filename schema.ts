import type { NormalizeSchema, Schema } from "./schema.t"
import { types } from "./types"
import type { Types } from "./types.t"

// рантайм-очистка (оставляем только поля схемы)
export function contextDefinitionToSchema<C extends Schema>(schema: (types: Types) => C): Schema {
  return normalizeSchema(schema(types)) as Schema
}
export function normalizeSchema<S>(raw: S): NormalizeSchema<S> {
  const out: any = {}
  for (const [k, def] of Object.entries(raw as Record<string, any>)) {
    if (!def) continue
    const required = def.required && typeof def.required !== "function"
    if (required && def.default === undefined) {
      throw new Error(`Обязательное поле ${k} должно иметь значение по умолчанию`)
    }
    const core: any = { type: def.type, ...(required && { required: true }) }
    if ("default" in def && def.default !== undefined) core.default = def.default
    if ("title" in def && def.title !== undefined) core.title = def.title
    if ("values" in def && def.values !== undefined && def.values.length > 0) core.values = def.values
    out[k] = core
  }
  return out
}
