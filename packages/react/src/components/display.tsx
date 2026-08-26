'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Display Variants Definition
 *
 * KRDS Typography - Display style (for banners/marketing)
 * Uses KRDS CSS variables for consistent theming with responsive sizing:
 * - xl: 32px (mobile) → 48px (desktop) - Extra large emphasis
 * - lg: 28px (mobile) → 42px (desktop) - Large emphasis
 * - md: 24px (mobile) → 36px (desktop) - Medium emphasis
 * - sm: 20px (mobile) → 32px (desktop) - Small emphasis
 * - All levels bold (700), line spacing 130%
 * - Default color: gray-95 (bolder) - KRDS contrast 4.5:1 compliant, auto dark mode
 */
const displayVariants = cva(
  // Base styles - Default color that meets KRDS contrast 4.5:1 or higher
  'font-bold leading-[var(--krds-leading-display)] text-krds-gray-95',
  {
    variants: {
      size: {
        xl: 'text-krds-display-xl',
        lg: 'text-krds-display-lg',
        md: 'text-krds-display-md',
        sm: 'text-krds-display-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Display Component Props
 */
export interface DisplayProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof displayVariants> {
  /**
   * Display size
   * @default "md"
   */
  size?: 'xl' | 'lg' | 'md' | 'sm';

  /**
   * HTML tag (default: h1)
   * @default "h1"
   */
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'p';

  /**
   * Text content
   */
  children: React.ReactNode;
}

/**
 * Display Component
 *
 * KRDS Typography - Large text for banners/marketing
 *
 * **Important:**
 * - Use Display for marketing/promotional content ONLY
 * - DO NOT use Display for page headings (h1, h2, h3)
 * - For page headings, use SectionHeading component instead
 *
 * **Use cases:**
 * - Hero sections on landing pages
 * - Promotional banners
 * - Marketing messages
 * - Large visual impact text
 *
 * @example
 * ```tsx
 * // ✅ Correct usage
 * <Display size="xl">Welcome to Our Service</Display>
 * <Display size="lg">Spring Sale 50% Off</Display>
 * <Display size="md">New Products</Display>
 * <Display size="sm">Special Offer</Display>
 *
 * // ❌ Wrong usage - Use SectionHeading instead
 * <Display as="h1">Page Title</Display>
 * <Display as="h2">Section Title</Display>
 * ```
 */
export const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  (
    { className, size = 'md', as: Component = 'h1', children, ...props },
    ref
  ) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as React.Ref<HTMLHeadingElement>}
        className={cn(displayVariants({ size }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Display.displayName = 'Display';
