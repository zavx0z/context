# @zavx0z/context

Лёгкая библиотека для типобезопасных **контекстов состояния**: строгая схема, иммутабельный доступ к значениям, контролируемые обновления и подписки. **Часть фреймворка MetaFor** (модуль контекста/состояния), при этом может использоваться как самостоятельный пакет.

---

## MetaFor

Библиотека используется во фреймворке **MetaFor** в качестве слоя контекста/состояния.

---

## Установка

```sh
bun add @zavx0z/context
```

---

## Быстрый пример

```ts
import { Context, types } from "@zavx0z/context"

const ctx = new Context((t) => ({
  name: t.string.required("Гость")({ title: "Имя" }),
  age: t.number.optional()({ title: "Возраст" }),
  isActive: t.boolean.required(true),
  role: t.enum("user", "admin", "moderator").required("user"),
  tags: t.array.optional(),
}))

// чтение — только через иммутабельный снимок
console.log(ctx.context.name) // "Гость"
console.log(ctx.context._title.name) // "Имя"

// обновление — возвращает только реально изменённые поля
ctx.update({ name: "Иван", age: 25 }) // { name: "Иван", age: 25 }
ctx.update({ age: 25 }) // {} (ничего не поменялось)
ctx.update({ age: 30 }) // { age: 30 }

// подписка на обновления
const off = ctx.onUpdate((updated) => {
  console.log("changed:", updated) // например: { age: 30 }
})
off()
```

---

## Ключевые возможности

- **Типизированные схемы** (`string`, `number`, `boolean`, `array`, `enum`).
- **Chainable-опции** для полей (например, `{ title: "Имя" }`).
- **Иммутабельный доступ** к значениям: прямое присваивание запрещено.
- `update(values)` **игнорирует** `undefined` и **возвращает только изменённые** ключи.
- `onUpdate(cb)` — подписка передаёт `updated: Partial<Values>`.
- Заголовки полей доступны через `context._title` (изменяемый объект, не влияет на значения).

---

## Снимки и клонирование

```ts
// Текущее «плоское» состояние (только значения)
const values = ctx.getSnapshot()

// Снимок с метаданными и текущими value
const full = ctx.snapshot

// Сериализуемая схема (без текущих value)
const schemaSnap = ctx.toSnapshot()

// Восстановление/клонирование
import { ContextClone } from "@zavx0z/context"
const clone = ContextClone.fromSnapshot(schemaSnap)
clone.restoreValues(values)
```

---

## API (кратко)

### `new Context((types) => schema)`

Создает контекст по фабрике схемы. Доступные фабрики: `types.string`, `types.number`, `types.boolean`, `types.array`, `types.enum(...values)`.
У каждой есть `.required(default?)` и `.optional(default?)` + chainable-настройки (напр. `{ title: string }`).

### Свойства и методы

- `context` — иммутабельный доступ к значениям + `_title`.
- `schema` — сериализованная схема (типы, required, default, title, values?).
- `update(values)` → `Partial<Values>` — только реально изменённые поля.
- `onUpdate(cb)` → `() => void` — отписка.
- `getSnapshot()` → `Values`.
- `snapshot` (геттер) → `{ [key]: { type, required, default?, title?, values?, value } }`.
- `toSnapshot()` → сериализуемая схема.
- `ContextClone.fromSnapshot(schema)` → `ContextClone`.
- `clone.restoreValues(values)`.

---

## Экспорты

```ts
import { Context, ContextClone, types } from "@zavx0z/context"
import type { Schema, ContextSnapshot, SerializedSchema, Values, ContextInstance } from "@zavx0z/context"
```

---

## Лицензия

MIT © [zavx0z](https://github.com/zavx0z)
