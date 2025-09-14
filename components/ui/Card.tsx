'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'luxury' | 'minimal' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    hover = false,
    interactive = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = `
      bg-white overflow-hidden transition-all duration-300
    `;

    const variantClasses = {
      default: `
        border border-gray-100 shadow-sm rounded-none
      `,
      luxury: `
        border border-gray-100 shadow-lg rounded-none backdrop-blur-sm
        bg-white/95
      `,
      minimal: `
        border-0 shadow-none rounded-none bg-transparent
      `,
      elevated: `
        border-0 shadow-xl rounded-none
      `,
      outlined: `
        border-2 border-gray-200 shadow-none rounded-none
      `,
    };

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const hoverClasses = hover ? `
      hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]
      cursor-pointer
    ` : '';

    const interactiveClasses = interactive ? `
      hover:shadow-lg active:scale-[0.98] cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-gray-300
    ` : '';

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      hoverClasses,
      interactiveClasses,
      className
    );

    const Component = interactive ? 'button' : 'div';

    return (
      <Component
        ref={ref as any}
        className={classes}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for better composition
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-b border-gray-100 pb-4 mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx(
        'text-lg font-playfair font-medium text-gray-900 leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-gray-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('border-t border-gray-100 pt-4 mt-4 flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

// Product-specific card variants
const ProductCard = forwardRef<HTMLDivElement, CardProps & {
  imageUrl?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  onQuickView?: () => void;
}>(
  ({
    className,
    imageUrl,
    title,
    price,
    originalPrice,
    badge,
    onQuickView,
    children,
    ...props
  }, ref) => {
    return (
      <Card
        ref={ref}
        variant="luxury"
        hover
        className={clsx('group relative', className)}
        {...props}
      >
        {/* Image Container */}
        {imageUrl && (
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            {badge && (
              <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-medium z-10">
                {badge}
              </div>
            )}
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Produto</span>
            </div>
            
            {/* Quick View Overlay */}
            {onQuickView && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center pb-4">
                <button
                  onClick={onQuickView}
                  className="bg-white text-black px-6 py-2 font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                >
                  Vista Rápida
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {title && (
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
              {title}
            </h3>
          )}
          
          {(price || originalPrice) && (
            <div className="flex items-center gap-2">
              {price && (
                <span className="text-lg font-medium text-gray-900">
                  €{price.toFixed(2)}
                </span>
              )}
              {originalPrice && price && originalPrice > price && (
                <span className="text-sm text-gray-400 line-through">
                  €{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          )}
          
          {children}
        </div>
      </Card>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default Card;
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  ProductCard,
};