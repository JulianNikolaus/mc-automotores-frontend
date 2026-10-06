import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/ubicacion', label: 'Ubicación' },
  { to: '/testimonios', label: 'Testimonios' },
  { to: '/cotizador', label: 'Cotizá' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-base/70 border-b border-primary/15">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="font-logo text-xl text-ink">
          M&amp;C <span className="text-primary">Automotores</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => `hover:text-primary transition-colors duration-300 ${isActive ? 'text-primary' : ''}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="hidden md:block relative">
          <button onClick={() => setContact(!contact)} className="inline-flex items-center gap-1.5 border border-primary/40 text-primary rounded-full px-4 py-2 text-sm hover:bg-primary hover:text-lowest transition-all duration-300">
            <span className="material-symbols-outlined text-base">chat</span> Contacto
          </button>
          {contact && (
            <div className="absolute right-0 mt-2 bg-card border border-primary/15 rounded-2xl p-2 flex flex-col gap-1 w-40">
              <a href="https://wa.me/542923692545" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm rounded-xl hover:bg-cardalt hover:text-primary transition-colors">Joaquín</a>
              <a href="https://wa.me/542923694306" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm rounded-xl hover:bg-cardalt hover:text-primary transition-colors">Francisco</a>
            </div>
          )}
        </div>
        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Menú">
          <span className="material-symbols-outlined text-3xl">{open ? 'close' : 'menu'}</span>
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-primary/15 bg-base/95 backdrop-blur-md">
          <ul className="flex flex-col px-4 py-4 gap-4 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={() => setOpen(false)} className="block hover:text-primary transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
