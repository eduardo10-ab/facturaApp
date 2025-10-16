import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useDteStore } from '@/store/dteStore';
import { DOCUMENT_TYPES } from '@/utils/constants';

interface DocumentTypeCard {
  type: string;
  title: string;
  subtitle: string;
  path: string;
  index: number;
}

const documentCards: DocumentTypeCard[] = [
  {
    type: DOCUMENT_TYPES.CCF.code,
    title: DOCUMENT_TYPES.CCF.name,
    subtitle: 'Documento oficial para operaciones con IVA',
    path: '/documents/ccf',
    index: 1
  },
  {
    type: DOCUMENT_TYPES.FACTURA.code,
    title: DOCUMENT_TYPES.FACTURA.name,
    subtitle: 'Comprobante de venta estándar',
    path: '/documents/factura',
    index: 2
  },
  {
    type: DOCUMENT_TYPES.DECLARACION_RENTA.code,
    title: DOCUMENT_TYPES.DECLARACION_RENTA.name,
    subtitle: 'Documento tributario oficial',
    path: '/documents/declaracion-renta',
    index: 3
  },
  {
    type: DOCUMENT_TYPES.NOTA_REMISION.code,
    title: DOCUMENT_TYPES.NOTA_REMISION.name,
    subtitle: 'Documento que verifica una entrega',
    path: '/documents/nota-remision',
    index: 4
  },
  {
    type: DOCUMENT_TYPES.NOTA_CREDITO.code,
    title: DOCUMENT_TYPES.NOTA_CREDITO.name,
    subtitle: 'Reducción de factura',
    path: '/documents/nota-credito',
    index: 5
  },
  {
    type: DOCUMENT_TYPES.NOTA_DEBITO.code,
    title: DOCUMENT_TYPES.NOTA_DEBITO.name,
    subtitle: 'Aumento del valor facturado',
    path: '/documents/nota-debito',
    index: 6
  },
  {
    type: DOCUMENT_TYPES.COMPROBANTE_RETENCION.code,
    title: DOCUMENT_TYPES.COMPROBANTE_RETENCION.name,
    subtitle: 'Constancia de impuestos retenidos',
    path: '/documents/comprobante-retencion',
    index: 7
  },
  {
    type: DOCUMENT_TYPES.FACTURA_EXPORTACION.code,
    title: DOCUMENT_TYPES.FACTURA_EXPORTACION.name,
    subtitle: 'Documento de venta internacional',
    path: '/documents/factura-exportacion',
    index: 8
  },
  {
    type: DOCUMENT_TYPES.FACTURA_EXCLUIDO.code,
    title: DOCUMENT_TYPES.FACTURA_EXCLUIDO.name,
    subtitle: 'Factura sin débito fiscal',
    path: '/documents/factura-excluido',
    index: 9
  }
];

const DocumentSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setDocumentType } = useDteStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCards = isExpanded ? documentCards : documentCards.slice(0, 5);
  const hiddenCount = documentCards.length - 5;

  const handleDocumentClick = (card: DocumentTypeCard) => {
    setDocumentType(card.type, card.title);
    navigate(card.path);
  };

  return (
    <Layout 
      title="Selección de Documento"
      subtitle="Elige el tipo de documento que deseas generar"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards de documentos */}
        {visibleCards.map((card) => (
          <Card
            key={card.type}
            className="p-6 cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all"
            onClick={() => handleDocumentClick(card)}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">
                {card.subtitle}
              </p>
            </div>
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Crear documento
            </button>
          </Card>
        ))}

        {/* Card para expandir/contraer */}
        {!isExpanded && (
          <Card
            className="p-6 cursor-pointer hover:shadow-lg border-dashed flex flex-col items-center justify-center"
            onClick={() => setIsExpanded(true)}
          >
            <ChevronDown className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-lg font-semibold text-gray-700 mb-1">
              Ver todos
            </p>
            <p className="text-sm text-gray-500">
              Mostrar {hiddenCount} documentos más
            </p>
          </Card>
        )}

        {/* Card para contraer cuando está expandido */}
        {isExpanded && (
          <Card
            className="p-6 cursor-pointer hover:shadow-lg border-dashed flex flex-col items-center justify-center md:col-span-2 lg:col-span-3"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronUp className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-lg font-semibold text-gray-700 mb-1">
              Compactar
            </p>
            <p className="text-sm text-gray-500">
              Mostrar menos documentos
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DocumentSelection;