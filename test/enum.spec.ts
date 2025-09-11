import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("enum", () => {
  it("definition", () => {
    const { schema: enumSchema } = 
    // #region enumDefinition
    new Context((types) => ({
      short: types.enum,

      callable: types.enum(),
      callableOptions: types.enum("a", "b")()({ title: "enum" }),
      callableDefault: types.enum("user", "admin")("user"),

      optional: types.enum().optional(),
      optionalOptions: types.enum().optional()({ title: "enum" }),
      optionalDefault: types.enum("user", "admin").optional("user"),

      required: types.enum("user", "admin").required("user"),
      requiredOptions: types.enum("user", "admin").required("user")({ title: "enum" }),
    })
    // #endregion enumDefinition
  )
    expect(enumSchema).toEqual(
      // #region enumSchema
      {
      short: {
        type: "enum",
      },
      callable: {
        type: "enum",
      },
      callableOptions: {
        type: "enum",
        title: "enum",
        values: ["a", "b"],
      },
      callableDefault: {
        type: "enum",
        default: "user",
        values: ["user", "admin"],
      },
      optional: {
        type: "enum",
      },
      optionalOptions: {
        type: "enum",
        title: "enum",
      },
      optionalDefault: {
        type: "enum",
        default: "user",
        values: ["user", "admin"],
      },
      required: {
        type: "enum",
        default: "user",
        required: true,
        values: ["user", "admin"],
      },
      requiredOptions: {
        type: "enum",
        default: "user",
        required: true,
        title: "enum",
        values: ["user", "admin"],
      },
    }
    // #endregion enumSchema
    )
  })
  const { context, update } = new Context((types) => ({
    role: types.enum("user", "admin").required("user"),
  }))
  it("принимает значения из enum", () => {
    update({ role: "admin" })
    expect(context.role, "Поле role должно быть 'admin'").toBe("admin")
  })
  it("не принимает значения, не входящие в enum", () => {
    expect(() => {
      // @ts-expect-error - TypeScript запрещает значения, не входящие в enum
      update({ role: "guest" })
    }).toThrow("Поле role должно быть 'user' или 'admin', получено 'guest'")
  })
})
