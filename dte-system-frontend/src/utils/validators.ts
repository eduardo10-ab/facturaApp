import { z } from 'zod';

// Schema para información del receptor
export const receiverSchema = z.object({
  nit: z.string().optional(),
  nrc: z.string().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  commercialName: z.string().optional(),
  economicActivity: z.string().optional(),
  department: z.string().min(1, 'Seleccione un departamento'),
  municipality: z.string().min(1, 'Seleccione un municipio'),
  address: z.string().min(1, 'Dirección requerida'),
  email: z.string().optional(),
  phone: z.string().optional()
});

// Schema para producto
export const productSchema = z.object({
  quantity: z.number().min(1, 'Cantidad debe ser mayor a 0'),
  unit: z.string().optional(),
  description: z.string().min(1, 'Descripción requerida'),
  saleType: z.string().min(1, 'Seleccione tipo de venta'),
  unitPrice: z.number().min(0, 'Precio debe ser mayor o igual a 0')
});

// Schema completo para DTE
export const dteSchema = z.object({
  documentType: z.string().min(1),
  receiver: receiverSchema,
  products: z.array(productSchema).min(0), // CAMBIADO: de min(1) a min(0) para permitir array vacío
  paymentMethod: z.string().min(1, 'Método de pago requerido'),
  issuer: z.object({
    docNumber: z.string().optional(),
    name: z.string().optional()
  }).optional(),
  receiverResponsible: z.object({
    docNumber: z.string().optional(),
    name: z.string().optional()
  }).optional()
});

// Funciones de validación individuales (para uso directo)
export const validators = {
  validateNIT: (nit: string): boolean => {
    if (!nit) return true;
    return /^\d{4}-\d{6}-\d{3}-\d{1}$/.test(nit);
  },

  validateNRC: (nrc: string): boolean => {
    if (!nrc) return true;
    return /^\d{8,15}$/.test(nrc);
  },

  validateEmail: (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone: (phone: string): boolean => {
    if (!phone) return true;
    return /^\d{4}-\d{4}$/.test(phone);
  },

  validateLettersOnly: (value: string): boolean => {
    return /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(value);
  },

  validateNumbersOnly: (value: string): boolean => {
    return /^[\d-]+$/.test(value);
  }
};