import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles } from '../services/api.js';
import { formatThousandsLive } from '../utils/format.js';
import VehicleCard from '../components/VehicleCard.jsx';

const fallback = [];

function Section({ id, title, children, open, onToggle }) {
  return (
    <div className="border-b border-primary/15 pb-3">
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onToggle(id)} className="flex w-full items-center justify-between py-3 text-ink text-sm font-semibold">
        {title}
        <span className={`material-symbols-outlined text-primary transition-transform ${open[id] ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {open[id] && <div className="space-y-2 pb-2">{children}</div>}
    </div>
  );
}

function Option({ active, onClick, children }) {
  return (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`block text-sm text-left transition-colors ${active ? 'text-primary' : 'hover:text-ink'}`}>{children}</button>
  );
}

export default function Inicio() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(false);
  const catalogRef = useRef(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ q: '', brand: '', yearFrom: '', yearTo: '', km: '', condition: '', transmision: '', combustible: '', priceCurrency: 'USD', minPrice: '', maxPrice: '' });
  const [sort, setSort] = useState('random');
  const [open, setOpen] = useState({ marca: true, condicion: false, transmision: false, combustible: false, km: false, anio: true, precio: true });
  const [allVehicles, setAllVehicles] = useState([]);

  const load = async (params = {}) => {
    try {
      const data = await getVehicles(params);
      setVehicles(data);
      setError(false);
    } catch {
      setError(true);
      setVehicles(fallback);
    }
  };

  useEffect(() => {
    load();
    getVehicles().then(setAllVehicles).catch(() => setAllVehicles([]));
  }, []);

  const brands = [...new Set(allVehicles.map((v) => v.brand).filter(Boolean))].sort();
  const transmissions = [...new Set(allVehicles.map((v) => v.technicalSpecs?.transmision).filter(Boolean))].sort();
  const combustibles = [...new Set(allVehicles.map((v) => v.technicalSpecs?.combustible).filter(Boolean))].sort();

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sort === 'priceAsc') return a.price - b.price;
    if (sort === 'priceDesc') return b.price - a.price;
    if (sort === 'yearDesc') return b.year - a.year;
    return 0;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.brand) params.brand = filters.brand;
    if (filters.yearFrom) params.yearMin = filters.yearFrom;
    if (filters.yearTo) params.yearMax = filters.yearTo;
    if (filters.km) params.maxKilometers = filters.km;
    if (filters.condition) params.condition = filters.condition;
    if (filters.transmision) params.transmision = filters.transmision;
    if (filters.combustible) params.combustible = filters.combustible;
    if (filters.minPrice) params.minPrice = filters.minPrice.replace(/\./g, '');
    if (filters.maxPrice) params.maxPrice = filters.maxPrice.replace(/\./g, '');
    if (filters.minPrice || filters.maxPrice) params.priceCurrency = filters.priceCurrency;
    load(params);
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clear = () => setFilters({ q: '', brand: '', yearFrom: '', yearTo: '', km: '', condition: '', transmision: '', combustible: '', priceCurrency: 'USD', minPrice: '', maxPrice: '' });
  const set = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });
  const keepScrollY = useRef(0);
  const keepScroll = () => {
    keepScrollY.current = window.scrollY;
    requestAnimationFrame(() => window.scrollTo(0, keepScrollY.current));
  };
  const toggle = (k) => setOpen({ ...open, [k]: !open[k] });

  return (
    <>
      <section className="relative min-h-screen flex items-center bg-cover bg-center border-b border-primary/15" style={{ backgroundImage: "url('/fondo-inicio.jpeg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(16,19,26,0) 0%, rgba(16,19,26,0) 45%, rgba(16,19,26,0.65) 80%, #10131A 100%)' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">Guatraché · Desde 2020</p>
          <h1 className="font-logo text-4xl md:text-6xl text-ink leading-tight max-w-3xl">
            M&C Automotores<span className="text-primary"></span>
          </h1>
          <p className="mt-5 max-w-xl">Venta de vehículos nuevos y usados Exclusivos</p>
        </div>
      </section>

      <section ref={catalogRef} className="max-w-7xl mx-auto px-4 py-16 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar de filtros */}
        <aside className="bg-card border border-primary/15 rounded-3xl p-6 h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain">
          <h2 className="font-display text-2xl text-ink mb-2">Filtros</h2>
          <form onSubmit={handleSearch} className="space-y-1">
            <div className="relative pb-3 border-b border-primary/15">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-[80%] text-muted text-xl">search</span>
              <input type="text" placeholder="Buscá tu próximo vehículo..." value={filters.q} onChange={set('q')} onMouseDown={(e) => { e.preventDefault(); e.currentTarget.focus({ preventScroll: true }); }} className="w-full bg-cardalt rounded-xl pl-10 pr-3 py-3 text-sm text-ink outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <Section open={open} onToggle={toggle} id="marca" title="Marca">
              <Option active={filters.brand === ''} onClick={() => setFilters({ ...filters, brand: '' })}>Todas</Option>
              {brands.map((b) => <Option key={b} active={filters.brand === b} onClick={() => setFilters({ ...filters, brand: b })}>{b}</Option>)}
            </Section>

            <Section open={open} onToggle={toggle} id="condicion" title="Condición">
              <Option active={filters.condition === ''} onClick={() => setFilters({ ...filters, condition: '' })}>Todas</Option>
              <Option active={filters.condition === 'Nuevo'} onClick={() => setFilters({ ...filters, condition: 'Nuevo' })}>Nuevo</Option>
              <Option active={filters.condition === 'Usado'} onClick={() => setFilters({ ...filters, condition: 'Usado' })}>Usado</Option>
            </Section>

            <Section open={open} onToggle={toggle} id="transmision" title="Transmisión">
              <Option active={filters.transmision === ''} onClick={() => setFilters({ ...filters, transmision: '' })}>Todas</Option>
              <Option active={filters.transmision === 'Automática'} onClick={() => setFilters({ ...filters, transmision: 'Automática' })}>Automática</Option>
              <Option active={filters.transmision === 'Manual'} onClick={() => setFilters({ ...filters, transmision: 'Manual' })}>Manual</Option>
            </Section>

            <Section open={open} onToggle={toggle} id="combustible" title="Combustible">
              <Option active={filters.combustible === ''} onClick={() => setFilters({ ...filters, combustible: '' })}>Todos</Option>
              {combustibles.map((c) => <Option key={c} active={filters.combustible === c} onClick={() => setFilters({ ...filters, combustible: c })}>{c}</Option>)}
            </Section>

            <Section open={open} onToggle={toggle} id="km" title="Kilómetros">
              <Option active={filters.km === ''} onClick={() => setFilters({ ...filters, km: '' })}>Todos</Option>
              <Option active={filters.km === '30000'} onClick={() => setFilters({ ...filters, km: '30000' })}>Hasta 30.000 km</Option>
              <Option active={filters.km === '60000'} onClick={() => setFilters({ ...filters, km: '60000' })}>Hasta 60.000 km</Option>
              <Option active={filters.km === '100000'} onClick={() => setFilters({ ...filters, km: '100000' })}>Hasta 100.000 km</Option>
              <Option active={filters.km === '150000'} onClick={() => setFilters({ ...filters, km: '150000' })}>Hasta 150.000 km</Option>
            </Section>

            <Section open={open} onToggle={toggle} id="anio" title="Año">
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Desde" value={filters.yearFrom} onChange={set('yearFrom')} onMouseDown={(e) => { e.preventDefault(); e.currentTarget.focus({ preventScroll: true }); }} className="w-full bg-cardalt rounded-xl px-3 py-2.5 text-sm text-ink outline-none" />
                <span>–</span>
                <input type="number" placeholder="Hasta" value={filters.yearTo} onChange={set('yearTo')} onMouseDown={(e) => { e.preventDefault(); e.currentTarget.focus({ preventScroll: true }); }} className="w-full bg-cardalt rounded-xl px-3 py-2.5 text-sm text-ink outline-none" />
              </div>
            </Section>

            <Section open={open} onToggle={toggle} id="precio" title="Precio">
              <select value={filters.priceCurrency} onChange={set('priceCurrency')} onFocus={keepScroll} className="w-full bg-cardalt rounded-xl px-3 py-2.5 text-sm text-ink outline-none mb-2">
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
              <div className="flex items-center gap-2">
                <input type="text" inputMode="numeric" placeholder="Desde" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: formatThousandsLive(e.target.value) })} onMouseDown={(e) => { e.preventDefault(); e.currentTarget.focus({ preventScroll: true }); }} className="w-full bg-cardalt rounded-xl px-3 py-2.5 text-sm text-ink outline-none" />
                <span>–</span>
                <input type="text" inputMode="numeric" placeholder="Hasta" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: formatThousandsLive(e.target.value) })} onMouseDown={(e) => { e.preventDefault(); e.currentTarget.focus({ preventScroll: true }); }} className="w-full bg-cardalt rounded-xl px-3 py-2.5 text-sm text-ink outline-none" />
              </div>
            </Section>

            <button type="submit" className="w-full mt-4 bg-primary text-lowest font-semibold rounded-xl py-3 hover:brightness-110 transition-all duration-300">Aplicar filtros</button>
            <button type="button" onClick={clear} className="w-full text-xs text-muted hover:text-primary transition-colors">Limpiar filtros</button>
          </form>
        </aside>

        {/* Resultados */}
        <div>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <p className="text-sm">Mostrando {sortedVehicles.length} vehículo(s)</p>
            <label className="text-sm flex items-center gap-2">Ordenar por
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-cardalt border border-primary/15 rounded-xl px-3 py-2 text-sm text-ink outline-none">
                <option value="random">Aleatorio</option>
                <option value="priceAsc">Precio: menor a mayor</option>
                <option value="priceDesc">Precio: mayor a menor</option>
                <option value="yearDesc">Año: más nuevos</option>
              </select>
            </label>
          </div>
          {error && <p className="text-sm text-yellow-500 mb-4">No se pudo conectar con el servidor; mostrando sin datos.</p>}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sortedVehicles.map((v) => <VehicleCard key={v._id} v={v} onDetail={() => navigate(`/vehiculo/${v._id}`)} />)}
          </div>
          {!sortedVehicles.length && !error && <p className="text-center py-16">No hay vehículos que coincidan con los filtros.</p>}
        </div>
      </section>

    </>
  );
}
