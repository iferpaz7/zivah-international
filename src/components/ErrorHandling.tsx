'use client';

import React, { useEffect, useState } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      return (
        <ErrorFallback
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800'>
        <div className='mb-4 text-6xl'>⚠️</div>
        <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>Algo salió mal</h2>
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>

        <div className='space-y-3'>
          <button
            onClick={reset}
            className='bg-accent hover:bg-dark-accent w-full rounded-lg px-4 py-2 font-medium text-white transition-colors'
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => window.location.reload()}
            className='w-full rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
          >
            Recargar página
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'>
              Detalles técnicos
            </summary>
            <pre className='mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs dark:bg-gray-700'>
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({
  size = 'md',
  message = 'Cargando...',
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <div
        className={`${sizeClasses[size]} border-accent/20 border-t-accent mb-4 animate-spin rounded-full border-4`}
      />
      {message && <p className='text-sm text-gray-600 dark:text-gray-400'>{message}</p>}
    </div>
  );
}

// Loading skeleton for products
export function ProductSkeleton() {
  return (
    <div className='animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-4 h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700' />
      <div className='mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='mb-4 h-3 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='flex items-center justify-between'>
        <div className='h-4 w-16 rounded bg-gray-200 dark:bg-gray-700' />
        <div className='h-6 w-20 rounded bg-gray-200 dark:bg-gray-700' />
      </div>
    </div>
  );
}

// Loading skeleton for content
export function ContentSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='h-4 w-full rounded bg-gray-200 dark:bg-gray-700' />
      <div className='h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700' />
    </div>
  );
}

// Network status indicator
export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className='fixed right-4 bottom-4 z-50 rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg'>
      <div className='flex items-center space-x-2'>
        <div className='h-2 w-2 animate-pulse rounded-full bg-white' />
        <span className='text-sm font-medium'>Sin conexión</span>
      </div>
    </div>
  );
}

// Toast notification system
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const typeStyles = {
    success: 'bg-accent text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 ${typeStyles[type]} z-50 max-w-sm rounded-lg px-4 py-3 shadow-lg`}
    >
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>{message}</span>
        <button
          onClick={onClose}
          className='ml-4 text-white transition-colors hover:text-gray-200'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastProps['type'] }>
  >([]);

  const addToast = (message: string, type: ToastProps['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
}

// Toast container component
export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Array<{ id: string; message: string; type: ToastProps['type'] }>;
  onRemove: (id: string) => void;
}) {
  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
