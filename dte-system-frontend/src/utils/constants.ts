// Migración de dte.js departamentosYMunicipios
export const DEPARTAMENTOS_MUNICIPIOS = {
  "01": {
    nombre: "Ahuachapán",
    municipios: {
      "01": "Ahuachapán Norte",
      "02": "Ahuachapán Centro",
      "03": "Ahuachapán Sur"
    }
  },
  "02": {
    nombre: "Santa Ana",
    municipios: {
      "01": "Santa Ana Norte",
      "02": "Santa Ana Centro",
      "03": "Santa Ana Este",
      "04": "Santa Ana Oeste"
    }
  },
  "03": {
    nombre: "Sonsonate",
    municipios: {
      "01": "Sonsonate Norte",
      "02": "Sonsonate Centro",
      "03": "Sonsonate Este",
      "04": "Sonsonate Oeste"
    }
  },
  "04": {
    nombre: "Chalatenango",
    municipios: {
      "01": "Chalatenango Norte",
      "02": "Chalatenango Centro",
      "03": "Chalatenango Sur"
    }
  },
  "05": {
    nombre: "La Libertad",
    municipios: {
      "01": "La Libertad Norte",
      "02": "La Libertad Centro",
      "03": "La Libertad Oeste",
      "04": "La Libertad Este",
      "05": "La Libertad Costa",
      "06": "La Libertad Sur"
    }
  },
  "06": {
    nombre: "San Salvador",
    municipios: {
      "01": "San Salvador Norte",
      "02": "San Salvador Oeste",
      "03": "San Salvador Este",
      "04": "San Salvador Centro",
      "05": "San Salvador Sur"
    }
  },
  "07": {
    nombre: "Cuscatlán",
    municipios: {
      "01": "Cuscatlán Norte",
      "02": "Cuscatlán Sur"
    }
  },
  "08": {
    nombre: "La Paz",
    municipios: {
      "01": "La Paz Oeste",
      "02": "La Paz Centro",
      "03": "La Paz Este"
    }
  },
  "09": {
    nombre: "Cabañas",
    municipios: {
      "01": "Cabañas Este",
      "02": "Cabañas Oeste"
    }
  },
  "10": {
    nombre: "San Vicente",
    municipios: {
      "01": "San Vicente Norte",
      "02": "San Vicente Sur"
    }
  },
  "11": {
    nombre: "Usulután",
    municipios: {
      "01": "Usulután Norte",
      "02": "Usulután Este",
      "03": "Usulután Oeste"
    }
  },
  "12": {
    nombre: "San Miguel",
    municipios: {
      "01": "San Miguel Norte",
      "02": "San Miguel Centro",
      "03": "San Miguel Oeste"
    }
  },
  "13": {
    nombre: "Morazán",
    municipios: {
      "01": "Morazán Norte",
      "02": "Morazán Sur"
    }
  },
  "14": {
    nombre: "La Unión",
    municipios: {
      "01": "La Unión Norte",
      "02": "La Unión Sur"
    }
  }
} as const;

export const DOCUMENT_TYPES = {
  CCF: { code: 'ccf', name: 'Comprobante de Crédito Fiscal' },
  FACTURA: { code: 'factura', name: 'Factura' },
  NOTA_CREDITO: { code: 'notaCredito', name: 'Nota de Crédito' },
  NOTA_DEBITO: { code: 'notaDebito', name: 'Nota de Débito' },
  NOTA_REMISION: { code: 'notaRemision', name: 'Nota de Remisión' },
  COMPROBANTE_RETENCION: { code: 'comprobanteRetencion', name: 'Comprobante de Retención' },
  DECLARACION_RENTA: { code: 'declaracionRenta', name: 'Declaración de Renta' },
  FACTURA_EXPORTACION: { code: 'facturaExportacion', name: 'Factura de Exportación' },
  FACTURA_EXCLUIDO: { code: 'facturaExcluido', name: 'Factura de Sujeto Excluido' }
} as const;

export const PAYMENT_METHODS = [
  { value: '01', label: 'Efectivo' },
  { value: '02', label: 'Cheque' },
  { value: '03', label: 'Transferencia' },
  { value: '04', label: 'Tarjeta Crédito' },
  { value: '05', label: 'Tarjeta Débito' }
] as const;

export const SALE_TYPES = [
  { value: '1', label: 'Gravado' },
  { value: '2', label: 'Exento' }
] as const;