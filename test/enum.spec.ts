import { describe, it, expect } from "bun:test"
import { Context } from "../context"

describe("enum", () => {
  const { context, update } = new Context((types) => ({
    role: types.enum("user", "admin").required("user"),
  }))
  it("принимает значения из enum", () => {
    update({ role: "admin" })
    expect(context.role, "Поле role должно быть 'admin'").toBe("admin")
  })
  it("не принимает значения, не входящие в enum", () => {
    expect(() => {
      // @ts-expect-error - TypeScript запрещает значения, не входящие в enum
      update({ role: "guest" })
    }).toThrow("Поле role должно быть 'user' или 'admin', получено 'guest'")
  })
})
