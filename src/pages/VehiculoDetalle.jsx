import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getVehicle, formatPrice, imgUrl } from '../services/api.js';
import WhatsAppChoice from '../components/WhatsAppChoice.jsx';

export default function VehiculoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getVehicle(id).then(setV).catch(() => setError(true));
  }, [id]);

  if (error) return <p className="max-w-7xl mx-auto px-4 py-20">Vehículo no encontrado.</p>;
  if (!v) return <p className="max-w-7xl mx-auto px-4 py-20">Cargando...</p>;

  const images = v.images?.length ? v.images : [];
  const step = (dir) => setIndex((index + dir + images.length) % images.length);
  const currentSrc = imgUrl(images[index]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6">
        <span className="material-symbols-outlined text-base">arrow_back</span> Volver al catálogo
      </button>

      <div className="relative">
        <img src={currentSrc} alt={`${v.brand} ${v.model}`} className="w-full h-80 md:h-[28rem] object-contain bg-lowest rounded-2xl" />
        <button onClick={() => setFullscreen(true)} title="Pantalla completa" className="absolute bottom-3 left-3 bg-lowest/70 rounded-full p-2 text-ink hover:text-primary">
          <span className="material-symbols-outlined">fullscreen</span>
        </button>
        {images.length > 1 && (
          <>
            <button onClick={() => step(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-lowest/60 rounded-full p-2 text-ink hover:text-primary"><span className="material-symbols-outlined">chevron_left</span></button>
            <button onClick={() => step(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-lowest/60 rounded-full p-2 text-ink hover:text-primary"><span className="material-symbols-outlined">chevron_right</span></button>
            <p className="absolute bottom-3 right-4 text-xs bg-lowest/60 rounded-full px-3 py-1">{index + 1} / {images.length}</p>
          </>
        )}
      </div>

      <div className="mt-8">
        <h1 className="font-display text-4xl text-ink">{v.brand} {v.model}</h1>
        <p className="mt-2 text-3xl text-primary font-semibold">{formatPrice(v.price, v.priceCurrency)}</p>
        {v.installmentPrice ? (
          <p className="text-xs mt-1">
            Anticipo de {v.downPayment != null ? formatPrice(v.downPayment, v.priceCurrency) : 'a acordar'} · {v.installments || 12} cuotas de {formatPrice(v.installmentPrice, v.priceCurrency)}
          </p>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-xs">
          {[
            { label: 'Año', value: v.year },
            { label: 'Kilómetros', value: Number(v.kilometers).toLocaleString('es-AR') },
            { label: 'Motor', value: v.technicalSpecs?.motor || 's/d' },
            { label: 'Transmisión', value: v.technicalSpecs?.transmision || 's/d' },
            { label: 'Combustible', value: v.technicalSpecs?.combustible || 's/d' },
            { label: 'Condición', value: v.condition || 's/d' },
            { label: 'Tracción', value: v.technicalSpecs?.traccion || 's/d' },
          ].map((s) => (
            <span key={s.label} className="bg-cardalt rounded-lg px-3 py-3 text-center">
              <span className="block text-muted text-[10px] uppercase tracking-widest mb-1">{s.label}</span>
              <span className="block text-ink text-sm">{s.value}</span>
            </span>
          ))}
        </div>

        {v.description && (
          <p className="mt-6 text-sm whitespace-pre-line border-t border-primary/15 pt-4">{v.description}</p>
        )}

        <WhatsAppChoice message={`Hola, quiero info del ${v.brand} ${v.model}`} className="mt-8 max-w-md" />
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
          <button onClick={() => setFullscreen(false)} className="absolute top-4 right-4 bg-lowest/70 rounded-full p-2 text-ink hover:text-primary">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 bg-lowest/70 rounded-full p-3 text-ink hover:text-primary"><span className="material-symbols-outlined text-3xl">chevron_left</span></button>
          )}
          <img src={currentSrc} alt="Pantalla completa" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 bg-lowest/70 rounded-full p-3 text-ink hover:text-primary"><span className="material-symbols-outlined text-3xl">chevron_right</span></button>
          )}
        </div>
      )}
    </section>
  );
}
