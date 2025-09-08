/**
 * Создает тип массива с поддержкой required/optional
 */
export const createArrayType = {
  /**
   * Создает обязательный тип массива
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания типа массива с опциями
   *
   * @example
   * ```typescript
   * userIds: types.array.required([])
   * ```
   */
  required: <T extends string | number | boolean = string>(defaultValue?: T[]) => {
    const base = { type: "array" as const, required: true as const, ...(defaultValue && { default: defaultValue }) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  /**
   * Создает опциональный тип массива
   * @param defaultValue - Значение по умолчанию
   * @returns Функция для создания типа массива с опциями
   *
   * @example
   * ```typescript
   * tags: types.array.optional()
   * ```
   */
  optional: <T extends (string | number | boolean)[]>(defaultValue?: T) => {
    const base = { type: "array" as const, required: false as const, ...(defaultValue && { default: defaultValue }) }
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
}
