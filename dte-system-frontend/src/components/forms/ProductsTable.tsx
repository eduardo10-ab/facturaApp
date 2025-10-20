// src/components/forms/ProductsTable.tsx
import React from 'react';
import { useFieldArray, Control, UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
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
    <>
      <table className="products-table">
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Unidad de medida</th>
            <th>Producto</th>
            <th>Tipo de venta</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => {
            const product = products?.[index];
            const subtotal = (product?.quantity || 0) * (product?.unitPrice || 0);

            return (
              <tr key={field.id}>
                <td>
                  <input
                    {...register(`products.${index}.quantity` as const, { valueAsNumber: true })}
                    type="number"
                    min="1"
                    step="1"
                  />
                  {errors.products?.[index]?.quantity && (
                    <span style={{ color: '#dc2626', fontSize: '11px', display: 'block' }}>
                      {errors.products[index]?.quantity?.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    {...register(`products.${index}.unit` as const)}
                    type="text"
                    placeholder="Unidad"
                  />
                </td>
                <td>
                  <input
                    {...register(`products.${index}.description` as const)}
                    type="text"
                    placeholder="Descripción"
                    required
                  />
                  {errors.products?.[index]?.description && (
                    <span style={{ color: '#dc2626', fontSize: '11px', display: 'block' }}>
                      {errors.products[index]?.description?.message}
                    </span>
                  )}
                </td>
                <td>
                  <select
                    {...register(`products.${index}.saleType` as const)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {SALE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  {errors.products?.[index]?.saleType && (
                    <span style={{ color: '#dc2626', fontSize: '11px', display: 'block' }}>
                      {errors.products[index]?.saleType?.message}
                    </span>
                  )}
                </td>
                <td>
                  <input
                    {...register(`products.${index}.unitPrice` as const, { valueAsNumber: true })}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                  {errors.products?.[index]?.unitPrice && (
                    <span style={{ color: '#dc2626', fontSize: '11px', display: 'block' }}>
                      {errors.products[index]?.unitPrice?.message}
                    </span>
                  )}
                </td>
                <td>
                  <div style={{ 
                    padding: '8px 12px', 
                    textAlign: 'right', 
                    fontWeight: '600',
                    color: '#1e293b' 
                  }}>
                    {formatters.currency(subtotal)}
                  </div>
                </td>
                <td>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '4px'
                      }}
                      title="Eliminar producto"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button type="button" className="add-product-btn" onClick={handleAddProduct}>
        +
      </button>

      <div style={{ textAlign: 'center', color: '#6b7280', margin: '20px 0' }}>
        Suma total de operaciones
      </div>

      <div className="totals-section">
        <div className="total-row">
          <span>Retención IVA:</span>
          <span>{formatters.currency(totals.retencionIVA)}</span>
        </div>
        <div className="total-row">
          <span>Retención Renta:</span>
          <span>{formatters.currency(totals.retencionRenta)}</span>
        </div>
        <div className="total-row">
          <span>Subtotal:</span>
          <span>{formatters.currency(totals.subtotal)}</span>
        </div>
        <div className="total-row">
          <span>Monto Total de la operación:</span>
          <span>{formatters.currency(totals.montoTotal)}</span>
        </div>
        <div className="total-row final">
          <span>Total a pagar:</span>
          <span>{formatters.currency(totals.totalAPagar)}</span>
        </div>
      </div>
    </>
  );
};