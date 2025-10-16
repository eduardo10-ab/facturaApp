// Migración de dte.js submitDTEDocument
import axiosInstance from './axios.config';
import type { DteDocument, DteResponse } from '@/types/dte.types';

export const dteApi = {
  create: async (document: DteDocument): Promise<DteResponse> => {
    const { data } = await axiosInstance.post<DteResponse>('/dte/create', document);
    return data;
  },

  query: async (codigoGeneracion: string, tdte: string): Promise<DteResponse> => {
    const { data } = await axiosInstance.post<DteResponse>('/dte/query', {
      codigoGeneracion,
      tdte
    });
    return data;
  }
};
