# @zavx0z/context

[![npm](https://img.shields.io/npm/v/@zavx0z/context)](https://www.npmjs.com/package/@zavx0z/context)
[![bun](https://img.shields.io/badge/bun-1.0+-black)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESM-green)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![JSON Patch](https://img.shields.io/badge/JSON%20Patch-RFC%206902-orange)](https://tools.ietf.org/html/rfc6902)
[![License](https://img.shields.io/badge/License-MIT-yellow)](https://opensource.org/licenses/MIT)

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

// update возвращает только обновлённые поля:
const changed = update({ age: 30 })
console.log(changed) // { age: 30 }

const unsubscribe = onUpdate((patches) => {
  console.log("JSON Patch:", patches)
})

update({ age: null }) // JSON Patch: [{ op: "replace", path: "/age", value: null }]
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

- `types.string.required({ default, title })` / `types.string.optional({ default, title })`
- `types.number.required({ default, title })` / `types.number.optional({ default, title })`
- `types.boolean.required({ default, title })` / `types.boolean.optional({ default, title })`
- `types.array.required({ default, title })` / `types.array.optional({ default, title })`
- `types.enum(...values).required({ default, title })` / `types.enum(...values).optional({ default, title })`

**Параметры:**

- `default` — значение по умолчанию
- `title` — опциональное название поля для документации

### createContext(schema)

Создаёт типизированный контекст по схеме.

**Параметры:**

- `schema` — объект или функция, возвращающая схему с использованием types

**Возвращает:**

- `context` — иммутабельный объект состояния
- `update(values)` — обновление значений (только переданные ключи)
  - **ВНИМАНИЕ:** update возвращает объект только с реально обновлёнными полями (а не весь контекст)
- `onUpdate(cb)` — подписка на изменения (возвращает функцию отписки)

---

## Примеры схем

```ts
// Пользовательский контекст
const userSchema = {
  name: types.string.required({ default: "Гость", title: "Имя пользователя" }),
  age: types.number.optional({ title: "Возраст" }),
  isActive: types.boolean.required({ default: true, title: "Активен" }),
  role: types.enum("user", "admin", "moderator").required({ default: "user", title: "Роль" }),
  tags: types.array.optional({ title: "Теги" }),
}

const { context, update } = createContext(userSchema)

update({ name: "Иван", age: 25 }) // { name: "Иван", age: 25 }
update({ age: 30 }) // { age: 30 }

// Контекст продукта
const productSchema = {
  id: types.string.required({ title: "Уникальный идентификатор" }),
  name: types.string.required({ default: "Новый продукт", title: "Название" }),
  price: types.number.required({ default: 0, title: "Цена" }),
  inStock: types.boolean.required({ default: false, title: "В наличии" }),
  category: types.enum("electronics", "clothing", "books").optional({ title: "Категория" }),
  images: types.array.required({ default: [], title: "Изображения" }),
}

const { update: updateProduct } = createContext(productSchema)
updateProduct({ id: "prod-123", price: 999 }) // { id: "prod-123", price: 999 }
```

---

## Экспорты

Библиотека предоставляет следующие экспорты:

```ts
// Основной экспорт
import { types, createContext } from "@zavx0z/context"

// Только типы (для TypeScript)
import type { ContextSchema, ExtractValues, JsonPatch } from "@zavx0z/context/types"
```

---

## Особенности

- **Иммутабельность:** значения в context нельзя менять напрямую — только через update(). Попытка изменить или удалить свойство вызовет ошибку.
- **Метод update:** возвращает только реально изменённые поля (а не весь контекст).
- **Подписка:** onUpdate(cb) позволяет реагировать на любые изменения, cb получает массив JSON Patch операций (RFC 6902).

- **Типизация:** все значения строго типизированы, поддерживается автодополнение в редакторе.
- **Документация:** поддержка title в схемах для улучшения документации.

---

## Для разработчиков

### Архитектура

- **`types.ts`** — фабрики типов (runtime) и объект `types` для декларативного описания схемы.
- **`types.t.ts`** — TypeScript-интерфейсы, описывающие декларативные типы схемы (RequiredStringDefinition, …​).
- **`context.t.ts`** — типы, связанные с самим контекстом (ExtractValues, JsonPatch, ContextInstance).
- **`context.ts`** — бизнес-логика: класс `Context`, функция `createContext`, импортирующие `types` и типы из `*.t.ts`.
- **`fixture/`** — кастомные матчеры для тестов (toPlainObjectEqual).
- Скрипты: `script/` — сборка (build.ts), генерация типов (typegen.ts), обновление версии (version.ts).
- Тесты: `test/` — примеры, edge-cases, проверки иммутабельности и подписки.

### Как добавить новый тип

1. Добавьте фабрику в `types.ts` по аналогии с существующими (см. createStringType, createNumberType и т.д.).
2. Опишите тип в `types.t.ts`.
3. Добавьте обработку в метод initializeContext класса Context в `context.ts`.
4. Добавьте тесты в `test/`.

### Сборка и тесты

```sh
# Разработка
bun run build:dev

# Продакшн
bun run build:prod

# Тесты
bun test

# Сухая публикация
bun run publish:dry
```

### Публикация

```sh
# Обновление версии (patch/minor/major)
bun run script/version.ts [patch|minor|major]

# Публикация в npm
bun run publish:npm
```

---

## Вклад

1. Форкните репозиторий
2. Создайте ветку: `git checkout -b feature/ваша-фича`
3. Внесите изменения, добавьте тесты
4. Оформите pull request

---

## Лицензия

MIT
