import type { Producto } from '../types/productos';

const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('pos_token');
  if (!token) return {};
  return {
    'Authorization': `Bearer ${token}`
  };
}

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_BASE}/productos/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Error al obtener productos: ${res.statusText}`);
  }
  return await res.json();
}

export async function createProducto(formData: FormData): Promise<Producto[]> {
  const headers = getAuthHeaders();
  const res = await fetch(`${API_BASE}/productos/`, {
    method: 'POST',
    headers: headers,
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.detail || `Error al crear producto: ${res.statusText}`;
    throw new Error(msg);
  }
  return await res.json();
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Error al eliminar producto ${id}`);
  }
}
