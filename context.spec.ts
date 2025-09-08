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
      name: t.string.required()({ title: "Имя" }),
      age: t.number.optional(),
      ok: t.boolean.required(),
      role: t.enum("user", "admin").required("user"),
      tags: t.array.required([]), // плоский массив
      note: t.string.optional(),
    }))

    // required -> дефолты, optional -> null
    expect(ctx.context).toEqual({
      name: "",
      age: null,
      ok: false,
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
      name: t.string.required()({ title: "Имя" }),
      role: t.enum("user", "admin").required("user"),
      tags: t.array.optional(), // optional array -> null
    }))
    expect(ctx.schema).toEqual({
      name: { type: "string", required: true, title: "Имя" },
      role: { type: "enum", required: true, values: ["user", "admin"], default: "user" },
      tags: { type: "array", required: false },
    })
  })

  it("update: примитивы и плоские массивы проходят, nested/objects — ошибка", () => {
    const ctx = new Context((t) => ({
      s: t.string.optional(),
      n: t.number.required(),
      b: t.boolean.optional(),
      arr: t.array.required([]),
    }))

    // базовое обновление
    const patch1 = ctx.update({ s: "MetaFor", n: 42, b: true })
    expect(patch1).toEqual({ s: "MetaFor", n: 42, b: true })
    expect(ctx.context.s).toBe("MetaFor")
    expect(ctx.context.n).toBe(42)
    expect(ctx.context.b).toBe(true)

    // обновление массива плоскими примитивами -> ок, заморозка
    const p2 = ctx.update({ arr: ["a", 1, true, null] } as any)
    expect(p2).toEqual({ arr: ["a", 1, true, null] } as any)
    expect(ctx.context.arr).toEqual(["a", 1, true, null] as any)
    expect(Object.isFrozen(ctx.context.arr)).toBe(true)
    expectThrow(() => {
      ;(ctx.context.arr as any)[0] = "x"
    })

    // попытка записать объект в примитивное поле
    expect(() => ctx.update({ s: { x: 1 } as any })).toThrow()

    // попытка nested массива
    expect(() => ctx.update({ arr: [["nested"]] as any })).toThrow()

    // попытка массива с объектами
    expect(() => ctx.update({ arr: [{ x: 1 }] as any })).toThrow()

    // попытка функции
    expect(() => ctx.update({ s: function () {} as any })).toThrow()
  })

  it("onUpdate: вызывается только при реальном изменении и отдаёт точечный патч", () => {
    const ctx = new Context((t) => ({
      a: t.number.required(0),
      b: t.string.optional(),
      arr: t.array.required([0, 1]),
    }))

    const patches: any[] = []
    const off = ctx.onUpdate((u) => patches.push(u))

    // без изменений — пусто
    ctx.update({})
    expect(patches.length).toBe(0)

    // реальное изменение
    ctx.update({ a: 1 })
    expect(patches.pop()).toEqual({ a: 1 })

    // массив меняем — приходит новый frozen массив
    ctx.update({ arr: [2, 3, 4] })
    const last = patches.pop()
    expect(Array.isArray(last.arr)).toBe(true)
    expect(Object.isFrozen(last.arr)).toBe(true)
    expect(last).toEqual({ arr: [2, 3, 4] })

    // повтор того же значения — не эмитит
    const cnt = patches.length
    ctx.update({ a: 1 })
    expect(patches.length).toBe(cnt)

    off()
  })

  it("snapshot: содержит схему + актуальные значения", () => {
    const ctx = new Context((t) => ({
      name: t.string.required()({ title: "Имя" }),
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
