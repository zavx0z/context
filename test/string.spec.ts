import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("строка", () => {
  it("string", () => {
    const { schema: stringSchema } =
      // #region stringDefinition
      new Context((types) => ({
        short: types.string.optional(),

        callable: types.string.optional(),
        callableOptions: types.string.optional()({ title: "title" }),
        callableDefault: types.string.optional("default"),

        optional: types.string.optional(),
        optionalOptions: types.string.optional()({ title: "title" }),
        optionalDefault: types.string.optional("default"),

        required: types.string.required("default"),
        requiredOptions: types.string.required("default")({ title: "title" }),
        requiredDefault: types.string.required("default"),
      }))
    // #endregion stringDefinition
    expect(stringSchema).toEqual(
      // #region stringSchema
      {
        short: {
          type: "string",
        },
        callable: {
          type: "string",
        },
        callableOptions: {
          type: "string",
          title: "title",
        },
        callableDefault: {
          type: "string",
          default: "default",
        },
        optional: {
          type: "string",
        },
        optionalOptions: {
          type: "string",
          title: "title",
        },
        optionalDefault: {
          type: "string",
          default: "default",
        },
        required: {
          type: "string",
          default: "default",
          required: true,
        },
        requiredOptions: {
          type: "string",
          default: "default",
          required: true,
          title: "title",
        },
        requiredDefault: {
          type: "string",
          required: true,
          default: "default",
        },
      }
      // #endregion stringSchema
    )
  })
})
