import './globals.css';

export const metadata = {
  title: 'СеллерМаг — упаковочные материалы оптом и в розницу',
  description: 'Курьерские пакеты, zip-пакеты, коробки, вакуумная упаковка. Опт и розница со склада в Томске.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
