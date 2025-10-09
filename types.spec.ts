import { describe, it, expect } from "bun:test"
import { contextFromSchema } from "./context"
import { contextSchema } from "./schema"

describe("Определение типов", () => {
  it("optional", () => {
    const { schema: optionalSchema } =
      // #region optionalDefinition
      contextFromSchema(
        contextSchema((types) => ({
          string: types.string.optional(),
          number: types.number.optional(),
          boolean: types.boolean.optional(),
          array: types.array.optional(),
          enum: types.enum("a", "b", "c").optional(),
        }))
      )
    // #endregion optionalDefinition
    expect(optionalSchema).toEqual(
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
          values: ["a", "b", "c"],
        },
      }
      // #endregion optionalSchema
    )
  })
  it("required", () => {
    const { schema: requiredSchema } =
      // #region requiredDefinition
      contextFromSchema(
        contextSchema((types) => ({
          string: types.string.required("default"),
          number: types.number.required(1),
          boolean: types.boolean.required(true),
          array: types.array.required([1, 2, 3]),
          enum: types.enum("a", "b", "c").required("a"),
        }))
      )
    // #endregion requiredDefinition
    expect(requiredSchema).toEqual(
      // #region requiredSchema
      {
        string: { type: "string", default: "default", required: true },
        number: { type: "number", default: 1, required: true },
        boolean: { type: "boolean", default: true, required: true },
        array: { type: "array", default: [1, 2, 3], required: true },
        enum: { type: "enum", default: "a", required: true, values: ["a", "b", "c"] },
      }
      // #endregion requiredSchema
    )
  })
  describe("default", () => {
    it("optional", () => {
      const { schema: defaultValueSchema } =
        // #region defaultValueDefinition
        contextFromSchema(
          contextSchema((types) => ({
            string: types.string.optional("default"),
            stringWithoutDefault: types.string.optional(),
            number: types.number.optional(1),
            numberWithoutDefault: types.number.optional(),
            boolean: types.boolean.optional(true),
            booleanWithoutDefault: types.boolean.optional(),
            array: types.array.optional([1, 2, 3]),
            arrayWithoutDefault: types.array.optional(),
            enum: types.enum("a", "b", "c").optional("a"),
          }))
        )
      // #endregion defaultValueDefinition
      expect(defaultValueSchema).toEqual(
        // #region defaultValueSchema
        {
          string: { type: "string", default: "default" },
          stringWithoutDefault: { type: "string" },
          number: { type: "number", default: 1 },
          numberWithoutDefault: { type: "number" },
          boolean: { type: "boolean", default: true },
          booleanWithoutDefault: { type: "boolean" },
          array: { type: "array", default: [1, 2, 3] },
          arrayWithoutDefault: { type: "array" },
          enum: { type: "enum", default: "a", values: ["a", "b", "c"] },
        }
        // #endregion defaultValueSchema
      )
    })
    it("required", () => {
      const { schema: requiredDefaultValueSchema } =
        // #region requiredDefaultValueDefinition
        contextFromSchema(
          contextSchema((types) => ({
            string: types.string.required("default"),
            number: types.number.required(1),
            boolean: types.boolean.required(true),
            array: types.array.required([1, 2, 3]),
            enum: types.enum("a", "b", "c").required("a"),
          }))
        )

      // #endregion requiredDefaultValueDefinition
      expect(requiredDefaultValueSchema).toEqual(
        // #region requiredDefaultValueSchema
        {
          string: { type: "string", default: "default", required: true },
          number: { type: "number", default: 1, required: true },
          boolean: { type: "boolean", default: true, required: true },
          array: { type: "array", default: [1, 2, 3], required: true },
          enum: { type: "enum", default: "a", required: true, values: ["a", "b", "c"] },
        }
        // #endregion requiredDefaultValueSchema
      )
    })
    it("without default", () => {
      expect(
        () =>
          // #region withoutDefaultValueDefinition
          contextFromSchema(
            contextSchema((types) => ({
              // @ts-expect-error - TypeScript запрещает null для required string
              string: types.string.required(),
              // @ts-expect-error - TypeScript запрещает null для required number
              number: types.number.required(),
              // @ts-expect-error - TypeScript запрещает null для required boolean
              boolean: types.boolean.required(),
              // @ts-expect-error - TypeScript запрещает null для required array
              array: types.array.required(),
              // @ts-expect-error - TypeScript запрещает null для required enum
              enum: types.enum("a", "b", "c").required(),
            }))
          )
        // #endregion withoutDefaultValueDefinition
      ).toThrowError()
    })
  })
  describe("метаданные", () => {
    it("label", () => {
      const { schema: titleSchema } =
        // #region titleDefinition
        contextFromSchema(
          contextSchema((types) => ({
            string: types.string.optional({ label: "string" }),
            number: types.number.optional({ label: "number" }),
            boolean: types.boolean.optional({ label: "boolean" }),
            array: types.array.optional({ label: "array" }),
            enum: types.enum("a", "b", "c").optional({ label: "enum" }),
          }))
        )
      // #endregion titleDefinition
      expect(titleSchema).toEqual(
        // #region titleSchema
        {
          string: { type: "string", label: "string" },
          number: { type: "number", label: "number" },
          boolean: { type: "boolean", label: "boolean" },
          array: { type: "array", label: "array" },
          enum: { type: "enum", label: "enum", values: ["a", "b", "c"] },
        }
      )
    })
    it("id и data", () => {
      const { schema } = contextFromSchema(
        contextSchema((types) => ({
          idString: types.string.required("ID", { id: true, label: "ID String" }),
          idEnum: types.enum("u", "a").required("u", { id: true }),
          dataArray: types.array.required([1], { data: "users", label: "Users" }),
          plainArray: types.array.optional({ data: "logs" }),
          // @ts-expect-error опциональные поля не могут иметь id
          optionalString: types.string.optional({ label: "opt", id: "identifier" }),
          optionalEnum: types.enum("x", "y").optional({ label: "opt" }),
        }))
      )
      expect(schema).toEqual({
        idString: { type: "string", required: true, default: "ID", label: "ID String", id: true },
        idEnum: { type: "enum", required: true, default: "u", values: ["u", "a"], id: true },
        dataArray: { type: "array", required: true, default: [1], label: "Users", data: "users" },
        plainArray: { type: "array", data: "logs" },
        optionalString: { type: "string", label: "opt" },
        optionalEnum: { type: "enum", label: "opt", values: ["x", "y"] },
      })
    })
  })
})
