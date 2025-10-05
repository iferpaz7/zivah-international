import * as React from 'react';

import { cn } from '@/lib/utils';

import { Label } from './label';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>
      {children}
      {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
    </div>
  );
}

interface FormGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3;
  className?: string;
}

export function FormGrid({ children, cols = 2, className }: FormGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return <div className={cn('grid gap-6', gridCols[cols], className)}>{children}</div>;
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className='border-b border-gray-200 dark:border-gray-700 pb-4'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{title}</h3>
        {description && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-4 justify-end border-t border-gray-200 dark:border-gray-700 pt-6',
        className
      )}
    >
      {children}
    </div>
  );
}
