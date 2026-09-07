import './globals.css';
import { CartProvider } from '../components/CartContext';
import ChatWidget from '../components/ChatWidget';

export const metadata = {
  title: 'СеллерМаг — упаковочные материалы оптом и в розницу',
  description: 'Курьерские пакеты, zip-пакеты, коробки, вакуумная упаковка. Опт и розница со склада в Томске.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
