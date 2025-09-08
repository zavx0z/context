import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("массив", () => {
  describe("опционально", () => {
    it("без дефолтного значения", () => {
      const { schema } = new Context((t) => ({
        array: t.array.optional(),
      }))
      expect(schema).toEqual({
        array: {
          required: false,
          type: "array",
        },
      })
    })
    it("с дефолтным значением", () => {
      const { schema } = new Context((t) => ({
        array: t.array.optional(),
      }))
      expect(schema).toEqual({
        array: {
          required: false,
          type: "array",
        },
      })
    })
  })
  describe("обязательно", () => {
    it("без дефолтного значения", () => {
      const { schema } = new Context((t) => ({
        array: t.array.required(),
      }))
      expect(schema).toEqual({
        array: {
          required: true,
          type: "array",
        },
      })
    })
    it("с дефолтным значением", () => {
      const { schema } = new Context((t) => ({
        array: t.array.required(),
      }))
      expect(schema).toEqual({
        array: {
          required: true,
          type: "array",
        },
      })
    })
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
