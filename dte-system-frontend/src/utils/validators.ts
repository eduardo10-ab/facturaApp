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
  products: z.array(productSchema).min(0),
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

// Funciones de validación y formato
export const validators = {
  // NIT: Solo números, máximo 9 dígitos
  formatNIT: (value: string): string => {
    const numbersOnly = value.replace(/[^\d]/g, '');
    return numbersOnly.slice(0, 9);
  },

  // NRC: Solo números, máximo 7 dígitos
  formatNRC: (value: string): string => {
    const numbersOnly = value.replace(/[^\d]/g, '');
    return numbersOnly.slice(0, 7);
  },

  // Teléfono: Solo números y guiones, máximo 8 dígitos (sin contar guiones)
  formatPhone: (value: string): string => {
    // Eliminar todo excepto números y guiones
    let formatted = value.replace(/[^\d-]/g, '');
    
    // Contar solo los números (sin guiones)
    const numbersOnly = formatted.replace(/-/g, '');
    
    // Si hay más de 8 números, recortar
    if (numbersOnly.length > 8) {
      const numbers = numbersOnly.slice(0, 8);
      // Reformatear con guión si es necesario
      if (numbers.length >= 4) {
        formatted = numbers.slice(0, 4) + '-' + numbers.slice(4);
      } else {
        formatted = numbers;
      }
    }
    
    return formatted;
  },

  // Solo permite letras, espacios y caracteres especiales del español
  formatLettersOnly: (value: string): string => {
    return value.replace(/[^a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]/g, '');
  },

  // Validaciones completas
  validateNIT: (nit: string): boolean => {
    if (!nit) return true;
    return /^\d{1,9}$/.test(nit);
  },

  validateNRC: (nrc: string): boolean => {
    if (!nrc) return true;
    return /^\d{1,7}$/.test(nrc);
  },

  validateEmail: (email: string): boolean => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone: (phone: string): boolean => {
    if (!phone) return true;
    const numbersOnly = phone.replace(/-/g, '');
    return numbersOnly.length <= 8;
  },

  validateLettersOnly: (value: string): boolean => {
    if (!value) return true;
    return /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/.test(value);
  },

  validateNumbersOnly: (value: string): boolean => {
    return /^\d+$/.test(value);
  }
};