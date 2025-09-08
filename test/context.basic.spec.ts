import { test, expect } from "bun:test"
import { Context } from "../context"

test("Создание контекста с базовыми типами", () => {
  // #region allTypes
  const { context, schema } = new Context((types) => ({
    name: types.string.required("Гость")({ title: "Имя пользователя" }),
    age: types.number.optional()({ title: "Возраст" }),
    isActive: types.boolean.required(true)({ title: "Активен" }),
    role: types.enum("user", "admin", "moderator").required("user")({ title: "Роль" }),
    tags: types.array.optional()({ title: "Теги" }),
    description: types.string.optional(), // без title
  }))
  // #endregion allTypes
  // Проверяем значения
  expect(context.name, "Поле name должно быть 'Гость'").toBe("Гость")
  expect(context.age, "Поле age должно быть null").toBe(null)
  expect(context.isActive, "Поле isActive должно быть true").toBe(true)
  expect(context.role, "Поле role должно быть 'user'").toBe("user")
  expect(context.tags, "Поле tags должно быть null").toBe(null)
  expect(context.description, "Поле description должно быть null").toBe(null)

  // Проверяем метаданные
  expect(schema.name.title, "Метаданные name должны быть доступны").toBe("Имя пользователя")
  expect(schema.age.title, "Метаданные age должны быть доступны").toBe("Возраст")
  expect(schema.isActive.title, "Метаданные isActive должны быть доступны").toBe("Активен")
  expect(schema.role.title, "Метаданные role должны быть доступны").toBe("Роль")
  expect(schema.tags.title, "Метаданные tags должны быть доступны").toBe("Теги")
  expect(schema.description.title, "Метаданные description должны быть пустой строкой").toBeUndefined()
})
