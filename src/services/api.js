const API_BASE = '';

export const imgUrl = (src) => {
  if (!src) return 'https://placehold.co/800x500/191C22/D4AF37?text=M%26C';
  if (src.startsWith('/uploads')) return src;
  return src;
};

export const formatPrice = (n, currency = 'USD') =>
  `${currency === 'ARS' ? '$' : 'USD'} ${Number(n).toLocaleString('es-AR')}`;

export async function getVehicles(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/v1/vehicles${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Error al cargar vehículos');
  return res.json();
}

export async function getVehicle(id) {
  const res = await fetch(`${API_BASE}/api/v1/vehicles/${id}`);
  if (!res.ok) throw new Error('No encontrado');
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
}

export async function saveVehicle(id, formData) {
  const token = localStorage.getItem('mc_token');
  const res = await fetch(`${API_BASE}/api/v1/vehicles${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Error al guardar');
  return res.json();
}

export async function deleteVehicle(id) {
  const token = localStorage.getItem('mc_token');
  const res = await fetch(`${API_BASE}/api/v1/vehicles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al eliminar');
  return res.json();
}
