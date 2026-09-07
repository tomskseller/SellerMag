import Link from 'next/link';
import Header from '../../components/Header';
import BrandStrip from '../../components/BrandStrip';
import ProductIcon from '../../components/ProductIcon';
import { getCategories, getProducts } from '../../lib/api';
import { getIconType, getBg } from '../../lib/display';

export default async function CatalogPage({ searchParams }) {
  const activeCategorySlug = searchParams?.category || null;

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);

  const filtered = activeCategorySlug
    ? products.filter((p) => p.categories?.slug === activeCategorySlug)
    : products;

  return (
    <div style={{ background: '#fff', minHeight: '100%' }} className="w-full">
      <BrandStrip />
      <Header />

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <aside>
            <div className="text-xs font-extrabold uppercase tracking-wide mb-3" style={{ color: 'var(--ink-soft)' }}>Категории</div>
            <div className="flex flex-col gap-1 mb-6">
              <Link href="/catalog" className={`cat-link ${!activeCategorySlug ? 'active' : ''}`}>Все</Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/catalog?category=${encodeURIComponent(c.slug)}`}
                  className={`cat-link ${activeCategorySlug === c.slug ? 'active' : ''}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </aside>

          <div>
            <div className="text-sm font-medium mb-4" style={{ color: 'var(--ink-soft)' }}>
              {products.length === 0 ? 'Не удалось загрузить товары (проверьте, что backend запущен)' : `Найдено ${filtered.length} товаров`}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => {
                const minPrice = p.product_variations?.length
                  ? Math.min(...p.product_variations.map((v) => v.price))
                  : null;
                return (
                  <Link key={p.id} href={`/product/${p.slug}`} className="card">
                    <div className="w-full aspect-square p-8" style={{ background: getBg(i) }}>
                      <ProductIcon type={getIconType(p.categories?.name)} tone="var(--ink)" branded={getIconType(p.categories?.name) === 'branded'} />
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] font-extrabold mb-1" style={{ color: 'var(--coral-dark)' }}>{p.categories?.name}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
