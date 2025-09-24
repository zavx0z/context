import type { Schema } from "./schema.t"
import { types } from "./types"
import type { Types } from "./types.t"

/**
 * Создаёт нормализованную схему контекста.
 *
 * Принимает фабрику схемы, в которую передаются `types`, и возвращает
 * очищенную схему, содержащую только разрешённые поля (`type`, `required`,
 * `default`, `title`, `values`, `id`, `data`). Также валидирует, что все
 * обязательные поля имеют значение по умолчанию.
 *
 * @example
 * const schema = contextSchema((t) => ({
 *   name: t.string.required("Иван", { title: "Имя" }),
 *   tags: t.array.optional({ title: "Теги" }),
 * }))
 */
export function contextSchema<C extends Schema>(schema: (types: Types) => C): C {
  const raw = schema(types)
  const out = {} as C
  for (const k in raw) {
    const def = raw[k]
    if (!def) continue
    if (def.required && def.default === undefined) {
      throw new Error(`Обязательное поле ${k} должно иметь значение по умолчанию`)
    }
    const core: Record<string, unknown> = { type: def.type, ...(def.required && { required: true as const }) }
    if ("default" in def && def.default !== undefined) (core as any).default = def.default
    if ("title" in def && def.title !== undefined) (core as any).title = def.title
    if ("values" in def && Array.isArray((def as any).values) && (def as any).values.length > 0)
      (core as any).values = (def as any).values
    if ("id" in def && (def as any).id === true) (core as any).id = true
    if ("data" in def && typeof (def as any).data === "string" && (def as any).data.length > 0)
      (core as any).data = (def as any).data
    ;(out as any)[k] = core as unknown as C[typeof k]
  }
  return out
}
