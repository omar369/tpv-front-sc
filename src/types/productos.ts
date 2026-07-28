export interface Producto {
  id: number;
  clave: string;
  clave_externa?: string | null;
  nombre: string;
  marca?: string | null;
  modelo?: string | null;
  precio: number;
  precio_minimo?: number | null;
  descripcion?: string | null;
  categoria_id?: number | null;
  proveedor_id?: number | null;
  unidad_medida?: string | null;
  cantidad_unidad_medida?: number | null;
  stock_actual: number;
  stock_minimo: number;
  activo: boolean;
  imagen_url?: string | null;
  created_at?: string | null;
}

export interface ProductoCreate {
  clave: string;
  clave_externa?: string;
  nombre: string;
  marca?: string;
  modelo?: string;
  precio: number;
  precio_minimo?: number;
  descripcion?: string;
  categoria_id?: number;
  proveedor_id?: number;
  unidad_medida?: string;
  cantidad_unidad_medida?: number;
  stock_actual?: number;
  stock_minimo?: number;
  activo?: boolean;
  imagen?: File | null;
}
