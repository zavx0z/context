import { describe, it, expect } from "bun:test"
import { types, createContext } from "../context"
import type { JsonPatch } from "../types"

describe("onUpdate", () => {
  it("вызывает коллбек с патчами при обновлении", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
      isActive: types.boolean.required({ default: true }),
    })

    let received: JsonPatch[] = []
    onUpdate((patches) => {
      received = patches
    })

    update({ name: "Иван", age: 25 })
    expect(received, "onUpdate должен вызываться с патчами replace для измененных полей").toEqual([
      { op: "replace", path: "/name", value: "Иван" },
      { op: "replace", path: "/age", value: 25 },
    ])

    update({ age: null })
    expect(received, "onUpdate должен вызываться с патчем remove для null значений").toEqual([
      { op: "remove", path: "/age" },
    ])
  })

  it("поддерживает отписку от обновлений", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
    })

    let called = 0
    const unsubscribe = onUpdate(() => {
      called++
    })

    update({ name: "Вася" })
    expect(called, "onUpdate должен быть вызван один раз").toBe(1)

    unsubscribe()
    update({ name: "Петя" })
    expect(called, "onUpdate не должен вызываться после отписки").toBe(1)
  })

  it("поддерживает несколько подписчиков", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
    })

    let a = 0,
      b = 0
    onUpdate(() => {
      a++
    })
    onUpdate(() => {
      b++
    })

    update({ name: "Оля" })
    expect(a, "Первый подписчик должен быть вызван").toBe(1)
    expect(b, "Второй подписчик должен быть вызван").toBe(1)
  })

  it("генерирует корректные JSON Patch", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
    })

    const patches: JsonPatch[] = []
    onUpdate((p) => patches.push(...p))

    update({ name: "Лена" })
    let patch = patches[0]!
    expect(patch.op, "op должен быть 'replace' для обновления значения").toBe("replace")
    expect(patch.path, "path должен быть '/name' для поля name").toBe("/name")
    expect(patch, "patch должен содержать value с новым значением").toHaveProperty("value", "Лена")

    update({ age: null })
    patch = patches[1]!
    expect(patch.op, "op должен быть 'remove' для null значений").toBe("remove")
    expect(patch.path, "path должен быть '/age' для поля age").toBe("/age")
  })

  it("не вызывает коллбек при создании контекста", () => {
    let called = false
    const { onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
    })

    onUpdate(() => {
      called = true
    })

    expect(called, "onUpdate не должен вызываться при создании контекста").toBe(false)
  })

  it.todo("вызывает коллбек только при изменении значений", () => {
    const { update, onUpdate } = createContext({
      name: types.string.required({ default: "Гость" }),
      age: types.number.optional(),
    })

    let callCount = 0
    onUpdate(() => {
      callCount++
    })

    update({ name: "Гость" }) // то же значение
    expect(callCount, "onUpdate не должен вызываться при установке того же значения").toBe(0)

    update({ name: "Иван" }) // новое значение
    expect(callCount, "onUpdate должен быть вызван при изменении значения").toBe(1)

    update({ age: null }) // установка null для optional поля
    expect(callCount, "onUpdate должен быть вызван при установке null").toBe(2)
  })
})
