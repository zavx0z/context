declare module "bun:test" {
  //@ts-ignore
  interface Matchers<R> {
    /** Проверяет, что Proxy-контекст эквивалентен plain-объекту по схеме */
    toPlainObjectEqual(schema: object, value: object): R
  }
}
