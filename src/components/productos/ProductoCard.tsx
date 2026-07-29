import React from 'react';
import type { Producto } from '../../types';

interface Props {
  producto: Producto;
}

export const ProductoCard: React.FC<Props> = ({ producto }) => {
  return (
    <div class="product-card">
      <div class="product-card__img-container">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            class="product-card__img"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div class="product-card__placeholder">
            <span>📷</span>
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      <div class="product-card__body">
        <div class="product-card__badge-row">
          <span class="product-card__clave">#{producto.clave}</span>
          <span class={producto.activo ? 'badge-active' : 'badge-inactive'}>
            {producto.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <h4 class="product-card__title">{producto.nombre}</h4>
        
        {(producto.marca || producto.modelo) && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {producto.marca && <strong>{producto.marca} </strong>}
            {producto.modelo && <span>({producto.modelo})</span>}
          </div>
        )}

        {producto.cantidad_unidad_medida && producto.unidad_medida && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Contenido: {Number(producto.cantidad_unidad_medida)} {producto.unidad_medida}
          </div>
        )}

        <div class="product-card__price">
          ${Number(producto.precio).toFixed(2)}
        </div>
      </div>
    </div>
  );
};
