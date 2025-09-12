import { describe, it, expect } from "bun:test"
import { Context, ContextClone } from "./context"

// Утилита: безопасно проверить, что операция бросает TypeError (сообщение может отличаться в разных рантаймах)
function expectThrow(fn: () => unknown) {
  let threw = false
  try {
    fn()
  } catch (e) {
    threw = true
    expect(e instanceof Error).toBe(true)
  }
  if (!threw) {
    throw new Error("Ожидалось исключение, но его не было брошено")
  }
}

describe("Context: примитивы и плоские массивы", () => {
  it("инициализация по умолчанию (required/optional + array)", () => {
    const ctx = new Context((t) => ({
      name: t.string.required("default")({ title: "Имя" }),
      age: t.number.optional(),
      ok: t.boolean.required(true),
      role: t.enum("user", "admin").required("user"),
      tags: t.array.required([]), // плоский массив
      note: t.string.optional(),
    }))

    // required -> дефолты, optional -> null
    expect({ ...ctx.context }).toEqual({
      name: "default",
      age: null,
      ok: true,
      role: "user",
      tags: [],
      note: null,
    })

    // витрина read-only объект
    expect(() => {
      ;(ctx.context as any).name = "X"
    }).toThrow()

    // массив заморожен
    expect(Array.isArray(ctx.context.tags)).toBe(true)
    expect(Object.isFrozen(ctx.context.tags)).toBe(true)
    expectThrow(() => {
      ;(ctx.context.tags as any)[0] = "nope"
    })
  })

  it("schema сериализация не содержит функций и хранит метаданные", () => {
    const ctx = new Context((t) => ({
      name: t.string.required("default")({ title: "Имя" }),
      role: t.enum("user", "admin").required("user"),
      tags: t.array.optional(), // optional array -> null
    }))
    expect(ctx.schema).toEqual({
      name: { type: "string", required: true, title: "Имя", default: "default" },
      role: { type: "enum", required: true, values: ["user", "admin"], default: "user" },
      tags: { type: "array" },
    })
  })

  it("onUpdate: вызывается только при реальном изменении и отдаёт точечный патч", () => {
    const ctx = new Context((t) => ({
      a: t.number.required(1),
      b: t.string.optional(),
      arr: t.array.required([0, 1]),
    }))

    const patches: any[] = []
    const off = ctx.onUpdate((u) => patches.push(u))

    // без изменений — пусто
    ctx.update({})
    expect(patches.length).toBe(0)

    // реальное изменение
    ctx.update({ a: 2 })
    expect(patches.pop()).toEqual({ a: 2 })

    // массив меняем — приходит новый frozen массив
    ctx.update({ arr: [2, 3, 4] })
    const last = patches.pop()
    expect(Array.isArray(last.arr)).toBe(true)
    expect(Object.isFrozen(last.arr)).toBe(true)
    expect(last).toEqual({ arr: [2, 3, 4] })

    // повтор того же значения — не эмитит
    const cnt = patches.length
    ctx.update({ a: 2 })
    expect(patches.length).toBe(cnt)

    off()
  })

  it("snapshot: содержит схему + актуальные значения", () => {
    const ctx = new Context((t) => ({
      name: t.string.required("default")({ title: "Имя" }),
      arr: t.array.required([0, 1]),
    }))
    ctx.update({ name: "MetaFor", arr: [10, 20] })
    const snap = ctx.snapshot

    expect(snap.name.type).toBe("string")
    expect(snap.name.required).toBe(true)
    expect(snap.name.title).toBe("Имя")
    expect(snap.name.value).toBe("MetaFor")

    expect(snap.arr.type).toBe("array")
    expect(snap.arr.required).toBe(true)
    expect(snap.arr.value).toEqual([10, 20])
  })
})

describe("Защита read-only витрины целиком", () => {
  it("нельзя добавлять/удалять ключи контекста и менять дескрипторы", () => {
    const ctx = new Context((t) => ({
      s: t.string.required("x"),
      arr: t.array.required([1]),
    }))

    // запрещено удалять ключ
    expectThrow(() => {
      delete (ctx.context as any).s
    })

    // запрещено добавлять ключ
    expectThrow(() => {
      ;(ctx.context as any).zzz = 123
    })

    // запрещено переопределять дескриптор геттера
    expectThrow(() => {
      Object.defineProperty(ctx.context, "s", { value: "hack" })
    })
  })
})
