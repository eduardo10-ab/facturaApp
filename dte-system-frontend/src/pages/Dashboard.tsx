// src/pages/Dashboard.tsx
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';

const ArrowDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7,10L12,15L17,10H7Z"/>
  </svg>
);

interface Invoice {
  id: number;
  client: string;
  initials: string;
  time: string;
  document: string;
  duration: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.companyName || user?.user || 'Usuario';

  const todayInvoices: Invoice[] = [
    {
      id: 1,
      client: 'David Gálvez',
      initials: 'DG',
      time: '5:06 AM',
      document: 'Comprobante de credito fiscal',
      duration: '6 min'
    },
    {
      id: 2,
      client: 'Joel Fuentes',
      initials: 'JF',
      time: '5:13 AM',
      document: 'Declaracion de renta',
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

  const currentDate = new Date().toLocaleDateString('es-SV', {
    day: 'numeric',
    month: 'long'
  });

  return (
    <Layout
      title={`Bienvenido, ${displayName}`}
      subtitle="Aquí están las estadísticas de hoy de tu sistema"
    >
      <div className="dashboard">
        <div className="dashboard-content">
          {/* Sección de tabla */}
          <div className="table-section">
            <div className="table-header">
              <h3>Facturas emitidas: {currentDate} (Hoy)</h3>
              <button className="filter-btn">
                Todos
                <ArrowDownIcon />
              </button>
            </div>

            <div className="info-text">{todayInvoices.length} Clientes</div>

            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre del cliente</th>
                  <th>Hora de inicio</th>
                  <th>Documento solicitado</th>
                  <th>Duración de trámite</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {todayInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="table-avatar">
                        <span className="avatar-initials">{invoice.initials}</span>
                      </div>
                    </td>
                    <td>
                      <div className="doc-info">
                        <div className="doc-name">{invoice.client}</div>
                      </div>
                    </td>
                    <td className="time-col">{invoice.time}</td>
                    <td className="time-col">{invoice.document}</td>
                    <td className="duration-col">{invoice.duration}</td>
                    <td></td>
                    <td>
                      <button 
                        className="details-btn"
                        onClick={() => alert(`Ver detalles de ${invoice.client}`)}
                      >
                        VER DETALLES
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;