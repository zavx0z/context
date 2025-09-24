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
    if (def.required && def.default === undefined) {
      throw new Error(`Обязательное поле ${k} должно иметь значение по умолчанию`)
    }
    const core: any = { type: def.type, ...(def.required && { required: true }) }
    if ("default" in def && def.default !== undefined) core.default = def.default
    if ("title" in def && def.title !== undefined) core.title = def.title
    if ("values" in def && def.values !== undefined && def.values.length > 0) core.values = def.values
    if ("id" in def && def.id === true) core.id = true
    if ("data" in def && typeof def.data === "string" && def.data.length > 0) core.data = def.data
    out[k] = core
  }
  return out
}
