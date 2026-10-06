export default function Ubicacion() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-20">
        <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">Dónde estamos</p>
        <h1 className="font-display text-4xl md:text-6xl text-ink max-w-3xl leading-tight">
          Guatraché, <span className="text-primary">La Pampa.</span>
        </h1>
        <p className="mt-6 max-w-2xl">Showroom y atención directa en Castelli 250, Guatraché.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl overflow-hidden border border-primary/15">
          <iframe
            title="Ubicación M&C Automotores"
            className="w-full h-96 grayscale invert-[0.9] contrast-[0.9]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Castelli+250,+Guatraché,+La+Pampa&output=embed">
          </iframe>
        </div>
        <div>
          <h2 className="font-display text-3xl text-ink">Horarios</h2>
          <ul className="mt-6 divide-y divide-primary/15 border-y border-primary/15 text-sm">
            <li className="flex justify-between py-3"><span>Lunes a Viernes</span><span className="text-ink">9:00 – 19:00</span></li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="bg-primary text-lowest font-semibold rounded-xl px-6 py-3 hover:brightness-110 transition-all duration-300">Abrir en Google Maps</a>
            <a href="https://waze.com" target="_blank" rel="noopener noreferrer" className="border border-primary/40 text-primary rounded-xl px-6 py-3 hover:bg-primary hover:text-lowest transition-all duration-300">Abrir en Waze</a>
          </div>
        </div>
      </section>

    </>
  );
}
