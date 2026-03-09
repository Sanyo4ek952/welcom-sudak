# MVP Foundation: зависимости для старта

## 1. План
1. Зафиксировать минимальный набор зависимостей строго под заявленный стек.
2. Разделить зависимости на `dependencies` и `devDependencies`.
3. Дать готовые команды установки через `pnpm` без лишних библиотек.

## 2. Dependencies
- `next@15.2.0` — фреймворк (App Router) для основного приложения.
- `react@19.0.0` — UI-библиотека для компонентов.
- `react-dom@19.0.0` — рендеринг React в браузере.
- `@prisma/client@6.5.0` — runtime-клиент Prisma для запросов к PostgreSQL.
- `react-hook-form@7.54.2` — работа с формами с минимальным re-render.
- `zod@3.24.2` — схема-валидация и типобезопасная проверка данных.

## 3. DevDependencies
- `typescript@5.8.2` — TypeScript для типизации проекта.
- `prisma@6.5.0` — CLI Prisma для миграций, генерации клиента и работы со схемой.
- `tailwindcss@3.4.17` — utility-first CSS-фреймворк.
- `postcss@8.4.49` — процессинг CSS для Tailwind.
- `autoprefixer@10.4.20` — автопрефиксы CSS для кроссбраузерности.
- `eslint@9.22.0` — базовый линтинг кода.
- `eslint-config-next@15.2.0` — рекомендованная ESLint-конфигурация для Next.js.
- `@types/react@19.0.10` — типы React для TypeScript.
- `@types/react-dom@19.0.4` — типы React DOM для TypeScript.

## 4. Команды `pnpm install`
```bash
pnpm add next@15.2.0 react@19.0.0 react-dom@19.0.0 @prisma/client@6.5.0 react-hook-form@7.54.2 zod@3.24.2
pnpm add -D typescript@5.8.2 prisma@6.5.0 tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20 eslint@9.22.0 eslint-config-next@15.2.0 @types/react@19.0.10 @types/react-dom@19.0.4
```

## 5. Короткий summary
Это минимальный foundation-набор под MVP Welcome Sudak на Next.js + TypeScript + Tailwind + Prisma + PostgreSQL + RHF + Zod без второстепенных библиотек и без выхода за scope.
