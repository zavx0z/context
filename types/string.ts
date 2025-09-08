/**
 * Создает строковый тип с поддержкой required/optional
 */
export const createStringType = {
  /**
   * Создает обязательный строковый тип
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания строкового типа с опциями
   *
   * @example
   * ```typescript
   * name: types.string.required("Anonymous")
   * ```
   */
  required: (defaultValue?: string) => {
    const base = { type: "string" as const, required: true as const, ...(defaultValue && { default: defaultValue }) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  /**
   * Создает опциональный строковый тип
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания строкового типа с опциями
   *
   * @example
   * ```typescript
   * email: types.string.optional()
   * ```
   */
  optional: (defaultValue?: string) => {
    const base = { type: "string" as const, required: false as const, ...(defaultValue && { default: defaultValue }) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
}
