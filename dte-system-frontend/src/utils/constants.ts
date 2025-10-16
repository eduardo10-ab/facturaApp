// Migración de dte.js departamentosYMunicipios
export const DEPARTAMENTOS_MUNICIPIOS = {
  "01": { 
    nombre: "Ahuachapán", 
    municipios: { 
      "01":"Ahuachapán", "02":"Apaneca", "03":"Atiquizaya", 
      "04":"Concepción de Ataco", "05":"El Refugio", "06":"Guaymango", 
      "07":"Jujutla", "08":"San Francisco Menéndez", "09":"San Lorenzo", 
      "10":"San Pedro Puxtla", "11":"Tacuba", "12":"Turín" 
    } 
  },
  "02": { 
    nombre: "Cabañas", 
    municipios: { 
      "01":"Cinquera", "02":"Dolores", "03":"Guacotecti", 
      "04":"Ilobasco", "05":"Jutiapa", "06":"San Isidro", 
      "07":"Sensuntepeque", "08":"Tejutepeque", "09":"Victoria" 
    } 
  },
  "03": { 
    nombre: "Chalatenango", 
    municipios: { 
      "01":"Agua Caliente", "02":"Arcatao", "03":"Azacualpa", 
      "04":"Citalá", "05":"Comalapa", "06":"Concepción Quezaltepeque", 
      "07":"Chalatenango", "08":"Dulce Nombre de María", "09":"El Carrizal", 
      "10":"El Paraíso", "11":"La Laguna", "12":"La Palma", 
      "13":"La Reina", "14":"Las Vueltas", "15":"Nombre de Jesús", 
      "16":"Nueva Concepción", "17":"Nueva Trinidad", "18":"Ojos de Agua", 
      "19":"Potonico", "20":"San Antonio de la Cruz", "21":"San Antonio Los Ranchos", 
      "22":"San Fernando", "23":"San Francisco Lempa", "24":"San Francisco Morazán", 
      "25":"San Ignacio", "26":"San Isidro Labrador", "27":"San Luis del Carmen", 
      "28":"San Miguel de Mercedes", "29":"San Rafael", "30":"Santa Rita", 
      "31":"Tejutla" 
    } 
  },
  "04": { 
    nombre: "Cuscatlán", 
    municipios: { 
      "01":"Candelaria", "02":"Cojutepeque", "03":"El Carmen", 
      "04":"El Rosario", "05":"Monte San Juan", "06":"Oratorio de Concepción", 
      "07":"San Bartolomé Perulapía", "08":"San Cristóbal", "09":"San José Guayabal", 
      "10":"San Pedro Perulapán", "11":"San Rafael Cedros", "12":"San Ramón", 
      "13":"Santa Cruz Analquito", "14":"Santa Cruz Michapa", "15":"Suchitoto", 
      "16":"Tenancingo" 
    } 
  },
  "05": { 
    nombre: "La Libertad", 
    municipios: { 
      "01":"Antiguo Cuscatlán", "02":"Ciudad Arce", "03":"Colón", 
      "04":"Comasagua", "05":"Chiltiupán", "06":"Huizúcar", 
      "07":"Jayaque", "08":"Jicalapa", "09":"La Libertad", 
      "10":"Santa Tecla", "11":"Nuevo Cuscatlán", "12":"San Juan Opico", 
      "13":"Quezaltepeque", "14":"Sacacoyo", "15":"San José Villanueva", 
      "16":"San Matías", "17":"San Pablo Tacachico", "18":"Tamanique", 
      "19":"Talnique", "20":"Teotepeque", "21":"Tepecoyo", 
      "22":"Zaragoza" 
    } 
  },
  "10": { 
    nombre: "San Salvador", 
    municipios: { 
      "01":"Aguilares", "02":"Apopa", "03":"Ayutuxtepeque", 
      "04":"Cuscatancingo", "05":"El Paisnal", "06":"Guazapa", 
      "07":"Ilopango", "08":"Mejicanos", "09":"Nejapa", 
      "10":"Panchimalco", "11":"Rosario de Mora", "12":"San Marcos", 
      "13":"San Martín", "14":"San Salvador", "15":"Santiago Texacuangos", 
      "16":"Santo Tomás", "17":"Soyapango", "18":"Tonacatepeque" 
    } 
  }
  // Agregar resto de departamentos según necesidad
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
