'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  pill?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'sm',
    outline = false,
    pill = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center font-medium transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-2
    `;

    const variantClasses = outline ? {
      default: 'text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-50',
      secondary: 'text-gray-600 border border-gray-200 bg-transparent hover:bg-gray-50',
      accent: 'text-amber-700 border border-amber-300 bg-transparent hover:bg-amber-50',
      success: 'text-green-700 border border-green-300 bg-transparent hover:bg-green-50',
      warning: 'text-yellow-700 border border-yellow-300 bg-transparent hover:bg-yellow-50',
      danger: 'text-red-700 border border-red-300 bg-transparent hover:bg-red-50',
      info: 'text-blue-700 border border-blue-300 bg-transparent hover:bg-blue-50',
    } : {
      default: 'text-white bg-gray-900 hover:bg-gray-800',
      secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200',
      accent: 'text-white bg-amber-700 hover:bg-amber-800',
      success: 'text-white bg-green-600 hover:bg-green-700',
      warning: 'text-black bg-yellow-400 hover:bg-yellow-500',
      danger: 'text-white bg-red-600 hover:bg-red-700',
      info: 'text-white bg-blue-600 hover:bg-blue-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    const shapeClasses = pill ? 'rounded-full' : 'rounded-none';

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      shapeClasses,
      className
    );

    return (
      <span
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status badges for e-commerce
const StatusBadge = forwardRef<HTMLSpanElement, BadgeProps & {
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'new' | 'sale' | 'featured' | 'bestseller';
}>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      'in-stock': { variant: 'success' as const, text: 'Em Estoque' },
      'low-stock': { variant: 'warning' as const, text: 'Últimas Unidades' },
      'out-of-stock': { variant: 'danger' as const, text: 'Esgotado' },
      'new': { variant: 'info' as const, text: 'Novo' },
      'sale': { variant: 'danger' as const, text: 'Promoção' },
      'featured': { variant: 'accent' as const, text: 'Destaque' },
      'bestseller': { variant: 'default' as const, text: 'Mais Vendido' },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        {...props}
      >
        {config.text}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Discount badge
const DiscountBadge = forwardRef<HTMLSpanElement, BadgeProps & {
  percentage: number;
}>(
  ({ percentage, ...props }, ref) => (
    <Badge
      ref={ref}
      variant="danger"
      size="sm"
      {...props}
    >
      -{percentage}%
    </Badge>
  )
);

DiscountBadge.displayName = 'DiscountBadge';

export default Badge;
export { StatusBadge, DiscountBadge };