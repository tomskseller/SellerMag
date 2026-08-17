-- СеллерМаг — схема базы данных (Supabase / Postgres)
-- Порядок применения: выполнить целиком в Supabase SQL Editor.

-- ─────────────────────────────────────────────
-- Категории (двухуровневые: категория → подкатегория)
-- ─────────────────────────────────────────────
create table categories (
    id            bigint generated always as identity primary key,
    name          text not null,
    slug          text not null unique,
    parent_id     bigint references categories(id) on delete cascade,
    sort_order    int default 0,
    created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Товары (карточка товара — например «Курьерский пакет белого цвета»)
-- ─────────────────────────────────────────────
create table products (
    id            bigint generated always as identity primary key,
    category_id   bigint references categories(id),
    name          text not null,
    slug          text not null unique,
    description   text,
    sheet_row_id  text,               -- ссылка на строку в Google Таблице для синхронизации
    is_active     boolean default true,
    created_at    timestamptz default now(),
    updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Вариации товара (конкретный размер × плотность = конкретная позиция с ценой и остатком)
-- ─────────────────────────────────────────────
create table product_variations (
    id            bigint generated always as identity primary key,
    product_id    bigint references products(id) on delete cascade,
    size          text,               -- например '24x32'
    density_mkm   int,                -- например 60
    sku           text unique,
    price         numeric(10,2) not null,
    stock         int not null default 0,
    updated_at    timestamptz default now()
);

-- Оптовая сетка цен для вариации (от N штук — цена за штуку)
create table wholesale_tiers (
    id                   bigint generated always as identity primary key,
    product_variation_id bigint references product_variations(id) on delete cascade,
    min_qty              int not null,
    price_per_unit       numeric(10,2) not null
);

-- ─────────────────────────────────────────────
-- Клиенты (создаются и при быстром заказе, и при входе по SMS)
-- ─────────────────────────────────────────────
create table customers (
    id            bigint generated always as identity primary key,
    name          text,
    phone         text unique,
    is_registered boolean default false,   -- true, если клиент входил через SMS-код
    created_at    timestamptz default now()
);

create table customer_addresses (
    id            bigint generated always as identity primary key,
    customer_id   bigint references customers(id) on delete cascade,
    address       text not null,
    created_at    timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Заказы
-- ─────────────────────────────────────────────
create type delivery_method as enum ('pickup', 'courier', 'transport_company');
create type payer_type as enum ('person', 'company');
create type payment_status as enum ('pending', 'invoice_issued', 'paid', 'cancelled');

create table orders (
    id                bigint generated always as identity primary key,
    order_number      text not null unique,       -- например 'СМ-48213'
    customer_id       bigint references customers(id),
    customer_name     text not null,
    customer_phone    text not null,
    delivery_method   delivery_method not null,
    delivery_address  text,
    payer_type        payer_type not null default 'person',
    inn               text,                        -- заполняется для юрлиц
    company_name      text,
    company_kpp       text,
    company_address   text,
    payment_status    payment_status not null default 'pending',
    total_amount      numeric(10,2) not null,
    sheet_synced      boolean default false,        -- отметка, что заказ записан в Google Таблицу
    created_at        timestamptz default now()
);

create table order_items (
    id                    bigint generated always as identity primary key,
    order_id              bigint references orders(id) on delete cascade,
    product_variation_id  bigint references product_variations(id),
    product_name          text not null,   -- денормализовано на случай изменения товара в будущем
    variant_label          text,            -- например '24×32 см, 60 мкм'
    qty                   int not null,
    price_per_unit        numeric(10,2) not null
);

-- ─────────────────────────────────────────────
-- Индексы для частых запросов
-- ─────────────────────────────────────────────
create index idx_products_category on products(category_id);
create index idx_variations_product on product_variations(product_id);
create index idx_orders_customer on orders(customer_id);
create index idx_order_items_order on order_items(order_id);
