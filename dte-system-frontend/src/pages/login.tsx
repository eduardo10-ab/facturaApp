// src/pages/login.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';

// Schema de validación del formulario
const loginSchema = z.object({
  username: z.string().min(1, 'Usuario es requerido'),
  password: z.string().min(1, 'Contraseña es requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login({
      user: data.username,
      pwd: data.password
    });

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Panel Izquierdo */}
          <div className="login-left">
            <span className="titulo-app">Sistema de facturación electrónica</span>
            <div className="company-logo">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Panel Derecho - Formulario */}
          <div className="login-right">
            <span className="bienvenido">Bienvenido</span>
            
            {/* Alerta de error */}
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Campo Usuario */}
              <div className="form-group-login">
                <label htmlFor="username" className="conta">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  {' '}Usuario
                </label>
                <input
                  {...register('username')}
                  type="text"
                  id="username"
                  className="form-input-login"
                  placeholder="Ingrese su usuario"
                />
                {errors.username && (
                  <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                    {errors.username.message}
                  </span>
                )}
              </div>

              {/* Campo Contraseña */}
              <div className="form-group-login">
                <label htmlFor="password">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  {' '}Contraseña
                </label>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className="form-input-login"
                  placeholder="Ingrese su contraseña"
                />
                {errors.password && (
                  <span style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', display: 'block' }}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Botón Submit */}
              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>

              <p className="remember-text">
                En caso de olvidar la contraseña comuníquese con soporte técnico.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;