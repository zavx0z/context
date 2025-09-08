export const createEnumType = <const T extends readonly (string | number)[]>(...values: T) => ({
  /**
   * Создает обязательный тип перечисления
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания типа перечисления с опциями
   *
   * @example
   * ```typescript
   * status: types.enum("pending", "active", "blocked").required("pending")
   * ```
   */
  required: (defaultValue?: T[number]) => {
    const base = { type: "enum" as const, required: true as const, values, default: defaultValue }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  /**
   * Создает опциональный тип перечисления
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания типа перечисления с опциями
   *
   * @example
   * ```typescript
   * theme: types.enum("light", "dark").optional()
   * ```
   */
  optional: (defaultValue?: T[number]) => {
    const base = { type: "enum" as const, required: false as const, values, default: defaultValue }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
})
