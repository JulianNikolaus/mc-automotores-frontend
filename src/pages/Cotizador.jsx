import { useState } from 'react';
import WhatsAppChoice from '../components/WhatsAppChoice.jsx';

export default function Cotizador() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-20">
        <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">Cotizá tu vehículo</p>
        <h1 className="font-display text-4xl md:text-6xl text-ink max-w-3xl leading-tight">
          Tasación profesional <span className="text-primary">en el día.</span>
        </h1>
        <p className="mt-6 max-w-2xl">Tres pasos, sin compromiso y con valoración transparente.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: 'photo_camera', title: '1 · Enviá las fotos', text: 'Frontal, trasera, laterales, interior y tablero por WhatsApp.' },
          { icon: 'search', title: '2 · Peritamos', text: 'Revisamos documentación, kilometraje y estado general.' },
          { icon: 'payments', title: '3 · Recibís la oferta', text: 'Valoración en el día, sin letra chica.' },
        ].map((s) => (
          <div key={s.title} className="bg-card border border-primary/15 rounded-2xl p-6">
            <span className="material-symbols-outlined text-primary text-3xl">{s.icon}</span>
            <h3 className="mt-4 text-ink font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm">{s.text}</p>
          </div>
        ))}
      </section>

      <div className="text-center pb-16 flex justify-center">
        <WhatsAppChoice message="Hola, quiero cotizar mi vehículo" className="max-w-md w-full" />
      </div>


    </>
  );
}
