import { describe, it, expect } from "bun:test"
import { Context } from "../context"
import { fromSchema, fromSnapshot } from "../context"

describe("десериализация", () => {
  it("создание из снимка", () => {
    // Создаем оригинальный контекст
    const originalContext = new Context((types) => ({
      name: types.string.required("Гость"),
      age: types.number.optional(),
      isActive: types.boolean.required(true),
      role: types.enum("user", "admin").required("user"),
    }))

    // Обновляем значения
    originalContext.update({ name: "Иван", age: 25 })

    // Создаем снимок
    const snapshot = originalContext.snapshot

    // Создаем клон из снимка (через функцию)
    const clonedContext = fromSnapshot(snapshot)

    // Проверяем, что структура сохранена
    expect(clonedContext.context.name, "имя должно сохраниться").toBe("Иван")
    expect(clonedContext.context.age, "возраст должен сохраниться").toBe(25)
    expect(clonedContext.context.isActive, "isActive должен сохраниться").toBe(true)
    expect(clonedContext.context.role, "роль должна сохраниться").toBe("user")

    // Проверяем схему
    expect(clonedContext.schema.name.type, "тип name должен сохраниться").toBe("string")
    expect(clonedContext.schema.age.type, "тип age должен сохраниться").toBe("number")
    expect(clonedContext.schema.isActive.type, "тип isActive должен сохраниться").toBe("boolean")
    expect(clonedContext.schema.role.type, "тип role должен сохраниться").toBe("enum")
  })

  it("обновление клонированного контекста", () => {
    const originalContext = new Context((types) => ({
      name: types.string.required("Гость"),
      age: types.number.optional(),
    }))

    const snapshot = originalContext.schema
    const valuesSnapshot = originalContext.context
    const clonedContext = fromSchema(snapshot)
    clonedContext.update(valuesSnapshot as any)

    // Обновляем клонированный контекст
    const updated = clonedContext.update({ name: "Новое имя", age: 30 })

    expect(updated.name, "возвращенное имя должно быть обновлено").toBe("Новое имя")
    expect(updated.age, "возвращенный возраст должен быть обновлен").toBe(30)
    expect(clonedContext.context.name, "контекст должен обновиться").toBe("Новое имя")
    expect(clonedContext.context.age, "контекст должен обновиться").toBe(30)
  })

  it("пустой снимок", () => {
    const emptySnapshot = {} as any
    const clonedContext = fromSchema(emptySnapshot)

    expect(clonedContext.context as any, "пустой контекст должен быть пустым объектом").toEqual({})
    expect(clonedContext.schema, "пустая схема должна быть пустым объектом").toEqual({})
  })

  it("снимок с метаданными", () => {
    const schema = {
      name: {
        type: "string" as const,
        required: true,
        default: "Гость",
        title: "Имя пользователя",
        id: true as const,
      },
      age: {
        type: "number" as const,
        required: false,
        title: "Возраст",
      },
      tags: {
        type: "array" as const,
        required: true,
        default: [] as string[],
        title: "Теги",
        data: "user_tags",
      },
    }

    const clonedContext = fromSchema(schema)

    expect(clonedContext.schema.name.type, "тип должен сохраниться").toBe("string")
    expect(clonedContext.schema.name.required, "required должен сохраниться").toBe(true)
    expect(clonedContext.schema.name.default, "default должен сохраниться").toBe("Гость")
    expect(clonedContext.schema.name.title, "title должен сохраниться").toBe("Имя пользователя")
    expect(clonedContext.schema.name.id, "id должен сохраниться").toBe(true)

    expect(clonedContext.schema.age.type, "тип должен сохраниться").toBe("number")
    expect(clonedContext.schema.age.required, "required должен сохраниться").toBe(false)
    expect(clonedContext.schema.age.title, "title должен сохраниться").toBe("Возраст")

    expect(clonedContext.schema.tags.type, "тип должен сохраниться").toBe("array")
    expect(clonedContext.schema.tags.required, "required должен сохраниться").toBe(true)
    expect(clonedContext.schema.tags.data, "data должен сохраниться").toBe("user_tags")
  })

  it("подписка на обновления", () => {
    const originalContext = new Context((types) => ({
      name: types.string.required("Гость"),
    }))

    const snapshot = originalContext.snapshot
    const clonedContext = fromSnapshot(snapshot)

    let updateCount = 0
    let lastUpdate: any = null

    const unsubscribe = clonedContext.onUpdate((updated) => {
      updateCount++
      lastUpdate = updated
    })

    // Обновляем контекст
    clonedContext.update({ name: "Новое имя" })

    expect(updateCount, "должно быть одно обновление").toBe(1)
    expect(lastUpdate.name, "последнее обновление должно содержать новое имя").toBe("Новое имя")

    // Отписываемся
    unsubscribe()
    clonedContext.update({ name: "Другое имя" })

    expect(updateCount, "не должно быть новых обновлений после отписки").toBe(1)
  })
})
