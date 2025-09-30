'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', fullWidth = false, ...props }, ref) => {
    const baseClasses = `
      block px-3 py-2 border rounded-md text-sm
      placeholder-gray-400 focus:outline-none focus:ring-2
      focus:ring-offset-2 transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variants = {
      default: `
        border-gray-300 focus:border-blue-500 focus:ring-blue-500
        bg-white text-gray-900
      `,
      error: `
        border-red-300 focus:border-red-500 focus:ring-red-500
        bg-red-50 text-red-900
      `,
      success: `
        border-green-300 focus:border-green-500 focus:ring-green-500
        bg-green-50 text-green-900
      `,
    };

    const classes = clsx(
      baseClasses,
      variants[variant],
      fullWidth && 'w-full',
      className
    );

    return (
      <input
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';