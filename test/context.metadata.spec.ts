import { test, expect } from "bun:test"
import { Context } from "../context"

test("Работа с метаданными контекста", () => {
  const { schema, context } = new Context((types) => ({
    name: types.string.required("Гость")({ title: "Имя пользователя" }),
    age: types.number.optional(),
    isActive: types.boolean.required(true),
  }))

  // Проверяем начальные значения
  expect(schema.name.title, "Начальный заголовок name").toBe("Имя пользователя")
  expect(schema.age.title, "Начальный заголовок age должен быть пустой строкой").toBeUndefined()
  expect(schema.isActive.title, "Начальный заголовок isActive должен быть пустой строкой").toBeUndefined()

  // Изменяем заголовки
  schema.name.title = "Полное имя"
  schema.age.title = "Возраст пользователя"
  schema.isActive.title = "Статус активности"

  // Проверяем, что заголовки изменились
  expect(schema.name.title, "Заголовок name должен измениться").toBe("Полное имя")
  expect(schema.age.title, "Заголовок age должен измениться").toBe("Возраст пользователя")
  expect(schema.isActive.title, "Заголовок isActive должен измениться").toBe("Статус активности")

  // Проверяем, что значения контекста не изменились
  expect(context.name, "Значение name не должно измениться").toBe("Гость")
  expect(context.age, "Значение age не должно измениться").toBe(null)
  expect(context.isActive, "Значение isActive не должно измениться").toBe(true)
})
