import React, { useState } from 'react';
import { createProducto } from '../../services/productos';
import type { Producto } from '../../types';

interface Props {
  onBack: () => void;
  onSuccess: (newProd: Producto) => void;
  existingClaves: string[];
  apiUrl?: string;
}

export const FormProducto: React.FC<Props> = ({ onBack, onSuccess, existingClaves, apiUrl = 'http://localhost:8000' }) => {
  const [clave, setClave] = useState('');
  const [claveExterna, setClaveExterna] = useState('');
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [precio, setPrecio] = useState('');
  const [precioMinimo, setPrecioMinimo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('pz');
  const [cantidadUnidadMedida, setCantidadUnidadMedida] = useState('1');
  const [stockActual, setStockActual] = useState('0');
  const [stockMinimo, setStockMinimo] = useState('0');
  const [categoriaId, setCategoriaId] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [activo, setActivo] = useState(true);

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!clave.trim()) {
      setError('La clave del producto es obligatoria.');
      return;
    }
    if (existingClaves.includes(clave.trim().toLowerCase())) {
      setError(`La clave "${clave}" ya se encuentra registrada. Usa una clave SKU distinta.`);
      return;
    }
    if (!nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) {
      setError('Introduce un precio público válido mayor a 0.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('clave', clave.trim());
      if (claveExterna.trim()) formData.append('clave_externa', claveExterna.trim());
      formData.append('nombre', nombre.trim());
      if (marca.trim()) formData.append('marca', marca.trim());
      if (modelo.trim()) formData.append('modelo', modelo.trim());
      formData.append('precio', precio.toString());
      if (precioMinimo.trim()) formData.append('precio_minimo', precioMinimo.trim());
      if (descripcion.trim()) formData.append('descripcion', descripcion.trim());
      if (unidadMedida.trim()) formData.append('unidad_medida', unidadMedida.trim());
      if (cantidadUnidadMedida.trim()) formData.append('cantidad_unidad_medida', cantidadUnidadMedida.trim());
      if (stockActual.trim()) formData.append('stock_actual', stockActual.trim());
      if (stockMinimo.trim()) formData.append('stock_minimo', stockMinimo.trim());
      if (categoriaId.trim()) formData.append('categoria_id', categoriaId.trim());
      if (proveedorId.trim()) formData.append('proveedor_id', proveedorId.trim());
      formData.append('activo', activo ? 'true' : 'false');
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const response = await createProducto(formData, apiUrl);
      const created = Array.isArray(response) ? response[0] : response;
      onSuccess(created);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="phase-card">
      <div class="phase-header">
        <div class="phase-title-group">
          <h3 class="phase-title">Crear Nuevo Producto</h3>
          <p class="phase-desc">Completa los campos detallados para registrar el producto en el catálogo</p>
        </div>
        <button type="button" onClick={onBack} class="btn-secondary">
          ← Volver a Búsqueda
        </button>
      </div>

      {error && (
        <div class="duplicate-alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#fca5a5' }}>
          <span class="duplicate-alert-icon">⚠️</span>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} class="form-grid">
        <div class="form-fields">
          {/* Fila 1: Claves */}
          <div class="form-row">
            <div class="field-group">
              <label>Clave / SKU Interno <span>*</span></label>
              <input
                type="text"
                class="field-input"
                placeholder="Ej. ART-001"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>
            <div class="field-group">
              <label>Clave Externa / Código de Barras</label>
              <input
                type="text"
                class="field-input"
                placeholder="Ej. 7501000123456"
                value={claveExterna}
                onChange={(e) => setClaveExterna(e.target.value)}
              />
            </div>
          </div>

          {/* Fila 2: Nombre, Marca, Modelo */}
          <div class="field-group">
            <label>Nombre del Producto <span>*</span></label>
            <input
              type="text"
              class="field-input"
              placeholder="Ej. Coca Cola 600ml Desechable"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div class="form-row">
            <div class="field-group">
              <label>Marca</label>
              <input
                type="text"
                class="field-input"
                placeholder="Ej. Coca Cola, Samsung"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </div>
            <div class="field-group">
              <label>Modelo / Presentación</label>
              <input
                type="text"
                class="field-input"
                placeholder="Ej. 600ml, XL, V8"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
            </div>
          </div>

          {/* Fila 3: Precios */}
          <div class="form-row">
            <div class="field-group">
              <label>Precio al Público ($) <span>*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                class="field-input"
                placeholder="0.00"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
              />
            </div>
            <div class="field-group">
              <label>Precio Mínimo Permitido ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                class="field-input"
                placeholder="0.00"
                value={precioMinimo}
                onChange={(e) => setPrecioMinimo(e.target.value)}
              />
            </div>
          </div>

          {/* Fila 4: Unidad de medida y Cantidad */}
          <div class="form-row">
            <div class="field-group">
              <label>Unidad de Medida</label>
              <select
                class="field-select"
                value={unidadMedida}
                onChange={(e) => setUnidadMedida(e.target.value)}
              >
                <option value="pz">Pieza (pz)</option>
                <option value="kg">Kilogramo (kg)</option>
                <option value="lt">Litro (lt)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="gr">Gramos (gr)</option>
                <option value="caja">Caja</option>
                <option value="paq">Paquete</option>
              </select>
            </div>
            <div class="field-group">
              <label>Cantidad de la Unidad</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                class="field-input"
                placeholder="Ej. 600, 1.5, 1"
                value={cantidadUnidadMedida}
                onChange={(e) => setCantidadUnidadMedida(e.target.value)}
              />
            </div>
          </div>

          {/* Fila 5: Stock */}
          <div class="form-row">
            <div class="field-group">
              <label>Stock Inicial</label>
              <input
                type="number"
                min="0"
                class="field-input"
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
              />
            </div>
            <div class="field-group">
              <label>Stock Mínimo Alerta</label>
              <input
                type="number"
                min="0"
                class="field-input"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
              />
            </div>
          </div>

          <div class="field-group">
            <label>Descripción</label>
            <textarea
              class="field-textarea"
              placeholder="Detalles opcionales del producto..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div class="form-row">
            <div class="field-group">
              <label>ID Categoría (Opcional)</label>
              <input
                type="number"
                class="field-input"
                placeholder="Ej. 1"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              />
            </div>
            <div class="field-group">
              <label>Estado</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem' }}>Producto Activo en Terminal</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <div class="field-group">
            <label>Imagen del Producto</label>
            <label class="image-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" class="dropzone-preview" />
              ) : (
                <>
                  <span style={{ fontSize: '2rem' }}>🖼️</span>
                  <span class="dropzone-text">Haz clic o arrastra una imagen aquí</span>
                  <span class="dropzone-hint">Soporta PNG, JPG o WEBP</span>
                </>
              )}
            </label>
          </div>
        </div>
      </form>

      <div class="form-actions">
        <button type="button" onClick={onBack} class="btn-secondary" disabled={loading}>
          Cancelar
        </button>
        <button type="button" onClick={handleSubmit} class="btn-primary" disabled={loading}>
          {loading ? 'Subiendo Producto...' : '💾 Guardar Producto'}
        </button>
      </div>
    </div>
  );
};
