/**
 * Создает булевый тип с поддержкой required/optional
 */
export const createBooleanType = {
  /**
   * Создает обязательный булевый тип
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания булевого типа с опциями
   *
   * @example
   * ```typescript
   * isActive: types.boolean.required(false)
   * ```
   */
  required: (defaultValue?: boolean) => {
    const base = { type: "boolean" as const, required: true as const, ...(defaultValue && {default: defaultValue}) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  /**
   * Создает опциональный булевый тип
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания булевого типа с опциями
   *
   * @example
   * ```typescript
   * isVerified: types.boolean.optional()
   * ```
   */
  optional: (defaultValue?: boolean) => {
    const base = { type: "boolean" as const, required: false as const, ...(defaultValue && {default: defaultValue}) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
}
