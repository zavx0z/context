import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("контекст", () => {
  describe("nullable", () => {
    // #region optional
    describe("позволяет устанавливать null для optional полей", () => {
      const { context, update } = new Context((types) => ({
        nickname: types.string.optional(),
        age: types.number.optional(),
        tags: types.array.optional(["best", "worst"]),
        role: types.enum("user", "admin").optional("user"),
      }))
      it("null для optional string", () => {
        update({ nickname: null })
        expect(context.nickname, "Поле nickname должно обновиться на null").toBeNull()
      })
      it("null для optional number", () => {
        update({ age: null })
        expect(context.age, "Поле age должно обновиться на null").toBeNull()
      })
      it("null для optional array", () => {
        update({ tags: null })
        expect(context.tags, "Поле tags должно обновиться на null").toBeNull()
      })
      it("null для optional enum", () => {
        update({ role: null })
        expect(context.role, "Поле role должно обновиться на null").toBeNull()
      })
    })
    // #endregion optional
    // #region required
    describe("не позволяет устанавливать null для required полей", () => {
      const { update } = new Context((types) => ({
        name: types.string.required("Гость"),
        age: types.number.required(18),
        isActive: types.boolean.required(true),
        tags: types.array.required([]),
        role: types.enum("user", "admin").required("user"),
      }))
      it("null для required string", () => {
        expect(() => {
          // @ts-expect-error - TypeScript запрещает null
          update({ name: null })
        }).toThrow("Поле name не может быть null")
      })
      it("null для required enum", () => {
        expect(() => {
          // @ts-expect-error - TypeScript запрещает null
          update({ role: null })
        }).toThrow("Поле role не может быть null")
      })
      it("null для required array", () => {
        expect(() => {
          // @ts-expect-error - TypeScript запрещает null
          update({ tags: null })
        }).toThrow("Поле tags не может быть null")
      })
    })
    // #endregion required
  })
})
