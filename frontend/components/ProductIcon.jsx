export default function ProductIcon({ type = 'bag', tone = 'var(--ink)', branded = false }) {
  const s = { fill: 'none', stroke: tone, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'box') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <path d="M20 40 L60 22 L100 40 L60 58 Z" {...s} />
        <path d="M20 40 V90 L60 108 V58" {...s} />
        <path d="M100 40 V90 L60 108" {...s} />
      </svg>
    );
  }
  if (type === 'vacuum') {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <rect x="24" y="26" width="72" height="82" rx="8" {...s} />
        <path d="M24 52 Q60 42 96 52" {...s} />
        <path d="M24 62 Q60 52 96 62" {...s} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <rect x="20" y="30" width="80" height="78" rx="10" {...s} />
      <line x1="20" y1="46" x2="100" y2="46" stroke={tone} strokeWidth="3" strokeDasharray="5 5" />
      <path d="M45 30 V18 a15 15 0 0 1 30 0 V30" {...s} />
      {branded && <rect x="48" y="68" width="24" height="24" rx="4" fill={tone} opacity="0.18" stroke={tone} />}
    </svg>
  );
}
