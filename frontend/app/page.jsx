import Link from 'next/link';
import { Truck, FileCheck2, Warehouse, PackageCheck, Phone, Mail, MapPin, Download, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import BrandStrip from '../components/BrandStrip';
import ProductIcon from '../components/ProductIcon';
import { getCategories, getProducts } from '../lib/api';
import { getIconType, getBg } from '../lib/display';

const USP = [
  { icon: PackageCheck, title: 'Опт от 100 шт', text: 'Чем больше объём — тем ниже цена за штуку' },
  { icon: Warehouse, title: 'Отгрузка день в день', text: 'Самовывоз со склада или курьер по городу' },
  { icon: FileCheck2, title: 'Работаем с юрлицами', text: 'Счёт и УПД формируются автоматически по ИНН' },
  { icon: Truck, title: 'Доставка по всей РФ', text: 'СДЭК, Почта России, Деловые Линии' },
];

export default async function HomePage() {
  // Реальные данные из Supabase через backend. Если backend не запущен —
  // страница покажет пустые блоки категорий/товаров, но не упадёт.
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);
  const hits = products.slice(0, 4);

  return (
    <div style={{ background: '#fff', minHeight: '100%' }} className="w-full">
      <BrandStrip />
      <Header />

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center" style={{ background: 'var(--mint)' }}>
          <div className="px-8 md:px-12 py-14 md:py-16">
            <div className="text-sm font-extrabold text-white mb-3 uppercase tracking-wide">Оптом и в розницу</div>
            <div className="font-display font-black text-white leading-[0.95] mb-4 text-4xl md:text-[56px]">
              ДО <span style={{ color: 'var(--ink)' }}>−25%</span><br />НА ОПТ
            </div>
            <p className="text-white text-sm mb-8 max-w-xs" style={{ opacity: 0.92 }}>
              Курьерские пакеты, zip-пакеты, коробки и вакуумная упаковка — отгрузка со склада в Томске
            </p>
            <Link href="/catalog" className="btn btn-ink">
              Смотреть каталог <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative h-full flex items-center justify-center py-10 pr-10">
            <div className="absolute w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,.18)', top: 10, right: 40 }} />
            <div className="absolute w-40 h-40 rounded-full" style={{ background: 'var(--coral)', bottom: 0, left: 20 }} />
            <div className="relative w-56 h-56 rounded-3xl p-10" style={{ background: '#fff' }}>
              <ProductIcon type="bag" tone="var(--ink)" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories — реальные из Supabase */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-black mb-6" style={{ color: 'var(--ink)' }}>Категории</h2>
        {categories.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Не удалось загрузить категории — проверьте, что backend запущен на localhost:8000.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/catalog?category=${encodeURIComponent(c.slug)}`}
                className="rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1"
                style={{ background: getBg(i), border: '1.5px solid var(--line)' }}
              >
                <div className="w-12 h-12 mb-3">
                  <ProductIcon type={getIconType(c.name)} tone="var(--ink)" branded={getIconType(c.name) === 'branded'} />
                </div>
                <div className="text-xs font-extrabold leading-snug" style={{ color: 'var(--ink)' }}>{c.name}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* USP */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {USP.map((u) => (
            <div key={u.title} className="rounded-2xl p-5" style={{ border: '1.5px solid var(--line)' }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ background: 'var(--ink)' }}>
                <u.icon size={19} color="#fff" />
              </div>
              <div className="text-sm font-extrabold mb-1" style={{ color: 'var(--ink)' }}>{u.title}</div>
              <div className="text-xs leading-snug" style={{ color: 'var(--ink-soft)' }}>{u.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hits — реальные товары */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>Популярные товары</h2>
          <Link href="/catalog" className="text-sm font-extrabold flex items-center gap-1" style={{ color: 'var(--mint-dark)' }}>
            Весь каталог <ArrowRight size={14} />
          </Link>
        </div>
        {hits.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Товары пока не загружены — проверьте, что backend запущен и в Supabase есть данные.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hits.map((p, i) => {
              const minPrice = p.product_variations?.length
                ? Math.min(...p.product_variations.map((v) => v.price))
                : null;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} className="card">
                  <div className="w-full aspect-square p-8" style={{ background: getBg(i) }}>
                    <ProductIcon type={getIconType(p.categories?.name)} tone="var(--ink)" branded={getIconType(p.categories?.name) === 'branded'} />
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold mb-2 leading-snug" style={{ color: 'var(--ink)' }}>{p.name}</div>
                    <div className="text-lg font-black font-display" style={{ color: 'var(--ink)' }}>
                      {minPrice != null ? (
                        <>от {minPrice} ₽<span className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}> / шт</span></>
                      ) : (
                        <span className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>нет вариаций</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Wholesale + price list banner */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'var(--ink)' }}>
          <div>
            <div className="font-display text-2xl font-black text-white mb-2">Чем больше объём — тем ниже цена</div>
            <div className="text-sm" style={{ color: '#9BA2A9' }}>Оптовая сетка есть у каждого товара — пересчитывается автоматически при выборе количества</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="btn btn-white"><Download size={15} /> Прайс-лист</a>
            <Link href="/catalog" className="btn btn-coral">Оптовые цены</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1.5px solid var(--line)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-display text-lg font-black" style={{ color: 'var(--ink)' }}>
              Селлер<span style={{ color: 'var(--mint)' }}>Маг</span>
            </span>
            <p className="text-xs mt-2" style={{ color: 'var(--ink-soft)' }}>Упаковочные материалы оптом и в розницу</p>
          </div>
          <div className="text-sm flex flex-col gap-2" style={{ color: 'var(--ink-soft)' }}>
            <div className="flex items-center gap-2"><Phone size={14} /> +7 (___) ___-__-__</div>
            <div className="flex items-center gap-2"><Mail size={14} /> info@example.ru</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> г. Томск, склад (адрес уточняется)</div>
          </div>
          <div className="text-sm flex flex-col gap-2" style={{ color: 'var(--ink-soft)' }}>
            <Link href="/catalog">Каталог</Link>
            <span>Доставка и оплата</span>
            <span>Для юрлиц</span>
            <a href="#" className="font-bold flex items-center gap-1.5" style={{ color: 'var(--ink)' }}><Download size={13} /> Прайс-лист (Excel)</a>
          </div>
          <div className="text-sm flex flex-col gap-2" style={{ color: 'var(--ink-soft)' }}>
            <span>Публичная оферта</span>
            <span>Политика конфиденциальности</span>
            <span>Реквизиты</span>
          </div>
        </div>
      </div>
    </div>
  );
}
