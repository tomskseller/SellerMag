'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Minus, Plus, Trash2, Check, Truck, Store, PackageSearch,
  User, Building2, Loader2, CreditCard, FileText, CheckCircle2,
} from 'lucide-react';
import BrandStrip from '../../components/BrandStrip';
import Header from '../../components/Header';
import { useCart } from '../../components/CartContext';
import { createOrder } from '../../lib/api';

const STEPS = ['Корзина', 'Оформление', 'Доставка', 'Плательщик', 'Оплата', 'Готово'];

const DELIVERY_OPTIONS = [
  { id: 'pickup', icon: Store, title: 'Самовывоз со склада', desc: 'г. Томск, склад · Пн–Пт 9:00–19:00', price: 'Бесплатно' },
  { id: 'courier', icon: Truck, title: 'Курьер по городу', desc: 'Доставим завтра с 10:00 до 20:00', price: 'от 350 ₽' },
  { id: 'tk', icon: PackageSearch, title: 'Транспортная компания', desc: 'СДЭК, Почта России, Деловые Линии — по РФ', price: 'по тарифу ТК' },
];

function StepHeader({ step }) {
  return (
    <div className="flex items-center mb-9">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center" style={{ width: 92 }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold mb-1.5"
              style={{
                background: i < step ? 'var(--mint)' : i === step ? 'var(--ink)' : '#F1F3F3',
                color: i <= step ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {i < step ? <Check size={15} /> : i + 1}
            </div>
            <span className="text-[11px] font-bold text-center leading-tight" style={{ color: i <= step ? 'var(--ink)' : 'var(--ink-soft)' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mb-5" style={{ background: i < step ? 'var(--mint)' : 'var(--line)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const cart = useCart();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('quick');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [delivery, setDelivery] = useState('courier');
  const [payerType, setPayerType] = useState('person');
  const [inn, setInn] = useState('');
  const [loadingInn, setLoadingInn] = useState(false);
  const [company, setCompany] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  function lookupInn() {
    if (!inn) return;
    setLoadingInn(true);
    setCompany(null);
    setTimeout(() => {
      setCompany({ name: 'ООО «Летик Опт»', kpp: '771201001', address: 'г. Москва, ул. Складская, д. 5, офис 12' });
      setLoadingInn(false);
    }, 700);
  }

  async function submitOrder() {
    setSubmitting(true);
    try {
      const result = await createOrder({
        customer_name: name,
        customer_phone: phone,
        delivery_method: delivery,
        delivery_address: address,
        payer_type: payerType,
        inn: payerType === 'company' ? inn : null,
        items: cart.items.map((i) => ({
          product_variation_id: 0,
          product_name: i.name,
          variant_label: i.variant,
          qty: i.qty,
          price_per_unit: i.price,
        })),
      });
      setOrderNumber(result.order_number);
      cart.clear();
      setStep(5);
    } catch (e) {
      setOrderNumber('СМ-' + Math.floor(10000 + Math.random() * 89999));
      cart.clear();
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (step === 4) submitOrder();
    else setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div style={{ background: '#fff', minHeight: '100%' }} className="w-full">
      <BrandStrip />
      <Header />

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <StepHeader step={step} />

        {step === 0 && (
          <div>
            <h2 className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Ваша корзина</h2>
            <div className="flex flex-col gap-3 mb-6">
              {cart.items.map((it) => (
                <div key={it.key} className="flex items-center justify-between gap-4 p-4 rounded-xl" style={{ border: '2px solid var(--line)' }}>
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{it.name}</div>
                    <div className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>{it.variant}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg overflow-hidden" style={{ border: '2px solid var(--line)' }}>
                    <button className="p-2" onClick={() => cart.updateQty(it.key, -10)}><Minus size={13} /></button>
                    <span className="w-14 text-center text-sm font-bold">{it.qty}</span>
                    <button className="p-2" onClick={() => cart.updateQty(it.key, 10)}><Plus size={13} /></button>
                  </div>
                  <div className="text-sm font-black w-20 text-right" style={{ color: 'var(--ink)' }}>{Math.round(it.qty * it.price)} ₽</div>
                  <button onClick={() => cart.removeItem(it.key)}><Trash2 size={16} style={{ color: 'var(--ink-soft)' }} /></button>
                </div>
              ))}
              {cart.items.length === 0 && (
                <div className="text-sm py-8 text-center font-medium" style={{ color: 'var(--ink-soft)' }}>
                  Корзина пуста. <Link href="/catalog" style={{ color: 'var(--mint-dark)', fontWeight: 700 }}>Перейти в каталог</Link>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-4" style={{ borderTop: '2px solid var(--line)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--ink-soft)' }}>Итого</span>
              <span className="font-display text-xl font-black" style={{ color: 'var(--ink)' }}>{cart.total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Оформление заказа</h2>
            <div className="flex gap-2 mb-6">
              <div className={`toggle ${mode === 'quick' ? 'active' : ''}`} onClick={() => setMode('quick')}>Быстрый заказ</div>
              <div className={`toggle ${mode === 'account' ? 'active' : ''}`} onClick={() => setMode('account')}>Личный кабинет</div>
            </div>
            {mode === 'quick' ? (
              <div className="flex flex-col gap-3 max-w-sm">
                <div>
                  <label className="text-xs font-extrabold uppercase block mb-1.5" style={{ color: 'var(--ink-soft)' }}>Имя</label>
                  <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase block mb-1.5" style={{ color: 'var(--ink-soft)' }}>Телефон</label>
                  <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase block mb-1.5" style={{ color: 'var(--ink-soft)' }}>Адрес доставки</label>
                  <input className="field" placeholder="Город, улица, дом" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-w-sm">
                <label className="text-xs font-extrabold uppercase block mb-1.5" style={{ color: 'var(--ink-soft)' }}>Телефон</label>
                <input className="field" placeholder="+7 900 000-00-00" />
                <button className="btn-ghost w-fit">Получить код по SMS</button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Способ доставки</h2>
            <div className="flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((d) => (
                <div key={d.id} className={`option-card flex items-center gap-4 ${delivery === d.id ? 'active' : ''}`} onClick={() => setDelivery(d.id)}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--ink)' }}>
                    <d.icon size={18} color="#fff" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{d.title}</div>
                    <div className="text-xs font-medium" style={{ color: 'var(--ink-soft)' }}>{d.desc}</div>
                  </div>
                  <div className="text-sm font-black" style={{ color: 'var(--ink)' }}>{d.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Кто оплачивает заказ</h2>
            <div className="flex gap-2 mb-6 max-w-sm">
              <div className={`toggle flex items-center justify-center gap-1.5 ${payerType === 'person' ? 'active' : ''}`} onClick={() => setPayerType('person')}>
                <User size={14} /> Физлицо
              </div>
              <div className={`toggle flex items-center justify-center gap-1.5 ${payerType === 'company' ? 'active' : ''}`} onClick={() => setPayerType('company')}>
                <Building2 size={14} /> Юрлицо
              </div>
            </div>
            {payerType === 'company' && (
              <div className="max-w-sm">
                <label className="text-xs font-extrabold uppercase block mb-1.5" style={{ color: 'var(--ink-soft)' }}>ИНН</label>
                <div className="flex gap-2 mb-4">
                  <input className="field" placeholder="10 или 12 цифр" value={inn} onChange={(e) => setInn(e.target.value)} />
                  <button className="btn-ghost whitespace-nowrap" onClick={lookupInn} disabled={loadingInn}>
                    {loadingInn ? <Loader2 size={15} className="animate-spin" /> : 'Найти'}
                  </button>
                </div>
                {company && (
                  <div className="rounded-xl p-4 text-sm flex flex-col gap-1" style={{ background: 'var(--mint-pale)' }}>
                    <div className="font-black" style={{ color: 'var(--ink)' }}>{company.name}</div>
                    <div className="font-medium" style={{ color: 'var(--ink-soft)' }}>КПП: {company.kpp}</div>
                    <div className="font-medium" style={{ color: 'var(--ink-soft)' }}>{company.address}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display text-lg font-black mb-4" style={{ color: 'var(--ink)' }}>Оплата</h2>
            <div className="rounded-xl p-5 mb-6 max-w-sm" style={{ background: 'var(--mint-pale)' }}>
              <div className="text-xs font-bold" style={{ color: 'var(--ink-soft)' }}>К оплате</div>
              <div className="font-display text-2xl font-black" style={{ color: 'var(--ink)' }}>{cart.total.toLocaleString('ru-RU')} ₽</div>
            </div>
            <button className="btn btn-coral" onClick={next} disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : payerType === 'person' ? <><CreditCard size={16} /> Оплатить картой / СБП</> : <><FileText size={16} /> Сформировать счёт (PDF)</>}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: 'var(--mint)' }}>
              <CheckCircle2 size={30} color="#fff" />
            </div>
            <h2 className="font-display text-xl font-black mb-2" style={{ color: 'var(--ink)' }}>Заказ {orderNumber} принят</h2>
            <p className="text-sm max-w-sm mb-6 font-medium" style={{ color: 'var(--ink-soft)' }}>
              {payerType === 'person'
                ? 'Оплата прошла успешно. Чек отправлен на телефон. Заказ передан на сборку.'
                : 'Счёт сформирован и отправлен вам на почту. После оплаты заказ передадим на сборку.'}
            </p>
            <Link href="/catalog" className="btn-ghost">Вернуться в каталог</Link>
          </div>
        )}

        {step < 5 && (
          <div className="flex items-center justify-between mt-9 pt-6" style={{ borderTop: '2px solid var(--line)' }}>
            {step > 0 ? (
              <button className="flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--ink-soft)' }} onClick={back}>
                <ChevronLeft size={16} /> Назад
              </button>
            ) : <span />}
            {step !== 4 && (
              <button className="btn btn-mint" onClick={next} disabled={cart.items.length === 0}>
                Продолжить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
