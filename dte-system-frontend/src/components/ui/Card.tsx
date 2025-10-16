import React from 'react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
    >
      {children}
    </div>
  );
};

// Demo de componentes
export default function UIComponentsDemo() {
  const [showAlert, setShowAlert] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Componentes UI - Sistema DTE</h1>
      
      {/* Alerts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Alertas</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowAlert(true)}>
            Mostrar Alerta
          </Button>
        </div>
        {showAlert && (
          <Alert 
            message="Documento procesado exitosamente" 
            type="success"
            onClose={() => setShowAlert(false)}
          />
        )}
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Botones</h2>
        <div className="flex gap-2 flex-wrap">
          <Button variant="primary">Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="danger">Peligro</Button>
          <Button variant="ghost">Ghost</Button>
          <Button 
            isLoading={loading} 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
          >
            Con Loading
          </Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Nombre del cliente" 
            placeholder="Ingrese el nombre"
            required
          />
          <Input 
            label="NIT" 
            placeholder="0000-000000-000-0"
            helperText="Formato: 0000-000000-000-0"
          />
          <Input 
            label="Campo con error" 
            error="Este campo es requerido"
            defaultValue="Valor incorrecto"
          />
          <Input 
            label="Campo deshabilitado" 
            disabled
            defaultValue="No editable"
          />
        </div>
      </section>

      {/* Selects */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Selects</h2>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de documento"
            options={[
              { value: 'ccf', label: 'Comprobante de Crédito Fiscal' },
              { value: 'factura', label: 'Factura' },
              { value: 'nota', label: 'Nota de Crédito' }
            ]}
            required
          />
          <Select
            label="Método de pago"
            options={[
              { value: '01', label: 'Efectivo' },
              { value: '02', label: 'Tarjeta' },
              { value: '03', label: 'Transferencia' }
            ]}
          />
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cards</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Card Simple</h3>
            <p className="text-sm text-gray-600">Contenido de la card</p>
          </Card>
          <Card className="p-4" onClick={() => alert('Click!')}>
            <h3 className="font-semibold mb-2">Card Clickeable</h3>
            <p className="text-sm text-gray-600">Haz click aquí</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Con Estadística</h3>
            <p className="text-3xl font-bold text-blue-600">$1,234.00</p>
          </Card>
        </div>
      </section>
    </div>
  );
}