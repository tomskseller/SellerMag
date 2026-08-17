// Главная страница.
// TODO: перенести сюда утверждённый макет homepage-demo.jsx, заменив
// захардкоженные CATEGORIES/HITS на данные из API (см. lib/api.js —
// getCategories(), getFeaturedProducts()).

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>
        Главная страница — в разработке
      </h1>
      <p className="text-sm mt-2" style={{ color: 'var(--ink-soft)' }}>
        Сюда переносится утверждённый макет homepage-demo.jsx
      </p>
    </main>
  );
}
