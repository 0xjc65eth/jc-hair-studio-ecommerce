'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2 font-medium 
      transition-all duration-200 focus:outline-none focus:ring-2 
      focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
      relative overflow-hidden
    `;

    const variantClasses = {
      primary: `
        bg-black text-white hover:bg-gray-800 focus:ring-gray-300
        active:scale-[0.98] border border-transparent
      `,
      secondary: `
        bg-white text-black border border-gray-200 hover:bg-gray-50
        focus:ring-gray-300 active:scale-[0.98]
      `,
      accent: `
        bg-amber-700 text-white hover:bg-amber-800 focus:ring-amber-300
        active:scale-[0.98] border border-transparent
      `,
      outline: `
        bg-transparent border border-black text-black hover:bg-black 
        hover:text-white focus:ring-gray-300 active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-gray-700 hover:bg-gray-100 hover:text-black
        focus:ring-gray-300 active:scale-[0.98] border border-transparent
      `,
      link: `
        bg-transparent text-black hover:text-gray-600 underline-offset-4
        hover:underline focus:ring-gray-300 border border-transparent p-0
      `,
      destructive: `
        bg-red-600 text-white hover:bg-red-700 focus:ring-red-300
        active:scale-[0.98] border border-transparent
      `,
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm rounded-none',
      md: 'h-10 px-4 text-sm rounded-none',
      lg: 'h-12 px-6 text-base rounded-none',
      xl: 'h-14 px-8 text-lg rounded-none',
      icon: 'h-10 w-10 p-0 rounded-none',
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin absolute" />
        )}
        
        <span className={clsx(
          'flex items-center gap-2',
          isLoading && 'opacity-0'
        )}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;