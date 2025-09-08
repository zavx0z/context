import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("строка", () => {
  describe("опционально", () => {
    it("без дефолтного значения", () => {
      const { schema } = new Context((t) => ({
        string: t.string.optional(),
      }))
      expect(schema).toEqual({
        string: {
          required: false,
          type: "string",
        },
      })
    })
    it("с дефолтным значением", () => {
      const { schema } = new Context((t) => ({
        string: t.string.optional("default"),
      }))
      expect(schema).toEqual({
        string: {
          required: false,
          type: "string",
          default: "default",
        },
      })
    })
  })
  describe("обязательно", () => {
    it("без дефолтного значения", () => {
      const { schema } = new Context((t) => ({
        string: t.string.required(),
      }))
      expect(schema).toEqual({
        string: {
          required: true,
          type: "string",
        },
      })
    })
    it("с дефолтным значением", () => {
      const { schema } = new Context((t) => ({
        string: t.string.required("default"),
      }))
      expect(schema).toEqual({
        string: {
          required: true,
          type: "string",
          default: "default",
        },
      })
    })
  })
})
