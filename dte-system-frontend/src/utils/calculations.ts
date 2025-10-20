// src/utils/calculations.ts
export interface TotalsResult {
  retencionIVA: number;
  retencionRenta: number;
  subtotal: number;
  montoTotal: number;
  totalAPagar: number;
}

export const calculateProductTotals = (
  products: Array<{
    quantity: number;
    unitPrice: number;
    saleType: '1' | '2';
  }>
): TotalsResult => {
  let subtotalGravado = 0;
  let subtotalExento = 0;

  // Calcular subtotales por tipo de venta
  products.forEach((product) => {
    const itemSubtotal = product.quantity * product.unitPrice;
    
    if (product.saleType === '1') {
      // Gravado (con IVA)
      subtotalGravado += itemSubtotal;
    } else if (product.saleType === '2') {
      // Exento (sin IVA)
      subtotalExento += itemSubtotal;
    }
  });

  // Subtotal: suma de operaciones gravadas (sin IVA)
  const subtotal = subtotalGravado;
  
  // IVA: 13% sobre operaciones gravadas
  const iva = subtotalGravado * 0.13;
  
  // Monto Total de la operación: subtotal + IVA + exento
  const montoTotal = subtotalGravado + iva + subtotalExento;
  
  // Retención IVA: 1% sobre el total de la operación (con IVA)
  const retencionIVA = montoTotal * 0.01;
  
  // Retención Renta: 10% sobre el subtotal (sin IVA)
  const retencionRenta = subtotalGravado * 0.10;
  
  // Total a pagar: Monto Total - retenciones
  const totalAPagar = montoTotal - retencionIVA - retencionRenta;

  return {
    retencionIVA,
    retencionRenta,
    subtotal,
    montoTotal,
    totalAPagar
  };
};