import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Package } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName = user?.companyName || user?.user || 'Usuario';

  // Datos de ejemplo (en producción vendrían de una API)
  const todayInvoices = [
    {
      id: 1,
      client: 'David Gálvez',
      initials: 'DG',
      time: '5:06 AM',
      document: 'Comprobante de crédito fiscal',
      duration: '6 min'
    },
    {
      id: 2,
      client: 'Joel Fuentes',
      initials: 'JF',
      time: '5:13 AM',
      document: 'Declaración de renta',
      duration: '10 min'
    },
    {
      id: 3,
      client: 'Son Goku',
      initials: 'SG',
      time: '6:45 AM',
      document: 'Factura',
      duration: '11 min'
    }
  ];

  return (
    <Layout 
      title={`Bienvenido, ${displayName}`}
      subtitle="Aquí están las estadísticas de hoy de tu sistema"
    >
      {/* Cards de acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/documents')}
        >
          <FileText className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Facturación</h3>
          <p className="text-sm text-gray-600">
            Generar nuevos documentos tributarios electrónicos
          </p>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => alert('Función de clientes en desarrollo')}
        >
          <Users className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Clientes</h3>
          <p className="text-sm text-gray-600">
            Administrar información de clientes
          </p>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => alert('Función de inventario en desarrollo')}
        >
          <Package className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Inventario</h3>
          <p className="text-sm text-gray-600">
            Gestionar productos y servicios
          </p>
        </Card>
      </div>

      {/* Tabla de facturas del día */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Facturas emitidas: {new Date().toLocaleDateString('es-SV', { 
                day: 'numeric', 
                month: 'long' 
              })} (Hoy)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {todayInvoices.length} Cliente{todayInvoices.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Todos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora de inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento solicitado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración de trámite
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todayInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                        {invoice.initials}
                      </div>
                      <span className="font-medium text-gray-900">
                        {invoice.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {invoice.document}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      VER DETALLES
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;