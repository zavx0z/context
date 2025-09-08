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
})
