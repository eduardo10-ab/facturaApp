// Migración de products.js calculateTotals
export interface TotalsResult {
  subtotal: number;
  subtotalGravado: number;
  subtotalExento: number;
  iva: number;
  total: number;
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

  products.forEach((product) => {
    const subtotal = product.quantity * product.unitPrice;
    
    if (product.saleType === '1') {
      subtotalGravado += subtotal;
    } else if (product.saleType === '2') {
      subtotalExento += subtotal;
    }
  });

  const iva = subtotalGravado * 0.13;
  const total = subtotalGravado + iva + subtotalExento;
  const subtotal = subtotalGravado + subtotalExento;

  return {
    subtotal,
    subtotalGravado,
    subtotalExento,
    iva,
    total
  };
};