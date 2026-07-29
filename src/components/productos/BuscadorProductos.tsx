import React, { useState, useEffect, useMemo } from 'react';
import { getProductos } from '../../services/productos';
import type { Producto } from '../../types';
import { ProductoCard } from './ProductoCard';
import { FormProducto } from './FormProducto';

interface BuscadorProductosProps {
  apiUrl?: string;
}

export const BuscadorProductos: React.FC<BuscadorProductosProps> = ({ apiUrl = 'http://localhost:8000' }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'search' | 'create'>('search');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProductosList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos(apiUrl);
      setProductos(data);
    } catch (err: any) {
      setError(`No se pudo conectar con la API (${apiUrl}). Detalle: ${err.message || 'Error de conexión / CORS'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductosList();
  }, []);

  const filteredProductos = useMemo(() => {
    if (!searchTerm.trim()) return productos;
    const term = searchTerm.toLowerCase().trim();
    return productos.filter(
      (p) => p.nombre.toLowerCase().includes(term) || p.clave.toLowerCase().includes(term)
    );
  }, [productos, searchTerm]);

  const duplicateMatch = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase().trim();
    return productos.find(
      (p) => p.clave.toLowerCase() === term || p.nombre.toLowerCase() === term
    );
  }, [productos, searchTerm]);

  const existingClaves = useMemo(() => {
    return productos.map((p) => p.clave.toLowerCase());
  }, [productos]);

  const handleProductCreated = (newProd: Producto) => {
    setSuccessMessage(`¡Producto "${newProd.nombre || 'nuevo'}" registrado con éxito!`);
    setMode('search');
    setSearchTerm('');
    fetchProductosList();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  if (mode === 'create') {
    return (
      <FormProducto
        onBack={() => setMode('search')}
        onSuccess={handleProductCreated}
        existingClaves={existingClaves}
        apiUrl={apiUrl}
      />
    );
  }

  return (
    <div className="productos-container">
      {successMessage && (
        <div className="duplicate-alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#6ee7b7' }}>
          <span className="duplicate-alert-icon">✅</span>
          <div>{successMessage}</div>
        </div>
      )}

      <div className="phase-card">
        <div className="phase-header">
          <div className="phase-title-group">
            <h3 className="phase-title">Paso 1: Buscar Producto Existente</h3>
            <p className="phase-desc">Ingresa el nombre o clave del producto antes de agregarlo para evitar duplicados en la base de datos</p>
          </div>
          <button
            type="button"
            onClick={() => setMode('create')}
            className="btn-primary"
          >
            ➕ Subir Nuevo Producto
          </button>
        </div>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o clave SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {duplicateMatch && (
          <div className="duplicate-alert">
            <span className="duplicate-alert-icon">⚠️</span>
            <div>
              <strong>¡Producto ya registrado!</strong> Se encontró un producto coincidente:{' '}
              <em>"{duplicateMatch.nombre}"</em> con clave <code>#{duplicateMatch.clave}</code>. Evita volver a subirlo.
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Cargando catálogo de productos...
          </div>
        ) : error ? (
          <div className="duplicate-alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#fca5a5' }}>
            <span className="duplicate-alert-icon">❌</span>
            <div>{error}</div>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {searchTerm
                ? `No se encontraron productos que coincidan con "${searchTerm}".`
                : 'No hay productos registrados aún en el catálogo.'}
            </p>
            <button
              type="button"
              onClick={() => setMode('create')}
              className="btn-primary"
            >
              ➕ Crear "{searchTerm || 'Nuevo Producto'}"
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Mostrando {filteredProductos.length} producto(s) encontrado(s)
            </div>
            <div className="results-grid">
              {filteredProductos.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
