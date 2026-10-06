export default function Nosotros() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-20">
        <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">Nuestra historia</p>
        <h1 className="font-display text-4xl md:text-6xl text-ink max-w-3xl leading-tight">
          +6 años de <span className="text-primary">confianza</span> en cada entrega.
        </h1>
        <p className="mt-6 max-w-2xl">
          M&C Automotores nació para darle valor a tu vehículo y entregarte una unidad en perfectas condiciones, con todo resuelto.
        </p>
      </section>

      <section className="border-y border-primary/15 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div><p className="font-display text-5xl text-primary">+130</p><p className="mt-2 text-sm">unidades entregadas</p></div>
          <div><p className="font-display text-5xl text-primary">+6</p><p className="mt-2 text-sm">años en el rubro</p></div>
          <div><p className="font-display text-5xl text-primary">2</p><p className="mt-2 text-sm">socios fundadores</p></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-ink mb-10">Socios fundadores</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card border border-primary/15 rounded-2xl p-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-cardalt border border-primary/15 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-muted text-5xl">person</span>
            </div>
            <div>
              <h3 className="text-ink font-semibold text-lg">Francisco</h3>
              <p className="mt-2 text-sm">Socio.</p>
            </div>
          </div>
          <div className="bg-card border border-primary/15 rounded-2xl p-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-cardalt border border-primary/15 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-muted text-5xl">person</span>
            </div>
            <div>
              <h3 className="text-ink font-semibold text-lg">Joaquín</h3>
              <p className="mt-2 text-sm">Socio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl text-ink mb-10">Pilares inquebrantables</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card border border-primary/15 rounded-2xl p-6">
            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
            <h3 className="mt-4 text-ink font-semibold">Peritaje de 150 puntos</h3>
            <p className="mt-2 text-sm">Inspección técnica integral y reporte transparente antes de cada venta.</p>
          </div>
          <div className="bg-card border border-primary/15 rounded-2xl p-6">
            <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
            <h3 className="mt-4 text-ink font-semibold">Gestoría propia</h3>
            <p className="mt-2 text-sm">Transferencias, patentamiento y documentación resuelta sin intermediarios.</p>
          </div>
          <div className="bg-card border border-primary/15 rounded-2xl p-6">
            <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
            <h3 className="mt-4 text-ink font-semibold">Celeridad en la entrega</h3>
            <p className="mt-2 text-sm">Plazos cumplidos y seguimiento personalizado en cada operación.</p>
          </div>
        </div>
      </section>


    </>
  );
}
