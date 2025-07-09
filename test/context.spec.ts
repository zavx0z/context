import { describe, it, expect } from "bun:test"
import { types, createContext } from "../context"

describe("Контекст", () => {
  describe("Создание контекста", () => {
    it("создаёт контекст с правильными значениями по умолчанию", () => {
      const { context } = createContext({
        name: types.string.required({ default: "Гость" }),
        role: types.enum("user", "admin", "moderator").required({ default: "user" }),
        nickname: types.string(),
        bio: types.string.optional(),
        priority: types.enum("low", "medium", "high")(),
        tags: types.array.optional({ default: [] }),
      })

      expect(context.name).toBe("Гость")
      expect(context.role).toBe("user")
      expect(context.nickname).toBe(null)
      expect(context.bio).toBe(null)
      expect(context.priority).toBe(null)
      expect(context.tags).toEqual([])
    })

    it("корректно работает со всеми типами данных", () => {
      const { context } = createContext({
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

      expect(context.title).toBe("Заголовок")
      expect(context.description).toBe(null)
      expect(context.age).toBe(18)
      expect(context.score).toBe(null)
      expect(context.isActive).toBe(true)
      expect(context.isVerified).toBe(null)
      expect(context.status).toBe("draft")
      expect(context.category).toBe(null)
      expect(context.tags).toEqual([])
      expect(context.permissions).toBe(null)
      expect(context.flags).toBe(null)
    })

    it("проверяет типизацию enum", () => {
      const { context } = createContext({
        role: types.enum("user", "admin")(),
      })
      expect(context.role).toBe(null)

      // @ts-expect-error - enum должен принимать только строки
      types.enum(true, false)()
      // @ts-expect-error - enum должен принимать только строки
      types.enum({})()
    })

    it("проверяет типизацию array", () => {
      const { context } = createContext({
        tags: types.array<string>({ default: ["a", "b"] }),
        numbers: types.array<number>(),
        flags: types.array<boolean>(),
      })
      expect(context.tags).toEqual(["a", "b"])
      expect(context.numbers).toBe(null)
      expect(context.flags).toBe(null)

      // @ts-expect-error - array должен принимать только примитивы
      types.array({ default: [{}] })
    })
  })

  describe("Иммутабельность", () => {
    it("запрещает прямое изменение значений", () => {
      const { context } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      expect(() => {
        ;(context as any).name = "Новое имя"
      }).toThrow("Прямое изменение контекста запрещено")

      expect(() => {
        ;(context as any).status = "process"
      }).toThrow("Прямое изменение контекста запрещено")

      expect(() => {
        ;(context as any).newField = "значение"
      }).toThrow("Прямое изменение контекста запрещено")
    })

    it("запрещает удаление свойств", () => {
      const { context } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      expect(() => {
        delete (context as any).name
      }).toThrow("Удаление свойств контекста запрещено")

      expect(() => {
        delete (context as any).status
      }).toThrow("Удаление свойств контекста запрещено")
    })

    it("позволяет читать значения", () => {
      const { context } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      expect(context.name).toBe("Гость")
      expect(context.status).toBe("start")
    })
  })
})

describe("Примеры использования", () => {
  it("пользовательский контекст", () => {
    const schema = {
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
      isActive: types.boolean.required({ default: true }),
      role: types.enum("user", "admin", "moderator").required({ default: "user" }),
      tags: types.array.optional(),
    }
    const { context, update } = createContext(schema)

    expect(context).toPlainObjectEqual(schema, {
      name: "Гость",
      age: null,
      isActive: true,
      role: "user",
      tags: null,
    })

    const updated = update({ name: "Иван", age: 25 })
    expect(updated).toPlainObjectEqual(schema, {
      name: "Иван",
      age: 25,
      isActive: true,
      role: "user",
      tags: null,
    })
  })

  it("контекст продукта", () => {
    const schema = {
      id: types.string.required(),
      name: types.string.required({ default: "Новый продукт" }),
      price: types.number.required({ default: 0 }),
      inStock: types.boolean.required({ default: false }),
      category: types.enum("electronics", "clothing", "books").optional(),
      images: types.array.required({ default: [] }),
    }
    const { context, update } = createContext(schema)

    expect(context).toPlainObjectEqual(schema, {
      id: "",
      name: "Новый продукт",
      price: 0,
      inStock: false,
      category: null,
      images: [],
    })

    const updated = update({
      id: "prod-123",
      name: "iPhone 15",
      price: 99999,
      inStock: true,
      category: "electronics",
    })
    expect(updated).toPlainObjectEqual(schema, {
      id: "prod-123",
      name: "iPhone 15",
      price: 99999,
      inStock: true,
      category: "electronics",
      images: [],
    })
  })

  it("контекст статьи", () => {
    const schema = {
      title: types.string.required({ default: "Заголовок" }),
      content: types.string.optional(),
      published: types.boolean.required({ default: false }),
      views: types.number.required({ default: 0 }),
    }
    const { context, update } = createContext(schema)

    expect(context).toPlainObjectEqual(schema, {
      title: "Заголовок",
      content: null,
      published: false,
      views: 0,
    })

    const updated = update({
      title: "Новый заголовок",
      content: "Содержание статьи",
      published: true,
    })
    expect(updated).toPlainObjectEqual(schema, {
      title: "Новый заголовок",
      content: "Содержание статьи",
      published: true,
      views: 0,
    })
  })
})
