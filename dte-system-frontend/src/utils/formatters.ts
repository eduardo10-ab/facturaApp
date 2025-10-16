// Migración de utils.js formatCurrency
export const formatters = {
  currency: (amount: number): string => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  date: (date: Date): string => {
    return new Intl.DateTimeFormat('es-SV').format(date);
  },

  datetime: (date: Date): string => {
    return new Intl.DateTimeFormat('es-SV', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }
};
