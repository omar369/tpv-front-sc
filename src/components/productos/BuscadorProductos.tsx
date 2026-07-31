import React, { useState, useEffect, useMemo } from 'react';
import { getProductos } from '../../services/productos';
import type { Producto } from '../../types';
import { ProductoCard } from './ProductoCard';
import { FormProducto } from './FormProducto';

// Categorías estáticas — filtran por coincidencia en nombre/descripción.
// TODO: conectar a endpoint de categorías cuando esté disponible en la API.
const CATEGORIES = [
  'Todos',
  'Pintura',
  'Impermeabilizante',
  'Esmaltes',
  'Selladores',
  'Rodillos',
  'Brochas',
];

// Íconos para los accesos rápidos superiores
const QUICK_ACTIONS = [
  { icon: '📦', label: 'Productos' },
  { icon: '🔧', label: 'Servicios' },
  { icon: '🎧', label: 'Soporte' },
];

interface BuscadorProductosProps {
  apiUrl?: string;
}

export const BuscadorProductos: React.FC<BuscadorProductosProps> = ({
  apiUrl = 'http://localhost:8000',
}) => {
  const [productos, setProductos]           = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm]         = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
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
  const filteredBySearch = useMemo(() => {
    if (!searchTerm.trim()) return productos;
    const term = searchTerm.toLowerCase().trim();
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.clave.toLowerCase().includes(term) ||
        (p.marca?.toLowerCase().includes(term) ?? false),
    );
  }, [productos, searchTerm]);

  // ── Filtrado por categoría ──
  const filteredProductos = useMemo(() => {
    if (activeCategory === 'Todos') return filteredBySearch;
    const cat = activeCategory.toLowerCase();
    return filteredBySearch.filter(
      (p) =>
        p.nombre.toLowerCase().includes(cat) ||
        (p.descripcion?.toLowerCase().includes(cat) ?? false),
    );
  }, [filteredBySearch, activeCategory]);

  // ── Detección de duplicado exacto ──
  const duplicateMatch = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase().trim();
    return productos.find(
      (p) =>
        p.clave.toLowerCase() === term || p.nombre.toLowerCase() === term,
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

  // ── Vista: Buscador + catálogo ──
  return (
    <div className="productos-root">

      {/* Accesos rápidos de sección */}
      <div className="productos-quick-actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="quick-action-item"
            title={action.label}
          >
            <span className="quick-action-icon">{action.icon}</span>
            <span className="quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>

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
            <em>"{duplicateMatch.nombre}"</em> (clave: <code>#{duplicateMatch.clave}</code>)
          </div>
        </div>
      )}

      {/* Layout: panel de categorías + grid de productos */}
      <div className="productos-layout">

        {/* Panel izquierdo de categorías */}
        <aside className="categorias-panel">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`categoria-item ${activeCategory === cat ? 'categoria-item--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </aside>

        {/* Área principal: grid de productos */}
        <section>
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
                {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''}
              </p>
              <div className="productos-grid">
                {filteredProductos.map((p) => (
                  <ProductoCard key={p.id} producto={p} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Botón para agregar producto */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMode('create')}
        >
          ➕ Subir nuevo producto
        </button>
      </div>
    </div>
  );
};
