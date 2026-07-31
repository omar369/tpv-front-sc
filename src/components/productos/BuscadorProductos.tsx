import React, { useState, useEffect, useMemo } from 'react';
import { getProductos } from '../../services/productos';
import type { Producto } from '../../types';
import { ProductoCard } from './ProductoCard';
import { FormProducto } from './FormProducto';

// Categorías del catálogo como en la imagen de referencia
const CATEGORIES = [
  'PINTURA',
  'IMPERMEABILIZANTE',
  'ESMALTES',
  'SELLADORES',
  'RODILLOS',
  'BROCHAS',
  'TODOS',
] as const;

interface BuscadorProductosProps {
  apiUrl?: string;
}

export const BuscadorProductos: React.FC<BuscadorProductosProps> = ({
  apiUrl = 'http://localhost:8000',
}) => {
  const [productos, setProductos]             = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('PINTURA');
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [mode, setMode]                       = useState<'search' | 'create'>('search');
  const [successMessage, setSuccessMessage]   = useState<string | null>(null);

  // ── Carga de productos ──
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

  // ── Filtrado por Búsqueda + Categoría ──
  const filteredProductos = useMemo(() => {
    let result = productos;

    // Filtrar por categoría seleccionada si no es "TODOS"
    if (selectedCategory && selectedCategory !== 'TODOS') {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const pName = p.nombre.toLowerCase();
        const pDesc = (p.descripcion || '').toLowerCase();
        const pMarca = (p.marca || '').toLowerCase();
        return (
          pName.includes(catLower) ||
          pDesc.includes(catLower) ||
          pMarca.includes(catLower)
        );
      });
    }

    // Filtrar por texto ingresado en el buscador
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(term) ||
          p.clave.toLowerCase().includes(term) ||
          (p.marca?.toLowerCase().includes(term) ?? false),
      );
    }

    return result;
  }, [productos, searchTerm, selectedCategory]);

  // ── Alerta de Duplicados ──
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

  // ── Formulario de Alta ──
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
    <div className="productos-root">

      {/* ── 3 Íconos de Línea Superiores (Fiel a la Imagen) ── */}
      <div className="productos-quick-actions" role="navigation" aria-label="Accesos principales">
        {/* Ícono 1: Caja / Productos */}
        <a
          href="/productos/nuevo"
          className="quick-action-btn"
          title="Catálogo de Productos"
        >
          <svg className="quick-action-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22L32 12L52 22V46L32 56L12 46V22Z" />
            <path d="M32 12V56" />
            <path d="M12 22L32 32L52 22" />
            <path d="M25 15.5L39 22.5" strokeWidth="3" />
            <path d="M26 18.5L38 24.5" />
          </svg>
        </a>

        {/* Ícono 2: Herramientas / Servicios */}
        <a
          href="/"
          className="quick-action-btn"
          title="Dashboard & Servicios"
        >
          <svg className="quick-action-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 46H50M22 36C22 36 26 30 32 30C38 30 42 36 42 36" />
            <path d="M26 22L38 10M38 22L26 10" />
            <circle cx="32" cy="16" r="10" />
          </svg>
        </a>

        {/* Ícono 3: Soporte / Atención */}
        <button
          type="button"
          className="quick-action-btn"
          title="Soporte y Ayuda"
          onClick={() => alert('Soporte técnico POS — Conectado')}
        >
          <svg className="quick-action-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 28C20 18 25 12 32 12C39 12 44 18 44 28" />
            <rect x="14" y="26" width="6" height="12" rx="3" />
            <rect x="44" y="26" width="6" height="12" rx="3" />
            <path d="M47 38C47 44 40 48 32 48H30" />
            <rect x="18" y="48" width="28" height="10" rx="3" />
          </svg>
        </button>
      </div>

      {/* ── Barra de Búsqueda Fiel a la Imagen ── */}
      <div className="search-bar-wrapper">
        <span className="search-bar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          className="search-bar-input"
          placeholder="¿ Que es lo que buscas ?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mensajes Banner */}
      {successMessage && (
        <div className="alert-banner alert-banner--success">
          <span>✅</span>
          <span>{successMessage}</span>
        </div>
      )}

      {duplicateMatch && (
        <div className="alert-banner alert-banner--warning">
          <span>⚠️</span>
          <div>
            <strong>¡Producto ya registrado!</strong> Se encontró: <em>"{duplicateMatch.nombre}"</em> (#{duplicateMatch.clave})
          </div>
        </div>
      )}

      {/* ── Layout de 2 Columnas (Panel Categorías Izquierda + Grid Productos) ── */}
      <div className="productos-content-layout">

        {/* Panel de Categorías Izquierda */}
        <aside className="categories-sidebar" aria-label="Filtro de categorías">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`category-item-btn ${isActive ? 'category-item-btn--active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            );
          })}
        </aside>

        {/* Grid de Productos Derecha */}
        <main className="productos-grid-container">
          {loading ? (
            <div className="loading-state">
              <span>Cargando productos...</span>
            </div>
          ) : error ? (
            <div className="alert-banner alert-banner--danger">
              <span>❌</span>
              <span>{error}</span>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '2.5rem' }}>🎨</span>
              <span className="empty-state-title">
                {searchTerm
                  ? `Sin resultados para "${searchTerm}"`
                  : `No se encontraron productos en "${selectedCategory}"`}
              </span>
              <span className="empty-state-desc">
                Intenta seleccionando otra categoría o registra un nuevo producto en el catálogo.
              </span>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setMode('create')}
              >
                ➕ Subir Producto
              </button>
            </div>
          ) : (
            <div className="productos-grid">
              {filteredProductos.map((prod) => (
                <ProductoCard key={prod.id} producto={prod} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Botón Flotante para crear nuevo producto */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMode('create')}
        >
          ➕ Subir Nuevo Producto
        </button>
      </div>

    </div>
  );
};
