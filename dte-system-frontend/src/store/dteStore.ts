import { create } from 'zustand';

interface DteState {
  currentDocumentType: string | null;
  documentTitle: string | null;
  setDocumentType: (type: string, title: string) => void;
  clearDocumentType: () => void;
}

export const useDteStore = create<DteState>((set) => ({
  currentDocumentType: null,
  documentTitle: null,
  setDocumentType: (type, title) => set({ 
    currentDocumentType: type, 
    documentTitle: title 
  }),
  clearDocumentType: () => set({ 
    currentDocumentType: null, 
    documentTitle: null 
  })
}));
