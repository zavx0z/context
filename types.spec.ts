import { describe, it, expect } from "bun:test"
import { Context } from "./context"

describe("Определение типов", () => {
  it("optional", () => {
    const { schema: optionalSchema } =
      // #region optionalDefinition
      new Context((types) => ({
        string: types.string.optional(),
        number: types.number.optional(),
        boolean: types.boolean.optional(),
        array: types.array.optional(),
        enum: types.enum("a", "b", "c").optional(),
      }))
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
      new Context((types) => ({
        string: types.string.required("default"),
        number: types.number.required(1),
        boolean: types.boolean.required(true),
        array: types.array.required([1, 2, 3]),
        enum: types.enum("a", "b", "c").required("a"),
      }))
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
        new Context((types) => ({
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
        new Context((types) => ({
          string: types.string.required("default"),
          number: types.number.required(1),
          boolean: types.boolean.required(true),
          array: types.array.required([1, 2, 3]),
          enum: types.enum("a", "b", "c").required("a"),
        }))

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
          new Context((types) => ({
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
        // #endregion withoutDefaultValueDefinition
      ).toThrowError()
    })
  })
  describe("метаданные", () => {
    it("title", () => {
      const { schema: titleSchema } =
        // #region titleDefinition
        new Context((types) => ({
          string: types.string.optional()({ title: "string" }),
          number: types.number.optional()({ title: "number" }),
          boolean: types.boolean.optional()({ title: "boolean" }),
          array: types.array.optional()({ title: "array" }),
          enum: types.enum("a", "b", "c").optional()({ title: "enum" }),
        }))
      // #endregion titleDefinition
      expect(titleSchema).toEqual(
        // #region titleSchema
        {
          string: { type: "string", title: "string" },
          number: { type: "number", title: "number" },
          boolean: { type: "boolean", title: "boolean" },
          array: { type: "array", title: "array" },
          enum: { type: "enum", title: "enum", values: ["a", "b", "c"] },
        }
      )
    })
    it("id и data", () => {
      const { schema } = new Context((types) => ({
        idString: types.string.required("ID")({ id: true, title: "ID String" }),
        idEnum: types.enum("u", "a").required("u")({ id: true }),
        dataArray: types.array.required([1])({ data: "users", title: "Users" }),
        plainArray: types.array.optional()({ data: "logs" }),
        // опциональные поля не могут иметь id
        optionalString: types.string.optional()({ title: "opt" }),
        optionalEnum: types.enum("x", "y").optional()({ title: "opt" }),
      }))
      expect(schema).toEqual({
        idString: { type: "string", required: true, default: "ID", title: "ID String", id: true },
        idEnum: { type: "enum", required: true, default: "u", values: ["u", "a"], id: true },
        dataArray: { type: "array", required: true, default: [1], title: "Users", data: "users" },
        plainArray: { type: "array", data: "logs" },
        optionalString: { type: "string", title: "opt" },
        optionalEnum: { type: "enum", title: "opt", values: ["x", "y"] },
      })
    })
  })
})
