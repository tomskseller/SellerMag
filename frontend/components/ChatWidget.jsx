'use client';

import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="rounded-2xl p-4 flex flex-col gap-2 w-64"
          style={{ background: '#fff', border: '1.5px solid var(--line)', boxShadow: '0 12px 32px rgba(27,31,34,.16)' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-extrabold" style={{ color: 'var(--ink)' }}>Написать менеджеру</span>
            <button onClick={() => setOpen(false)}><X size={16} style={{ color: 'var(--ink-soft)' }} /></button>
          </div>
          {/* TODO: заменить href на реальные ссылки на Telegram-бот и MAX после их регистрации */}
          <a href="#" className="chat-option">
            <Send size={17} style={{ color: '#229ED9' }} /> Написать в Telegram
          </a>
          <a href="#" className="chat-option">
            <MessageCircle size={17} style={{ color: 'var(--mint-dark)' }} /> Написать в MAX
          </a>
          <span className="text-[11px] mt-1" style={{ color: 'var(--ink-soft)' }}>Отвечает живой менеджер, обычно в течение 15 минут</span>
        </div>
      )}
      <button className="fab" onClick={() => setOpen((v) => !v)}>
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
      </button>
    </div>
  );
}
