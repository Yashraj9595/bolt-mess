import { useState, useCallback } from 'react';
import { AuthError, handleApiError } from '../utils/error';

interface AuthState<T> {
  isLoading: boolean;
  error: AuthError | null;
  data: T | null;
}

interface UseAuthState<T> extends AuthState<T> {
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  setData: (data: T | null) => void;
  handleError: (error: any) => void;
  reset: () => void;
}

export function useAuthState<T>(initialData: T | null = null): UseAuthState<T> {
  const [state, setState] = useState<AuthState<T>>({
    isLoading: false,
    error: null,
    data: initialData,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: AuthError | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const handleError = useCallback((error: any) => {
    const processedError = handleApiError(error);
    setError(processedError);
  }, [setError]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: initialData,
    });
  }, [initialData]);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    handleError,
    reset,
  };
} 