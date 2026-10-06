import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Inicio from './pages/Inicio.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Ubicacion from './pages/Ubicacion.jsx';
import Testimonios from './pages/Testimonios.jsx';
import Cotizador from './pages/Cotizador.jsx';
import Admin from './pages/Admin.jsx';
import VehiculoDetalle from './pages/VehiculoDetalle.jsx';

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/ubicacion" element={<Ubicacion />} />
          <Route path="/testimonios" element={<Testimonios />} />
          <Route path="/cotizador" element={<Cotizador />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/vehiculo/:id" element={<VehiculoDetalle />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
