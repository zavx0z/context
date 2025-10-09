import { describe, it, expect } from "bun:test"
import { contextSchema } from "./schema"
import { contextFromSchema } from "./context"

describe("Схема", () => {
  describe("enum values", () => {
    it("должен возвращать оригинальную схему через геттер", () => {
      const ctx = contextFromSchema(
        contextSchema((types) => ({
          name: types.string.required("Иван", { label: "Имя пользователя" }),
          age: types.number.optional(),
          isActive: types.boolean.required(true, { label: "Активен" }),
          role: types.enum("user", "admin", "moderator").required("user", { label: "Роль" }),
          tags: types.array.required([], { label: "Теги" }),
          priority: types.enum("low", "medium", "high").optional({ label: "Приоритет" }),
          description: types.string.optional({ label: "Описание" }),
          metadata: types.array.optional({ label: "Метаданные" }),
        }))
      )

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
          label: "Имя пользователя",
        },
        age: {
          type: "number",
        },
        isActive: {
          type: "boolean",
          required: true,
          default: true,
          label: "Активен",
        },
        role: {
          type: "enum",
          required: true,
          values: ["user", "admin", "moderator"],
          default: "user",
          label: "Роль",
        },
        tags: {
          type: "array",
          required: true,
          default: [],
          label: "Теги",
        },
        priority: {
          type: "enum",
          values: ["low", "medium", "high"],
          label: "Приоритет",
        },
        description: {
          type: "string",
          label: "Описание",
        },
        metadata: {
          type: "array",
          label: "Метаданные",
        },
      })
    })

    it("должен сохранять типизацию схемы", () => {
      const { schema } = contextFromSchema(
        contextSchema((types) => ({
          name: types.string.required("Иван", { label: "Имя пользователя" }),
          age: types.number.optional(),
          role: types.enum("user", "admin", "moderator").required("user", { label: "Роль" }),
          isActive: types.boolean.required(true, { label: "Активен" }),
          description: types.string.optional({ label: "Описание" }),
          priority: types.enum("low", "medium", "high").optional({ label: "Приоритет" }),
          tags: types.array.optional({ label: "Теги" }),
        }))
      )

      // Проверяем required поля
      expect(schema.name.type).toBe("string")
      expect(schema.name.required).toBe(true)
      expect(schema.name.default).toBe("Иван")
      expect(schema.name.label).toBe("Имя пользователя")

      expect(schema.role.type).toBe("enum")
      expect(schema.role.required).toBe(true)
      expect(schema.role.default).toBe("user")
      expect(schema.role.label).toBe("Роль")
      expect(schema.role.values).toEqual(["user", "admin", "moderator"])

      expect(schema.isActive.type).toBe("boolean")
      expect(schema.isActive.required).toBe(true)
      expect(schema.isActive.default).toBe(true)
      expect(schema.isActive.label).toBe("Активен")

      // Проверяем optional поля
      expect(schema.age.type).toBe("number")
      expect(schema.age.required).toBeUndefined()
      expect(schema.age.default).toBeUndefined()

      expect(schema.description.type).toBe("string")
      expect(schema.description.required).toBeUndefined()
      expect(schema.description.default).toBeUndefined()
      expect(schema.description.label).toBe("Описание")

      expect(schema.priority.type).toBe("enum")
      expect(schema.priority.required).toBeUndefined()
      expect(schema.priority.default).toBeUndefined()
      expect(schema.priority.label).toBe("Приоритет")
      expect(schema.priority.values).toEqual(["low", "medium", "high"])

      expect(schema.tags.type).toBe("array")
      expect(schema.tags.required).toBeUndefined()
      expect(schema.tags.default).toBeUndefined()
      expect(schema.tags.label).toBe("Теги")
    })
  })
})
