import { describe, it, expect } from "bun:test"
import { types, createContext } from "../context"

describe("update", () => {
  it("обновляет только переданные значения", () => {
    const { context, update } = createContext({
      name: types.string.required({ default: "Гость" }),
      nickname: types.string(),
      age: types.number.optional(),
    })

    update({ name: "Иван" })
    expect(context.name).toBe("Иван")
    expect(context.nickname).toBe(null)
    expect(context.age).toBe(null)

    update({ nickname: "nick", age: 25 })
    expect(context.name).toBe("Иван")
    expect(context.nickname).toBe("nick")
    expect(context.age).toBe(25)
  })

  it("игнорирует undefined значения", () => {
    const { context, update } = createContext({
      name: types.string.required({ default: "Гость" }),
      nickname: types.string(),
    })

    // @ts-expect-error - TypeScript должен запрещать undefined
    update({ name: undefined })

    expect(context.name).toBe("Гость")
  })

  it("позволяет устанавливать null для optional полей", () => {
    const { context, update } = createContext({
      nickname: types.string(),
      age: types.number.optional(),
    })

    update({ nickname: "test" })
    expect(context.nickname).toBe("test")

    update({ nickname: null })
    expect(context.nickname).toBe(null)

    update({ age: 25 })
    expect(context.age).toBe(25)

    update({ age: null })
    expect(context.age).toBe(null)
  })

  it("работает со всеми типами данных", () => {
    const { context, update } = createContext({
      title: types.string.required({ default: "Заголовок" }),
      description: types.string(),
      age: types.number.required({ default: 18 }),
      score: types.number(),
      isActive: types.boolean.required({ default: true }),
      isVerified: types.boolean(),
      status: types.enum("draft", "published", "archived").required({ default: "draft" }),
      category: types.enum("tech", "design", "business")(),
      tags: types.array.required<string>({ default: [] }),
      permissions: types.array<number>(),
      flags: types.array<boolean>(),
    })

    update({
      title: "Новый заголовок",
      description: "Новое описание",
      age: 25,
      score: 100,
      isActive: false,
      isVerified: true,
      status: "published",
      category: "tech",
      tags: ["typescript", "library"],
      permissions: [1, 2, 3],
      flags: [true, false, true],
    })

    expect(context.title).toBe("Новый заголовок")
    expect(context.description).toBe("Новое описание")
    expect(context.age).toBe(25)
    expect(context.score).toBe(100)
    expect(context.isActive).toBe(false)
    expect(context.isVerified).toBe(true)
    expect(context.status).toBe("published")
    expect(context.category).toBe("tech")
    expect(context.tags).toEqual(["typescript", "library"])
    expect(context.permissions).toEqual([1, 2, 3])
    expect(context.flags).toEqual([true, false, true])
  })

  it.todo("возвращает обновленный контекст", () => {
    const { context, update } = createContext({
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
    })

    const updated = update({ name: "Иван", age: 25 })

    expect(updated).toBe(context)
    expect(updated.name).toBe("Иван")
    expect(updated.age).toBe(25)
  })

  it("сохраняет иммутабельность после обновления", () => {
    const { context, update } = createContext({
      name: types.string.required({ default: "Гость" }),
      status: types.enum("start", "process", "end").required({ default: "start" }),
    })

    update({ name: "Новое имя" })

    expect(() => {
      ;(context as any).name = "Другое имя"
    }).toThrow("Прямое изменение контекста запрещено")

    expect(() => {
      ;(context as any).status = "end"
    }).toThrow("Прямое изменение контекста запрещено")
  })
})
