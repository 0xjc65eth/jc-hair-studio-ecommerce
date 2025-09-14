'use client';

import { useState } from 'react';
import { Button } from '../ui';
import { useCart } from '../../lib/stores/unifiedCartStore';
import { ProductWithDetails } from '../../types/product';
import { ShoppingBag, Check } from 'lucide-react';

interface AddToCartButtonProps {
  product: ProductWithDetails | {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    comparePrice?: number | string | null;
    images: { url: string; alt: string; isMain: boolean; }[];
    status?: string;
    quantity?: number;
    variants?: Array<{
      id: string;
      name: string;
      price?: number;
      quantity: number;
    }>;
  };
  variantId?: string;
  quantity?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  variantId,
  quantity = 1,
  className,
  size = 'md',
  showIcon = true,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const variant = variantId && product.variants
    ? product.variants.find(v => v.id === variantId)
    : undefined;

  const price = variant?.price || product.price;
  const inStock = (variant?.quantity || product.quantity || 999) > 0;
  const alreadyInCart = isInCart(product.id, variantId);

  const handleAddToCart = async () => {
    if (disabled || !inStock || isAdding) return;

    setIsAdding(true);

    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      addItem({
        productId: product.id,
        variantId,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: typeof product.price === 'string' ? Number(product.price) : Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
          images: product.images as any,
          status: (product.status || 'ACTIVE') as any,
          quantity: product.quantity || 999,
        },
        variant: variant ? {
          id: variant.id,
          name: variant.name,
          price: variant.price ? Number(variant.price) : undefined,
          quantity: variant.quantity,
        } : undefined,
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Determine button text and state
  let buttonText = 'Adicionar ao Carrinho';
  let buttonVariant: 'primary' | 'secondary' | 'outline' = 'primary';

  if (!inStock) {
    buttonText = 'Esgotado';
    buttonVariant = 'outline';
  } else if (justAdded) {
    buttonText = 'Adicionado!';
    buttonVariant = 'secondary';
  } else if (alreadyInCart) {
    buttonText = 'Adicionar Mais';
    buttonVariant = 'outline';
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || !inStock || isAdding}
      variant={buttonVariant}
      size={size}
      isLoading={isAdding}
      className={className}
      leftIcon={showIcon && (
        justAdded ? (
          <Check className="w-4 h-4" />
        ) : (
          <ShoppingBag className="w-4 h-4" />
        )
      )}
    >
      {buttonText}
    </Button>
  );
}