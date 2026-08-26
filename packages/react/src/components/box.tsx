'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Box Variants Definition
 *
 * Layout utility component
 * Easy access to Flexbox and Grid
 */
const boxVariants = cva('', {
  variants: {
    display: {
      flex: 'flex',
      'inline-flex': 'inline-flex',
      grid: 'grid',
      block: 'block',
      'inline-block': 'inline-block',
      none: 'hidden',
    },
    direction: {
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
      nowrap: 'flex-nowrap',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
      6: 'gap-6',
      8: 'gap-8',
      10: 'gap-10',
      12: 'gap-12',
      16: 'gap-16',
    },
  },
  defaultVariants: {
    display: 'block',
  },
});

/**
 * Box Component Props
 */
export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
  /**
   * Display type
   * @default "block"
   */
  display?: 'flex' | 'inline-flex' | 'grid' | 'block' | 'inline-block' | 'none';

  /**
   * Flex direction (only applies when display is flex)
   */
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';

  /**
   * Align items (only applies when display is flex)
   */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';

  /**
   * Justify content (only applies when display is flex)
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

  /**
   * Flex wrap (only applies when display is flex)
   */
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';

  /**
   * Gap size (Tailwind spacing scale: 1 = 0.25rem = 4px)
   */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

  /**
   * HTML tag
   * @default "div"
   */
  as?:
    | 'div'
    | 'section'
    | 'article'
    | 'aside'
    | 'main'
    | 'nav'
    | 'header'
    | 'footer';

  /**
   * Child elements
   */
  children: React.ReactNode;
}

/**
 * Box Component
 *
 * Versatile layout container component
 * Easy access to Flexbox and Grid through props
 *
 * @example
 * ```tsx
 * // Flex layout
 * <Box display="flex" direction="column" gap={4}>
 *   <Heading level="h2">Title</Heading>
 *   <Body>Content</Body>
 * </Box>
 *
 * // Horizontal alignment
 * <Box display="flex" align="center" gap={2}>
 *   <Label>Name:</Label>
 *   <Body>John Doe</Body>
 * </Box>
 *
 * // Grid layout
 * <Box display="grid" gap={4} className="grid-cols-3">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Box>
 * ```
 */
export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      className,
      display = 'block',
      direction,
      align,
      justify,
      wrap,
      gap,
      as: Component = 'div',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(
          boxVariants({
            display,
            direction,
            align,
            justify,
            wrap,
            gap,
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Box.displayName = 'Box';
