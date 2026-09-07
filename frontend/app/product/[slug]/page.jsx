import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Header from '../../../components/Header';
import BrandStrip from '../../../components/BrandStrip';
import ProductDetail from '../../../components/ProductDetail';
import { getProduct } from '../../../lib/api';

export default async function ProductPage({ params }) {
  let product = null;
  let error = null;
  try {
    product = await getProduct(params.slug);
  } catch (e) {
    error = e.message;
  }

  return (
    <div style={{ background: '#fff', minHeight: '100%' }} className="w-full">
      <BrandStrip />
      <Header />

      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Link href="/catalog" className="flex items-center gap-1.5 text-sm font-bold mb-6 w-fit" style={{ color: 'var(--ink-soft)' }}>
          <ChevronLeft size={16} /> Назад в каталог
        </Link>

        {product ? (
          <ProductDetail product={product} />
        ) : (
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Не удалось загрузить товар «{params.slug}» ({error}). Проверьте, что backend запущен и товар с таким slug существует в Supabase.
          </p>
        )}
      </div>
    </div>
  );
}
