# СеллерМаг — интернет-магазин упаковочных материалов

Каркас проекта: Next.js (frontend) + FastAPI (backend) + Supabase (Postgres) +
Google Sheets (панель управления остатками для менеджера).

## Структура репозитория

```
sellermag/
├── frontend/         Next.js-приложение (каталог, карточка, корзина, чекаут)
├── backend/          FastAPI-приложение (API товаров, заказов, интеграции)
├── db/               SQL-схема таблиц Supabase
├── google-sheets/    Структура листов Google Таблицы для синхронизации
├── infra/nginx/      Конфиг реверс-прокси для продакшена
└── docker-compose.yml
```

## Архитектура (кратко)

- **Источник истины по данным** — Supabase (Postgres). Каталог, остатки, заказы
  хранятся там.
- **Google Таблица** — рабочая панель менеджера. Изменения остатков/цен в
  таблице синхронизируются в Supabase; новые заказы из Supabase пишутся в лист
  «Заказы» — без ручных выгрузок файлов.
- **Backend (FastAPI)** — отдаёт каталог фронтенду, принимает заказы, дергает
  внешние интеграции: ЮKassa (оплата), DaData (реквизиты по ИНН), SMS.ru
  (код для входа в личный кабинет).
- **Frontend (Next.js)** — весь путь покупателя: главная → каталог → карточка
  → корзина → чекаут.

## Локальный запуск

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # заполнить реальными ключами
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # заполнить NEXT_PUBLIC_API_URL и т.д.
npm run dev
```

Frontend поднимется на `http://localhost:3000`, backend — на
`http://localhost:8000` (документация API — `http://localhost:8000/docs`).

## Переменные окружения

См. `backend/.env.example` и `frontend/.env.example` — там перечислены все
ключи, которые понадобится завести (Supabase, Google Sheets, ЮKassa, DaData,
SMS.ru) и заполнить реальными значениями. Файлы `.env` в репозиторий не
коммитятся (см. `.gitignore`).

## Деплой

Продакшен разворачивается через `docker-compose.yml` на VPS: Nginx (реверс-
прокси + SSL через Certbot) → frontend (Next.js) и backend (FastAPI).
Подробности появятся отдельным README в `infra/` на этапе деплоя.

## Статус

Каркас репозитория и SQL-схема — готовы. Реальная интеграция дизайн-макетов
(`homepage-demo.jsx`, `catalog-product-demo.jsx`, `cart-checkout-demo.jsx`) в
Next.js-приложение — следующий шаг.
