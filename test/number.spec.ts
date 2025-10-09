import { describe, it, expect } from "bun:test"
import { contextSchema } from "../schema"

describe("number", () => {
  it("number", () => {
    const schema =
      // #region numberDefinition
      contextSchema((types) => ({
        number: types.number.optional(),
        callable: types.number.optional(),
        callableOptions: types.number.optional({ label: "number" }),
        callableDefault: types.number.optional(4),

        optional: types.number.optional(),
        optionalOptions: types.number.optional({ label: "number" }),
        optionalDefault: types.number.optional(4),

        required: types.number.required(4),
        requiredOptions: types.number.required(4, { label: "number" }),
      }))
    // #endregion numberDefinition

    expect(schema).toEqual(
      // #region numberSchema
      {
        number: { type: "number" },
        callable: { type: "number" },
        callableOptions: { type: "number", label: "number" },
        callableDefault: { type: "number", default: 4 },
        optional: { type: "number" },
        optionalOptions: { type: "number", label: "number" },
        optionalDefault: { type: "number", default: 4 },
        required: { type: "number", default: 4, required: true },
        requiredOptions: { type: "number", default: 4, required: true, label: "number" },
      }
      // #endregion numberSchema
    )
  })
})
