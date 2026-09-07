# UI & Design System

This guide outlines the component architecture, styling framework, design tokens, and user experience standards for the **ZIVAH International Website**.

---

## 🎨 Design Stack

The application's interface is built on modern React primitives and utility styling:

- **Framework:** React 19 & Next.js 16 App Router
- **CSS Engine:** Tailwind CSS 4 (`@tailwindcss/postcss`)
- **Primitive Components:** Radix UI (`@radix-ui/react-*`)
- **Design Pattern:** shadcn/ui component architecture
- **Iconography:** Lucide Icons (`lucide-react`)
- **Toasts:** Sonner (`sonner`)
- **Forms:** React Hook Form (`react-hook-form`) + Zod validation

---

## 🧩 Component Architecture (`src/components/ui`)

All primitives are located in `src/components/ui/` and follow the shadcn/ui pattern. They are composable, unstyled by default, fully accessible, and styled with Tailwind classes via `cva` (class-variance-authority) and `cn(...)` (`tailwind-merge`).

### Core Component Inventory

| Category                | Components                                                                 |
| :---------------------- | :------------------------------------------------------------------------- |
| **Actions**             | `Button`, `DropdownMenu`                                                   |
| **Containers & Layout** | `Card`, `Separator`, `Sheet` (Mobile Drawer)                               |
| **Forms & Inputs**      | `Form`, `Input`, `Textarea`, `Label`, `Select`                             |
| **Navigation**          | `NavigationMenu`, `Tabs`                                                   |
| **Feedback**            | `Alert`, `AlertDialog`, `Sonner` (Toaster), `Badge`, `Progress`, `Tooltip` |
| **Data Display**        | `Accordion` (FAQs), `Avatar`, `Skeleton` (Loading states)                  |

---

## 💡 Usage Examples

### 1. Button Variants

```tsx
import { Button } from '@/components/ui/button';

export function ExampleButtons() {
  return (
    <div className='flex gap-4'>
      <Button variant='default'>Primary Action</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='destructive'>Destructive</Button>
      <Button size='sm'>Small</Button>
    </div>
  );
}
```

### 2. Form with Validation

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email(),
});

export function SubscribeForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(console.log)}
        className='space-y-4'
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='you@example.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Subscribe</Button>
      </form>
    </Form>
  );
}
```

---

## 🎯 Best Practices

1. **Accessibility First:** Ensure Radix UI primitives maintain proper ARIA attributes, keyboard navigation (`Tab`, `Esc`, arrow keys), and focus management.
2. **Design Tokens:** Always use semantic Tailwind color tokens (e.g. `bg-primary`, `text-muted-foreground`, `border-border`) rather than hardcoded hex values to support theme consistency.
3. **Copy Conventions:** User-facing text must be defined in the translation files (`messages/es.json` and `messages/en.json`) using `useTranslations()` or `getTranslations()`.
