// src/pages/forms/creditoFiscal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductsTable } from '@/components/forms/ProductsTable';
import { LocationSelects } from '@/components/forms/LocationSelects';
import { dteSchema } from '@/utils/validators';
import { PAYMENT_METHODS } from '@/utils/constants';
import { dteApi } from '@/api/dte.api';
import { useDteStore } from '@/store/dteStore';
import type { DteDocument } from '@/types/dte.types';

// Iconos SVG
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
  </svg>
);

const CreditoFiscalForm: React.FC = () => {
  const navigate = useNavigate();
  const { documentTitle } = useDteStore();
  const [entryDate, setEntryDate] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DteDocument>({
    resolver: zodResolver(dteSchema),
    defaultValues: {
      documentType: 'notaCredito',
      products: [{
        quantity: 1,
        unit: '',
        description: '',
        saleType: '1',
        unitPrice: 0
      }],
      receiver: {
        nit: '',
        nrc: '',
        name: '',
        commercialName: '',
        economicActivity: '',
        department: '',
        municipality: '',
        address: '',
        email: '',
        phone: ''
      },
      paymentMethod: ''
    }
  });

  // Capturar fecha y hora de entrada
  useEffect(() => {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    setEntryDate(`${day}/${month}/${year}`);
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    setEntryTime(`${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`);
  }, []);

  const onSubmit = async (data: DteDocument) => {
    try {
      console.log('Enviando DTE:', data);
      const response = await dteApi.create(data);
      
      setAlert({ message: 'Documento generado exitosamente', type: 'success' });
      console.log('Respuesta DTE:', response);
      
      setTimeout(() => {
        reset();
        navigate('/documents');
      }, 2000);
      
    } catch (error) {
      console.error('Error al generar documento:', error);
      
      let errorMsg = 'Error al generar el documento';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { descripcionMsg?: string } }; message?: string };
        errorMsg = axiosError.response?.data?.descripcionMsg || 
                   axiosError.message || 
                   errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      setAlert({ message: errorMsg, type: 'error' });
    }
  };

  return (
    <Layout 
      title={documentTitle || 'Nota de credito'}
      subtitle="Completa la información del documento"
    >
      <div className="formulario">
        {alert && (
          <div className={`alert alert-${alert.type}`} style={{ marginBottom: '20px' }}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Fecha y Hora de Entrada */}
          <div className="entry-info-container">
            <div className="entry-info-content">
              <div className="entry-date-time">
                <div className="entry-date-wrapper">
                  <span className="entry-icon"><CalendarIcon /></span>
                  <div className="entry-date-info">
                    <span className="entry-label">Fecha de entrada</span>
                    <span className="entry-value">{entryDate}</span>
                  </div>
                </div>
                <div className="entry-time-wrapper">
                  <span className="entry-icon"><ClockIcon /></span>
                  <div className="entry-time-info">
                    <span className="entry-label">Hora de entrada</span>
                    <span className="entry-value">{entryTime}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="entry-cancel-btn"
                onClick={() => navigate('/documents')}
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Columnas del Formulario */}
          <div className="form-columns">
            {/* Columna Izquierda - Datos del Receptor */}
            <div className="form-section">
              <div className="section-header">Datos del receptor</div>
              
              <div className="caja1">
                <div className="form-row">
                  <div className="form-group">
                    <label>NIT</label>
                    <input
                      {...register('receiver.nit')}
                      type="text"
                      className="form-input"
                      placeholder="0000-000000-000-0"
                    />
                    {errors.receiver?.nit && (
                      <span style={{ color: '#dc2626', fontSize: '12px' }}>
                        {errors.receiver.nit.message}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>NRC</label>
                    <input
                      {...register('receiver.nrc')}
                      type="text"
                      className="form-input"
                      placeholder="000000000000000"
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Nombre del cliente</label>
                    <input
                      {...register('receiver.name')}
                      type="text"
                      className="form-input"
                      placeholder="Nombre del cliente"
                      required
                    />
                    {errors.receiver?.name && (
                      <span style={{ color: '#dc2626', fontSize: '12px' }}>
                        {errors.receiver.name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Nombre comercial</label>
                    <input
                      {...register('receiver.commercialName')}
                      type="text"
                      className="form-input"
                      placeholder="Nombre comercial"
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Actividad económica</label>
                    <input
                      {...register('receiver.economicActivity')}
                      type="text"
                      className="form-input"
                      placeholder="Actividad económica"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row2">
                <LocationSelects
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                />
              </div>

              <div className="form-row full">
                <div className="form-group">
                  <label>Complemento de dirección</label>
                  <input
                    {...register('receiver.address')}
                    type="text"
                    className="form-input"
                    placeholder="Complemento de dirección"
                  />
                </div>
              </div>

              <div className="caja3">
                <div className="form-row full">
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <input
                      {...register('receiver.email')}
                      type="email"
                      className="form-input"
                      placeholder="receptor@correo.com"
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      {...register('receiver.phone')}
                      type="tel"
                      className="form-input"
                      placeholder="0000-0000"
                    />
                  </div>
                </div>
              </div>

              <button type="button" className="login-btn">
                Guardar información
              </button>
            </div>

            {/* Columna Derecha - Productos y Servicios */}
            <div className="form-section2">
              <div className="section-header">Productos y Servicios</div>
              
              <ProductsTable
                control={control}
                register={register}
                watch={watch}
                errors={errors}
              />

              <div className="form-group" style={{ marginTop: '30px' }}>
                <label>Forma de pago</label>
                <select
                  {...register('paymentMethod')}
                  className="form-input"
                  required
                >
                  <option value="">Elija una opción</option>
                  {PAYMENT_METHODS.map(pm => (
                    <option key={pm.value} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row3">
                <div className="form-group">
                  <label>N° de documento del emisor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="N° de documento del emisor"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del emisor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nombre del emisor"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>N° de documento del receptor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="N° de documento del receptor"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del receptor</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nombre del receptor"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="button-group">
            <button
              type="button"
              className="submit-btn cancel-btn"
              onClick={() => navigate('/documents')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generando documento...' : 'Generar documento'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreditoFiscalForm;