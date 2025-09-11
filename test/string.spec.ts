import { describe, test, expect } from "bun:test"
import { Context } from "../context"

describe("строка", () => {
  describe("краткая версия", () => {
    // #region short
    const { context, schema, snapshot } = new Context((t) => ({
      nullable: t.string(),
      nullableWithTitle: t.string()({ title: "nullable title" }),

      default: t.string("default value"),
      defaultWithTitle: t.string("default with title value")({ title: "default title" }),
    }))
    // #endregion short

    test("контекст", () => {
      expect(context, "контекст").toEqual(
        // #region shortContext
        {
          nullable: null,
          nullableWithTitle: null,

          default: "default value",
          defaultWithTitle: "default with title value",
        }
        // #endregion shortContext
      )
    })
    test("схема", () => {
      expect(schema, "схема").toEqual(
        // #region shortSchema
        {
          nullable: {
            type: "string",
          },
          nullableWithTitle: {
            type: "string",
            title: "nullable title",
          },
          default: {
            type: "string",
            default: "default value",
          },
          defaultWithTitle: {
            type: "string",
            default: "default with title value",
            title: "default title",
          },
        }
        // #endregion shortSchema
      )
    })

    test("снимок", () => {
      expect(snapshot, "снимок").toEqual(
        // #region shortSnapshot
        {
          nullable: {
            type: "string",
            value: null,
          },
          nullableWithTitle: {
            type: "string",
            title: "nullable title",
            value: null,
          },
          default: {
            type: "string",
            default: "default value",
            value: "default value",
          },
          defaultWithTitle: {
            type: "string",
            title: "default title",
            default: "default with title value",
            value: "default with title value",
          },
        }
        // #endregion shortSnapshot
      )
    })
  })
})
