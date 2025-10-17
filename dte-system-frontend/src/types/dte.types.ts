// ==================== src/types/dte.types.ts ====================
export interface DteDocument {
  documentType: string;
  receiver: ReceiverInfo;
  products: Product[];
  paymentMethod: string;
  issuer?: IssuerInfo;
  receiverResponsible?: ResponsibleInfo;
}

export interface ReceiverInfo {
  nit?: string;
  nrc?: string;
  name: string;
  commercialName?: string;
  economicActivity?: string;
  department: string;
  municipality: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface Product {
  quantity: number;
  unit?: string;
  description: string;
  saleType: string; // CAMBIO: de '1' | '2' a string
  unitPrice: number;
}

export interface IssuerInfo {
  docNumber?: string;
  name?: string;
}

export interface ResponsibleInfo {
  docNumber?: string;
  name?: string;
}

export interface DteResponse {
  version: number;
  ambiente: string;
  versionApp: number;
  estado: 'PROCESADO' | 'RECHAZADO' | 'RECIBIDO';
  codigoGeneracion: string;
  selloRecibido?: string;
  fhProcesamiento: string;
  clasificaMsg?: string;
  codigoMsg: string;
  descripcionMsg: string;
  observaciones?: string[];
}