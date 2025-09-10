import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("контекст", () => {
  describe("nullable", () => {
    // #region optional
    describe("позволяет устанавливать null для optional полей", () => {
      const { context, update } = new Context((types) => ({
        stringShort: types.string(),
        stringShortDefault: types.string("value short"),
        stringOptional: types.string.optional(),
        stringOptionalDefault: types.string.optional("value optional"),

        numberShort: types.number(),
        numberShortDefault: types.number(1),
        numberOptional: types.number.optional(),
        numberOptionalDefault: types.number.optional(2),

        booleanShort: types.boolean(),
        booleanShortDefault: types.boolean(true),
        booleanOptional: types.boolean.optional(),
        booleanOptionalDefault: types.boolean.optional(false),

        arrayShort: types.array(),
        arrayShortDefault: types.array([1, 2, 3]),
        arrayOptional: types.array.optional(),
        arrayOptionalDefault: types.array.optional([4, 5, 6]),

        enumShort: types.enum("user", "admin")(),
        enumShortDefault: types.enum("user", "admin")("user"),
        enumOptional: types.enum("user", "admin").optional(),
        enumOptionalDefault: types.enum("user", "admin").optional("user"),
      }))
      
      it("не обязательные значения без значений по умолчанию должны быть null", () => {
        expect(context.stringShort, "string в короткой версии должен быть null").toBeNull()
        expect(context.stringOptional, "string в опциональной версии должен быть null").toBeNull()

        expect(context.numberShort, "number в короткой версии должен быть null").toBeNull()
        expect(context.numberOptional, "number в опциональной версии должен быть null").toBeNull()

        expect(context.booleanShort, "boolean в короткой версии должен быть null").toBeNull()
        expect(context.booleanOptional, "boolean в опциональной версии должен быть null").toBeNull()

        expect(context.arrayShort, "array в короткой версии должен быть null").toBeNull()
        expect(context.arrayOptional, "array в опциональной версии должен быть null").toBeNull()

        expect(context.enumShort, "enum в короткой версии должен быть null").toBeNull()
        expect(context.enumOptional, "enum в опциональной версии должен быть null").toBeNull()
      })

      it("не обязательные значения с значениями по умолчанию должны быть равны значениям по умолчанию", () => {
        expect(context.stringShortDefault, "string в короткой версии равен значению").toBe("value short")
        expect(context.stringOptionalDefault, "string в опциональной версии равен значению").toBe("value optional")

        expect(context.numberShortDefault, "number в короткой версии равен значению").toBe(1)
        expect(context.numberOptionalDefault, "number в опциональной версии равен значению").toBe(2)

        expect(context.booleanShortDefault, "boolean в короткой версии равен значению").toBe(true)
        expect(context.booleanOptionalDefault, "boolean в опциональной версии равен значению").toBe(false)

        expect(context.arrayShortDefault, "array в короткой версии равен значению").toEqual([1, 2, 3])
        expect(context.arrayOptionalDefault, "array в опциональной версии равен значению").toEqual([4, 5, 6])

        expect(context.enumShortDefault, "enum в короткой версии равен значению").toBe("user")
        expect(context.enumOptionalDefault, "enum в опциональной версии равен значению").toBe("user")
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
