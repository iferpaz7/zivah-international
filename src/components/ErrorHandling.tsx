'use client';

import React, { useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
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
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
      <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center'>
        <div className='text-6xl mb-4'>⚠️</div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
          Algo salió mal
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Ha ocurrido un error inesperado. Por favor, intenta recargar la
          página.
        </p>

        <div className='space-y-3'>
          <button
            onClick={reset}
            className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => window.location.reload()}
            className='w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
          >
            Recargar página
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'>
              Detalles técnicos
            </summary>
            <pre className='mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto'>
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
        className={`${sizeClasses[size]} border-4 border-green-200 dark:border-green-800 border-t-green-600 dark:border-t-green-400 rounded-full animate-spin mb-4`}
      ></div>
      {message && (
        <p className='text-gray-600 dark:text-gray-400 text-sm'>{message}</p>
      )}
    </div>
  );
}

// Loading skeleton for products
export function ProductSkeleton() {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse'>
      <div className='w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4'></div>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
      <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4'></div>
      <div className='flex justify-between items-center'>
        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-16'></div>
        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-20'></div>
      </div>
    </div>
  );
}

// Loading skeleton for content
export function ContentSkeleton() {
  return (
    <div className='space-y-4 animate-pulse'>
      <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6'></div>
      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6'></div>
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
    <div className='fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'>
      <div className='flex items-center space-x-2'>
        <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
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
    success: 'bg-green-600 text-white',
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
      className={`fixed top-4 right-4 ${typeStyles[type]} px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm`}
    >
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>{message}</span>
        <button
          onClick={onClose}
          className='ml-4 text-white hover:text-gray-200 transition-colors'
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
    <div className='fixed top-4 right-4 space-y-2 z-50'>
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
