// src/components/forms/ProductsTable.tsx
import React, { useState, useRef, useEffect } from 'react';
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

// Constantes para los tipos de detalle
const DETAIL_TYPES = [
  { value: 'product', label: 'Producto o Servicio' },
  { value: 'nonAffected', label: 'Monto No Afecto' },
  { value: 'taxWithVAT', label: 'Impuestos/Tasas con afectación al IVA' }
];

const PRODUCT_TYPES = [
  { value: '1', label: '1 - Bien' },
  { value: '2', label: '2 - Servicio' },
  { value: '3', label: '3 - Bien y servicio' }
];

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

  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const [showProductTypeDropdown, setShowProductTypeDropdown] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const mainDropdownRef = useRef<HTMLDivElement>(null);
  const productTypeDropdownRef = useRef<HTMLDivElement>(null);

  const products = watch('products') as Product[];

  // Limpiar productos iniciales si existen al montar
  useEffect(() => {
    if (!isInitialized && fields.length > 0) {
      // Remover todos los productos que existan inicialmente
      for (let i = fields.length - 1; i >= 0; i--) {
        remove(i);
      }
      setIsInitialized(true);
    } else if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [fields.length, isInitialized, remove]);

  const totals = calculateProductTotals(
    products?.map((p: Product) => ({
      quantity: p.quantity || 0,
      unitPrice: p.unitPrice || 0,
      saleType: (p.saleType === "1" || p.saleType === "2" ? p.saleType : "1") as "1" | "2"
    })) || []
  );

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonContainerRef.current && 
        !buttonContainerRef.current.contains(event.target as Node) &&
        mainDropdownRef.current && 
        !mainDropdownRef.current.contains(event.target as Node) &&
        productTypeDropdownRef.current && 
        !productTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMainDropdown(false);
        setShowProductTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlusButtonClick = () => {
    setShowMainDropdown(!showMainDropdown);
    setShowProductTypeDropdown(false);
  };

  const handleDetailTypeSelect = (detailType: string) => {
    if (detailType === 'product') {
      setShowMainDropdown(false);
      setShowProductTypeDropdown(true);
    } else {
      // Para otras opciones, agregar el producto directamente
      append({
        quantity: 1,
        unit: '',
        description: '',
        saleType: '1',
        unitPrice: 0
      });
      setShowMainDropdown(false);
    }
  };

  const handleProductTypeSelect = (productType: string) => {
    append({
      quantity: 1,
      unit: '',
      description: '',
      saleType: productType,
      unitPrice: 0
    });
    setShowProductTypeDropdown(false);
  };

  const handleRemoveProduct = (index: number) => {
    remove(index);
  };

  return (
    <>
      {/* Encabezado de la tabla - Siempre visible */}
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Botón redondo (+) con dropdown */}
      <div 
        ref={buttonContainerRef}
        style={{ position: 'relative', display: 'flex', justifyContent: 'center', margin: '20px 0' }}
      >
        <button 
          type="button" 
          className="add-product-btn" 
          onClick={handlePlusButtonClick}
        >
          +
        </button>

        {/* Dropdown principal */}
        {showMainDropdown && (
          <div
            ref={mainDropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              zIndex: 50,
              minWidth: '300px'
            }}
          >
            {DETAIL_TYPES.map((detailType) => (
              <button
                key={detailType.value}
                type="button"
                onClick={() => handleDetailTypeSelect(detailType.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.15s',
                  borderRadius: detailType.value === DETAIL_TYPES[0].value ? '6px 6px 0 0' : 
                               detailType.value === DETAIL_TYPES[DETAIL_TYPES.length - 1].value ? '0 0 6px 6px' : '0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {detailType.label}
                {detailType.value === 'product' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dropdown de tipos de producto */}
        {showProductTypeDropdown && (
          <div
            ref={productTypeDropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              zIndex: 50,
              minWidth: '250px'
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowProductTypeDropdown(false);
                  setShowMainDropdown(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              Tipo:
            </div>
            {PRODUCT_TYPES.map((productType) => (
              <button
                key={productType.value}
                type="button"
                onClick={() => handleProductTypeSelect(productType.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#1f2937',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {productType.label}
              </button>
            ))}
          </div>
        )}
      </div>

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