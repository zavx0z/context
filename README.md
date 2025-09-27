# @zavx0z/context

[![npm](https://img.shields.io/npm/v/@zavx0z/context)](https://www.npmjs.com/package/@zavx0z/context)
[![bun](https://img.shields.io/badge/bun-1.0+-black)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-green)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![MDN](https://img.shields.io/badge/MDN-HTML-red)](https://developer.mozilla.org/en-US/docs/Web/HTML)

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
import { contextFromSchema, contextSchema } from "@zavx0z/context"

// 1. Создаём схему
const schema = contextSchema((t) => ({
  // обязательные примитивы/enum — могут быть помечены как идентификаторы
  id: t.string.required("1", { title: "ID", id: true }),
  role: t.enum("user", "admin").required("user", { id: true }),

  // обычные поля
  name: t.string.required("Гость", { title: "Имя" }),
  age: t.number.optional({ title: "Возраст" }),
  isActive: t.boolean.required(true),

  // массивы — можно указывать имя источника данных (таблицы)
  tags: t.array.required<string>([], { title: "Теги", data: "tags" }),
}))

// 2. Создаём контекст из схемы
const ctx = contextFromSchema(schema)

// чтение — только через иммутабельный снимок
console.log(ctx.context.name) // "Гость"
console.log(ctx.schema.name.title) // "Имя"

// обновление — возвращает только реально изменённые поля
ctx.update({ name: "Иван", age: 25 }) // { name: "Иван", age: 25 }
ctx.update({ age: 25 }) // {} (ничего не поменялось)
ctx.update({ age: 30 }) // { age: 30 }
ctx.update({ tags: ["важно", "срочно"] }) // { tags: ["важно", "срочно"] }

// подписка на обновления
const off = ctx.onUpdate((updated) => {
  console.log("changed:", updated)
})
off()
```

---

## Ключевые возможности

- **Типизированные схемы** (`string`, `number`, `boolean`, `array`, `enum`)
- **Chainable-опции** для полей (например, `{ title: "Имя" }`)
- **Метаданные**:
  - `title?: string` — заголовок
  - `id?: true` — только для обязательных примитивов и enum (отмечает поле как идентификатор)
  - `data?: string` — только для `array` (имя таблицы/источника данных)
- **Иммутабельный доступ** к значениям: прямое присваивание запрещено
- **Поддержка плоских массивов** примитивов с автоматической заморозкой
- `update(values)` **игнорирует** `undefined` и **возвращает только изменённые** ключи
- `onUpdate(cb)` — подписка передаёт `updated: Partial<Values>`
- Заголовки и метаданные доступны через `schema`

---

## Снимки и создание контекста

```ts
// Снимок с метаданными и текущими value
const full = ctx.snapshot

// Схема (без текущих value)
const schemaSnap = ctx.schema

// Создание контекста
const contextA = contextFromSchema(ctx.schema) // из схемы
```

---

## API (кратко)

### `contextSchema((types) => schema)`

Создает схему контекста. Для создания полного контекста используйте `contextFromSchema()`.

**Доступные фабрики:** `types.string`, `types.number`, `types.boolean`, `types.array`, `types.enum(...values)`.

- Примитивы и enum: `.required(default, { title?, id? })`, `.optional(default?, { title? })`
- Массивы: `.required(default[], { title?, data? })`, `.optional(default[]?, { title?, data? })`

### `contextFromSchema(schema)`

Создание контекста из схемы. Возвращает объект с методами:

- `context` — иммутабельный доступ к значениям (только для чтения)
- `schema` — схема (типы, required, default, title, values?, id?, data?)
- `update(values)` → `Partial<Values>` — только реально изменённые поля
- `onUpdate(cb)` → `() => void` — отписка
- `snapshot` (геттер) → `{ [key]: { type, required, default?, title?, values?, id?, data?, value } }`

---

## Экспорты

```ts
import { contextFromSchema, contextSchema } from "@zavx0z/context"
import type { Context, Schema, Values, Snapshot, Update } from "@zavx0z/context"
```

---

## Лицензия

MIT © [zavx0z](https://github.com/zavx0z)
