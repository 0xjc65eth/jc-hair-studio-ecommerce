'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react';

interface AddToCartButtonProps {
  product: any;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ product, className = '', disabled = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);

    try {
      // Simulate adding to cart - replace with actual cart logic
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('Added to cart:', {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity
      });

      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);

      // You can implement actual cart logic here
      // For example: addToCart(product, quantity)

    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Quantidade:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-center min-w-[60px] border-x border-gray-300">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= product.quantity}
            className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || product.quantity <= 0}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3
          transition-all duration-200 transform
          ${disabled || product.quantity <= 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : justAdded
            ? 'bg-green-500 text-white shadow-lg'
            : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5'
          }
          ${isAdding ? 'opacity-75' : ''}
        `}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Adicionando...
          </>
        ) : justAdded ? (
          <>
            <Check className="w-5 h-5" />
            Adicionado ao Carrinho!
          </>
        ) : disabled || product.quantity <= 0 ? (
          <>
            <ShoppingBag className="w-5 h-5" />
            Produto Indisponível
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Adicionar ao Carrinho
          </>
        )}
      </button>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <button
          disabled={disabled || product.quantity <= 0}
          className="py-2 px-4 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Comprar Agora
        </button>
        <button
          disabled={disabled}
          className="py-2 px-4 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Ver no Carrinho
        </button>
      </div>

      {/* Stock Info */}
      <div className="text-center text-sm text-gray-500">
        {product.quantity > 0 ? (
          product.quantity <= 5 ? (
            <span className="text-amber-600 font-medium">
              ⚠️ Apenas {product.quantity} unidades restantes
            </span>
          ) : (
            <span className="text-green-600">
              ✅ {product.quantity} unidades disponíveis
            </span>
          )
        ) : (
          <span className="text-red-600 font-medium">
            ❌ Produto esgotado
          </span>
        )}
      </div>
    </div>
  );
}