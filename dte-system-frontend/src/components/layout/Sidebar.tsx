// Migración del sidebar de principal.html y seleccion.html
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  Building2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';

const menuSections = [
  {
    title: 'Principal',
    items: [
      {
        id: 'dashboard',
        label: 'Inicio',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard'
      }
    ]
  },
  {
    title: 'Módulos',
    items: [
      {
        id: 'facturacion',
        label: 'Facturación',
        icon: <FileText className="w-5 h-5" />,
        path: '/documents'
      },
      {
        id: 'clientes',
        label: 'Clientes',
        icon: <Users className="w-5 h-5" />,
        path: '/clients'
      },
      {
        id: 'inventario',
        label: 'Inventario',
        icon: <Package className="w-5 h-5" />,
        path: '/inventory'
      }
    ]
  },
  {
    title: 'Otros',
    items: [
      {
        id: 'configuracion',
        label: 'Configuración',
        icon: <Settings className="w-5 h-5" />,
        path: '/settings'
      }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Cargar estado del sidebar desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true' && window.innerWidth > 1024) {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    // Cerrar sidebar en móvil después de click
    if (window.innerWidth <= 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Overlay móvil */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300',
          'flex flex-col',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header del Sidebar */}
        <div 
          className="h-16 border-b border-gray-200 flex items-center px-4 cursor-pointer hover:bg-gray-50"
          onClick={toggleSidebar}
        >
          <Building2 className="w-7 h-7 text-blue-600 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-gray-900 truncate">
              Sistema DTE
            </span>
          )}
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <div className="px-4 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              
              <div className="space-y-1 px-2">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.path)}
                    className={clsx(
                      'w-full flex items-center px-3 py-2.5 rounded-lg transition-colors',
                      'hover:bg-blue-50 hover:text-blue-600',
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-gray-700',
                      isCollapsed && 'justify-center'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!isCollapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer con botón de logout */}
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className={clsx(
              'w-full flex items-center px-3 py-2.5 rounded-lg transition-colors',
              'hover:bg-red-50 hover:text-red-600 text-gray-700',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3">Cerrar sesión</span>
            )}
          </button>
        </div>
      </aside>

      {/* Botón toggle móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};