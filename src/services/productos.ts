import type { Producto } from '../types/productos';
import { fetchApi } from './client';

export async function getProductos(baseUrl?: string): Promise<Producto[]> {
  return fetchApi<Producto[]>('/productos/', { method: 'GET' }, baseUrl);
}

export async function createProducto(formData: FormData, baseUrl?: string): Promise<Producto[]> {
  return fetchApi<Producto[]>('/productos/', {
    method: 'POST',
    body: formData,
  }, baseUrl);
}

export async function deleteProducto(id: number, baseUrl?: string): Promise<void> {
  return fetchApi<void>(`/productos/${id}`, { method: 'DELETE' }, baseUrl);
}
