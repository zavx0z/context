/**
 * Создает числовой тип с поддержкой required/optional
 */
export const createNumberType = {
  /**
   * Создает обязательный числовой тип
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания числового типа с опциями
   *
   * @example
   * ```typescript
   * age: types.number.required(18)
   * ```
   */
  required: (defaultValue?: number) => {
    const base = { type: "number" as const, required: true as const, ...(defaultValue && { default: defaultValue }) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  /**
   * Создает опциональный числовой тип
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания числового типа с опциями
   *
   * @example
   * ```typescript
   * score: types.number.optional()
   * ```
   */
  optional: (defaultValue?: number) => {
    const base = { type: "number" as const, required: false as const, ...(defaultValue && { default: defaultValue }) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
}
