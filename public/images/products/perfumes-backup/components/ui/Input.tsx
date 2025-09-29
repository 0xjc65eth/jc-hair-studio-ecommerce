'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'luxury' | 'minimal';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'md',
    fullWidth = true,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const baseClasses = `
      border transition-all duration-200 focus:outline-none
      disabled:cursor-not-allowed disabled:opacity-50
      placeholder:text-gray-400
    `;

    const variantClasses = {
      default: `
        border-gray-200 bg-white text-gray-900 focus:border-black
        focus:ring-2 focus:ring-gray-100 rounded-none
      `,
      luxury: `
        border-gray-200 bg-white text-gray-900 focus:border-black
        focus:ring-2 focus:ring-gray-300 focus:border-transparent
        rounded-none shadow-sm
      `,
      minimal: `
        border-0 border-b-2 border-gray-200 bg-transparent text-gray-900
        focus:border-black rounded-none px-0
      `,
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-4 text-base',
    };

    const statusClasses = {
      error: 'border-red-300 focus:border-red-500 focus:ring-red-100',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-100',
      default: '',
    };

    const getStatusClass = () => {
      if (error) return statusClasses.error;
      if (success) return statusClasses.success;
      return statusClasses.default;
    };

    const inputClasses = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      getStatusClass(),
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      isPassword && 'pr-10',
      fullWidth && 'w-full',
      className
    );

    const containerClasses = clsx(
      'relative',
      fullWidth && 'w-full'
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label 
            className={clsx(
              'block text-sm font-medium mb-2 transition-colors',
              error ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700',
              disabled && 'opacity-50'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {error && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {success && !error && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}
            {rightIcon && !isPassword && !error && !success && (
              <div className="text-gray-400">{rightIcon}</div>
            )}
          </div>
        </div>
        
        {/* Helper text, error, or success message */}
        {(helperText || error || success) && (
          <div className="mt-1 text-sm">
            {error && (
              <p className="text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p className="text-gray-500">{helperText}</p>
            )}
          </div>
        )}
        
        {/* Focus indicator for luxury variant */}
        {variant === 'luxury' && isFocused && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-none opacity-20 blur-sm -z-10 transition-opacity duration-200" />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;