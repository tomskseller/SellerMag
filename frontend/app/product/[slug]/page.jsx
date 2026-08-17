// Карточка товара.
// TODO: перенести сюда вид "product" из catalog-product-demo.jsx,
// подключив данные конкретного товара через lib/api.js — getProduct(slug).

export default function ProductPage({ params }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>
        Товар «{params.slug}» — в разработке
      </h1>
    </main>
  );
}
