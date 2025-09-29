'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Package,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/lib/stores/cartStore';
import { useUserStore } from '@/lib/store';
import { formatCurrency, getImageUrl, calculateProfessionalPrice } from '@/lib/utils';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MiniCart({ isOpen, onClose, className = '' }: MiniCartProps) {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();
  const { user } = useUserStore();
  
  const [isUpdating, setIsUpdating] = useState<Set<string>>(new Set());
  
  const isProfessional = user?.isProProfessional;
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const professionalDiscount = isProfessional ? user.discountPercentage || 15 : 0;
  
  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    setIsUpdating(prev => new Set([...prev, productId]));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
    
    setIsUpdating(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };
  
  const calculateItemTotal = (item: any) => {
    const basePrice = item.price * item.quantity;
    if (isProfessional) {
      return calculateProfessionalPrice(basePrice, professionalDiscount);
    }
    return basePrice;
  };
  
  const calculateCartTotal = () => {
    if (isProfessional) {
      return calculateProfessionalPrice(totalPrice, professionalDiscount);
    }
    return totalPrice;
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 
                       flex flex-col ${className}`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Carrinho ({totalItems})
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Cart Content */}
            {items.length === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onUpdateQuantity={handleQuantityUpdate}
                        onRemove={handleRemoveItem}
                        isUpdating={isUpdating.has(item.productId)}
                        isProfessional={isProfessional}
                        professionalDiscount={professionalDiscount}
                      />
                    ))}
                  </div>
                  
                  {/* Professional Benefits Banner */}
                  {isProfessional && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Desconto Profissional</span>
                      </div>
                      <p className="text-sm opacity-90">
                        Você está economizando {professionalDiscount}% em todos os produtos!
                      </p>
                    </motion.div>
                  )}
                </div>
                
                {/* Footer */}
                <div className="border-t border-gray-200 p-6 space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <div className="text-right">
                      {isProfessional && (
                        <div className="text-sm text-gray-400 line-through">
                          {formatCurrency(totalPrice)}
                        </div>
                      )}
                      <div className="text-lg font-semibold text-gray-900">
                        {formatCurrency(calculateCartTotal())}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Note */}
                  <div className="text-xs text-gray-500 text-center">
                    Frete calculado na finalização
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      href="/checkout"
                      onClick={onClose}
                      className="w-full bg-black text-white py-3 px-4 rounded-lg 
                               hover:bg-gray-800 transition-colors font-medium text-center block"
                    >
                      Finalizar Compra
                    </Link>
                    
                    <Link
                      href="/carrinho"
                      onClick={onClose}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg 
                               hover:bg-gray-200 transition-colors font-medium text-center block"
                    >
                      Ver Carrinho
                    </Link>
                  </div>
                  
                  {/* Continue Shopping */}
                  <button
                    onClick={onClose}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Continuar comprando
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Cart Item Component
interface CartItemProps {
  item: any;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating: boolean;
  isProfessional: boolean;
  professionalDiscount: number;
}

function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isUpdating,
  isProfessional,
  professionalDiscount
}: CartItemProps) {
  const itemTotal = item.price * item.quantity;
  const professionalPrice = isProfessional 
    ? calculateProfessionalPrice(itemTotal, professionalDiscount)
    : itemTotal;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-start space-x-3 group"
    >
      {/* Product Image */}
      <Link
        href={`/produto/${item.product.slug}`}
        className="flex-shrink-0"
      >
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(item.product.images[0], {
              width: 64,
              height: 64,
              quality: 80,
              format: 'webp'
            })}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/produto/${item.product.slug}`}
          className="block mb-1"
        >
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-gray-700">
            {item.product.name}
          </h4>
        </Link>
        
        {/* Variants */}
        {item.selectedVariants && Object.entries(item.selectedVariants).length > 0 && (
          <div className="text-xs text-gray-500 mb-1">
            {Object.entries(item.selectedVariants).map(([key, value]) => (
              <span key={key} className="mr-2">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-2">
          {isProfessional && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(item.price)}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(isProfessional 
              ? calculateProfessionalPrice(item.price, professionalDiscount)
              : item.price
            )}
          </span>
          {isProfessional && (
            <span className="text-xs bg-purple-100 text-purple-600 px-1 py-0.5 rounded">
              PRO
            </span>
          )}
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              disabled={isUpdating}
              className="p-1 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            
            <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
              {isUpdating ? '...' : item.quantity}
            </span>
            
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              disabled={isUpdating}
              className="p-1 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.productId)}
            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 
                     group-hover:opacity-100"
            title="Remover item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Item Total */}
        <div className="mt-2 text-right">
          {isProfessional && (
            <div className="text-xs text-gray-400 line-through">
              {formatCurrency(itemTotal)}
            </div>
          )}
          <div className="text-sm font-semibold text-gray-900">
            Total: {formatCurrency(professionalPrice)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty Cart Component
function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Seu carrinho está vazio
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-xs">
        Adicione produtos incríveis ao seu carrinho e finalize sua compra.
      </p>
      
      <button
        onClick={onClose}
        className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 
                 transition-colors font-medium"
      >
        Continuar Comprando
      </button>
    </div>
  );
}

// Mini Cart Trigger Button
interface MiniCartTriggerProps {
  onClick: () => void;
  className?: string;
}

export function MiniCartTrigger({ onClick, className = '' }: MiniCartTriggerProps) {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-700 hover:text-black transition-colors ${className}`}
      aria-label={`Carrinho com ${totalItems} itens`}
    >
      <ShoppingBag className="w-6 h-6" />
      
      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-black text-white text-xs 
                   font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </motion.span>
      )}
    </button>
  );
}