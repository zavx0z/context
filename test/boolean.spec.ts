import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("boolean", () => {
  it("definition", () => {
    const { schema: booleanSchema } =
      // #region booleanDefinition
      new Context((types) => ({
        short: types.boolean,

        callable: types.boolean(),
        callableOptions: types.boolean()({ title: "boolean" }),
        callableDefault: types.boolean(true),

        optional: types.boolean.optional(),
        optionalOptions: types.boolean.optional()({ title: "boolean" }),
        optionalDefault: types.boolean.optional(true),

        required: types.boolean.required(true),
        requiredOptions: types.boolean.required(true)({ title: "boolean" }),
      }))
    // #endregion booleanDefinition
    expect(booleanSchema).toEqual(
      // #region booleanSchema
      {
        short: { type: "boolean" },

        callable: { type: "boolean" },
        callableOptions: { type: "boolean", title: "boolean" },
        callableDefault: { type: "boolean", default: true },

        optional: { type: "boolean" },
        optionalOptions: { type: "boolean", title: "boolean" },
        optionalDefault: { type: "boolean", default: true },

        required: { type: "boolean", default: true, required: true },
        requiredOptions: { type: "boolean", default: true, required: true, title: "boolean" },
      }
      // #endregion booleanSchema
    )
  })
})
