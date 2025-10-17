// Reemplaza COMPLETO src/pages/documentSelection.tsx
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useDteStore } from '@/store/dteStore';
import { DOCUMENT_TYPES } from '@/utils/constants';
import '@/styles/documentSelection.css';

interface DocumentTypeCard {
  type: string;
  title: string;
  subtitle: string;
  path: string;
  index: number;
  highlighted?: boolean;
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
    index: 3,
    highlighted: true
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
      <div className="document-selection-grid">
        {/* Cards de documentos */}
        {visibleCards.map((card) => (
          <div
            key={card.type}
            onClick={() => handleDocumentClick(card)}
            className={`doc-card ${card.highlighted ? 'doc-card--highlighted' : ''}`}
          >
            {/* Contenido */}
            <div className="doc-card__content">
              <h3 className="doc-card__title">
                {card.title}
              </h3>
              <p className="doc-card__subtitle">
                {card.subtitle}
              </p>
            </div>

            {/* Botón */}
            <button 
              className={`doc-card__button ${
                card.highlighted 
                  ? 'doc-card__button--highlighted' 
                  : 'doc-card__button--normal'
              }`}
            >
              Crear documento
            </button>
          </div>
        ))}

        {/* Botón Ver todos / Compactar */}
        {!isExpanded ? (
          <div
            onClick={() => setIsExpanded(true)}
            className="toggle-card"
          >
            <ChevronDown className="toggle-card__icon" />
            <p className="toggle-card__title">Ver todos</p>
            <p className="toggle-card__subtitle">
              Mostrar {hiddenCount} documentos más
            </p>
          </div>
        ) : (
          <div
            onClick={() => setIsExpanded(false)}
            className="toggle-card toggle-card--expanded"
          >
            <ChevronUp className="toggle-card__icon" />
            <p className="toggle-card__title">Compactar</p>
            <p className="toggle-card__subtitle">
              Mostrar menos documentos
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentSelection;