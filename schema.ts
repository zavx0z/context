import type { NormalizeSchema } from "./schema.t"

// рантайм-очистка (оставляем только поля схемы)

export function normalizeSchema<S>(raw: S): NormalizeSchema<S> {
  const out: any = {}
  for (const [k, def] of Object.entries(raw as Record<string, any>)) {
    if (!def) continue
    const core: any = { type: def.type, ...(def.required && typeof def.required !== "function" && { required: true }) }
    if ("default" in def && def.default !== undefined) core.default = def.default
    if ("title" in def && def.title !== undefined) core.title = def.title
    if ("values" in def && def.values !== undefined && def.values.length > 0) core.values = def.values
    out[k] = core
  }
  return out
}
