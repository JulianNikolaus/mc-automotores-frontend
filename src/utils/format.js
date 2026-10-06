// Si el usuario tippea '.', se normaliza; si no los puso, los inserta automáticamente.
export const formatThousands = (value) => value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Formateo en vivo: permite que el usuario introduzca '.' y sigue insertando automáticamente si no los usa.
export const formatThousandsLive = (value) => {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (cleaned.endsWith('.')) return cleaned;
  return formatThousands(cleaned);
};

// Solo deja dígitos y puntos (para no bloquear al usuario)
export const allowDigitsAndDots = (value) => value.replace(/[^\d.]/g, '');

// Quita puntos para enviar al backend
export const withoutDots = (value) => String(value).replace(/\./g, '');
