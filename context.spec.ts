import { describe, test, expect } from "bun:test"
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
  test("инициализация по умолчанию (required/optional + array)", () => {
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

  test("schema сериализация не содержит функций и хранит метаданные", () => {
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

  describe("onUpdate", () => {
    // #region onUpdate
    test("обновление значения", () => {
      const { onUpdate, update } = new Context((types) => ({
        string: types.string.optional(),
        array: types.array.required([0, 1]),
      }))
      onUpdate((updated) => {
        expect(Array.isArray(updated.array), "должен быть массив").toBe(true)
        expect(Object.isFrozen(updated.array), "массив должен быть frozen").toBe(true)
        expect(updated, "значение быть равно переданному").toEqual({ array: [2, 3, 4] })
        expect(updated.string, "значения которые не были обновлены не должны быть в обновлении").toBeUndefined()
      })
      update({ array: [2, 3, 4] })
    })
    test("без изменений — пусто", () => {
      const { onUpdate, update } = new Context((types) => ({ number: types.number.required(1) }))
      let count = 0
      onUpdate(() => count++)
      update({})
      expect(count, "обновление не должно быть вызвано").toBe(0)
    })
    test("повтор того же значения — не эмитит", () => {
      const { onUpdate, update } = new Context((types) => ({ number: types.number.required(1) }))
      let count = 0
      onUpdate(() => count++)
      update({ number: 1 })
      expect(count, "обновление не должно быть вызвано").toBe(0)
    })
    test("отписка от обновлений", () => {
      const { onUpdate, update, context } = new Context((types) => ({ count: types.number.required(0) }))
      let count = 0
      const unsubscribe = onUpdate(() => count++)
      update({ count: 1 })
      expect(context.count, "обновление должно быть вызвано").toBe(count)
      unsubscribe()
      update({ count: 2 })
      expect(context.count, "контекст должен быть обновлен").toBe(2)
      expect(count, "обновление не должно быть вызвано").toBe(1)
    })
    // #endregion onUpdate
  })

  test("snapshot: содержит схему + актуальные значения", () => {
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
  test("нельзя добавлять/удалять ключи контекста и менять дескрипторы", () => {
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
