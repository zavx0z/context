import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("массив", () => {
  it("definition", () => {
    const { schema: arraySchema } =
      // #region arrayDefinition
      new Context(
        (types) => ({
          short: types.array,

          callable: types.array(),
          callableOptions: types.array()({ title: "array" }),
          callableDefault: types.array([1, 2, 3]),

          optional: types.array.optional(),
          optionalOptions: types.array.optional()({ title: "array" }),
          optionalDefault: types.array.optional([1, 2, 3]),

          required: types.array.required([1, 2, 3]),
          requiredOptions: types.array.required([1, 2, 3])({ title: "array" }),
        })
        // #endregion arrayDefinition
      )

    expect(arraySchema).toEqual(
      // #region arraySchema
      {
        short: {
          type: "array",
        },
        callable: {
          type: "array",
        },
        callableOptions: {
          type: "array",
          title: "array",
        },
        callableDefault: {
          type: "array",
          default: [1, 2, 3],
        },
        optional: {
          type: "array",
        },
        optionalOptions: {
          type: "array",
          title: "array",
        },
        optionalDefault: {
          type: "array",
          default: [1, 2, 3],
        },
        required: {
          required: true,
          type: "array",
          default: [1, 2, 3],
        },
        requiredOptions: {
          required: true,
          type: "array",
          default: [1, 2, 3],
          title: "array",
        },
      }
      // #endregion arraySchema
    )
  })
  describe("обновление", () => {
    const { schema, update, context } = new Context((t) => ({
      array: t.array.required([1, 2, 3]),
    }))
    it("схема", () => {
      expect(schema).toEqual({
        array: {
          required: true,
          type: "array",
          default: [1, 2, 3],
        },
      })
    })

    it("обновление с несоответствующим типом", () => {
      expect(() => {
        // @ts-expect-error - TypeScript должен запрещать изменение типа
        update({ array: ["2", 5] })
      }).toThrow(
        "[Context.update] \"array\": ожидается массив элементов типа 'number', получен массив с элементами разных типов."
      )
    })
    it("обновление с соответствующим типом", () => {
      update({ array: [2, 5, 6] })
      expect(context.array).toEqual([2, 5, 6])
    })
  })
})
