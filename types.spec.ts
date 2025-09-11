import { describe, it, expect } from "bun:test"
import { Context } from "./context"

describe("Определение типов", () => {
  it("optional", () => {
    const { schema: simpleSchema } =
      // #region simpleDefinition
      new Context((types) => ({
        string: types.string,
        number: types.number,
        boolean: types.boolean,
        array: types.array,
        enum: types.enum,
      }))
    // #endregion simpleDefinition
    const { schema: simpleSchemaCall } =
      // #region simpleDefinitionCall
      new Context((types) => ({
        string: types.string(),
        number: types.number(),
        boolean: types.boolean(),
        array: types.array(),
        enum: types.enum(),
      }))
    // #endregion simpleDefinitionCall
    const { schema: optionalSchema } =
      // #region optionalDefinition
      new Context((types) => ({
        string: types.string.optional(),
        number: types.number.optional(),
        boolean: types.boolean.optional(),
        array: types.array.optional(),
        enum: types.enum().optional(),
      }))
    // #endregion optionalDefinition
    expect(simpleSchema).toEqual(simpleSchemaCall)
    expect(simpleSchema).toEqual(optionalSchema)
    expect(simpleSchemaCall).toEqual(optionalSchema)
    expect(simpleSchema).toEqual(
      // #region optionalSchema
      {
        string: {
          type: "string",
        },
        number: {
          type: "number",
        },
        boolean: {
          type: "boolean",
        },
        array: {
          type: "array",
        },
        enum: {
          type: "enum",
        },
      }
      // #endregion optionalSchema
    )
  })
  it("required", () => {
    const { schema: requiredSchema } =
      // #region requiredDefinition
      new Context((types) => ({
        string: types.string.required(),
        number: types.number.required(),
        boolean: types.boolean.required(),
        array: types.array.required(),
        enum: types.enum().required(),
      }))
    // #endregion requiredDefinition
  })
})
