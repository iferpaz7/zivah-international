import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',

        // Zivah International Brand Variants
        accent: 'bg-accent text-accent-foreground hover:bg-dark-accent focus-visible:ring-accent',
        corporate:
          'bg-primary text-primary-foreground hover:bg-secondary focus-visible:ring-primary',

        // Navigation & Interactive Variants
        nav: 'text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg',
        'nav-active': 'text-accent bg-accent/10 dark:bg-accent/20 rounded-lg',
        'nav-mobile':
          'w-full text-left hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg',

        // Glass morphism variants
        glass:
          'bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-700/40',
        'glass-button':
          'backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-700/40',

        // Utility variants
        icon: 'p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg',
        notification:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs px-3 py-1',
        success: 'bg-accent text-accent-foreground hover:bg-accent/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',

        // Product page specific variants
        'cta-primary': 'bg-accent hover:bg-accent/90 text-white font-medium',
        'cta-secondary':
          'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 py-3',
        xl: 'h-12 px-8 py-4 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',

        // Navigation specific sizes
        nav: 'px-4 py-2',
        'nav-mobile': 'px-4 py-3',

        // Full width variants
        full: 'w-full px-4 py-2',
        'full-lg': 'w-full px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
