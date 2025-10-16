import React from 'react';
import { useFieldArray, Control, UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { SALE_TYPES } from '@/utils/constants';
import { formatters } from '@/utils/formatters';
import { calculateProductTotals } from '@/utils/calculations';
import type { DteDocument, Product } from '@/types/dte.types';

interface ProductsTableProps {
  control: Control<DteDocument>;
  register: UseFormRegister<DteDocument>;
  watch: UseFormWatch<DteDocument>;
  errors: FieldErrors<DteDocument>;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  control,
  register,
  watch,
  errors
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  });

  const products = watch('products') as Product[];

  const totals = calculateProductTotals(
    products?.map((p: Product) => ({
      quantity: p.quantity || 0,
      unitPrice: p.unitPrice || 0,
      saleType: (p.saleType === "1" || p.saleType === "2" ? p.saleType : "1") as "1" | "2"
    })) || []
  );

  const handleAddProduct = () => {
    append({
      quantity: 1,
      unit: '',
      description: '',
      saleType: '1',
      unitPrice: 0
    });
  };

  const handleRemoveProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      alert('Debe mantener al menos un producto');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Productos / Servicios</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddProduct}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cantidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Unidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tipo de Venta
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Precio Unitario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subtotal
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fields.map((field, index) => {
              const product = products?.[index];
              const subtotal = (product?.quantity || 0) * (product?.unitPrice || 0);

              return (
                <tr key={field.id} className="bg-white">
                  <td className="px-4 py-3">
                    <Input
                      {...register(`products.${index}.quantity` as const, { valueAsNumber: true })}
                      type="number"
                      min="1"
                      step="1"
                      className="w-24"
                      error={errors.products?.[index]?.quantity?.message}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      {...register(`products.${index}.unit` as const)}
                      type="text"
                      placeholder="Unidad"
                      className="w-32"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      {...register(`products.${index}.description` as const)}
                      type="text"
                      placeholder="Descripción del producto"
                      className="min-w-[200px]"
                      error={errors.products?.[index]?.description?.message}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      {...register(`products.${index}.saleType` as const)}
                      options={SALE_TYPES.map(t => ({ value: t.value, label: t.label }))}
                      className="w-32"
                      error={errors.products?.[index]?.saleType?.message}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      {...register(`products.${index}.unitPrice` as const, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-32"
                      error={errors.products?.[index]?.unitPrice?.message}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {formatters.currency(subtotal)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="max-w-md ml-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">{formatters.currency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Exento:</span>
            <span className="font-medium">{formatters.currency(totals.subtotalExento)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA (13%):</span>
            <span className="font-medium">{formatters.currency(totals.iva)}</span>
          </div>
          <div className="flex justify-between text-lg border-t border-gray-300 pt-3">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-bold text-blue-600">{formatters.currency(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};