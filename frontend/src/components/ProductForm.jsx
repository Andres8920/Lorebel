/**
 * Formulario de Producto
 * Componente reutilizable para crear y editar productos con validación
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { categoriaService } from '../services/productService';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: product || {
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      imagen: ''
    }
  });

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await categoriaService.getCategorias(1, 100); // Obtener todas
        if (response.success) {
          setCategorias(response.data);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  // Resetear form cuando cambia el producto (modo edición)
  useEffect(() => {
    if (product) {
      // Si el producto tiene categoria como objeto, extraer el _id
      const formData = {
        ...product,
        categoria: product.categoria?._id || product.categoria
      };
      reset(formData);
    }
  }, [product, reset]);

  /**
   * Parsea datos del form antes de enviar
   * Convierte precio y stock a números
   */
  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      precio: parseFloat(data.precio),
      stock: parseInt(data.stock, 10)
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="form-group">
        <label htmlFor="nombre" className="form-label">Nombre *</label>
        <input
          type="text"
          id="nombre"
          className="form-input"
          {...register('nombre', {
            required: 'El nombre es requerido',
            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            maxLength: { value: 100, message: 'Máximo 100 caracteres' }
          })}
        />
        {errors.nombre && <p className="form-error">{errors.nombre.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion" className="form-label">Descripción *</label>
        <textarea
          id="descripcion"
          className="form-textarea"
          {...register('descripcion', {
            required: 'La descripción es requerida',
            minLength: { value: 10, message: 'Mínimo 10 caracteres' },
            maxLength: { value: 500, message: 'Máximo 500 caracteres' }
          })}
        />
        {errors.descripcion && <p className="form-error">{errors.descripcion.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="precio" className="form-label">Precio *</label>
        <input
          type="number"
          step="0.01"
          id="precio"
          className="form-input"
          {...register('precio', {
            required: 'El precio es requerido',
            min: { value: 0, message: 'El precio no puede ser negativo' }
          })}
        />
        {errors.precio && <p className="form-error">{errors.precio.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="stock" className="form-label">Stock *</label>
        <input
          type="number"
          id="stock"
          className="form-input"
          {...register('stock', {
            required: 'El stock es requerido',
            min: { value: 0, message: 'El stock no puede ser negativo' }
          })}
        />
        {errors.stock && <p className="form-error">{errors.stock.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="categoria" className="form-label">Categoría *</label>
        <select
          id="categoria"
          className="form-select"
          {...register('categoria', { required: 'La categoría es requerida' })}
          disabled={loadingCategorias}
        >
          <option value="">
            {loadingCategorias ? 'Cargando categorías...' : 'Selecciona una categoría'}
          </option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.icono} {cat.nombre}
            </option>
          ))}
        </select>
        {errors.categoria && <p className="form-error">{errors.categoria.message}</p>}
        {!loadingCategorias && categorias.length === 0 && (
          <p className="form-info" style={{ color: '#C4975A', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            ⚠️ No hay categorías disponibles. Crea una categoría primero.
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="imagen" className="form-label">URL de Imagen</label>
        <input
          type="url"
          id="imagen"
          className="form-input"
          placeholder="https://ejemplo.com/imagen.jpg"
          {...register('imagen')}
        />
        {errors.imagen && <p className="form-error">{errors.imagen.message}</p>}
      </div>

      <div className="modal-footer">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
