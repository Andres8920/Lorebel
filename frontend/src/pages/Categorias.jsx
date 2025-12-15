/**
 * Página de Gestión de Categorías
 * CRUD completo de categorías personalizadas con paginación
 */

import { useState, useEffect, useRef } from 'react';
import { categoriaService } from '../services/productService';
import CategoriaForm from '../components/CategoriaForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import '../styles/Categorias.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, categoriaId: null });
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 12
  });
  
  const searchTimeout = useRef(null);

  useEffect(() => {
    fetchCategorias();
  }, [filters]);

  /**
   * Carga categorías desde API con filtros actuales
   * No muestra spinner si ya hay categorías cargadas (evita parpadeo)
   */
  const fetchCategorias = async () => {
    try {
      // Solo mostrar loading completo si no hay categorías
      if (categorias.length === 0) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      
      const response = await categoriaService.getAll(filters);
      setCategorias(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setAlert({ type: 'error', message: 'Error al cargar categorías' });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  /**
   * Actualiza filtros de paginación
   * @param {number} newPage - Nueva página a mostrar
   * @param {number} newLimit - Nuevo límite de items por página
   */
  const handlePageChange = (newPage, newLimit) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
      limit: newLimit || prev.limit
    }));
  };

  /**
   * Maneja el cambio en el input de búsqueda con debounce
   * Espera 500ms después de que el usuario deja de escribir
   */
  const handleSearchChange = (value) => {
    setSearchInput(value);
    
    // Limpiar timeout anterior si existe
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Crear nuevo timeout para búsqueda
    searchTimeout.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 500);
  };

  /**
   * Crea una nueva categoría
   */
  const handleCreate = async (categoriaData) => {
    try {
      const response = await categoriaService.create(categoriaData);
      if (response.success) {
        setAlert({ type: 'success', message: 'Categoría creada exitosamente' });
        setShowModal(false);
        fetchCategorias();
      }
    } catch (error) {
      console.error('Error al crear categoría:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al crear categoría'
      });
    }
  };

  /**
   * Actualiza categoría existente
   */
  const handleUpdate = async (categoriaData) => {
    try {
      const response = await categoriaService.update(selectedCategoria._id, categoriaData);
      if (response.success) {
        setAlert({ type: 'success', message: 'Categoría actualizada exitosamente' });
        setShowModal(false);
        setSelectedCategoria(null);
        fetchCategorias();
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al actualizar categoría'
      });
    }
  };

  /**
   * Elimina categoría tras confirmación
   */
  const handleDelete = async () => {
    try {
      const response = await categoriaService.delete(confirmDialog.categoriaId);
      if (response.success) {
        setAlert({ type: 'success', message: 'Categoría eliminada exitosamente' });
        setConfirmDialog({ isOpen: false, categoriaId: null });
        fetchCategorias();
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al eliminar categoría'
      });
    }
  };

  const openCreateModal = () => {
    setSelectedCategoria(null);
    setShowModal(true);
  };

  const openEditModal = (categoria) => {
    setSelectedCategoria(categoria);
    setShowModal(true);
  };

  const openDeleteDialog = (categoriaId) => {
    setConfirmDialog({ isOpen: true, categoriaId });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategoria(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="products-header">
        <h1 className="products-title">Gestión de Categorías</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          ➕ Nueva Categoría
        </button>
      </div>

      <div className="products-filters">
        <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Buscar categorías..."
            className="form-input"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: '100%' }}
          />
          {searching && (
            <span className="searching-indicator">
              🔍 Buscando...
            </span>
          )}
        </div>
      </div>

      {categorias.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏷️</div>
          <h3>No hay categorías</h3>
          <p>Comienza agregando tu primera categoría</p>
        </div>
      ) : (
        <>
          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <div key={categoria._id} className="categoria-card">
                <div className="categoria-card-header">
                  <span className="categoria-icono">{categoria.icono || '📦'}</span>
                  <h3 className="categoria-nombre">{categoria.nombre}</h3>
                </div>
              <p className="categoria-descripcion">
                {categoria.descripcion || 'Sin descripción'}
              </p>
              <div className="categoria-card-actions">
                <button
                  onClick={() => openEditModal(categoria)}
                  className="btn btn-warning btn-small"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => openDeleteDialog(categoria._id)}
                  className="btn btn-danger btn-small"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            itemName="categorías"
          />
        )}
      </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button onClick={closeModal} className="modal-close">
                &times;
              </button>
            </div>
            <CategoriaForm
              categoria={selectedCategoria}
              onSubmit={selectedCategoria ? handleUpdate : handleCreate}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta categoría? Los productos asociados no se eliminarán."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, categoriaId: null })}
      />
    </div>
  );
};

export default Categorias;
