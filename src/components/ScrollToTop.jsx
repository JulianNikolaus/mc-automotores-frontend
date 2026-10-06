import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Al navegar a una nueva ruta, la página siempre aparece desde arriba.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
