import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

// ...existing code...

const buttonVariants = cva(
  'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border-input bg-background hover:bg-accent/10 hover:text-accent hover:border-accent border-2',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm',
        ghost: 'hover:bg-accent/10 hover:text-accent',
        link: 'text-primary underline-offset-4 hover:underline',

        // Zivah International Brand Variants
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm',
        corporate: 'bg-primary text-primary-foreground hover:bg-secondary shadow-sm',

        // Call-to-action variants used in product pages
        'cta-primary': 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg',
        'cta-secondary': 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md',

        // Navigation & Interactive Variants
        nav: 'text-foreground hover:text-accent hover:bg-muted',
        'nav-active': 'text-accent bg-accent/10',
        'nav-mobile': 'text-foreground hover:text-accent hover:bg-muted w-full text-left',

        // Glass morphism variants
        glass: 'bg-background/20 border-border/30 hover:bg-background/30 border backdrop-blur-md',
        'glass-button':
          'bg-background/10 border-border/20 hover:bg-background/20 border backdrop-blur-sm',

        // Utility variants
        icon: 'hover:bg-muted p-2',
        notification:
          'bg-secondary text-secondary-foreground hover:bg-secondary/90 px-3 py-1 text-xs',
        success: 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm',
        warning: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
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
    // Compute classes in a stable order: base variants first, then user-supplied className.
    const computedClassName = `${buttonVariants({ variant, size })} ${className ?? ''}`.trim();

    return (
      <Comp
        className={computedClassName}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
