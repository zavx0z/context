import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("контекст", () => {
  const { context } = new Context((t) => ({
    string: t.string.optional()({ title: "String" }),
    arr: t.array.required([0, 1]),
  }))
  it("обращение к ключу контекста", () => {
    expect(context.string).toBe(null)
  })
  it("обращение к объекту контекста", () => {
    expect(context).toEqual({ string: null, arr: [0, 1] })
  })
  it("обращение к элементу массива", () => {
    expect(context.arr[0]).toEqual(0)
    expect(() => {
      context.arr[0] = 10
    }).toThrow("Attempted to assign to readonly property")
  })
  it("объект контекста иммутабельный", () => {
    expect(() => {
      context.string = "новое значение"
    }).toThrow()
  })
})
