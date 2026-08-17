// Чекаут.
// TODO: перенести сюда шаги 1-5 (Оформление → Доставка → Плательщик →
// Оплата → Готово) из cart-checkout-demo.jsx, подключив реальный вызов
// POST /orders (backend/app/routers/orders.py) через lib/api.js.

export default function CheckoutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>
        Оформление заказа — в разработке
      </h1>
    </main>
  );
}
