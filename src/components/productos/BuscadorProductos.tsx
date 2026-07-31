import React, { useState, useEffect, useMemo } from 'react';
import { getProductos } from '../../services/productos';
import type { Producto } from '../../types';
import { ProductoCard } from './ProductoCard';
import { FormProducto } from './FormProducto';

// Accesos rápidos superiores — íconos funcionales (logo puede personalizarse)
const QUICK_ACTIONS = [
  {
    icon: '📦',
    label: 'Productos',
    href: '/productos/nuevo',
    key: 'productos',
  },
  {
    icon: '📊',
    label: 'Dashboard',
    href: '/',
    key: 'dashboard',
  },
] as const;

interface BuscadorProductosProps {
  apiUrl?: string;
}

export const BuscadorProductos: React.FC<BuscadorProductosProps> = ({
  apiUrl = 'http://localhost:8000',
}) => {
  const [productos, setProductos]           = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm]         = useState('');
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [mode, setMode]                     = useState<'search' | 'create'>('search');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── Carga inicial de productos ──
  const fetchProductosList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos(apiUrl);
      setProductos(data);
    } catch (err: any) {
      setError(
        `No se pudo conectar con la API (${apiUrl}). Detalle: ${err.message || 'Error de conexión / CORS'}`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductosList();
  }, []);

  // ── Filtrado por texto de búsqueda ──
  const filteredProductos = useMemo(() => {
    if (!searchTerm.trim()) return productos;
    const term = searchTerm.toLowerCase().trim();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.clave.toLowerCase().includes(term) ||
        (p.marca?.toLowerCase().includes(term) ?? false),
    );
  }, [productos, searchTerm]);

  // ── Detección de duplicado exacto ──
  const duplicateMatch = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase().trim();
    return productos.find(
      (p) => p.clave.toLowerCase() === term || p.nombre.toLowerCase() === term,
    );
  }, [productos, searchTerm]);

  const existingClaves = useMemo(
    () => productos.map((p) => p.clave.toLowerCase()),
    [productos],
  );

  const handleProductCreated = (newProd: Producto) => {
    setSuccessMessage(`¡Producto "${newProd.nombre || 'nuevo'}" registrado con éxito!`);
    setMode('search');
    setSearchTerm('');
    fetchProductosList();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // ── Vista: Formulario de alta ──
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

  // ── Vista principal: Buscador + catálogo ──
  return (
    <div className="productos-root">

      {/* Botones de acceso rápido a secciones */}
      <nav className="productos-quick-actions" aria-label="Accesos rápidos">
        {QUICK_ACTIONS.map((action) => (
          <a
            key={action.key}
            href={action.href}
            className="quick-action-btn"
            title={action.label}
          >
            <span className="quick-action-btn-icon">{action.icon}</span>
            <span className="quick-action-btn-label">{action.label}</span>
          </a>
        ))}
        {/* Botón de nuevo producto */}
        <button
          type="button"
          className="quick-action-btn"
          title="Subir Producto"
          onClick={() => setMode('create')}
        >
          <span className="quick-action-btn-icon">➕</span>
          <span className="quick-action-btn-label">Nuevo</span>
        </button>
      </nav>

      {/* Barra de búsqueda pill */}
      <div className="search-bar-wrapper">
        <span className="search-bar-icon">🔍</span>
        <input
          type="text"
          className="search-bar-input"
          placeholder="¿Qué es lo que buscas?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="alert-banner alert-banner--success">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Alerta de duplicado */}
      {duplicateMatch && (
        <div className="duplicate-warning">
          <span className="duplicate-warning-icon">⚠️</span>
          <div>
            <strong>¡Producto ya registrado!</strong> Se encontró:{' '}
            <em>"{duplicateMatch.nombre}"</em> (clave:{' '}
            <code>#{duplicateMatch.clave}</code>)
          </div>
        </div>
      )}

      {/* Grid de productos — ancho completo, sin panel de categorías */}
      {loading ? (
        <div className="loading-state">
          <span>Cargando catálogo...</span>
        </div>
      ) : error ? (
        <div className="alert-banner alert-banner--danger">
          <span>❌</span>
          <span>{error}</span>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: '2rem' }}>📭</span>
          <span className="empty-state-title">
            {searchTerm
              ? `Sin resultados para "${searchTerm}"`
              : 'No hay productos aún'}
          </span>
          <span className="empty-state-desc">
            {searchTerm
              ? 'Prueba con otro término o crea el producto nuevo.'
              : 'Agrega tu primer producto al catálogo.'}
          </span>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setMode('create')}
          >
            ➕ {searchTerm ? `Crear "${searchTerm}"` : 'Nuevo Producto'}
          </button>
        </div>
      ) : (
        <>
          <p className="productos-count">
            {filteredProductos.length} producto
            {filteredProductos.length !== 1 ? 's' : ''}
          </p>
          <div className="productos-grid">
            {filteredProductos.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
