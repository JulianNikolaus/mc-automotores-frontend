import { useEffect, useState } from 'react';
import { getVehicles } from '../services/api.js';
import { imgUrl } from '../services/api.js';

export default function Testimonios() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [preview, setPreview] = useState(null);
  const [ok, setOk] = useState(false);
  const [model, setModel] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    fetch('/api/v1/reviews')
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : '—';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('stars', rating);
    fd.append('text', text);
    fd.append('vehicleModel', model);
    if (photo) fd.append('photo', photo);
    await fetch('/api/v1/reviews', { method: 'POST', body: fd });
    setOk(true);
    e.target.reset();
    setRating(5);
    setPreview(null);
    setPhoto(null);
    setName('');
    setText('');
    setModel('');
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 py-20">
        <p className="text-primary uppercase tracking-[0.3em] text-xs mb-4">Experiencia de clientes</p>
        <h1 className="font-display text-4xl md:text-6xl text-ink max-w-3xl leading-tight">
          {avg}/5 <span className="text-primary">Valoración</span> de nuestros clientes.
        </h1>
        <p className="mt-6 max-w-2xl">Entregas verificadas, peritajes cumplidos y gestoría transparente.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <article key={r._id} className="bg-card border border-primary/15 rounded-2xl p-6">
            <p className="text-primary tracking-widest">{'★'.repeat(r.stars)}</p>
            {r.photo && (
              <img src={imgUrl(r.photo)} alt={`Foto de ${r.name}`} className="mt-4 rounded-xl w-full h-40 object-cover" />
            )}
            <p className="mt-4 text-sm">{r.text}</p>
            <p className="mt-4 text-primary text-sm">— {r.name}{r.vehicleModel ? ` · ${r.vehicleModel}` : ''}</p>
          </article>
        ))}
        {!reviews.length && <p className="text-sm col-span-3">Todavía no hay reseñas publicadas.</p>}
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="font-display text-3xl text-ink mb-8">Dejá tu reseña</h2>
        <form onSubmit={handleSubmit} className="bg-card border border-primary/15 rounded-3xl p-8 space-y-5">
          <div>
            <label className="text-sm text-ink">Nombre</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm text-ink">Modelo de vehículo adquirido (opcional)</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ej: Volkswagen Amarok" className="mt-2 w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="text-sm text-ink">Calificación</label>
            <div className="mt-2 flex gap-1 text-3xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className={n <= rating ? 'text-primary' : 'text-hover'}>★</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-ink">Tu experiencia</label>
            <textarea rows="4" required value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full bg-cardalt rounded-xl px-4 py-3 text-sm text-ink outline-none focus:ring-1 focus:ring-primary"></textarea>
          </div>
          <div>
            <label className="text-sm text-ink block mb-2">Fotografía de la unidad (opcional)</label>
            <input type="file" accept="image/*" className="hidden" id="tPhoto" onChange={(e) => { const f = e.target.files[0]; setPreview(f ? URL.createObjectURL(f) : null); setPhoto(f || null); }} />
            <label htmlFor="tPhoto" className="inline-flex items-center gap-2 cursor-pointer border border-primary/40 text-primary rounded-xl px-4 py-2 text-sm hover:bg-primary hover:text-lowest transition-all duration-300">
              <span className="material-symbols-outlined text-base">add_photo_alternate</span> Agregar foto
            </label>
            {preview && <img src={preview} alt="Vista previa" className="mt-4 rounded-xl max-h-48 border border-primary/15" />}
          </div>
          <button className="w-full bg-primary text-lowest font-semibold rounded-xl py-3 hover:brightness-110 transition-all duration-300">Publicar reseña</button>
          {ok && <p className="text-primary text-sm text-center">¡Gracias! Tu reseña fue enviada y será visible una vez aprobada.</p>}
        </form>
      </section>
    </>
  );
}
