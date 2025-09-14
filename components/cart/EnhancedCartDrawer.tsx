'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Heart, 
  Truck, 
  Package, 
  MapPin,
  Tag,
  Gift,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { useEnhancedCartStore } from '@/lib/stores/enhancedCartStore';

interface EnhancedCartDrawerProps {
  onGoToCheckout?: () => void;
}

export default function EnhancedCartDrawer({ onGoToCheckout }: EnhancedCartDrawerProps) {
  const {
    items,
    isOpen,
    appliedCoupon,
    shippingMethod,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShippingMethod,
    getCartSummary,
    moveToWishlist
  } = useEnhancedCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const summary = getCartSummary();

  // Mock coupon validation
  const validateCoupon = async (code: string) => {
    setIsApplyingCoupon(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockCoupons = {
      'DESCONTO10': {
        code: 'DESCONTO10',
        type: 'percentage' as const,
        value: 10,
        description: '10% de desconto'
      },
      'FRETE20': {
        code: 'FRETE20',
        type: 'fixed' as const,
        value: 20,
        description: 'R$ 20 de desconto'
      },
      'PRIMEIRA50': {
        code: 'PRIMEIRA50',
        type: 'fixed' as const,
        value: 50,
        minAmount: 200,
        description: 'R$ 50 de desconto em compras acima de R$ 200'
      }
    };

    const coupon = mockCoupons[code.toUpperCase() as keyof typeof mockCoupons];
    
    if (coupon) {
      applyCoupon(coupon);
      setCouponCode('');
    } else {
      alert('Cupom inválido');
    }
    
    setIsApplyingCoupon(false);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      validateCoupon(couponCode.trim());
    }
  };

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Padrão',
      description: '5-7 dias úteis',
      price: 9.90,
      freeFrom: 199,
      icon: <Package className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Expressa',
      description: '2-3 dias úteis',
      price: 19.90,
      freeFrom: 299,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'pickup',
      name: 'Retirada',
      description: 'Retire na loja',
      price: 0,
      freeFrom: 0,
      icon: <MapPin className="w-5 h-5" />
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Carrinho ({summary.itemsCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              /* Empty Cart */
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-600 mb-6">
                  Adicione alguns produtos incríveis para começar!
                </p>
                <button
                  onClick={closeCart}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-xs text-amber-600 font-medium">
                              {item.brand}
                            </p>
                            {item.variant && (
                              <p className="text-xs text-gray-500">
                                {item.variant.size || item.variant.shade}
                              </p>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => moveToWishlist(item.id)}
                              className="p-1 hover:bg-white rounded transition-colors"
                              title="Mover para favoritos"
                            >
                              <Heart className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 hover:bg-white rounded transition-colors"
                              title="Remover item"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-600">
                              R$ {((item.variant?.price || item.price) * item.quantity).toFixed(2)}
                            </span>
                            {item.comparePrice && (
                              <span className="text-xs text-gray-400 line-through">
                                R$ {(item.comparePrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-2 text-sm font-medium min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Cupom de Desconto
                  </h3>
                  
                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-sm text-green-600">
                            {appliedCoupon.description}
                          </p>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Digite o código"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!couponCode.trim() || isApplyingCoupon}
                        className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isApplyingCoupon ? '...' : 'Aplicar'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Shipping Options */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setShowShippingOptions(!showShippingOptions)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span className="font-medium text-gray-900">Opções de Entrega</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 transform transition-transform ${showShippingOptions ? 'rotate-90' : ''}`} />
                  </button>

                  {showShippingOptions && (
                    <div className="mt-3 space-y-2">
                      {shippingOptions.map((option) => {
                        const isSelected = shippingMethod === option.id;
                        const isFree = summary.subtotal >= option.freeFrom && option.price > 0;
                        
                        return (
                          <button
                            key={option.id}
                            onClick={() => setShippingMethod(option.id as any)}
                            className={`w-full p-3 border rounded-lg text-left transition-colors ${
                              isSelected 
                                ? 'border-amber-500 bg-amber-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {option.icon}
                                <div>
                                  <p className="font-medium text-gray-900">{option.name}</p>
                                  <p className="text-sm text-gray-600">{option.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                {option.price === 0 ? (
                                  <span className="text-green-600 font-medium">Grátis</span>
                                ) : isFree ? (
                                  <div>
                                    <span className="text-green-600 font-medium">Grátis</span>
                                    <p className="text-xs text-gray-500 line-through">
                                      R$ {option.price.toFixed(2)}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="font-medium">R$ {option.price.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">R$ {summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.shipping > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frete:</span>
                    <span className="font-medium">R$ {summary.shipping.toFixed(2)}</span>
                  </div>
                )}
                {summary.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Desconto:</span>
                    <span className="font-medium text-green-600">-R$ {summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-amber-600">R$ {summary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {summary.subtotal < 199 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 mb-2">
                    Faltam <strong>R$ {(199 - summary.subtotal).toFixed(2)}</strong> para frete grátis!
                  </p>
                  <div className="bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((summary.subtotal / 199) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onGoToCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Finalizar Compra
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={closeCart}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continuar Comprando
                  </button>
                  <button
                    onClick={clearCart}
                    className="px-4 py-3 text-gray-500 hover:text-red-600 transition-colors"
                    title="Limpar carrinho"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}