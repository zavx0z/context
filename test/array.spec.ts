import { describe, it, expect } from "bun:test"
import { contextSchema } from "../schema"
import { contextFromSchema } from "../context"

describe("массив", () => {
  it("definition", () => {
    const { schema: arraySchema } =
      // #region arrayDefinition
      contextFromSchema(
        contextSchema(
          (types) => ({
            short: types.array.optional(),

            callable: types.array.optional(),
            callableOptions: types.array.optional({ label: "array" }),
            callableDefault: types.array.optional([1, 2, 3]),

            optional: types.array.optional(),
            optionalOptions: types.array.optional({ label: "array" }),
            optionalDefault: types.array.optional([1, 2, 3]),

            required: types.array.required([1, 2, 3]),
            requiredOptions: types.array.required([1, 2, 3], { label: "array" }),
          })
          // #endregion arrayDefinition
        )
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
          label: "array",
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
          label: "array",
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
          label: "array",
        },
      }
      // #endregion arraySchema
    )
  })
  describe("обновление", () => {
    const { schema, update, context } = contextFromSchema(
      contextSchema((t) => ({
        array: t.array.required([1, 2, 3]),
      }))
    )
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
    it("обновление существующими параметрами", () => {
      // Сначала устанавливаем значение
      update({ array: [2, 5, 6] })
      // Затем пытаемся обновить теми же значениями - должно вернуть пустой объект
      const updated = update({ array: [2, 5, 6] })
      expect(updated).toBeEmptyObject()
    })
  })
})
