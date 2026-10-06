import { useState } from 'react';
import { formatPrice, imgUrl } from '../services/api.js';
import WhatsAppChoice from './WhatsAppChoice.jsx';

export default function VehicleModal({ v, onClose }) {
  const images = v.images?.length ? v.images : [];
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const step = (dir) => setIndex((index + dir + images.length) % images.length);
  const currentSrc = imgUrl(images[index]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-lowest/90 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-card border border-primary/40 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-lowest/70 backdrop-blur-sm text-muted hover:text-primary rounded-full p-1 transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <div className="relative">
            <img src={currentSrc} alt={`${v.brand} ${v.model}`} className="w-full h-96 object-contain bg-lowest rounded-2xl" />
            <button onClick={() => setFullscreen(true)} title="Pantalla completa" className="absolute bottom-3 left-3 bg-lowest/70 rounded-full p-2 text-ink hover:text-primary">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
            {images.length > 1 && (
              <>
                <button onClick={() => step(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-lowest/60 rounded-full p-2 text-ink hover:text-primary">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={() => step(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-lowest/60 rounded-full p-2 text-ink hover:text-primary">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <p className="absolute bottom-3 right-4 text-xs bg-lowest/60 rounded-full px-3 py-1">{index + 1} / {images.length}</p>
              </>
            )}
          </div>

          <h3 className="mt-6 font-display text-3xl text-ink">{v.brand} {v.model}</h3>
          <p className="mt-2 text-2xl text-primary font-semibold">{formatPrice(v.price, v.priceCurrency)}</p>
          {v.installmentPrice ? (
            <p className="text-xs mt-1">
              Anticipo de {v.downPayment != null ? formatPrice(v.downPayment, v.priceCurrency) : 'a acordar'} · {v.installments || 12} cuotas de {formatPrice(v.installmentPrice, v.priceCurrency)}
            </p>
          ) : null}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-xs">
            <span className="bg-cardalt rounded-lg px-3 py-2 text-center">Año {v.year}</span>
            <span className="bg-cardalt rounded-lg px-3 py-2 text-center">{Number(v.kilometers).toLocaleString('es-AR')} km</span>
            <span className="bg-cardalt rounded-lg px-3 py-2 text-center">{v.technicalSpecs?.motor || 'Motor s/d'}</span>
            <span className="bg-cardalt rounded-lg px-3 py-2 text-center">{v.technicalSpecs?.transmision || 'Transm. s/d'}</span>
          </div>

          {v.description && (
            <p className="mt-6 text-sm whitespace-pre-line border-t border-primary/15 pt-4">{v.description}</p>
          )}

          <WhatsAppChoice message={`Hola, quiero info del ${v.brand} ${v.model}`} className="mt-8" />
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
          <button onClick={() => setFullscreen(false)} className="absolute top-4 right-4 bg-lowest/70 rounded-full p-2 text-ink hover:text-primary">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 bg-lowest/70 rounded-full p-3 text-ink hover:text-primary">
              <span className="material-symbols-outlined text-3xl">chevron_left</span>
            </button>
          )}
          <img src={currentSrc} alt="Pantalla completa" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 bg-lowest/70 rounded-full p-3 text-ink hover:text-primary">
              <span className="material-symbols-outlined text-3xl">chevron_right</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
