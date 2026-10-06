# M&C Automotores — Frontend

Sitio público de la concesionaria, construido con React + Vite + Tailwind CSS v4.

## Requisitos
- Node.js 18+

## Variables de entorno
No hay variables de entorno obligatorias. El proyecto usa el dominio en el que está servido (en desarrollo el proxy de Vite redirige `/api` y `/uploads` al backend en `http://localhost:4000`).

## Comandos
```bash
npm install
npm run dev     # desarrollo en http://localhost:5173
npm run build   # build de producción
npm run preview # previsualizar el build
```

## Estructura
- `src/pages/` — pantallas (Inicio, Nosotros, Ubicación, Testimonios, Cotizador, Admin, VehiculoDetalle)
- `src/components/` — Header, Footer, VehicleCard, VehicleModal, WhatsAppChoice, ScrollToTop
- `src/services/api.js` — cliente HTTP al backend
- `src/utils/format.js` — formateadores de números/precios
- `public/` — assets estáticos

## Nota
El backend debe estar corriendo en `http://localhost:4000` (o configurar el proxy de `vite.config.js`).
