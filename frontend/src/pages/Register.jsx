import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setAlert(null);

    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);

    if (result.success) {
      setAlert({ type: 'success', message: '¡Registro exitoso! Redirigiendo...' });
      setTimeout(() => {
        navigate('/productos');
      }, 1000);
    } else {
      setAlert({ type: 'error', message: result.message });
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registrarse</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            className="form-input"
            placeholder="usuario123"
            {...register('username', {
              required: 'El nombre de usuario es requerido',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres'
              },
              maxLength: {
                value: 50,
                message: 'Máximo 50 caracteres'
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Solo letras, números y guiones bajos'
              }
            })}
          />
          {errors.username && <p className="form-error">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="correo@ejemplo.com"
            {...register('email', {
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email no válido'
              }
            })}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="••••••••"
            {...register('password', {
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Debes confirmar la contraseña',
              validate: value =>
                value === password || 'Las contraseñas no coinciden'
            })}
          />
          {errors.confirmPassword && (
            <p className="form-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <div className="form-link">
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
