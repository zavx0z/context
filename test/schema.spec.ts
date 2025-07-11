import { describe, it, expect } from "bun:test"
import { createContext, types } from "../context"

describe("Схема", () => {
  it("должен возвращать оригинальную схему через геттер", () => {
    const ctx = createContext({
      name: types.string.required("Иван")({ title: "Имя пользователя" }),
      age: types.number.optional()({ title: "Возраст" }),
      isActive: types.boolean.required(true)({ title: "Активен" }),
      role: types.enum("user", "admin", "moderator").required("user")({ title: "Роль" }),
      tags: types.array.required([])({ title: "Теги" }),
      priority: types.enum("low", "medium", "high").optional()({ title: "Приоритет" }),
      description: types.string.optional()({ title: "Описание" }),
      metadata: types.array.optional()({ title: "Метаданные" }),
    })

    // Получаем схему через геттер
    const result = ctx.schema
    // Проверяем что это объект схемы
    expect(typeof result).toBe("object")
    expect(result).not.toBeNull()
    expect(result).toEqual({
      name: {
        type: "string",
        required: true,
        default: "Иван",
        title: "Имя пользователя",
      },
      age: {
        type: "number",
        required: false,
        default: undefined,
        title: "Возраст",
      },
      isActive: {
        type: "boolean",
        required: true,
        default: true,
        title: "Активен",
      },
      role: {
        type: "enum",
        required: true,
        values: ["user", "admin", "moderator"],
        default: "user",
        title: "Роль",
      },
      tags: {
        type: "array",
        required: true,
        default: [],
        title: "Теги",
      },
      priority: {
        type: "enum",
        required: false,
        default: undefined,
        values: ["low", "medium", "high"],
        title: "Приоритет",
      },
      description: {
        type: "string",
        required: false,
        default: undefined,
        title: "Описание",
      },
      metadata: {
        type: "array",
        required: false,
        default: undefined,
        title: "Метаданные",
      },
    })
  })
})
