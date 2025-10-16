import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAlert } from '@/components/ui/useAlert';
import { ProductsTable } from '@/components/forms/ProductsTable';
import { LocationSelects } from '@/components/forms/LocationSelects';
import { dteSchema } from '@/utils/validators';
import { PAYMENT_METHODS } from '@/utils/constants';
import { dteApi } from '@/api/dte.api';
import { useDteStore } from '@/store/dteStore';
import type { DteDocument } from '@/types/dte.types';

const CreditoFiscalForm: React.FC = () => {
  const navigate = useNavigate();
  const { documentTitle } = useDteStore();
  const { showAlert, AlertComponent } = useAlert();

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
    documentType: 'ccf',
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

const onSubmit = async (data: DteDocument) => {
  try {
    console.log('Enviando DTE:', data);
    const response = await dteApi.create(data);
    
    showAlert('Documento generado exitosamente', 'success');
    console.log('Respuesta DTE:', response);
    
    // Reset form después de 2 segundos
    setTimeout(() => {
      reset();
      navigate('/documents');
    }, 2000);
    
  } catch (error) {
    console.error('Error al generar documento:', error);
    
    // ⭐ CORRECCIÓN: Manejo seguro del error
    let errorMsg = 'Error al generar el documento';
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { descripcionMsg?: string } }; message?: string };
      errorMsg = axiosError.response?.data?.descripcionMsg || 
                 axiosError.message || 
                 errorMsg;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    
    showAlert(errorMsg, 'error');
  }
};

  return (
    <Layout 
      title={documentTitle || 'Comprobante de Crédito Fiscal'}
      subtitle="Complete el formulario para generar el documento"
    >
      {AlertComponent}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Información del Receptor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Información del Receptor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('receiver.nit')}
              label="NIT"
              placeholder="0000-000000-000-0"
              helperText="Formato: 0000-000000-000-0"
              error={errors.receiver?.nit?.message}
            />

            <Input
              {...register('receiver.nrc')}
              label="NRC"
              placeholder="Número de registro"
              error={errors.receiver?.nrc?.message}
            />

            <Input
              {...register('receiver.name')}
              label="Nombre del Cliente"
              placeholder="Nombre completo"
              required
              error={errors.receiver?.name?.message}
            />

            <Input
              {...register('receiver.commercialName')}
              label="Nombre Comercial"
              placeholder="Nombre comercial (opcional)"
            />

            <Input
              {...register('receiver.economicActivity')}
              label="Actividad Económica"
              placeholder="Descripción de la actividad"
            />

            <Input
              {...register('receiver.phone')}
              label="Teléfono"
              placeholder="0000-0000"
              helperText="Formato: 0000-0000"
              error={errors.receiver?.phone?.message}
            />

            <Input
              {...register('receiver.email')}
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.receiver?.email?.message}
            />
          </div>

          <div className="mt-4">
            <LocationSelects
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />
          </div>

          <div className="mt-4">
            <Input
              {...register('receiver.address')}
              label="Dirección"
              placeholder="Dirección completa"
              required
              error={errors.receiver?.address?.message}
            />
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow p-6">
          <ProductsTable
            control={control}
            register={register}
            watch={watch}
            errors={errors}
          />
        </div>

        {/* Método de Pago */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Método de Pago
          </h2>
          <Select
            {...register('paymentMethod')}
            label="Forma de Pago"
            options={PAYMENT_METHODS.map(pm => ({ value: pm.value, label: pm.label }))}
            required
            error={errors.paymentMethod?.message}
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/documents')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Generando documento...' : 'Generar Documento'}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default CreditoFiscalForm;