import { createArrayType } from "./array"
import { createBooleanType } from "./boolean"
import { createEnumType } from "./enum"
import { createNumberType } from "./number"
import { createStringType } from "./string"

export const types = {
  string: Object.assign((defaultValue?: string) => createStringType.optional(defaultValue), createStringType),
  number: Object.assign((defaultValue?: number) => createNumberType.optional(defaultValue), createNumberType),
  boolean: Object.assign((defaultValue?: boolean) => createBooleanType.optional(defaultValue), createBooleanType),
  array: Object.assign(
    <const T extends (string | number | boolean)[]>(defaultValue?: T) => createArrayType.optional(defaultValue),
    createArrayType
  ),
  enum: <const T extends readonly (string | number)[]>(...values: T) => {
    const enumBase = createEnumType(...values)
    return Object.assign((defaultValue?: T[number]) => enumBase.optional(defaultValue), enumBase)
  },
}
