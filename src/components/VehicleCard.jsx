import { useState } from 'react';
import { formatPrice, imgUrl } from '../services/api.js';
import WhatsAppChoice from './WhatsAppChoice.jsx';

export default function VehicleCard({ v, onDetail }) {
  const [contact, setContact] = useState(false);
  return (
    <article className="bg-card border border-primary/15 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300">
      <img src={imgUrl(v.images?.[0])} alt={`${v.brand} ${v.model}`} className="w-full h-52 object-contain bg-lowest" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl text-ink">{v.brand} {v.model}</h3>
          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border ${v.status === 'available' ? 'border-primary/40 text-primary' : 'border-primary/15 text-muted'}`}>
            {v.status === 'available' ? 'Disponible' : v.status === 'reserved' ? 'Reservado' : 'Vendido'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
          <span className="bg-cardalt rounded-lg px-2 py-1 text-center">{v.year}</span>
          <span className="bg-cardalt rounded-lg px-2 py-1 text-center">{Number(v.kilometers).toLocaleString('es-AR')} km</span>
          <span className="bg-cardalt rounded-lg px-2 py-1 text-center">{v.technicalSpecs?.transmision || '-'}</span>
        </div>
        <p className="mt-4 text-2xl text-primary font-semibold">{formatPrice(v.price, v.priceCurrency)}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={() => onDetail(v)} className="flex-1 bg-cardalt border border-primary/40 text-primary text-sm font-semibold rounded-xl py-2.5 hover:bg-primary hover:text-lowest transition-all duration-300">Ver detalle</button>
        </div>
        {contact && <WhatsAppChoice message={`Hola, quiero info del ${v.brand} ${v.model}`} className="mt-2" />}
        <button onClick={() => setContact(!contact)} className="w-full mt-2 bg-primary text-lowest text-sm font-semibold rounded-xl py-2.5 hover:brightness-110 transition-all duration-300">Contactar</button>
      </div>
    </article>
  );
}
