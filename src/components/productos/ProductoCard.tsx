import React from 'react';
import type { Producto } from '../../types';

interface ProductoCardProps {
  producto: Producto;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
  return (
    <div className="product-card" title={`${producto.nombre} - $${Number(producto.precio).toFixed(2)}`}>
      {/* Badge de Estado */}
      <span
        className={`product-card-badge ${
          producto.activo ? 'product-card-badge--active' : 'product-card-badge--inactive'
        }`}
      >
        {producto.activo ? 'Activo' : 'Inactivo'}
      </span>

      {/* Imagen del Producto centrada con padding generoso */}
      <div className="product-card-image-area">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="product-card-image"
            onError={(e) => {
              // Fallback si la imagen no carga
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/300x350/f4f4f6/333333?text=Cubeta+Pintura';
            }}
          />
        ) : (
          <div className="product-card-placeholder">
            <span className="product-card-placeholder-icon">🪣</span>
            <span>{producto.nombre}</span>
          </div>
        )}
      </div>

      {/* Footer Info al Hover */}
      <div className="product-card-footer">
        <span className="product-card-name">{producto.nombre}</span>
        <span className="product-card-price">${Number(producto.precio).toFixed(2)}</span>
      </div>
    </div>
  );
};
