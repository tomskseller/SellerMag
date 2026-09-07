'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useCart } from './CartContext';

export default function Header() {
  const { count } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
      <Menu size={20} style={{ color: 'var(--ink)' }} />
      <Link href="/" className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>
        Селлер<span style={{ color: 'var(--mint)' }}>Маг</span>
      </Link>
      <div className="flex-1 max-w-xl relative hidden md:block">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
        <input
          placeholder="Найти пакеты, коробки, плёнку..."
          className="w-full pl-11 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ border: '2px solid var(--line)' }}
        />
      </div>
      <Link href="/checkout" className="relative">
        <ShoppingCart size={21} style={{ color: 'var(--ink)' }} />
        {count > 0 && (
          <span
            className="absolute -top-2 -right-2 text-[10px] font-extrabold text-white rounded-full w-4 h-4 flex items-center justify-center"
            style={{ background: 'var(--coral)' }}
          >
            {count}
          </span>
        )}
      </Link>
    </div>
  );
}
