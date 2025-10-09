import { describe, it, expect } from "bun:test"
import { contextSchema } from "../schema"

describe("boolean", () => {
  it("definition", () => {
    const schema =
      // #region booleanDefinition
      contextSchema((types) => ({
        short: types.boolean.optional(),

        callable: types.boolean.optional(),
        callableOptions: types.boolean.optional({ label: "boolean" }),
        callableDefault: types.boolean.optional(true),

        optional: types.boolean.optional(),
        optionalOptions: types.boolean.optional({ label: "boolean" }),
        optionalDefault: types.boolean.optional(true),

        required: types.boolean.required(true),
        requiredOptions: types.boolean.required(true, { label: "boolean" }),
      }))
    // #endregion booleanDefinition
    expect(schema).toEqual(
      // #region booleanSchema
      {
        short: { type: "boolean" },

        callable: { type: "boolean" },
        callableOptions: { type: "boolean", label: "boolean" },
        callableDefault: { type: "boolean", default: true },

        optional: { type: "boolean" },
        optionalOptions: { type: "boolean", label: "boolean" },
        optionalDefault: { type: "boolean", default: true },

        required: { type: "boolean", default: true, required: true },
        requiredOptions: { type: "boolean", default: true, required: true, label: "boolean" },
      }
      // #endregion booleanSchema
    )
  })
})
