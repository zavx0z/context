import { describe, it, expect } from "bun:test"
import { types, createContext } from "../context"

describe("Контекст", () => {
  describe("Создание контекста", () => {
    it("создаёт контекст с правильными значениями по умолчанию", () => {
      const { context } = createContext({
        name: types.string.required("Гость"),
        role: types.enum("user", "admin", "moderator").required("user"),
        nickname: types.string(),
        bio: types.string.optional(),
        priority: types.enum("low", "medium", "high")(),
        tags: types.array.optional([]),
      })

      expect(context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
      expect(context.role, 'Поле role должно быть "user" по умолчанию').toBe("user")
      expect(context.nickname, "Поле nickname должно быть null по умолчанию").toBe(null)
      expect(context.bio, "Поле bio должно быть null по умолчанию").toBe(null)
      expect(context.priority, "Поле priority должно быть null по умолчанию").toBe(null)
      expect(context.tags, "Поле tags должно быть [] по умолчанию").toEqual([])
    })

    it("корректно работает со всеми типами данных", () => {
      const { context } = createContext({
        title: types.string.required("Заголовок"),
        description: types.string(),
        age: types.number.required(18),
        score: types.number(),
        isActive: types.boolean.required(true),
        isVerified: types.boolean(),
        status: types.enum("draft", "published", "archived").required("draft"),
        category: types.enum("tech", "design", "business")(),
        tags: types.array.required([]),
        permissions: types.array(),
        flags: types.array(),
      })

      expect(context.title, 'Поле title должно быть "Заголовок" по умолчанию').toBe("Заголовок")
      expect(context.description, "Поле description должно быть null по умолчанию").toBe(null)
      expect(context.age, "Поле age должно быть 18 по умолчанию").toBe(18)
      expect(context.score, "Поле score должно быть null по умолчанию").toBe(null)
      expect(context.isActive, "Поле isActive должно быть true по умолчанию").toBe(true)
      expect(context.isVerified, "Поле isVerified должно быть null по умолчанию").toBe(null)
      expect(context.status, 'Поле status должно быть "draft" по умолчанию').toBe("draft")
      expect(context.category, "Поле category должно быть null по умолчанию").toBe(null)
      expect(context.tags, "Поле tags должно быть [] по умолчанию").toEqual([])
      expect(context.permissions, "Поле permissions должно быть null по умолчанию").toBe(null)
      expect(context.flags, "Поле flags должно быть null по умолчанию").toBe(null)
    })

    it("проверяет новый chainable API с title", () => {
      const { context } = createContext({
        name: types.string.required("Гость")({ title: "Имя пользователя" }),
        role: types.enum("user", "admin", "moderator").required("user")({ title: "Роль" }),
        nickname: types.string("Nic")({ title: "Псевдоним" }),
      })

      expect(context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
      expect(context.role, 'Поле role должно быть "user" по умолчанию').toBe("user")
      expect(context.nickname, 'Поле nickname должно быть "Nic" по умолчанию').toBe("Nic")
    })

    it("проверяет типизацию enum", () => {
      const { context } = createContext({
        role: types.enum("user", "admin")(),
      })
      expect(context.role, "Поле role должно быть null по умолчанию").toBe(null)

      // @ts-expect-error - enum должен принимать только строки
      types.enum(true, false)()
      // @ts-expect-error - enum должен принимать только строки
      types.enum({})()
    })

    it("проверяет типизацию array", () => {
      const { context } = createContext({
        tags: types.array(["a", "b"]),
        numbers: types.array(),
        flags: types.array(),
      })
      expect(context.tags, 'Поле tags должно быть ["a", "b"] по умолчанию').toEqual(["a", "b"])
      expect(context.numbers, "Поле numbers должно быть null по умолчанию").toBe(null)
      expect(context.flags, "Поле flags должно быть null по умолчанию").toBe(null)

      // @ts-ignore - array должен принимать только примитивы
      types.array([{}])
    })
  })

  describe("Иммутабельность", () => {
    it("запрещает прямое изменение значений", () => {
      const { context } = createContext({
        name: types.string.required("Гость"),
        status: types.enum("start", "process", "end").required("start"),
      })

      expect(() => {
        ;(context as any).name = "Новое имя"
      }, "Должна быть ошибка при прямом изменении поля name").toThrow("Прямое изменение контекста запрещено")

      expect(() => {
        ;(context as any).status = "process"
      }, "Должна быть ошибка при прямом изменении поля status").toThrow("Прямое изменение контекста запрещено")

      expect(() => {
        ;(context as any).newField = "значение"
      }, "Должна быть ошибка при прямом добавлении нового поля").toThrow("Прямое изменение контекста запрещено")
    })

    it("запрещает удаление свойств", () => {
      const { context } = createContext({
        name: types.string.required("Гость"),
        status: types.enum("start", "process", "end").required("start"),
      })

      expect(() => {
        delete (context as any).name
      }, "Должна быть ошибка при удалении поля name").toThrow("Удаление свойств контекста запрещено")

      expect(() => {
        delete (context as any).status
      }, "Должна быть ошибка при удалении поля status").toThrow("Удаление свойств контекста запрещено")
    })

    it("позволяет читать значения", () => {
      const { context } = createContext({
        name: types.string.required("Гость"),
        status: types.enum("start", "process", "end").required("start"),
      })

      expect(context.name, 'Поле name должно быть "Гость"').toBe("Гость")
      expect(context.status, 'Поле status должно быть "start"').toBe("start")
    })
  })
})

describe("Примеры использования", () => {
  it("пользовательский контекст", () => {
    const schema = {
      name: types.string.required("Гость"),
      age: types.number.optional(),
      isActive: types.boolean.required(true),
      role: types.enum("user", "admin", "moderator").required("user"),
      tags: types.array.optional(),
    }
    const { context, update } = createContext(schema)

    expect(context, "userContext должен содержать значения по умолчанию для всех полей").toPlainObjectEqual(schema, {
      name: "Гость",
      age: null,
      isActive: true,
      role: "user",
      tags: null,
    })

    const updated = update({ name: "Иван", age: 25 })
    expect(updated, "После update должны вернуться только обновленные поля").toEqual({
      name: "Иван",
      age: 25,
    })
  })

  it("контекст продукта", () => {
    const schema = {
      id: types.string.required(),
      name: types.string.required("Новый продукт"),
      price: types.number.required(0),
      inStock: types.boolean.required(false),
      category: types.enum("electronics", "clothing", "books").optional(),
      images: types.array.required([]),
    }
    const { context, update } = createContext(schema)

    expect(context, "productContext должен содержать значения по умолчанию для всех полей").toPlainObjectEqual(schema, {
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
    expect(updated, "После update должны вернуться только обновленные поля").toEqual({
      id: "prod-123",
      name: "iPhone 15",
      price: 99999,
      inStock: true,
      category: "electronics",
    })
  })

  it("контекст статьи", () => {
    const schema = {
      title: types.string.required("Заголовок"),
      content: types.string.optional(),
      published: types.boolean.required(false),
      views: types.number.required(0),
    }
    const { context, update } = createContext(schema)

    expect(context, "articleContext должен содержать значения по умолчанию для всех полей").toPlainObjectEqual(schema, {
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
    expect(updated, "После update должны вернуться только обновленные поля").toEqual({
      title: "Новый заголовок",
      content: "Содержание статьи",
      published: true,
    })
  })
})
