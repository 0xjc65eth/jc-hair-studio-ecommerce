'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { ShoppingCart, Zap, Gift, Clock, Shield, Truck } from 'lucide-react';

interface OptimizedCTAProps {
  variant?: 'primary' | 'urgent' | 'discount' | 'trust';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  showUrgency?: boolean;
  discountPercent?: number;
  originalPrice?: number;
  finalPrice?: number;
  className?: string;
}

export default function OptimizedCTA({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  onClick,
  disabled = false,
  children,
  showUrgency = false,
  discountPercent,
  originalPrice,
  finalPrice,
  className = ''
}: OptimizedCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [urgencyTime, setUrgencyTime] = useState(15 * 60); // 15 minutes

  // Countdown timer
  useEffect(() => {
    if (showUrgency && urgencyTime > 0) {
      const timer = setTimeout(() => setUrgencyTime(urgencyTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showUrgency, urgencyTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'urgent':
        return {
          button: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse',
          icon: <Zap className="w-5 h-5" />,
          text: children || '⚡ COMPRAR AGORA'
        };
      case 'discount':
        return {
          button: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200',
          icon: <Gift className="w-5 h-5" />,
          text: children || `🎉 ECONOMIZE ${discountPercent}%`
        };
      case 'trust':
        return {
          button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200',
          icon: <Shield className="w-5 h-5" />,
          text: children || '🔒 COMPRA SEGURA'
        };
      default:
        return {
          button: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200',
          icon: <ShoppingCart className="w-5 h-5" />,
          text: children || 'ADICIONAR AO CARRINHO'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Price Display (if provided) */}
      {(originalPrice && finalPrice) && (
        <div className="text-center mb-2">
          {originalPrice !== finalPrice && (
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-gray-500 line-through text-sm">€{originalPrice.toFixed(2)}</span>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                -{discountPercent}%
              </span>
            </div>
          )}
          <div className="text-2xl font-bold text-green-600">€{finalPrice.toFixed(2)}</div>
        </div>
      )}

      {/* Urgency Timer */}
      {showUrgency && urgencyTime > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-center">
          <div className="flex items-center justify-center gap-2 text-red-700 font-medium">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>OFERTA TERMINA EM: {formatTime(urgencyTime)}</span>
          </div>
        </div>
      )}

      {/* Main CTA Button */}
      <Button
        onClick={onClick}
        disabled={disabled}
        size={size}
        className={`${styles.button} ${fullWidth ? 'w-full' : ''} relative overflow-hidden group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Shine Effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
        )}

        <div className="flex items-center justify-center gap-2 relative z-10">
          {styles.icon}
          <span className="font-bold">{styles.text}</span>
        </div>
      </Button>

      {/* Trust Indicators Below Button */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-green-600" />
          <span>Compra Segura</span>
        </div>
        <div className="flex items-center gap-1">
          <Truck className="w-3 h-3 text-blue-600" />
          <span>Envio Rápido</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-600">✓</span>
          <span>Garantia 30d</span>
        </div>
      </div>

      {/* Stock Warning (if urgent variant) */}
      {variant === 'urgent' && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            <span className="animate-pulse">⚠️</span>
            <span>Apenas 3 unidades restantes!</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick preset components for common use cases
export const UrgentBuyNow = (props: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="urgent" showUrgency={true} {...props} />
);

export const DiscountCTA = (props: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="discount" {...props} />
);

export const TrustCTA = (props: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="trust" {...props} />
);

export const StandardCTA = (props: Omit<OptimizedCTAProps, 'variant'>) => (
  <OptimizedCTA variant="primary" {...props} />
);