import React from 'react';
import type { Producto } from '../../types';

interface ProductoCardProps {
  producto: Producto;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  return (
    <div className="product-card">
      {/* Badge de estado — aparece en hover */}
      <span
        className={`product-card-badge ${
          producto.activo ? 'product-card-badge--active' : 'product-card-badge--inactive'
        }`}
      >
        {producto.activo ? 'Activo' : 'Inactivo'}
      </span>

      {/* Área de imagen — protagonista del card */}
      <div className="product-card-image-area">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="product-card-image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="product-card-placeholder">
            <span className="product-card-placeholder-icon">📦</span>
            <span>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Franja inferior — visible en hover */}
      <div className="product-card-footer">
        <span className="product-card-name">{producto.nombre}</span>
        <span className="product-card-price">${Number(producto.precio).toFixed(2)}</span>
      </div>
    </div>
  );
};
