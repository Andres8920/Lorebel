/**
 * Formulario de Categoría
 * Crea y edita categorías con validación
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const CategoriaForm = ({ categoria, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: categoria || {
      nombre: '',
      descripcion: '',
      icono: '📦'
    }
  });

  useEffect(() => {
    if (categoria) {
      reset(categoria);
    }
  }, [categoria, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="nombre" className="form-label">Nombre *</label>
        <input
          type="text"
          id="nombre"
          className="form-input"
          {...register('nombre', {
            required: 'El nombre es requerido',
            minLength: { value: 2, message: 'Mínimo 2 caracteres' },
            maxLength: { value: 50, message: 'Máximo 50 caracteres' }
          })}
        />
        {errors.nombre && <p className="form-error">{errors.nombre.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion" className="form-label">Descripción</label>
        <textarea
          id="descripcion"
          className="form-input"
          rows="3"
          {...register('descripcion', {
            maxLength: { value: 200, message: 'Máximo 200 caracteres' }
          })}
        />
        {errors.descripcion && <p className="form-error">{errors.descripcion.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="icono" className="form-label">Icono (Emoji)</label>
        <input
          type="text"
          id="icono"
          className="form-input"
          placeholder="📦"
          {...register('icono')}
        />
        <small className="form-help">Usa un emoji como icono (opcional)</small>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {categoria ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;
