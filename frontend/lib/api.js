const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getCategories() {
  const res = await fetch(new URL('/categories', API_URL), { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить категории');
  return res.json();
}

export async function getProducts() {
  const res = await fetch(new URL('/products', API_URL), { cache: 'no-store' });
  if (!res.ok) throw new Error('Не удалось загрузить товары');
  return res.json();
}

export async function getProduct(slug) {
  const res = await fetch(new URL(`/products/${slug}`, API_URL), { cache: 'no-store' });
  if (!res.ok) throw new Error('Товар не найден');
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(new URL('/orders', API_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Не удалось оформить заказ');
  return res.json();
}
