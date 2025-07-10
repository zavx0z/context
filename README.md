# @zavx0z/context

[![npm](https://img.shields.io/npm/v/@zavx0z/context)](https://www.npmjs.com/package/@zavx0z/context)
[![bun](https://img.shields.io/badge/bun-1.0+-black)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-green)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![JSON Patch](https://img.shields.io/badge/JSON%20Patch-RFC%206902-orange)](https://tools.ietf.org/html/rfc6902)
[![License](https://img.shields.io/badge/License-MIT-yellow)](https://opensource.org/licenses/MIT)

## Описание

**@zavx0z/context** — библиотека для создания типизированных, иммутабельных контекстов с поддержкой схем и подписки на изменения. Подходит для управления состоянием в проектах, где важен контроль изменений.

---

## Быстрый старт

### Установка

```sh
bun add @zavx0z/context
# или
npm install @zavx0z/context
```

### Пример использования

```ts
import { types, createContext } from "@zavx0z/context"

const schema = {
  name: types.string.required({ default: "Гость" }),
  age: types.number.optional(),
  isActive: types.boolean.required({ default: true }),
  role: types.enum("user", "admin", "moderator").required({ default: "user" }),
  tags: types.array.optional(),
}

const { context, update, onUpdate } = createContext(schema)

console.log(context.name) // "Гость"
update({ name: "Иван", age: 25 })
console.log(context.name) // "Иван"

const unsubscribe = onUpdate((patches) => {
  console.log("JSON Patch:", patches)
})

update({ age: null }) // JSON Patch: [{ op: "remove", path: "/age" }]
unsubscribe()
```

---

## Основные возможности

- Типизированные схемы для описания структуры состояния
- Иммутабельный доступ к значениям (контекст нельзя изменить напрямую)
- Метод update для безопасного и контролируемого обновления
- Подписка на изменения (onUpdate) с поддержкой JSON Patch (RFC 6902) для отслеживания изменений
- Поддержка типов: string, number, boolean, array, enum

---

## API

### types

Фабрики для описания схемы:

- `types.string.required({ default })` / `types.string.optional({ default })`
- `types.number.required({ default })` / `types.number.optional({ default })`
- `types.boolean.required({ default })` / `types.boolean.optional({ default })`
- `types.array.required({ default })` / `types.array.optional({ default })`
- `types.enum(...values).required({ default })` / `types.enum(...values).optional({ default })`

### createContext(schema)

Создаёт типизированный контекст по схеме.

**Параметры:**

- `schema` — объект или функция, возвращающая схему с использованием types

**Возвращает:**

- `context` — иммутабельный объект состояния
- `update(values)` — обновление значений (только переданные ключи)
- `onUpdate(cb)` — подписка на изменения (возвращает функцию отписки)

---

## Примеры схем

```ts
// Пользовательский контекст
const userSchema = {
  name: types.string.required({ default: "Гость" }),
  age: types.number.optional(),
  isActive: types.boolean.required({ default: true }),
  role: types.enum("user", "admin", "moderator").required({ default: "user" }),
  tags: types.array.optional(),
}

// Контекст продукта
const productSchema = {
  id: types.string.required(),
  name: types.string.required({ default: "Новый продукт" }),
  price: types.number.required({ default: 0 }),
  inStock: types.boolean.required({ default: false }),
  category: types.enum("electronics", "clothing", "books").optional(),
  images: types.array.required({ default: [] }),
}
```

---

## Особенности

- **Иммутабельность:** значения в context нельзя менять напрямую — только через update(). Попытка изменить или удалить свойство вызовет ошибку.
- **Подписка:** onUpdate(cb) позволяет реагировать на любые изменения, cb получает массив JSON Patch операций (RFC 6902).
- **Типизация:** все значения строго типизированы, поддерживается автодополнение в редакторе.

---

## Для разработчиков

### Архитектура

- **`types.ts`** — фабрики типов (runtime) и объект `types` для декларативного описания схемы.
- **`types.t.ts`** — TypeScript-интерфейсы, описывающие декларативные типы схемы (RequiredStringDefinition, …​).
- **`context.t.ts`** — типы, связанные с самим контекстом (ExtractValues, JsonPatch, ContextInstance).
- **`context.ts`** — бизнес-логика: класс `Context`, функция `createContext`, импортирующие `types` и типы из `*.t.ts`.
- Скрипты: `script/` — сборка (build.ts), обновление версии (version.ts).
- Тесты: `test/` — примеры, edge-cases, проверки иммутабельности и подписки.

### Как добавить новый тип

1. Добавьте фабрику в `context.ts` по аналогии с существующими (см. createStringType, createNumberType и т.д.).
2. Опишите тип в `types.ts`.
3. Добавьте обработку в метод initializeContext класса Context.
4. Добавьте тесты в `test/`.

### Сборка и тесты

- Сборка: `bun run script/build.ts --dev` или `--prod`
- Тесты: `bun test`

### Публикация

- `bun run script/version.ts` — увеличивает patch-версию
- `bun run publish:npm` — сборка и публикация

---

## Вклад

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/ваша-фича`
3. Внесите изменения, добавьте тесты
4. Оформите pull request

---

## Лицензия

MIT
