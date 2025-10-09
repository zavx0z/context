import { describe, it, expect } from "bun:test"
import { contextSchema } from "../schema"

describe("строка", () => {
  it("string", () => {
    const stringSchema =
      // #region stringDefinition
      contextSchema((types) => ({
        short: types.string.optional(),

        callable: types.string.optional(),
        callableOptions: types.string.optional({ label: "label" }),
        callableDefault: types.string.optional("default"),

        optional: types.string.optional(),
        optionalOptions: types.string.optional({ label: "label" }),
        optionalDefault: types.string.optional("default"),

        required: types.string.required("default"),
        requiredOptions: types.string.required("default", { label: "label" }),
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
          label: "label",
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
          label: "label",
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
          label: "label",
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
