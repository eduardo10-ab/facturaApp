import { useState } from 'react';
import { Alert, AlertProps } from '@/components/ui/Alert';

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const showAlert = (message: string, type: AlertProps['type'] = 'success') => {
    setAlert({ message, type });
  };

  const hideAlert = () => setAlert(null);

  const AlertComponent = alert ? (
    <Alert {...alert} onClose={hideAlert} />
  ) : null;

  return { showAlert, hideAlert, AlertComponent };
};