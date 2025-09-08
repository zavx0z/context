import { describe, test, expect } from "bun:test"
import { Context } from "../context"

describe("массив", () => {
  describe("обновление", () => {
    const { schema, update, context } = new Context((t) => ({
      array: t.array.required([1, 2, 3]),
    }))
    test("схема", () => {
      expect(schema).toEqual({
        array: {
          required: true,
          type: "array",
          default: [1, 2, 3],
        },
      })
    })

    test("обновление с несоответствующим типом", () => {
      expect(() => {
        // @ts-expect-error - TypeScript должен запрещать изменение типа
        update({ array: ["2", 5] })
      }).toThrow(
        "[Context.update] \"array\": ожидается массив элементов типа 'number', получен массив с элементами разных типов."
      )
    })
    test("обновление с соответствующим типом", () => {
      update({ array: [2, 5, 6] })
      expect(context.array).toEqual([2, 5, 6])
    })
  })
})
