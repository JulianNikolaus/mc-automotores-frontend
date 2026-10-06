import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-lowest border-t border-primary/15 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <p className="font-logo text-lg text-ink">M&amp;C <span className="text-primary">Automotores</span></p>
          <p className="mt-3">Compra-Venta de vehículos nuevos y usados Exclusivos - Particulares</p>
          <p className="mt-1">Consignataria - vendemos tu auto</p>
        </div>
        <div>
          <h3 className="text-ink font-semibold mb-3">Contacto</h3>
          <p>+54 2923 69-2545 · Joaquín</p>
          <p>+54 2923 69-4306 · Francisco</p>
          <p>Castelli 250, Guatraché, La Pampa</p>
        </div>
        <div>
          <h3 className="text-ink font-semibold mb-3">Legal</h3>
          <p>© 2026 M&amp;C Automotores. Todos los derechos reservados.</p>
          <Link to="/admin" className="inline-block mt-4 text-xs text-hover hover:text-primary transition-colors">
            Acceso concesionaria
          </Link>
        </div>
        <div>
          <h3 className="text-ink font-semibold mb-3">Redes</h3>
          <a href="https://www.instagram.com/automotores_mc/" target="_blank" rel="noopener noreferrer" className="block hover:text-primary transition-colors">Instagram</a>
          <a href="https://www.facebook.com/autosmancha.pickups" target="_blank" rel="noopener noreferrer" className="block mt-2 hover:text-primary transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
