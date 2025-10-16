// ==================== src/pages/Login.tsx ====================
// Migración completa de login.html + auth.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

// Schema de validación del formulario
const loginSchema = z.object({
  username: z.string().min(1, 'Usuario es requerido'),
  password: z.string().min(1, 'Contraseña es requerida')
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();

  // React Hook Form con validación Zod
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Panel Izquierdo */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex flex-col justify-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    // Fallback si no hay logo
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Sistema de Facturación Electrónica
              </h1>
              <p className="text-blue-100 text-lg">
                Documentos Tributarios Electrónicos - El Salvador
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Emisión instantánea</h3>
                  <p className="text-sm text-blue-100">
                    Genera tus DTEs en segundos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">100% Seguro</h3>
                  <p className="text-sm text-blue-100">
                    Cumplimiento con el Ministerio de Hacienda
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold">Gestión simplificada</h3>
                  <p className="text-sm text-blue-100">
                    Administra todos tus documentos en un solo lugar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Formulario */}
          <div className="md:w-1/2 p-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenido
              </h2>
              <p className="text-gray-600 mb-8">
                Ingresa tus credenciales para continuar
              </p>

              {/* Alerta de error */}
              {error && (
                <Alert 
                  message={error} 
                  type="error" 
                  autoClose={false}
                  onClose={() => {}}
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
                {/* Campo Usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Usuario
                  </label>
                  <Input
                    {...register('username')}
                    type="text"
                    placeholder="Ingrese su usuario"
                    error={errors.username?.message}
                    className="w-full"
                  />
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Contraseña
                  </label>
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Ingrese su contraseña"
                    error={errors.password?.message}
                    className="w-full"
                  />
                </div>

                {/* Botón Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>

                {/* Texto de ayuda */}
                <p className="text-sm text-gray-600 text-center mt-4">
                  En caso de olvidar la contraseña comuníquese con soporte técnico.
                </p>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  © 2025 Sistema DTE - Ministerio de Hacienda El Salvador
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;