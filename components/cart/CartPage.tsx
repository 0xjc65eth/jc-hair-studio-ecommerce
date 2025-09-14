'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../lib/stores/unifiedCartStore';
import { Button } from '../ui';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  X, 
  ShoppingBag, 
  Truck, 
  Shield, 
  CreditCard,
  Gift
} from 'lucide-react';

export default function CartPage() {
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
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  const taxAmount = getTaxAmount();
  const total = getTotal();
  const shippingThreshold = 50;
  const freeShipping = subtotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 5.99;
  const finalTotal = total + shippingCost;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-playfair font-light mb-4 text-gray-900">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Parece que você ainda não adicionou nenhum produto ao seu carrinho. 
              Explore nossa coleção de extensões de cabelo premium!
            </p>
            <Link href="/produtos">
              <Button size="lg" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-playfair font-light text-gray-900 mb-2">
                Carrinho de Compras
              </h1>
              <p className="text-gray-600">
                {itemsCount} {itemsCount === 1 ? 'produto' : 'produtos'} no seu carrinho
              </p>
            </div>
            <Link href="/produtos">
              <Button variant="outline" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => {
                const mainImage = item.product.images.find(img => img.isMain) || item.product.images[0];
                const itemPrice = item.variant?.price || item.product.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {mainImage ? (
                          <Image
                            src={mainImage.url}
                            alt={mainImage.alt || item.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Sem Img</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900 text-lg mb-1">
                              {item.product.name}
                            </h3>
                            {item.variant && (
                              <p className="text-sm text-gray-600 mb-2">
                                {item.variant.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remover produto"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-medium text-gray-900">
                              €{itemTotal.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              €{itemPrice.toFixed(2)} cada
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon Code */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Cupão de Desconto
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Insira o código do cupão"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-luxury flex-1"
                  />
                  <Button variant="outline">
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Summary Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-playfair font-medium mb-4">
                    Resumo da Encomenda
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'produto' : 'produtos'}):</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>IVA (23%):</span>
                      <span>€{taxAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Envio:
                      </span>
                      <span className={freeShipping ? 'text-green-600' : ''}>
                        {freeShipping ? 'Grátis' : `€${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    
                    {!freeShipping && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Envio grátis em compras superiores a €{shippingThreshold.toFixed(2)}
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>€{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button fullWidth size="lg" className="mb-4">
                      Finalizar Compra
                    </Button>
                  </Link>
                  
                  <Link href="/produtos">
                    <Button variant="outline" fullWidth>
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Compra Segura
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>Envio rápido e confiável</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span>Várias formas de pagamento</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}