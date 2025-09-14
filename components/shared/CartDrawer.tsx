'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../ui';
import { useCart } from '../../lib/stores/unifiedCartStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    items, 
    subtotal, 
    itemsCount, 
    isEmpty, 
    updateQuantity, 
    removeItem, 
    getTaxAmount, 
    getTotal 
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  const taxAmount = getTaxAmount();
  const total = getTotal();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-playfair font-medium">
            Carrinho ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione alguns produtos para começar suas compras
              </p>
              <Button
                onClick={onClose}
                className="w-full"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => {
                const mainImage = item.product.images.find(img => img.isMain) || item.product.images[0];
                const itemPrice = item.variant?.price || item.product.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-none">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100">
                      {mainImage ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Produto</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Sem Img</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {item.product.name}
                      </h4>
                      
                      {item.variant && (
                        <p className="text-xs text-gray-600 mb-2">
                          {item.variant.name}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-none">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            €{itemTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remover item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-gray-100 p-4 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (23%):</span>
                <span>€{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href="/carrinho" onClick={onClose}>
                <Button variant="outline" fullWidth>
                  Ver Carrinho
                </Button>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <Button fullWidth>
                  Finalizar Compra
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <p className="text-xs text-gray-600 text-center">
              Frete e impostos calculados no checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}