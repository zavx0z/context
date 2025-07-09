import { describe, it, expect } from "bun:test"
import { types, createContext } from "../context"
import type { JsonPatch } from "../types"

describe("Контекст", () => {
  describe("Основная функциональность создания и обновления контекстов", () => {
    it("создаёт контекст с правильными типами и значениями по умолчанию", () => {
      const { context } = createContext({
        name: types.string.required({ default: "Гость" }),
        role: types.enum("user", "admin", "moderator").required({ default: "user" }),
        nickname: types.string(),
        bio: types.string.optional(),
        priority: types.enum("low", "medium", "high")(),
        tags: types.array.optional({ default: [] }),
      })

      expect(context.name, 'Поле name должно быть "Гость" по умолчанию').toBe("Гость")
      expect(context.role, 'Поле role должно быть "user" по умолчанию').toBe("user")
      expect(context.nickname, "Поле nickname должно быть null по умолчанию").toBe(null)
      expect(context.bio, "Поле bio должно быть null по умолчанию").toBe(null)
      expect(context.priority, "Поле priority должно быть null по умолчанию").toBe(null)
      expect(context.tags, "Поле tags должно быть [] по умолчанию").toEqual([])
    })

    it("обновляет только переданные значения, игнорирует undefined", () => {
      const { context, update } = createContext({
        name: types.string.required({ default: "Гость" }),
        nickname: types.string(),
      })
      update({ name: "test" })
      expect(context.name, 'Поле name должно обновиться на "test"').toBe("test")
      update({ nickname: "nick" })
      expect(context.nickname, 'Поле nickname должно обновиться на "nick"').toBe("nick")
      update({ nickname: null })
      expect(context.nickname, "Поле nickname должно обновиться на null").toBe(null)
      // @ts-expect-error
      update({ name: undefined })
    })

    it("не допускает undefined для optional полей (TS)", () => {
      const { context, update } = createContext({
        nickname: types.string(),
      })
      // @ts-expect-error
      update({ nickname: undefined }) // "exactOptionalPropertyTypes": true,
      update({ nickname: null })
      expect(context.nickname, "Поле nickname должно быть null после update").toBe(null)
    })

    it("enum допускает только строки и числа", () => {
      const { context, update } = createContext({
        role: types.enum("user", "admin")(),
      })
      expect(context.role, "Поле role должно быть null по умолчанию").toBe(null)
      update({ role: "admin" })
      expect(context.role, 'Поле role должно обновиться на "admin"').toBe("admin")

      // @ts-expect-error
      types.enum(true, false)()
      // @ts-expect-error
      types.enum({})()
    })
    it("array допускает только строки, числа или булево", () => {
      const { context } = createContext({
        tags: types.array<string>({ default: ["a", "b"] }),
        numbers: types.array<number>(),
        flags: types.array<boolean>(),
      })
      expect(context.tags, 'Поле tags должно быть ["a", "b"] по умолчанию').toEqual(["a", "b"])
      expect(context.numbers, "Поле numbers должно быть null по умолчанию").toBe(null)
      expect(context.flags, "Поле flags должно быть null по умолчанию").toBe(null)

      // @ts-expect-error
      types.array({ default: [{}] })
    })

    it("корректно работает с разными типами", () => {
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
      expect(context.title, 'Поле title должно быть "Новый заголовок"').toBe("Новый заголовок")
      expect(context.description, 'Поле description должно быть "Новое описание"').toBe("Новое описание")
      expect(context.age, "Поле age должно быть 25").toBe(25)
      expect(context.score, "Поле score должно быть 100").toBe(100)
      expect(context.isActive, "Поле isActive должно быть false").toBe(false)
      expect(context.isVerified, "Поле isVerified должно быть true").toBe(true)
      expect(context.status, 'Поле status должно быть "published"').toBe("published")
      expect(context.category, 'Поле category должно быть "tech"').toBe("tech")
      expect(context.tags, 'Поле tags должно быть ["typescript", "library"]').toEqual(["typescript", "library"])
      expect(context.permissions, "Поле permissions должно быть [1, 2, 3]").toEqual([1, 2, 3])
      expect(context.flags, "Поле flags должно быть [true, false, true]").toEqual([true, false, true])
    })
  })
  describe("Иммутабельность контекста", () => {
    it("запрещает прямое изменение значений контекста", () => {
      const { context, update } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })
      // el.context.name = "other" // будет ошибка линтинга
      // Попытка прямого изменения должна вызывать ошибку
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

    it("запрещает удаление свойств контекста", () => {
      const { context, update } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      // Попытка удаления свойства должна вызывать ошибку
      expect(() => {
        delete (context as any).name
      }, "Должна быть ошибка при удалении поля name").toThrow("Удаление свойств контекста запрещено")

      expect(() => {
        delete (context as any).status
      }, "Должна быть ошибка при удалении поля status").toThrow("Удаление свойств контекста запрещено")
    })

    it("позволяет читать значения контекста", () => {
      const { context, update } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      // Чтение значений должно работать
      expect(context.name, 'Поле name должно быть "Гость"').toBe("Гость")
      expect(context.status, 'Поле status должно быть "start"').toBe("start")
    })

    it("обновление через update() работает корректно", () => {
      const { context, update } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      // Обновление через update() должно работать
      update({ name: "Новое имя", status: "process" })
      expect(context.name, 'Поле name должно обновиться на "Новое имя"').toBe("Новое имя")
      expect(context.status, 'Поле status должно обновиться на "process"').toBe("process")
    })

    it("контекст остается иммутабельным после обновления", () => {
      const { context, update } = createContext({
        name: types.string.required({ default: "Гость" }),
        status: types.enum("start", "process", "end").required({ default: "start" }),
      })

      update({ name: "Новое имя" })

      // После обновления прямое изменение все еще должно быть запрещено
      expect(() => {
        ;(context as any).name = "Другое имя"
      }, "Должна быть ошибка при прямом изменении поля name после update").toThrow(
        "Прямое изменение контекста запрещено"
      )

      expect(() => {
        ;(context as any).status = "end"
      }, "Должна быть ошибка при прямом изменении поля status после update").toThrow(
        "Прямое изменение контекста запрещено"
      )
    })
  })
})

describe("Примеры использования (документация)", () => {
  it("MetaFor: создание и обновление userContext", () => {
    const schema = {
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
      isActive: types.boolean.required({ default: true }),
      role: types.enum("user", "admin", "moderator").required({ default: "user" }),
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
    expect(
      updated,
      "После update должны обновиться только переданные поля, остальные остаться прежними"
    ).toPlainObjectEqual(schema, {
      name: "Иван",
      age: 25,
      isActive: true,
      role: "user",
      tags: null,
    })
  })

  it("MetaFor: создание и обновление productContext", () => {
    const schema = {
      id: types.string.required(),
      name: types.string.required({ default: "Новый продукт" }),
      price: types.number.required({ default: 0 }),
      inStock: types.boolean.required({ default: false }),
      category: types.enum("electronics", "clothing", "books").optional(),
      images: types.array.required({ default: [] }),
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
    expect(
      updated,
      "После update должны обновиться только переданные поля, остальные остаться прежними"
    ).toPlainObjectEqual(schema, {
      id: "prod-123",
      name: "iPhone 15",
      price: 99999,
      inStock: true,
      category: "electronics",
      images: [],
    })
  })

  it("MetaFor: создание и обновление articleContext", () => {
    const schema = {
      title: types.string.required({ default: "Заголовок" }),
      content: types.string.optional(),
      published: types.boolean.required({ default: false }),
      views: types.number.required({ default: 0 }),
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
    expect(
      updated,
      "После update должны обновиться только переданные поля, остальные остаться прежними"
    ).toPlainObjectEqual(schema, {
      title: "Новый заголовок",
      content: "Содержание статьи",
      published: true,
      views: 0,
    })
  })
})

describe("onUpdate", () => {
  it("вызывает коллбек с правильными патчами при update", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
      isActive: types.boolean.required({ default: true }),
    })
    let received: JsonPatch[] = []
    onUpdate((patches) => {
      received = patches
    })
    update({ name: "Иван", age: 25 })
    expect(received, "onUpdate должен вызываться с патчами").toEqual([
      { op: "replace", path: "/name", value: "Иван" },
      { op: "replace", path: "/age", value: 25 },
    ])
    update({ age: null })
    expect(received, "onUpdate должен вызываться с патчем remove").toEqual([{ op: "remove", path: "/age" }])
  })

  it("функция отписки работает корректно", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
    })
    let called = 0
    const unsubscribe = onUpdate(() => {
      called++
    })
    update({ name: "Вася" })
    expect(called, "onUpdate должен быть вызван").toBe(1)
    unsubscribe()
    update({ name: "Петя" })
    expect(called, "onUpdate не должен вызываться после отписки").toBe(1)
  })

  it("несколько подписчиков получают патчи", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
    })
    let a = 0,
      b = 0
    onUpdate(() => {
      a++
    })
    onUpdate(() => {
      b++
    })
    update({ name: "Оля" })
    expect(a, "Первый подписчик должен быть вызван").toBe(1)
    expect(b, "Второй подписчик должен быть вызван").toBe(1)
  })

  it("патчи соответствуют формату JSON Patch", () => {
    const { context, update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
    })
    const patches: JsonPatch[] = []
    onUpdate((p) => patches.push(...p))
    update({ name: "Лена" })

    let patch = patches[0]!
    expect(patch).toBeDefined()

    expect(patch.op, "op должен быть 'replace'").toBe("replace")
    expect(patch.path, "path должен быть '/name'").toBe("/name")
    expect(patch).toHaveProperty("value", "Лена")
    update({ age: null })
    patch = patches[1]!
    expect(patch.op, "op должен быть 'remove'").toBe("remove")
    expect(patch.path, "path должен быть '/age'").toBe("/age")
  })
})
