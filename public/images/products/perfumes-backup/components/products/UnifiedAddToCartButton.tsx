'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Package
} from 'lucide-react';
// import { toast } from 'react-toastify'; // Remover até configurar toast

// Enhanced Product interface supporting all use cases
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  variant?: string;
  color?: string;
  size?: string;
  quantity?: number; // Stock quantity
  comparePrice?: number;
  status?: 'active' | 'inactive' | 'outOfStock';
}

interface UnifiedAddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  showQuantitySelector?: boolean;
  showStockInfo?: boolean;
  showQuickActions?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  maxQuantity?: number;
  onAddSuccess?: (product: Product, quantity: number) => void;
  onAddError?: (error: string) => void;
}

/**
 * Unified AddToCartButton component consolidating all cart functionality
 *
 * Features:
 * - Supports variants, colors, and sizes properly
 * - Stock validation and display
 * - Quantity selection with limits
 * - Loading and success states
 * - Toast notifications
 * - Accessibility support
 * - Multiple display variants
 * - Quick actions (Buy Now, View Cart)
 */
export function UnifiedAddToCartButton({
  product,
  disabled = false,
  showQuantitySelector = false,
  showStockInfo = true,
  showQuickActions = false,
  className = '',
  size = 'md',
  variant = 'default',
  maxQuantity,
  onAddSuccess,
  onAddError,
}: UnifiedAddToCartButtonProps) {
  const { addItem, getItemCount, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Get current quantity of this specific variant in cart
  const currentQuantity = isInCart(product.id, product.variant) ? 1 : 0; // Simplificado por enquanto

  // Calculate stock and availability
  const stockQuantity = product.quantity || 999;
  const isOutOfStock = stockQuantity <= 0;
  const isLowStock = stockQuantity <= 5 && stockQuantity > 0;
  const maxAllowedQuantity = maxQuantity || stockQuantity;
  const isDisabled = disabled || isOutOfStock || isAdding;

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product.id, product.variant, product.color, product.size]);

  // Handle quantity changes with validation
  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, maxAllowedQuantity));
    setQuantity(clampedQuantity);
  };

  // Enhanced add to cart with comprehensive error handling
  const handleAddToCart = async () => {
    if (isDisabled) return;

    // Validate stock before adding
    if (quantity > stockQuantity) {
      const errorMsg = `Apenas ${stockQuantity} unidades disponíveis`;
      toast.error(errorMsg);
      onAddError?.(errorMsg);
      return;
    }

    setIsAdding(true);

    try {
      // Converter para formato compatível com cartStore
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.image ? [{ url: product.image, alt: product.name }] : []
      };

      const variant = product.variant || product.color || product.size ? {
        name: product.variant,
        color: product.color,
        size: product.size,
        price: product.price
      } : undefined;

      addItem({
        productId: product.id,
        product: cartProduct,
        variant,
        quantity,
      });

      // Success feedback
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      const successMsg = `${product.name} adicionado ao carrinho!`;
      // toast.success(successMsg, { position: 'top-right', autoClose: 3000 }); // Desabilitado temporariamente
      console.log(successMsg); // Log temporário

      onAddSuccess?.(product, quantity);

      // Reset quantity for next addition
      if (!showQuantitySelector) {
        setQuantity(1);
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMsg = 'Erro ao adicionar produto ao carrinho';
      // toast.error(errorMsg); // Desabilitado temporariamente
      console.error(errorMsg); // Log temporário
      onAddError?.(errorMsg);
    } finally {
      setIsAdding(false);
    }
  };

  // Buy now functionality
  const handleBuyNow = async () => {
    await handleAddToCart();
    // Redirecionar para carrinho ou checkout
    if (typeof window !== 'undefined') {
      window.location.href = '/carrinho';
    }
  };

  // Determine button text and state
  const getButtonState = () => {
    if (isOutOfStock) {
      return { text: 'Esgotado', variant: 'outline' as const, icon: <AlertTriangle size={16} /> };
    }
    if (justAdded) {
      return { text: 'Adicionado!', variant: 'secondary' as const, icon: <Check size={16} /> };
    }
    if (currentQuantity > 0 && !showQuantitySelector) {
      return { text: 'Adicionar Mais', variant: 'outline' as const, icon: <Plus size={16} /> };
    }
    return { text: 'Adicionar ao Carrinho', variant: 'primary' as const, icon: <ShoppingCart size={16} /> };
  };

  const buttonState = getButtonState();

  // Compact variant for tight spaces
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {currentQuantity > 0 && (
          <div className="text-xs text-green-600 font-medium text-center">
            ✓ {currentQuantity} no carrinho
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          variant={buttonState.variant}
          size={size}
          isLoading={isAdding}
          leftIcon={buttonState.icon}
          className="w-full"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          {buttonState.text}
        </Button>
      </div>
    );
  }

  // Detailed variant with all features
  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Stock Information */}
        {showStockInfo && (
          <div className="text-center text-sm">
            {isOutOfStock ? (
              <span className="text-red-600 font-medium flex items-center justify-center gap-1">
                <AlertTriangle size={14} />
                Produto esgotado
              </span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-medium flex items-center justify-center gap-1">
                <AlertTriangle size={14} />
                Apenas {stockQuantity} unidades restantes
              </span>
            ) : (
              <span className="text-green-600 flex items-center justify-center gap-1">
                <Package size={14} />
                {stockQuantity} unidades disponíveis
              </span>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        {showQuantitySelector && !isOutOfStock && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Quantidade:
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-center min-w-[60px] border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxAllowedQuantity}
                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Current cart quantity display */}
        {currentQuantity > 0 && (
          <div className="text-sm text-green-600 font-medium text-center bg-green-50 p-2 rounded">
            ✓ {currentQuantity} {currentQuantity === 1 ? 'unidade' : 'unidades'} no carrinho
          </div>
        )}

        {/* Main Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isDisabled}
          variant={buttonState.variant}
          size={size}
          isLoading={isAdding}
          leftIcon={buttonState.icon}
          className="w-full"
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          {buttonState.text}
        </Button>

        {/* Quick Actions */}
        {showQuickActions && !isOutOfStock && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleBuyNow}
              disabled={isDisabled}
              variant="outline"
              size={size}
              className="w-full"
            >
              Comprar Agora
            </Button>
            <Button
              onClick={() => window.location.href = '/carrinho'}
              variant="outline"
              size={size}
              className="w-full"
              disabled={currentQuantity === 0}
            >
              Ver Carrinho
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Default variant - balanced functionality
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Simple quantity selector for default variant */}
      {showQuantitySelector && !isOutOfStock && (
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Diminuir quantidade"
          >
            <Minus size={14} />
          </button>
          <span className="w-12 text-center font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= maxAllowedQuantity}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Aumentar quantidade"
          >
            <Plus size={14} />
          </button>
        </div>
      )}

      {/* Current cart status */}
      {currentQuantity > 0 && (
        <div className="text-sm text-green-600 font-medium text-center">
          ✓ {currentQuantity} no carrinho
        </div>
      )}

      {/* Main actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleAddToCart}
          disabled={isDisabled}
          isLoading={isAdding}
          leftIcon={buttonState.icon}
          size={size}
          aria-label={`Adicionar ${product.name} ao carrinho`}
        >
          Carrinho
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={isDisabled}
          isLoading={isAdding}
          size={size}
        >
          Comprar
        </Button>
      </div>

      {/* Stock warning for default variant */}
      {showStockInfo && isLowStock && !isOutOfStock && (
        <div className="text-xs text-amber-600 text-center">
          ⚠️ Apenas {stockQuantity} unidades restantes
        </div>
      )}
    </div>
  );
}

export default UnifiedAddToCartButton;