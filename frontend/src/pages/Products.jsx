/**
 * Página de Gestión de Productos
 * CRUD completo con filtros, búsqueda, paginación y modales
 */

import { useState, useEffect, useRef } from 'react';
import { productService, categoriaService } from '../services/productService';
import ProductForm from '../components/ProductForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, productId: null });
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    categoria: '',
    search: '',
    page: 1,
    limit: 10
  });
  
  const searchTimeout = useRef(null);

  // Cargar categorías al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await categoriaService.getCategorias(1, 100);
        if (response.success) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategorias();
  }, []);

  // Recargar productos cuando cambian filtros o página
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  /**
   * Carga productos desde API con filtros actuales
   * No muestra spinner si ya hay productos cargados (evita parpadeo)
   */
  const fetchProducts = async () => {
    try {
      // Solo mostrar loading completo si no hay productos
      if (products.length === 0) {
        setLoading(true);
      } else {
        setSearching(true);
      }
      
      const response = await productService.getAll(filters);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setAlert({ type: 'error', message: 'Error al cargar productos' });
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
   * Espera 500ms después de que el usuario deje de escribir
   */
  const handleSearchChange = (value) => {
    setSearchInput(value);
    
    // Limpiar timeout anterior
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Crear nuevo timeout
    searchTimeout.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: value,
        page: 1
      }));
    }, 500); // Espera 500ms después de que el usuario deje de escribir
  };

  /**
   * Crea un nuevo producto
   */
  const handleCreate = async (productData) => {
    try {
      const response = await productService.create(productData);
      if (response.success) {
        setAlert({ type: 'success', message: 'Producto creado exitosamente' });
        setShowModal(false);
        fetchProducts(); // Recargar lista
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al crear producto'
      });
    }
  };

  /**
   * Actualiza producto existente
   */
  const handleUpdate = async (productData) => {
    try {
      const response = await productService.update(selectedProduct._id, productData);
      if (response.success) {
        setAlert({ type: 'success', message: 'Producto actualizado exitosamente' });
        setShowModal(false);
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al actualizar producto'
      });
    }
  };

  /**
   * Elimina producto tras confirmación
   */
  const handleDelete = async () => {
    try {
      const response = await productService.delete(confirmDialog.productId);
      if (response.success) {
        setAlert({ type: 'success', message: 'Producto eliminado exitosamente' });
        setConfirmDialog({ isOpen: false, productId: null });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Error al eliminar producto'
      });
    }
  };

  const openCreateModal = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const openDetailModal = (product) => {
    setProductDetail(product);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setProductDetail(null);
  };

  const openDeleteDialog = (productId) => {
    setConfirmDialog({ isOpen: true, productId });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
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
        <h1 className="products-title">Gestión de Productos</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          ➕ Nuevo Producto
        </button>
      </div>

      <div className="products-filters">
        <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Buscar productos..."
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
        <select
          className="form-select"
          value={filters.categoria}
          onChange={(e) => setFilters({ ...filters, categoria: e.target.value, page: 1 })}
          style={{ minWidth: '150px' }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.icono} {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No hay productos</h3>
          <p>Comienza agregando tu primer producto</p>
        </div>
      ) : (
        <>
          <div className="products-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.imagen && product.imagen !== 'https://via.placeholder.com/300x200?text=Producto' ? (
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          className="product-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                    </td>
                    <td>{product.nombre}</td>
                    <td>{product.descripcion.substring(0, 50)}...</td>
                    <td>${product.precio.toFixed(2)}</td>
                    <td>
                      <span className={`product-stock ${product.stock < 10 ? 'stock-low' : 'stock-ok'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      {product.categoria?.icono} {product.categoria?.nombre || 'Sin categoría'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => openDetailModal(product)}
                          className="btn btn-info btn-small"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="btn btn-warning btn-small"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => openDeleteDialog(product._id)}
                          className="btn btn-danger btn-small"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              itemName="productos"
            />
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={closeModal} className="modal-close">
                &times;
              </button>
            </div>
            <ProductForm
              product={selectedProduct}
              onSubmit={selectedProduct ? handleUpdate : handleCreate}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}

      {showDetailModal && productDetail && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Detalles del Producto</h2>
              <button onClick={closeDetailModal} className="modal-close">
                &times;
              </button>
            </div>
            <div className="product-detail-content">
              {productDetail.imagen && productDetail.imagen !== 'https://via.placeholder.com/300x200?text=Producto' && (
                <div className="product-detail-image">
                  <img
                    src={productDetail.imagen}
                    alt={productDetail.nombre}
                    onError={(e) => {
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="product-detail-info">
                <div className="detail-row">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{productDetail.nombre}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Descripción:</span>
                  <span className="detail-value">{productDetail.descripcion}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Precio:</span>
                  <span className="detail-value detail-price">${productDetail.precio.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Stock:</span>
                  <span className={`detail-value ${productDetail.stock < 10 ? 'stock-low' : 'stock-ok'}`}>
                    {productDetail.stock} unidades
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Categoría:</span>
                  <span className="detail-value">
                    {productDetail.categoria?.icono} {productDetail.categoria?.nombre || 'Sin categoría'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Fecha de creación:</span>
                  <span className="detail-value">
                    {new Date(productDetail.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={closeDetailModal} className="btn btn-secondary">
                Cerrar
              </button>
              <button
                onClick={() => {
                  closeDetailModal();
                  openEditModal(productDetail);
                }}
                className="btn btn-primary"
              >
                ✏️ Editar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, productId: null })}
      />
    </div>
  );
};

export default Products;
