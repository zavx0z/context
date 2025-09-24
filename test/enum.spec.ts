import { describe, it, expect } from "bun:test"
import { contextSchema } from "../schema"
import { contextFromSchema } from "../context"

describe("enum", () => {
  it("варианты декларации", () => {
    const { schema } =
      // prettier-ignore
      // #region enumDefinition
      contextFromSchema(contextSchema((types) => ({
          short: types.enum().optional(),

          callable: types.enum().optional(),
          callableOptions: types.enum(1, 2).optional({ title: "enum" }),
          callableDefault: types.enum("user", "admin").optional("user"),

          optional: types.enum().optional(),
          optionalOptions: types.enum().optional({ title: "enum" }),
          optionalDefault: types.enum("user", "admin").optional("user"),

          required: types.enum("user", "admin").required("user"),
          requiredOptions: types.enum(1, 2, 3, 4).required(4, { title: "числовые значения" }),
        }))
        // #endregion enumDefinition
      )
    expect(schema).toEqual(
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
          values: [1, 2],
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
          default: 4,
          required: true,
          title: "числовые значения",
          values: [1, 2, 3, 4],
        },
      }
      // #endregion enumSchema
    )
  })
  it("значения отсутствуют", () => {
    const { context, schema, snapshot } =
      // #region emptyType
      contextFromSchema(
        contextSchema((types) => ({
          short: types.enum().optional(),
          callable: types.enum().optional(),
          optional: types.enum().optional(),
        }))
      )
    // #endregion emptyType
    expect({ ...context }).toEqual(
      // #region emptyContext
      {
        short: null,
        callable: null,
        optional: null,
      }
      // #endregion emptyContext
    )
    expect(schema).toEqual(
      // #region emptySchema
      {
        short: {
          type: "enum",
        },
        callable: {
          type: "enum",
        },
        optional: {
          type: "enum",
        },
      }
      // #endregion emptySchema
    )
    expect(snapshot).toEqual(
      // #region emptySnapshot
      {
        short: {
          type: "enum",
          value: null,
        },
        optional: {
          type: "enum",
          value: null,
        },
        callable: {
          type: "enum",
          value: null,
        },
      }
      // #endregion emptySnapshot
    )
  })
  const { context, update } = contextFromSchema(
    contextSchema((types) => ({
      role: types.enum("user", "admin").required("user"),
    }))
  )
  it("принимает значения из enum", () => {
    update({ role: "admin" })
    expect(context.role, "Поле role должно быть 'admin'").toBe("admin")
  })
  it("не принимает значения, не входящие в enum", () => {
    // @ts-expect-error - TypeScript запрещает значения, не входящие в enum
    expect(() => update({ role: "guest" })).toThrow(
      "[Context.update] \"role\": должно быть 'user' или 'admin', получено 'guest'"
    )
  })
})
