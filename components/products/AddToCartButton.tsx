'use client';

import { useState } from 'react';
import { useCart } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  variant?: string;
  color?: string;
  size?: string;
}

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  showQuantitySelector?: boolean;
  className?: string;
}

export function AddToCartButton({
  product,
  disabled = false,
  showQuantitySelector = false,
  className = '',
}: AddToCartButtonProps) {
  const { addItem, getItemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const currentQuantity = getItemCount();

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      addItem({
        productId: product.id,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
          price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price)),
          comparePrice: product.comparePrice ? parseFloat(String(product.comparePrice)) : undefined,
          images: product.image ? [{ url: product.image, alt: product.name, isMain: true }] : [],
          status: 'ACTIVE' as any,
          quantity: 999,
        },
        variant: product.variant ? {
          id: product.variant,
          name: product.variant,
          price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price)),
          quantity: 999,
        } : undefined,
      });

      toast.success(`${product.name} adicionado ao carrinho!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      // Reset quantity after adding
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erro ao adicionar produto ao carrinho');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Small delay to ensure the item is added before opening cart
    setTimeout(() => {
      openCart();
    }, 100);
  };

  if (currentQuantity > 0 && !showQuantitySelector) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-sm text-green-600 font-medium text-center">
          ✓ {currentQuantity} no carrinho
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            isLoading={isAdding}
          >
            <Plus size={16} />
            Adicionar Mais
          </Button>
          <Button
            size="sm"
            onClick={openCart}
          >
            Ver Carrinho
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showQuantitySelector && (
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleAddToCart}
          disabled={disabled || isAdding}
          isLoading={isAdding}
          leftIcon={<ShoppingCart size={16} />}
        >
          Carrinho
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={disabled || isAdding}
          isLoading={isAdding}
        >
          Comprar
        </Button>
      </div>
    </div>
  );
}