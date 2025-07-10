// Фабрики описаний типов параметров контекста

const createStringType = {
  required: (params = {}) => ({type: "string" as const, required: true as const, ...params}),
  optional: (params = {}) => ({type: "string" as const, required: false as const, ...params}),
}
const createNumberType = {
  required: (params = {}) => ({type: "number" as const, required: true as const, ...params}),
  optional: (params = {}) => ({type: "number" as const, required: false as const, ...params}),
}
const createBooleanType = {
  required: (params = {}) => ({type: "boolean" as const, required: true as const, ...params}),
  optional: (params = {}) => ({type: "boolean" as const, required: false as const, ...params}),
}
const createArrayType = {
  required: (params = {}) => ({type: "array" as const, required: true as const, ...params}),
  optional: (params = {}) => ({type: "array" as const, required: false as const, ...params}),
}

export const types = {
  string: Object.assign((params = {}) => createStringType.optional(params), createStringType),
  number: Object.assign((params = {}) => createNumberType.optional(params), createNumberType),
  boolean: Object.assign((params = {}) => createBooleanType.optional(params), createBooleanType),
  array: Object.assign((params = {}) => createArrayType.optional(params), createArrayType),
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    const enumBase = {
      required: (options = {}) => ({type: "enum" as const, required: true as const, values, ...options}),
      optional: (options = {}) => ({type: "enum" as const, required: false as const, values, ...options}),
    }
    return Object.assign((options = {}) => enumBase.optional(options), enumBase)
  },
}