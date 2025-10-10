'use client';

import { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center font-medium
      rounded-full border transition-colors
    `;

    const variants = {
      primary: 'bg-blue-100 text-blue-800 border-blue-200',
      secondary: 'bg-gray-100 text-gray-800 border-gray-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const classes = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    return (
      <div
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

// Additional Badge components for specific use cases
export const StatusBadge = forwardRef<HTMLDivElement, BadgeProps & { status?: 'online' | 'offline' | 'away' }>(
  ({ status = 'offline', className, ...props }, ref) => {
    const statusVariants = {
      online: 'bg-green-100 text-green-800 border-green-200',
      offline: 'bg-gray-100 text-gray-800 border-gray-200',
      away: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return (
      <Badge
        ref={ref}
        className={clsx(statusVariants[status], className)}
        {...props}
      />
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export const DiscountBadge = forwardRef<HTMLDivElement, BadgeProps & { percentage?: number }>(
  ({ percentage, className, children, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        variant="error"
        className={clsx('animate-pulse font-bold', className)}
        {...props}
      >
        {children || `${percentage}% OFF`}
      </Badge>
    );
  }
);

DiscountBadge.displayName = 'DiscountBadge';