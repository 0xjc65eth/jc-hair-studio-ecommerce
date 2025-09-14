'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../lib/stores/unifiedCartStore';
import { Button } from '../ui';
import { 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  Truck, 
  Shield,
  Check,
  AlertCircle
} from 'lucide-react';

interface CheckoutFormData {
  // Customer Information
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Shipping Address
  address: string;
  address2: string;
  city: string;
  postalCode: string;
  country: string;
  
  // Payment
  paymentMethod: 'card' | 'paypal' | 'mbway';
  
  // Card details (if card payment)
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  
  // Additional options
  newsletter: boolean;
  terms: boolean;
}

const initialFormData: CheckoutFormData = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  postalCode: '',
  country: 'PT',
  paymentMethod: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardName: '',
  newsletter: false,
  terms: false,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    subtotal, 
    itemsCount, 
    isEmpty, 
    getTaxAmount, 
    getTotal,
    clearCart
  } = useCart();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isEmpty) {
      router.push('/carrinho');
    }
  }, [mounted, isEmpty, router]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;
  if (isEmpty) return null;

  const taxAmount = getTaxAmount();
  const total = getTotal();
  const shippingThreshold = 50;
  const freeShipping = subtotal >= shippingThreshold;
  const shippingCost = freeShipping ? 0 : 5.99;
  const finalTotal = total + shippingCost;

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    // Required fields
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.firstName) newErrors.firstName = 'Nome é obrigatório';
    if (!formData.lastName) newErrors.lastName = 'Apelido é obrigatório';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.address) newErrors.address = 'Morada é obrigatória';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    if (!formData.postalCode) newErrors.postalCode = 'Código postal é obrigatório';
    if (!formData.terms) newErrors.terms = 'true' as any;

    // Card validation (if card payment)
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Data de validade é obrigatória';
      if (!formData.cardCvc) newErrors.cardCvc = 'CVC é obrigatório';
      if (!formData.cardName) newErrors.cardName = 'Nome no cartão é obrigatório';
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStep('processing');

    try {
      // Prepare order data
      const orderData = {
        // Customer Information
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        
        // Shipping Address
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        
        // Cart Items
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        
        // Totals
        subtotal: Number(subtotal.toFixed(2)),
        taxAmount: Number(taxAmount.toFixed(2)),
        shippingCost: Number(shippingCost.toFixed(2)),
        total: Number(finalTotal.toFixed(2)),
        
        // Payment
        paymentMethod: formData.paymentMethod,
        
        // Additional options
        customerNotes: undefined
      };

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      if (result.success) {
        setStep('success');
        
        // Clear cart after successful order
        setTimeout(() => {
          clearCart();
          router.push('/');
        }, 5000);
      } else {
        throw new Error(result.error || 'Order creation failed');
      }
      
    } catch (error: any) {
      console.error('Order creation error:', error);
      alert(`Erro ao processar pedido: ${error.message}`);
      setStep('checkout');
      setIsSubmitting(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-playfair font-light mb-4">
            A processar o seu pagamento...
          </h2>
          <p className="text-gray-600">
            Por favor, não feche esta página. O seu pedido está a ser processado.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-playfair font-light mb-4">
            Pedido realizado com sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Obrigado pela sua compra. Receberá um email de confirmação em breve.
          </p>
          <p className="text-sm text-gray-500">
            Será redirecionado automaticamente em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-playfair font-light text-gray-900">
              Finalizar Compra
            </h1>
            <Link href="/carrinho">
              <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Carrinho
              </Button>
            </Link>
          </div>
          
          {/* Security indicator */}
          <div className="flex items-center gap-2 mt-4 text-sm text-green-700">
            <Lock className="w-4 h-4" />
            <span>Conexão segura e encriptada</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Checkout Form */}
              <div className="space-y-8">
                {/* Customer Information */}
                <div>
                  <h2 className="text-xl font-medium mb-6">Informações de Contacto</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`input-luxury w-full ${errors.email ? 'border-red-300' : ''}`}
                        placeholder="seu@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome *</label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={`input-luxury w-full ${errors.firstName ? 'border-red-300' : ''}`}
                          placeholder="João"
                        />
                        {errors.firstName && (
                          <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Apelido *</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={`input-luxury w-full ${errors.lastName ? 'border-red-300' : ''}`}
                          placeholder="Silva"
                        />
                        {errors.lastName && (
                          <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`input-luxury w-full ${errors.phone ? 'border-red-300' : ''}`}
                        placeholder="+351 xxx xxx xxx"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Morada de Entrega
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Morada *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`input-luxury w-full ${errors.address ? 'border-red-300' : ''}`}
                        placeholder="Rua das Flores, 123"
                      />
                      {errors.address && (
                        <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Complemento</label>
                      <input
                        type="text"
                        value={formData.address2}
                        onChange={(e) => handleInputChange('address2', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="Apartamento, andar, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cidade *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`input-luxury w-full ${errors.city ? 'border-red-300' : ''}`}
                          placeholder="Lisboa"
                        />
                        {errors.city && (
                          <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Código Postal *</label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className={`input-luxury w-full ${errors.postalCode ? 'border-red-300' : ''}`}
                          placeholder="1000-001"
                        />
                        {errors.postalCode && (
                          <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">País</label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="input-luxury w-full"
                      >
                        <option value="PT">Portugal</option>
                        <option value="ES">Espanha</option>
                        <option value="FR">França</option>
                        <option value="DE">Alemanha</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Método de Pagamento
                  </h2>
                  
                  {/* Payment Options */}
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'card', label: 'Cartão de Crédito/Débito', icon: CreditCard },
                      { id: 'paypal', label: 'PayPal', icon: CreditCard, disabled: true },
                      { id: 'mbway', label: 'MB WAY', icon: CreditCard, disabled: true }
                    ].map(({ id, label, icon: Icon, disabled }) => (
                      <label key={id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      } ${formData.paymentMethod === id ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={id}
                          checked={formData.paymentMethod === id}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value as any)}
                          disabled={disabled}
                          className="mr-3"
                        />
                        <Icon className="w-5 h-5 mr-3" />
                        <span>{label}</span>
                        {disabled && <span className="ml-auto text-sm text-gray-500">Em breve</span>}
                      </label>
                    ))}
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-2">Número do Cartão *</label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className={`input-luxury w-full ${errors.cardNumber ? 'border-red-300' : ''}`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {errors.cardNumber && (
                          <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Validade *</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                            className={`input-luxury w-full ${errors.cardExpiry ? 'border-red-300' : ''}`}
                            placeholder="MM/AA"
                          />
                          {errors.cardExpiry && (
                            <p className="text-red-600 text-sm mt-1">{errors.cardExpiry}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">CVC *</label>
                          <input
                            type="text"
                            value={formData.cardCvc}
                            onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                            className={`input-luxury w-full ${errors.cardCvc ? 'border-red-300' : ''}`}
                            placeholder="123"
                          />
                          {errors.cardCvc && (
                            <p className="text-red-600 text-sm mt-1">{errors.cardCvc}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome no Cartão *</label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value)}
                          className={`input-luxury w-full ${errors.cardName ? 'border-red-300' : ''}`}
                          placeholder="João Silva"
                        />
                        {errors.cardName && (
                          <p className="text-red-600 text-sm mt-1">{errors.cardName}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => handleInputChange('terms', e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      Aceito os{' '}
                      <Link href="/termos" className="text-black underline">
                        termos e condições
                      </Link>{' '}
                      e a{' '}
                      <Link href="/privacidade" className="text-black underline">
                        política de privacidade
                      </Link>
                      . *
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-600 text-sm">{errors.terms}</p>
                  )}
                  
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      Quero receber novidades e ofertas especiais por email.
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Order Items */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-6">Resumo do Pedido</h2>
                    
                    <div className="space-y-4 mb-6">
                      {items.map((item) => {
                        const mainImage = item.product.images.find(img => img.isMain) || item.product.images[0];
                        const itemPrice = item.variant?.price || item.product.price;
                        const itemTotal = itemPrice * item.quantity;

                        return (
                          <div key={item.id} className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              {mainImage ? (
                                <Image
                                  src={mainImage.url}
                                  alt={mainImage.alt || item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">N/A</span>
                                </div>
                              )}
                              
                              {/* Quantity badge */}
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs rounded-full flex items-center justify-center">
                                {item.quantity}
                              </div>
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
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                  {item.quantity} × €{itemPrice.toFixed(2)}
                                </span>
                                <span className="font-medium text-gray-900">
                                  €{itemTotal.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Envio:</span>
                        <span className={freeShipping ? 'text-green-600' : ''}>
                          {freeShipping ? 'Grátis' : `€${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>IVA (23%):</span>
                        <span>€{taxAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between font-medium text-lg pt-3 border-t border-gray-200">
                        <span>Total:</span>
                        <span>€{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        A processar...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Finalizar Compra - €{finalTotal.toFixed(2)}
                      </>
                    )}
                  </Button>

                  {/* Security Info */}
                  <div className="text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                    <p>Os seus dados são protegidos com encriptação SSL</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}