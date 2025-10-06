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
      <Label className='text-foreground text-sm font-medium'>
        {label}
        {required && <span className='ml-1 text-red-500'>*</span>}
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
      <div className='border-border border-b pb-4'>
        <h3 className='text-foreground text-lg font-semibold'>{title}</h3>
        {description && <p className='text-muted-foreground mt-1 text-sm'>{description}</p>}
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
        'border-border flex flex-col justify-end gap-4 border-t pt-6 sm:flex-row',
        className
      )}
    >
      {children}
    </div>
  );
}
