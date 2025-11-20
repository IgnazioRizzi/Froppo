import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('Errore:', error);
    
    if (error.response?.data) {
      setError(error.response.data);
    } else if (error.message) {
      setError(error.message);
    } else {
      setError('Si è verificato un errore imprevisto');
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { error, handleError, clearError };
};
