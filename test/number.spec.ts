import { describe, it, expect } from "bun:test"
import { contextSchema } from "../schema"

describe("number", () => {
  it("number", () => {
    const numberSchema =
      // #region numberDefinition
      contextSchema((types) => ({
        number: types.number.optional(),
        callable: types.number.optional(),
        callableOptions: types.number.optional({ title: "number" }),
        callableDefault: types.number.optional(4),

        optional: types.number.optional(),
        optionalOptions: types.number.optional({ title: "number" }),
        optionalDefault: types.number.optional(4),

        required: types.number.required(4),
        requiredOptions: types.number.required(4, { title: "number" }),
      }))
    // #endregion numberDefinition

    expect(numberSchema).toEqual(
      // #region numberSchema
      {
        number: { type: "number" },
        callable: { type: "number" },
        callableOptions: { type: "number", title: "number" },
        callableDefault: { type: "number", default: 4 },
        optional: { type: "number" },
        optionalOptions: { type: "number", title: "number" },
        optionalDefault: { type: "number", default: 4 },
        required: { type: "number", default: 4, required: true },
        requiredOptions: { type: "number", default: 4, required: true, title: "number" },
      }
      // #endregion numberSchema
    )
  })
})
