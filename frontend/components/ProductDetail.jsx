'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Check, Package } from 'lucide-react';
import ProductIcon from './ProductIcon';
import { useCart } from './CartContext';
import { getIconType, getBg } from '../lib/display';

export default function ProductDetail({ product }) {
  const cart = useCart();
  const variations = product.product_variations || [];
  const [selectedId, setSelectedId] = useState(variations[0]?.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = variations.find((v) => v.id === selectedId) || variations[0];

  // Оптовая сетка: сама вариация (от 1 шт) + пороги из wholesale_tiers
  const tiers = useMemo(() => {
    if (!selected) return [];
    const base = { min_qty: 1, price_per_unit: selected.price, label: 'от 1 шт' };
    const extra = (selected.wholesale_tiers || [])
      .slice()
      .sort((a, b) => a.min_qty - b.min_qty)
      .map((t) => ({ ...t, label: `от ${t.min_qty} шт` }));
    return [base, ...extra];
  }, [selected]);

  const currentTier = useMemo(() => {
    let match = tiers[0];
    for (const t of tiers) if (qty >= t.min_qty) match = t;
    return match;
  }, [tiers, qty]);

  if (!selected) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-center">У этого товара пока нет ни одной вариации (размер/плотность) в базе.</div>;
  }

  const icon = getIconType(product.categories?.name);
  const bg = getBg(product.id);
  const total = Math.round(currentTier.price_per_unit * qty * 10) / 10;

  function addToCart() {
    cart.addItem({
      key: `${product.slug}-${selected.id}`,
      name: product.name,
      variant: `${selected.size || ''} см, ${selected.density_mkm || '—'} мкм`,
      qty,
      price: currentTier.price_per_unit,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <div className="w-full aspect-square rounded-2xl p-14 mb-3" style={{ background: bg }}>
          <ProductIcon type={icon} tone="var(--ink)" branded={icon === 'branded'} />
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold mb-2" style={{ color: 'var(--coral-dark)' }}>{product.categories?.name}</div>
        <h1 className="font-display text-2xl font-black mb-4" style={{ color: 'var(--ink)' }}>{product.name}</h1>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-3xl font-black" style={{ color: 'var(--ink)' }}>{currentTier.price_per_unit} ₽</span>
          <span className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>/ шт, {currentTier.label}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-5">
          <span className="w-2 h-2 rounded-full" style={{ background: selected.stock > 100 ? 'var(--mint)' : 'var(--coral)' }} />
          <span className="text-xs font-bold" style={{ color: 'var(--ink-soft)' }}>На складе: {selected.stock} шт</span>
        </div>

        <div className="text-xs font-extrabold uppercase tracking-wide mb-2" style={{ color: 'var(--ink-soft)' }}>Вариант (размер, плотность)</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {variations.map((v) => (
            <button
              key={v.id}
              className={`chip ${v.id === selectedId ? 'active' : ''}`}
              onClick={() => setSelectedId(v.id)}
            >
              {v.size} см, {v.density_mkm} мкм
            </button>
          ))}
        </div>

        {tiers.length > 1 && (
          <>
            <div className="text-xs font-extrabold uppercase tracking-wide mb-2" style={{ color: 'var(--ink-soft)' }}>Оптовые цены</div>
            <div className="flex flex-col gap-1.5 mb-6">
              {tiers.map((t) => (
                <div key={t.min_qty} className={`tier-row flex items-center justify-between px-3 py-2 text-sm ${t.min_qty === currentTier.min_qty ? 'active' : ''}`}>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>{t.label}</span>
                  <span className="font-bold" style={{ color: 'var(--ink)' }}>{t.price_per_unit} ₽/шт</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-xs font-extrabold uppercase tracking-wide mb-2" style={{ color: 'var(--ink-soft)' }}>Количество</div>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '2px solid var(--line)' }}>
            <button className="px-3 py-3 font-bold" onClick={() => setQty((q) => Math.max(1, q - 10))}>−</button>
            <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-20 text-center py-2.5 outline-none font-bold" />
            <button className="px-3 py-3 font-bold" onClick={() => setQty((q) => q + 10)}>+</button>
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>Итого</div>
            <div className="font-display text-xl font-black" style={{ color: 'var(--ink)' }}>{total.toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>

        <button className="btn w-full" style={{ background: added ? 'var(--mint)' : 'var(--coral)', color: '#fff' }} onClick={addToCart}>
          {added ? <><Check size={17} /> Добавлено в корзину</> : <><Package size={17} /> В корзину</>}
        </button>
      </div>
    </div>
  );
}
