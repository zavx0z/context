import { describe, it, expect, beforeAll, afterAll } from "bun:test"
import { contextSchema } from "../schema"
import { contextFromSchema } from "../context"

describe("update", () => {
  it("обновляет только переданные значения", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        name: types.string.required("Гость"),
        nickname: types.string.optional(),
        age: types.number.optional(),
      }))
    )

    update({ name: "Иван" })
    expect(context.name, 'Поле name должно обновиться на "Иван"').toBe("Иван")
    expect(context.nickname, "Поле nickname должно остаться null").toBe(null)
    expect(context.age, "Поле age должно остаться null").toBe(null)

    update({ nickname: "nick", age: 25 })
    expect(context.name, 'Поле name должно остаться "Иван"').toBe("Иван")
    expect(context.nickname, 'Поле nickname должно обновиться на "nick"').toBe("nick")
    expect(context.age, "Поле age должно обновиться на 25").toBe(25)
  })
  // #region undefined
  it("игнорирует undefined значения", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        name: types.string.required("Гость"),
      }))
    )
    // @ts-expect-error - TypeScript запрещает undefined
    update({ name: undefined })
    expect(context.name, 'Поле name осталось "Гость"').toBe("Гость")
  })
  // #endregion undefined
  // #region requiredNull
  describe("не позволяет устанавливать null для required полей", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        name: types.string.required("Гость"),
        age: types.number.required(18),
        isActive: types.boolean.required(true),
        tags: types.array.required([]),
        role: types.enum("user", "admin").required("user"),
      }))
    )
    it("null для required string", () => {
      // @ts-expect-error - TypeScript запрещает null
      expect(() => update({ name: null })).toThrow('[Context.update] "name": поле не может быть null')
      expect(context.name, "Поле name осталось 'Гость'").toBe("Гость")
    })
    it("null для required number", () => {
      // @ts-expect-error - TypeScript запрещает null
      expect(() => update({ age: null })).toThrow('[Context.update] "age": поле не может быть null')
      expect(context.age, "Поле age осталось 18").toBe(18)
    })
    it("null для required boolean", () => {
      // @ts-expect-error - TypeScript запрещает null
      expect(() => update({ isActive: null })).toThrow('[Context.update] "isActive": поле не может быть null')
      expect(context.isActive, "Поле isActive осталось true").toBe(true)
    })
    it("null для required array", () => {
      // @ts-expect-error - TypeScript запрещает null
      expect(() => update({ tags: null })).toThrow('[Context.update] "tags": поле не может быть null')
      expect(context.tags, "Поле tags осталось []").toEqual([])
    })
    it("null для required enum", () => {
      // @ts-expect-error - TypeScript запрещает null
      expect(() => update({ role: null })).toThrow('[Context.update] "role": поле не может быть null')
      expect(context.role, "Поле role осталось 'user'").toBe("user")
    })
  })
  // #endregion requiredNull
  // #region arrayErrors
  describe("валидация массивов", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        tags: types.array.required([]),
        items: types.array.optional([]),
      }))
    )
    it("nested массив", () => {
      // @ts-expect-error - TypeScript запрещает nested массив
      expect(() => update({ tags: [["nested"]] })).toThrow(
        '[Context.update] "tags": ожидается плоский массив примитивов'
      )
      expect(context.tags, "Поле tags осталось []").toEqual([])
    })
    it("массив с объектами", () => {
      // @ts-expect-error - TypeScript запрещает массив с объектами
      expect(() => update({ tags: [{ x: 1 }] })).toThrow('[Context.update] "tags": ожидается плоский массив примитивов')
      expect(context.tags, "Поле tags осталось []").toEqual([])
    })
    it("массив с функциями", () => {
      // @ts-expect-error - TypeScript запрещает массив с функциями
      expect(() => update({ tags: [function () {}] })).toThrow(
        '[Context.update] "tags": ожидается плоский массив примитивов'
      )
      expect(context.tags, "Поле tags осталось []").toEqual([])
    })
  })
  // #endregion arrayErrors
  // #region primitiveErrors
  describe("валидация примитивных полей", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        name: types.string.required("test"),
        age: types.number.required(18),
        active: types.boolean.required(true),
      }))
    )
    it("объект в string поле", () => {
      // @ts-expect-error - TypeScript запрещает объект в string поле
      expect(() => update({ name: { x: 1 } })).toThrow('[Context.update] "name": объекты и функции запрещены')
      expect(context.name, "Поле name осталось 'test'").toBe("test")
    })
    it("функция в number поле", () => {
      // @ts-expect-error - TypeScript запрещает функции в number поле
      expect(() => update({ age: function () {} })).toThrow('[Context.update] "age": объекты и функции запрещены')
      expect(context.age, "Поле age осталось 18").toBe(18)
    })
    it("массив в boolean поле", () => {
      // @ts-expect-error - TypeScript запрещает массив в boolean поле
      expect(() => update({ active: [true] })).toThrow('[Context.update] "active": объекты и функции запрещены')
      expect(context.active, "Поле active осталось true").toBe(true)
    })
  })
  // #endregion primitiveErrors
  // #region enumErrors
  describe("валидация enum полей", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        role: types.enum("user", "admin").required("user"),
        status: types.enum("active", "inactive").optional("active"),
      }))
    )
    it("недопустимое значение в required enum", () => {
      // @ts-expect-error - TypeScript запрещает значения, не входящие в enum
      expect(() => update({ role: "guest" })).toThrow(
        "[Context.update] \"role\": должно быть 'user' или 'admin', получено 'guest'"
      )
      expect(context.role, "Поле role осталось 'user'").toBe("user")
    })
    it("недопустимое значение в optional enum", () => {
      // @ts-expect-error - TypeScript запрещает значения, не входящие в enum
      expect(() => update({ status: "pending" })).toThrow(
        "[Context.update] \"status\": должно быть 'active' или 'inactive', получено 'pending'"
      )
      expect(context.status, "Поле status осталось 'active'").toBe("active")
    })
  })
  // #endregion enumErrors
  // #region optionalNull
  it("позволяет устанавливать null для optional полей", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        nickname: types.string.optional(""),
        age: types.number.optional(4),
        isActive: types.boolean.optional(false),
        tags: types.array.optional([]),
        role: types.enum("user", "admin").optional("user"),
      }))
    )

    update({ nickname: null })
    expect(context.nickname, "Поле nickname должно обновиться на null").toBe(null)

    update({ age: null })
    expect(context.age, "Поле age должно обновиться на null").toBe(null)

    update({ isActive: null })
    expect(context.isActive, "Поле isActive должно обновиться на null").toBe(null)

    update({ tags: null })
    expect(context.tags, "Поле tags должно обновиться на null").toBe(null)

    update({ role: null })
    expect(context.role, "Поле role должно обновиться на null").toBe(null)
  })
  // #endregion optionalNull

  it("работает со всеми типами данных", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        title: types.string.required("Заголовок"),
        description: types.string.optional(),
        age: types.number.required(18),
        score: types.number.optional(),
        isActive: types.boolean.required(true),
        isVerified: types.boolean.optional(),
        status: types.enum("draft", "published", "archived").required("draft"),
        category: types.enum("tech", "design", "business").optional(),
        tags: types.array.required<string>([]),
        permissions: types.array.optional(),
        flags: types.array.optional(),
      }))
    )

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

    expect(context.title, 'Поле title должно обновиться на "Новый заголовок"').toBe("Новый заголовок")
    expect(context.description, 'Поле description должно обновиться на "Новое описание"').toBe("Новое описание")
    expect(context.age, "Поле age должно обновиться на 25").toBe(25)
    expect(context.score, "Поле score должно обновиться на 100").toBe(100)
    expect(context.isActive, "Поле isActive должно обновиться на false").toBe(false)
    expect(context.isVerified, "Поле isVerified должно обновиться на true").toBe(true)
    expect(context.status, 'Поле status должно обновиться на "published"').toBe("published")
    expect(context.category, 'Поле category должно обновиться на "tech"').toBe("tech")
    expect(context.tags, 'Поле tags должно обновиться на ["typescript", "library"]').toEqual(["typescript", "library"])
    expect(context.permissions, "Поле permissions должно обновиться на [1, 2, 3]").toEqual([1, 2, 3])
    expect(context.flags, "Поле flags должно обновиться на [true, false, true]").toEqual([true, false, true])
  })

  it("возвращает обновленный контекст", () => {
    const { update } = contextFromSchema(
      contextSchema((types) => ({
        name: types.string.required("Гость"),
        status: types.enum("start", "process", "end").required("start"),
        age: types.number.optional(),
      }))
    )

    const updated = update({ name: "Иван", age: 25, status: "start" })

    expect(updated, "update должен возвращать ключи только с обновленными параметрами").toEqual({
      name: "Иван",
      age: 25,
    })
    expect(updated.name, 'Возвращенный контекст должен содержать обновленное имя "Иван"').toBe("Иван")
    expect(updated.age, "Возвращенный контекст должен содержать обновленный возраст 25").toBe(25)
    expect(updated.status, "Поле status не должно быть в возвращаемом объекте, так как не изменилось").toBeUndefined()
  })

  it("сохраняет иммутабельность после обновления", () => {
    const { context, update } = contextFromSchema(
      contextSchema((types) => ({
        name: types.string.required("Гость"),
        status: types.enum("start", "process", "end").required("start"),
      }))
    )
    update({ name: "Новое имя" })

    expect(() => {
      ;(context as any).name = "Другое имя"
    }, "Должна быть ошибка при прямом изменении поля name после update").toThrow(
      "Attempted to assign to readonly property."
    )

    expect(() => {
      ;(context as any).status = "end"
    }, "Должна быть ошибка при прямом изменении поля status после update").toThrow(
      "Attempted to assign to readonly property."
    )
  })
})
