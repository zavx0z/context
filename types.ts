function makePrimitiveType<TName extends "string" | "number" | "boolean", Req extends boolean, D>(
  type: TName,
  required: Req,
  defaultValue?: D
) {
  const base = { type, required, ...(defaultValue !== undefined && { default: defaultValue }) } as const
  const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
  return Object.assign(configurator, base)
}

function createTypeWithRequiredOptional<TName extends "string" | "number" | "boolean">(type: TName) {
  const required = <D>(defaultValue?: D) => makePrimitiveType(type, true, defaultValue)
  const optional = <D>(defaultValue?: D) => makePrimitiveType(type, false, defaultValue)
  return Object.assign(optional, { required, optional })
}

const createArrayType = {
  required: <T extends string | number | boolean>(defaultValue?: T[]) => {
    const base = {
      type: "array" as const,
      required: true,
      ...(defaultValue !== undefined && { default: defaultValue }),
    } as const
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  optional: <T extends string | number | boolean>(defaultValue?: T[]) => {
    const base = {
      type: "array" as const,
      required: false,
      ...(defaultValue !== undefined && { default: defaultValue }),
    } as const
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
}

const createEnumType = <const T extends readonly (string | number)[]>(...values: T) => ({
  required: (defaultValue?: T[number]) => {
    const base = {
      type: "enum",
      required: true,
      ...(defaultValue !== undefined && { default: defaultValue }),
      values,
    } as const
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
  optional: (defaultValue?: T[number]) => {
    const base = {
      type: "enum",
      required: false,
      ...(defaultValue !== undefined && { default: defaultValue }),
      values,
    } as const
    const configurator = (options: { title?: string } = {}) => ({ ...base, ...options })
    return Object.assign(configurator, base)
  },
})

export const types = {
  string: createTypeWithRequiredOptional("string"),
  number: createTypeWithRequiredOptional("number"),
  boolean: createTypeWithRequiredOptional("boolean"),
  array: Object.assign(
    <const T extends (string | number | boolean)[]>(defaultValue?: T) =>
      createArrayType.optional<T[number]>(defaultValue),
    createArrayType
  ),
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    const enumBase = createEnumType(...values)
    return Object.assign((defaultValue?: T[number]) => enumBase.optional(defaultValue), enumBase)
  },
}
