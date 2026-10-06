import { useEffect, useRef, useState } from 'react';
import { getVehicles, getVehicle, login, saveVehicle, deleteVehicle, imgUrl } from '../services/api.js';
import { formatThousandsLive, withoutDots } from '../utils/format.js';

const emptyForm = {
  id: '', brand: '', model: '', year: '', km: '', price: '', status: 'available', condition: 'Usado',
  currency: 'USD', description: '', motor: '', transmision: '', traccion: '', combustible: '',
  installmentPrice: '', installments: '', downPayment: '',
};

// Formatea con puntos de miles: "20000000" -> "20.000.000"
const withDots = formatThousandsLive;

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('mc_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState('inventario'); // 'inventario' | 'resenas'
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [imageOrder, setImageOrder] = useState([]); // {kind:'existing',src} | {kind:'pending',file}

  const loadPending = async () => {
    try {
      const token = localStorage.getItem('mc_token');
      const [pendRes, apprRes] = await Promise.all([
        fetch('/api/v1/reviews/pending', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/v1/reviews'),
      ]);
      const pendData = await pendRes.json();
      const apprData = await apprRes.json();
      setPending(Array.isArray(pendData) ? pendData : []);
      setApproved(Array.isArray(apprData) ? apprData : []);
    } catch { setPending([]); setApproved([]); }
  };

  useEffect(() => { if (token) loadPending(); }, [token]);

  const approveReview = async (id) => {
    if (!confirm('¿Aprobar esta reseña?')) return;
    const token = localStorage.getItem('mc_token');
    await fetch(`/api/v1/reviews/${id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    loadPending();
  };

  const rejectReview = async (id) => {
    if (!confirm('¿No aprobar esta reseña?')) return;
    const token = localStorage.getItem('mc_token');
    await fetch(`/api/v1/reviews/${id}/reject`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    loadPending();
  };

  const deleteReview = async (id) => {
    if (!confirm('¿Eliminar esta reseña publicada?')) return;
    const token = localStorage.getItem('mc_token');
    await fetch(`/api/v1/reviews/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadPending();
  };

  const load = async () => {
    try { setVehicles(await getVehicles()); } catch { setVehicles([]); }
  };

  useEffect(() => { if (token) load(); }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('mc_token', data.token);
      setToken(data.token);
    } catch {
      setLoginError('Credenciales inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mc_token');
    setToken(null);
  };

  const edit = async (id) => {
    const v = await getVehicle(id);
    setForm({
      id: v._id, brand: v.brand, model: v.model, year: v.year, km: v.kilometers ? withDots(String(v.kilometers)) : '', price: v.price ? withDots(String(v.price)) : '',
      status: v.status, condition: v.condition || 'Usado', currency: v.priceCurrency || 'USD', description: v.description || '',
      motor: v.technicalSpecs?.motor || '', transmision: v.technicalSpecs?.transmision || '', traccion: v.technicalSpecs?.traccion || '', combustible: v.technicalSpecs?.combustible || '',
      installmentPrice: v.installmentPrice ? withDots(String(v.installmentPrice)) : '', installments: v.installments || '', downPayment: v.downPayment != null ? withDots(String(v.downPayment)) : '',
    });
    setImageOrder((v.images || []).map((src) => ({ kind: 'existing', src })));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reset = () => { setForm(emptyForm); setImageOrder([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('brand', form.brand); fd.append('model', form.model);
    fd.append('year', form.year); fd.append('kilometers', withoutDots(form.km));
    fd.append('price', withoutDots(form.price)); fd.append('status', form.status); fd.append('condition', form.condition);
    fd.append('priceCurrency', form.currency); fd.append('description', form.description);
    fd.append('technicalSpecs', JSON.stringify({ motor: form.motor, transmision: form.transmision, traccion: form.traccion, combustible: form.combustible }));
    fd.append('installmentPrice', withoutDots(form.installmentPrice)); fd.append('installments', form.installments);
    fd.append('downPayment', withoutDots(form.downPayment));
    fd.append('keepImages', JSON.stringify(imageOrder.filter((i) => i.kind === 'existing').map((i) => i.src)));
    imageOrder.filter((i) => i.kind === 'pending').forEach((i) => fd.append('images', i.file));
    try {
      await saveVehicle(form.id || null, fd);
      reset();
      load();
    } catch { alert('Error al guardar'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vehículo?')) return;
    await deleteVehicle(id);
    load();
  };

  const setF = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const dragIndex = useRef(null);
  const formRef = useRef(null);
  const onDrop = (e, to) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === to) return;
    const next = [...imageOrder];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setImageOrder(next);
  };

  if (!token) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-primary/15 rounded-3xl p-8">
          <h1 className="font-logo text-xl text-ink text-center">M&amp;C <span className="text-primary">Admin</span></h1>
          <p className="text-center text-sm mt-1">Acceso restringido</p>
          <div className="mt-8 space-y-4">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-1 focus:ring-primary" />
            <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-1 focus:ring-primary" />
            <button className="w-full bg-primary text-lowest font-semibold rounded-xl py-3 hover:brightness-110 transition">Ingresar</button>
            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
          </div>
        </form>
      </section>
    );
  }

  return (
    <>
      <header className="sticky top-0 backdrop-blur-md bg-base/70 border-b border-primary/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="font-display text-xl text-ink">Panel <span className="text-primary">Admin</span></h1>
          <button onClick={handleLogout} className="text-sm hover:text-primary transition">Salir</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-10 flex items-center gap-3">
        <button onClick={() => setView('inventario')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'inventario' ? 'bg-primary text-lowest' : 'bg-card text-muted'}`}>Inventario</button>
        <button onClick={() => setView('resenas')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'resenas' ? 'bg-primary text-lowest' : 'bg-card text-muted'}`}>Reseñas</button>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10 grid gap-10 lg:grid-cols-2">
        <form ref={formRef} onSubmit={handleSubmit} className="bg-card border border-primary/15 rounded-3xl p-6 space-y-4 h-fit">
          <h2 className="font-display text-xl text-ink">{form.id ? 'Editar vehículo' : 'Nuevo vehículo'}</h2>
          <input required placeholder="Marca" value={form.brand} onChange={setF('brand')} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
          <input required placeholder="Modelo" value={form.model} onChange={setF('model')} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" placeholder="Año" value={form.year} onChange={setF('year')} className="bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
            <input required type="text" inputMode="numeric" placeholder="Km" value={form.km} onChange={(e) => setForm({ ...form, km: withDots(e.target.value) })} className="bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <div className="flex gap-3">
            <select value={form.currency} onChange={setF('currency')} className="bg-cardalt rounded-xl px-3 py-3 text-sm text-ink outline-none w-32">
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
            <input required type="text" inputMode="numeric" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: withDots(e.target.value) })} className="flex-1 bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <textarea rows="3" placeholder="Descripción / observaciones" value={form.description} onChange={setF('description')} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none"></textarea>
          <select value={form.status} onChange={setF('status')} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none">
            <option value="available">Disponible</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
          </select>
          <select value={form.condition} onChange={setF('condition')} className="w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none">
            <option value="Usado">Usado</option>
            <option value="Nuevo">Nuevo</option>
          </select>
          <div className="grid grid-cols-4 gap-2">
            <input placeholder="Motor" value={form.motor} onChange={setF('motor')} className="bg-cardalt rounded-xl px-3 py-3 text-xs text-ink outline-none" />
            <select value={form.transmision} onChange={setF('transmision')} className="bg-cardalt rounded-xl px-3 py-3 text-xs text-ink outline-none">
              <option value="">Transmisión</option>
              <option>Automática</option>
              <option>Manual</option>
            </select>
            <input placeholder="Tracción" value={form.traccion} onChange={setF('traccion')} className="bg-cardalt rounded-xl px-3 py-3 text-xs text-ink outline-none" />
            <select value={form.combustible} onChange={setF('combustible')} className="bg-cardalt rounded-xl px-3 py-3 text-xs text-ink outline-none">
              <option value="">Combustible</option>
              <option>Nafta</option>
              <option>Gasoil</option>
              <option>GNC</option>
              <option>Electrico</option>
              <option>Hibrido</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="text" inputMode="numeric" placeholder="Valor cuota" value={form.installmentPrice} onChange={(e) => setForm({ ...form, installmentPrice: withDots(e.target.value) })} className="bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
            <input type="number" placeholder="N° cuotas" value={form.installments} onChange={setF('installments')} className="bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
            <input type="text" inputMode="numeric" placeholder="Anticipo" value={form.downPayment} onChange={(e) => setForm({ ...form, downPayment: withDots(e.target.value) })} className="bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none" />
          </div>

          <input type="file" accept="image/*" multiple className="hidden" id="vImages" onChange={(e) => {
            [...e.target.files].forEach((f) => setImageOrder((prev) => [...prev, { kind: 'pending', file: f }]));
            e.target.value = '';
          }} />
          <label htmlFor="vImages" className="inline-flex items-center gap-2 cursor-pointer border border-primary/40 text-primary rounded-xl px-4 py-2 text-sm hover:bg-primary hover:text-lowest transition-all duration-300">
            <span className="material-symbols-outlined text-base">add_photo_alternate</span> Agregar fotos
          </label>

          <div className="flex gap-2 flex-wrap mt-3">
            {imageOrder.length === 0 && <p className="text-xs">Sin fotos cargadas.</p>}
            {imageOrder.map((item, i) => (
              <div key={i} draggable onDragStart={() => (dragIndex.current = i)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, i)}
                className={`relative cursor-move rounded-lg ${item.kind === 'pending' ? 'ring-1 ring-primary' : ''}`}>
                <img src={item.kind === 'existing' ? imgUrl(item.src) : URL.createObjectURL(item.file)} alt="" className="w-20 h-20 object-cover rounded-lg border border-primary/20" />
                <button type="button" onClick={() => setImageOrder(imageOrder.filter((_, idx) => idx !== i))} title="Quitar foto"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lowest border border-red-400/60 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors duration-200">
                  <span className="material-symbols-outlined text-sm leading-none">close</span>
                </button>
              </div>
            ))}
          </div>

          <button className="w-full bg-primary text-lowest font-semibold rounded-xl py-3 hover:brightness-110 transition">Guardar</button>
          {form.id && <button type="button" onClick={reset} className="w-full text-sm hover:text-primary transition">Cancelar edición</button>}
        </form>

        <div>
          {view === 'inventario' ? (
            <>
              <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                <h2 className="font-display text-xl text-ink">Inventario</h2>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl">search</span>
                  <input type="text" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-cardalt rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div className="space-y-3">
                {vehicles.filter((v) => (v.brand + ' ' + v.model).toLowerCase().includes(search.toLowerCase())).map((v) => (
                  <div key={v._id} className="bg-card border border-primary/15 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={imgUrl(v.images?.[0])} alt="" className="w-16 h-16 object-cover rounded-xl border border-primary/15" />
                      <div>
                        <p className="text-ink font-semibold">{v.brand} {v.model} <span className="text-xs text-primary ml-2">{v.status}</span></p>
                        <p className="text-xs">{v.year} · {Number(v.kilometers).toLocaleString('es-AR')} km · {v.priceCurrency === 'ARS' ? '$' : 'USD'} {Number(v.price).toLocaleString('es-AR')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button onClick={() => edit(v._id)} className="px-3 py-1.5 border border-primary/40 text-primary rounded-lg">Editar</button>
                      <button onClick={() => handleDelete(v._id)} className="px-3 py-1.5 border border-red-500/40 text-red-400 rounded-lg">Eliminar</button>
                    </div>
                  </div>
                ))}
                {!vehicles.length && <p className="text-sm">Sin vehículos cargados.</p>}
                {!!vehicles.length && !vehicles.filter((v) => (v.brand + ' ' + v.model).toLowerCase().includes(search.toLowerCase())).length && <p className="text-sm">Sin resultados para "{search}".</p>}
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl text-ink mb-4">Reseñas pendientes</h2>
              <div className="space-y-3">
                {pending.map((r) => (
                  <div key={r._id} className="bg-card border border-primary/15 rounded-2xl p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-ink font-semibold">{r.name} · {'★'.repeat(r.stars)}</p>
                      <p className="text-xs mt-1">{r.text}</p>
                      {r.vehicleModel && <p className="text-xs text-primary mt-1">Vehículo: {r.vehicleModel}</p>}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button onClick={() => approveReview(r._id)} className="px-3 py-1.5 bg-primary text-lowest rounded-lg text-sm font-semibold">Aprobar</button>
                      <button onClick={() => rejectReview(r._id)} className="px-3 py-1.5 border border-red-500/40 text-red-400 rounded-lg text-sm font-semibold">No aprobar</button>
                    </div>
                  </div>
                ))}
                {!pending.length && <p className="text-sm">No hay reseñas pendientes de aprobación.</p>}
              </div>

              <h2 className="font-display text-xl text-ink mt-8 mb-4">Reseñas publicadas</h2>
              <div className="space-y-3">
                {approved.map((r) => (
                  <div key={r._id} className="bg-card border border-primary/15 rounded-2xl p-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-ink font-semibold">{r.name} · {'★'.repeat(r.stars)}</p>
                      <p className="text-xs mt-1">{r.text}</p>
                      {r.vehicleModel && <p className="text-xs text-primary mt-1">Vehículo: {r.vehicleModel}</p>}
                    </div>
                    <button onClick={() => deleteReview(r._id)} title="Eliminar reseña" className="p-2 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
                {!approved.length && <p className="text-sm">No hay reseñas publicadas.</p>}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
