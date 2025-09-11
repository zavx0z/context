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
          string: types.string("default"),
          stringWithoutDefault: types.string(),
          number: types.number(1),
          numberWithoutDefault: types.number(),
          boolean: types.boolean(true),
          booleanWithoutDefault: types.boolean(),
          array: types.array([1, 2, 3]),
          arrayWithoutDefault: types.array(),
          enum: types.enum("a", "b", "c")("a"),
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
          string: types.string()({ title: "string" }),
          number: types.number()({ title: "number" }),
          boolean: types.boolean()({ title: "boolean" }),
          array: types.array()({ title: "array" }),
          enum: types.enum()()({ title: "enum" }),
        }))
      // #endregion titleDefinition
      expect(titleSchema).toEqual(
        // #region titleSchema
        {
          string: { type: "string", title: "string" },
          number: { type: "number", title: "number" },
          boolean: { type: "boolean", title: "boolean" },
          array: { type: "array", title: "array" },
          enum: { type: "enum", title: "enum" },
        }
      )
    })
  })
  it("string", () => {
    const { schema: stringSchema } =
      // #region stringDefinition
      new Context((types) => ({
        short: types.string,

        callable: types.string(),
        callableOptions: types.string()({ title: "title" }),
        callableDefault: types.string("default"),

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
  it("number", () => {
    const { schema: numberSchema } =
      // #region numberDefinition
      new Context((types) => ({
        number: types.number,
        callable: types.number(),
        callableOptions: types.number()({ title: "number" }),
        callableDefault: types.number(4),

        optional: types.number.optional(),
        optionalOptions: types.number.optional()({ title: "number" }),
        optionalDefault: types.number.optional(4),

        required: types.number.required(4),
        requiredOptions: types.number.required(4)({ title: "number" }),
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
    )
  })
})
