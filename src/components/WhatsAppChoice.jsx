const WA = [
  { name: 'Joaquín', number: '542923692545' },
  { name: 'Francisco', number: '542923694306' },
];

export default function WhatsAppChoice({ message = '', className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {WA.map((w) => (
        <a
          key={w.number}
          href={`https://wa.me/${w.number}${message ? `?text=${encodeURIComponent(message)}` : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center inline-flex items-center justify-center gap-1.5 bg-primary text-lowest text-sm font-semibold rounded-xl py-2.5 hover:brightness-110 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-base">chat</span> {w.name}
        </a>
      ))}
    </div>
  );
}
