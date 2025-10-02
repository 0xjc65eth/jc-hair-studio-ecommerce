'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { countries, getShippingCost } from '@/lib/config/shipping';

// Componente de pagamento otimizado
import { StripePayment } from './StripePayment';
import { PromoCodeInput } from './PromoCodeInput';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Shield
} from 'lucide-react';
import { SecurityBadges, TrustIndicators } from '../ui/BrazilianComponents';

/**
 * Interface defining comprehensive customer information structure
 * Captures all required personal, contact, and address data for order processing
 */
interface CustomerInfo {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  cpfNif: string; // CPF for Brazil, NIF for Portugal/EU

  // Geographic Information
  country: string;

  // Complete Address Structure
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Delivery Preferences
  deliveryMethod: string;
}

export default function CheckoutPage() {
  const {
    items,
    subtotal,
    itemsCount,
    isEmpty,
    getTaxAmount,
    getTotal,
    clearCart
  } = useCart();

  // Cart state tracking for checkout - prevent race condition with localStorage loading
  const [mounted, setMounted] = useState(false);
  const [cartInitialized, setCartInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showUrgency, setShowUrgency] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [paymentMethod] = useState<'stripe'>('stripe');

  // Promo code state
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoFreeShipping, setPromoFreeShipping] = useState(false);
  const [promoCodeId, setPromoCodeId] = useState<string>('');

  // Client technical information for fraud prevention and order tracking
  const [clientInfo, setClientInfo] = useState({
    ip: '',
    userAgent: '',
    timestamp: ''
  });

  /**
   * Customer information state with comprehensive data structure
   * Includes personal details, contact info, and complete delivery address
   */
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    cpfNif: '',
    country: 'PT',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    deliveryMethod: 'standard' // Default delivery method
  });

  /**
   * Validation utility functions for form fields
   * Provides robust validation for different data types and formats
   */
  const validationUtils = {
    /**
     * Validates email format using comprehensive regex
     */
    validateEmail: (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },

    /**
     * Validates phone number format (international support) - relaxed validation
     */
    validatePhone: (phone: string): boolean => {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^[+]?[\d]{6,15}$/; // Relaxed: 6-15 digits
      return phoneRegex.test(cleanPhone);
    },

    /**
     * Validates CPF (Brazil) or NIF (Portugal/EU) format
     */
    validateCpfNif: (document: string): boolean => {
      const cleanDoc = document.replace(/[\s\-\.]/g, '');
      // CPF: 11 digits, NIF: 9 digits, or other EU formats
      return /^[\d]{9,11}$/.test(cleanDoc);
    },

    /**
     * Validates ZIP/postal code format (flexible for different countries)
     */
    validateZipCode: (zipCode: string, country: string): boolean => {
      const cleanZip = zipCode.replace(/[\s\-]/g, '');
      switch (country) {
        case 'PT': // Portugal
          return /^[\d]{4}-?[\d]{3}$/.test(zipCode);
        case 'BR': // Brazil
          return /^[\d]{5}-?[\d]{3}$/.test(zipCode);
        case 'US': // United States
          return /^[\d]{5}(-[\d]{4})?$/.test(zipCode);
        case 'DE': // Germany
        case 'FR': // France
          return /^[\d]{5}$/.test(cleanZip);
        default: // Generic validation
          return /^[a-zA-Z0-9\s\-]{3,10}$/.test(zipCode);
      }
    },

    /**
     * Validates required string fields (non-empty, reasonable length)
     */
    validateRequiredString: (value: string, minLength: number = 2): boolean => {
      return value.trim().length >= minLength;
    }
  };

  /**
   * Cart initialization effect - DEFINITIVE SOLUTION for race condition
   * Also captures client technical information for security and tracking
   */
  useEffect(() => {
    setMounted(true);

    // Capture client information for security and order tracking
    const captureClientInfo = async () => {
      try {
        // Get user agent from browser
        const userAgent = navigator.userAgent;

        // Get client IP address from external service
        let clientIp = 'Unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          clientIp = ipData.ip;
        } catch (ipError) {
          console.warn('Could not fetch client IP:', ipError);
          // Fallback: try to get IP from headers via our API
          try {
            const fallbackResponse = await fetch('/api/get-client-ip');
            const fallbackData = await fallbackResponse.json();
            clientIp = fallbackData.ip || 'Unknown';
          } catch (fallbackError) {
            console.warn('Fallback IP fetch failed:', fallbackError);
          }
        }

        // Update client info state
        setClientInfo({
          ip: clientIp,
          userAgent: userAgent,
          timestamp: new Date().toISOString()
        });

        console.log('📱 Client Info Captured:', {
          ip: clientIp,
          userAgent: userAgent.substring(0, 50) + '...', // Truncate for logging
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error capturing client info:', error);
      }
    };

    // Force immediate check of localStorage on mount
    const checkCartImmediately = () => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('jc-cart-storage-manual');
        console.log('🔍 IMMEDIATE CHECKOUT CHECK:', {
          savedCart: savedCart ? JSON.parse(savedCart).length : 0,
          currentItems: items.length
        });

        // If we have saved data, give it more time to load
        if (savedCart && JSON.parse(savedCart).length > 0) {
          console.log('📦 FOUND SAVED CART - Waiting for store update...');
          // Give more time for complex cart data
          setTimeout(() => setCartInitialized(true), 300);
        } else {
          console.log('📭 NO SAVED CART - Initialize immediately');
          // No saved data, safe to initialize immediately
          setCartInitialized(true);
        }
      } else {
        // Server-side, initialize after hydration
        setTimeout(() => setCartInitialized(true), 500);
      }
    };

    // Execute both initialization tasks
    captureClientInfo();
    checkCartImmediately();
  }, []);

  // Additional effect - if items appear, cart is definitely ready
  useEffect(() => {
    if (mounted && items.length > 0) {
      console.log('✅ ITEMS DETECTED - Cart definitely initialized');
      setCartInitialized(true);
    }
  }, [mounted, items]);

  // Failsafe - ensure we don't get stuck in loading forever
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      console.log('⏰ FAILSAFE TIMEOUT - Force initializing cart');
      setCartInitialized(true);
    }, 2000); // 2 second failsafe

    return () => clearTimeout(failsafeTimer);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  // Show loading while cart is initializing - prevent race condition
  if (!cartInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="max-w-md mx-auto">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-playfair font-light mb-4 text-gray-900">
              Carregando Carrinho...
            </h1>
            <p className="text-gray-600">
              Verificando seus produtos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only redirect if cart is empty AND we know it's been properly initialized
  if (isEmpty && cartInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-playfair font-light mb-4 text-gray-900">
              Carrinho Vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Seu carrinho está vazio. Adicione alguns produtos antes de prosseguir para o checkout.
            </p>
            <Link href="/produtos">
              <Button size="lg" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar às Compras
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const taxAmount = getTaxAmount();
  const total = getTotal();
  const baseShippingCost = getShippingCost(customerInfo.country);
  const shippingCost = promoFreeShipping ? 0 : baseShippingCost;
  const subtotalWithDiscount = Math.max(0, total - promoDiscount);
  const finalTotal = subtotalWithDiscount + shippingCost;

  const handleCustomerInfoChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setCustomerInfo(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Promo code handlers
  const handlePromoApplied = (discount: number, freeShipping: boolean, codeId: string) => {
    setPromoDiscount(discount);
    setPromoFreeShipping(freeShipping);
    setPromoCodeId(codeId);
  };

  const handlePromoRemoved = () => {
    setPromoDiscount(0);
    setPromoFreeShipping(false);
    setPromoCodeId('');
  };

  /**
   * Flexible validation for Step 1 - Customer Information
   * Uses relaxed validation to improve user experience
   * Allows payment to proceed with minimal required fields
   */
  const validateStep1 = () => {
    const { name, email, phone } = customerInfo;

    // RELAXED VALIDATION - Only check if fields have some content
    // This prevents payment form from being hidden unnecessarily
    const validationResults = {
      name: name.trim().length >= 1, // Any name is acceptable
      email: email.includes('@') && email.length >= 5, // Basic email check
      phone: phone.replace(/\D/g, '').length >= 6, // At least 6 digits
    };

    // Check if basic validations pass
    const isValid = Object.values(validationResults).every(result => result === true);

    // Enhanced debug logging for payment issues
    console.log('🔍 PAYMENT FORM VALIDATION:', {
      isValid,
      customerData: {
        name: name ? '✅ Present' : '❌ Missing',
        email: email ? '✅ Present' : '❌ Missing',
        phone: phone ? '✅ Present' : '❌ Missing',
      },
      validationResults,
      willShowPayment: isValid ? '✅ YES' : '❌ NO',
      failedFields: Object.keys(validationResults).filter(key =>
        validationResults[key as keyof typeof validationResults] === false
      )
    });

    if (!isValid) {
      console.warn('⚠️ PAYMENT BLOCKED - Complete required fields:', {
        needsName: !validationResults.name,
        needsEmail: !validationResults.email,
        needsPhone: !validationResults.phone,
      });
    }

    return isValid;
  };

  /**
   * Provides user-friendly validation messages for form fields
   * Returns specific error messages for failed validations
   */
  const getValidationMessage = (field: string): string => {
    const { name, email, phone, cpfNif, address, deliveryMethod } = customerInfo;

    switch (field) {
      case 'name':
        return !validationUtils.validateRequiredString(name, 2)
          ? 'Nome deve ter pelo menos 2 caracteres' : '';
      case 'email':
        return !validationUtils.validateEmail(email)
          ? 'Email deve ter formato válido (exemplo@email.com)' : '';
      case 'phone':
        return !validationUtils.validatePhone(phone)
          ? 'Telefone deve ter pelo menos 6 dígitos' : '';
      case 'cpfNif':
        return !validationUtils.validateCpfNif(cpfNif)
          ? 'CPF/NIF deve ter formato válido (9-11 dígitos)' : '';
      case 'zipCode':
        return !validationUtils.validateZipCode(address.zipCode, customerInfo.country)
          ? `Código postal inválido para ${customerInfo.country}` : '';
      default:
        return '';
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  /**
   * Handle successful payment processing with comprehensive data collection
   * Sends complete customer information, order details, and technical data to payment-success API
   */
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log('🎉 PAYMENT SUCCESS: Starting order completion process...', {
      paymentIntentId,
      customerEmail: customerInfo.email,
      total: finalTotal
    });

    setPaymentIntentId(paymentIntentId);
    setIsProcessing(true);

    try {
      // Enhanced logging for payment success flow
      console.log('📦 PAYMENT SUCCESS: Preparing order data...', {
        itemsCount: items.length,
        customerName: customerInfo.name,
        hasCompleteAddress: !!(customerInfo.address && customerInfo.address.street),
        technicalInfo: {
          hasIp: !!clientInfo.ip,
          hasUserAgent: !!clientInfo.userAgent
        }
      });

      // 🚨 CRITICAL: Call payment-success API with ALL customer and technical data
      console.log('📧 PAYMENT SUCCESS: Sending data to payment-success API...');

      const paymentSuccessResponse = await fetch('/api/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Payment Information
          paymentIntentId,
          amount: finalTotal,

          // Complete Customer Information
          customerInfo: {
            name: customerInfo.name || 'Cliente',
            email: customerInfo.email || 'email não informado',
            phone: customerInfo.phone || 'telefone não informado',
            cpfNif: customerInfo.cpfNif || 'documento não informado',
            country: customerInfo.country,

            // Complete address information
            address: {
              street: customerInfo.address.street,
              number: customerInfo.address.number,
              complement: customerInfo.address.complement,
              neighborhood: customerInfo.address.neighborhood,
              city: customerInfo.address.city,
              state: customerInfo.address.state,
              zipCode: customerInfo.address.zipCode,
              country: customerInfo.country
            },

            // Delivery preferences
            deliveryMethod: customerInfo.deliveryMethod
          },

          // Order items with complete details
          items: items.map(item => ({
            id: item.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.variant?.price || item.product.price,
            total: (item.variant?.price || item.product.price) * item.quantity,
            variant: item.variant ? {
              id: item.variant.id,
              name: item.variant.name,
              price: item.variant.price
            } : null
          })),

          // Order totals breakdown
          orderTotals: {
            subtotal: subtotal,
            taxAmount: taxAmount,
            shippingCost: shippingCost,
            finalTotal: finalTotal
          },

          // Technical information for fraud prevention and tracking
          technicalInfo: {
            clientIp: clientInfo.ip,
            userAgent: clientInfo.userAgent,
            timestamp: clientInfo.timestamp,
            orderTimestamp: new Date().toISOString(),
            browserLanguage: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenResolution: `${screen.width}x${screen.height}`,
            referrer: document.referrer || 'direct'
          }
        }),
      });

      console.log('📡 PAYMENT SUCCESS: Payment-success API response:', {
        status: paymentSuccessResponse.status,
        ok: paymentSuccessResponse.ok
      });

      if (paymentSuccessResponse.ok) {
        const responseData = await paymentSuccessResponse.json();
        console.log('✅ PAYMENT SUCCESS: API call successful!', {
          success: responseData.success,
          orderId: responseData.orderId,
          notificationsSent: responseData.notificationResults?.totalSent || 0
        });
      } else {
        const errorData = await paymentSuccessResponse.text();
        console.error('❌ PAYMENT SUCCESS: API call failed!', {
          status: paymentSuccessResponse.status,
          error: errorData.substring(0, 200)
        });

        // Don't block order completion even if notification fails
        console.warn('⚠️ PAYMENT SUCCESS: Continuing despite notification error...');
      }

      // Mark order as complete regardless of notification status
      console.log('🎊 PAYMENT SUCCESS: Marking order as complete...');
      setOrderComplete(true);

      // Clear cart after delay to ensure state update
      console.log('🧹 PAYMENT SUCCESS: Scheduling cart cleanup...');
      setTimeout(() => {
        clearCart();
        console.log('✅ PAYMENT SUCCESS: Cart cleared successfully');
      }, 500);

    } catch (error) {
      console.error('❌ PAYMENT SUCCESS: Error in completion process:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        paymentIntentId
      });

      // Still mark as complete since payment succeeded
      console.log('🔄 PAYMENT SUCCESS: Marking complete despite error...');
      setOrderComplete(true);
    } finally {
      setIsProcessing(false);
      console.log('🏁 PAYMENT SUCCESS: Process completed');
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('💳 Payment failed:', error);
    alert(`Erro no pagamento: ${error}`);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container-custom text-center">
          <div className="max-w-lg mx-auto">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-playfair font-light mb-4 text-gray-900">
              Pedido Confirmado!
            </h1>
            <p className="text-gray-600 mb-6">
              Obrigado pela sua compra! Você receberá um email de confirmação em breve.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-2">Número do Pedido</h3>
              <p className="text-3xl font-bold text-green-600">#JC-{Date.now().toString().slice(-6)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Um email de confirmação foi enviado para {customerInfo.email || 'juliocesarurss65@gmail.com'}
              </p>
            </div>
            <div className="space-y-4">
              {/* Special Offer for Next Purchase */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-orange-800 mb-2">🎁 OFERTA EXCLUSIVA!</div>
                <div className="text-sm text-orange-700 mb-3">
                  Use o código <span className="font-mono bg-yellow-200 px-2 py-1 rounded font-bold">CLIENTE15</span> na sua próxima compra
                </div>
                <div className="text-xs text-orange-600">15% de desconto válido por 48h</div>
              </div>

              <Link href="/produtos">
                <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                  🛍️ Continuar Comprando (15% OFF)
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>

              {/* Social Sharing */}
              <div className="text-center pt-4">
                <div className="text-sm text-gray-600 mb-3">Compartilhe sua experiência:</div>
                <div className="flex justify-center gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs hover:bg-blue-700 transition-colors">
                    📘 Facebook
                  </button>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-full text-xs hover:bg-pink-700 transition-colors">
                    📷 Instagram
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-full text-xs hover:bg-green-700 transition-colors">
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            <div>
              <h1 className="text-3xl font-playfair font-light text-gray-900 mb-2">
                Finalizar Compra
              </h1>
              <p className="text-gray-600">
                {itemsCount} {itemsCount === 1 ? 'produto' : 'produtos'} • €{finalTotal.toFixed(2)}
              </p>
            </div>
            <Link href="/carrinho">
              <Button variant="outline" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Carrinho
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Urgency Banner */}
      {showUrgency && (
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container-custom py-3">
            <div className="flex items-center justify-between text-center">
              <div className="flex items-center gap-2">
                <span className="animate-pulse text-yellow-300">⚠️</span>
                <span className="font-medium">OFERTA LIMITADA!</span>
                <span className="text-red-100">Termina em:</span>
                <div className="font-mono font-bold text-yellow-300">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-red-100">Últimas</span>
                  <span className="font-bold text-yellow-300 mx-1">3 unidades</span>
                  <span className="text-red-100">em stock!</span>
                </div>
                <button
                  onClick={() => setShowUrgency(false)}
                  className="text-red-200 hover:text-white"
                >×</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* One-Step Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Combined Form: Info + Payment */}
              <div className="space-y-6">
                <div className="bg-white border-2 border-amber-200 rounded-lg p-6 relative overflow-hidden">
                  {/* Social Proof Badge */}
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    ✅ +2.847 clientes satisfeitos
                  </div>

                  <h2 className="text-xl font-playfair font-medium mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Checkout Rápido - 30 Segundos!
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                        className={`input-luxury w-full ${
                          customerInfo.name && !validationUtils.validateRequiredString(customerInfo.name, 2)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      {customerInfo.name && getValidationMessage('name') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('name')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        className={`input-luxury w-full ${
                          customerInfo.email && !validationUtils.validateEmail(customerInfo.email)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      {customerInfo.email && getValidationMessage('email') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('email')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                        className={`input-luxury w-full ${
                          customerInfo.phone && !validationUtils.validatePhone(customerInfo.phone)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        placeholder="912345678"
                        required
                      />
                      {customerInfo.phone && getValidationMessage('phone') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('phone')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF/NIF <span className="text-gray-500 text-xs">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.cpfNif}
                        onChange={(e) => handleCustomerInfoChange('cpfNif', e.target.value)}
                        className={`input-luxury w-full ${
                          customerInfo.cpfNif && !validationUtils.validateCpfNif(customerInfo.cpfNif)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                      />
                      {customerInfo.cpfNif && getValidationMessage('cpfNif') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('cpfNif')}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço de Entrega
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País *
                      </label>
                      <select
                        value={customerInfo.country}
                        onChange={(e) => handleCustomerInfoChange('country', e.target.value)}
                        className="input-luxury w-full"
                        required
                      >
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name} - {country.currencySymbol} (Entrega: {country.shippingCost === 0 ? 'Grátis' : `${country.currencySymbol}${country.shippingCost}`})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Morada/Endereço Completo *
                      </label>
                      <textarea
                        value={`${customerInfo.address.street} ${customerInfo.address.number}${customerInfo.address.complement ? ', ' + customerInfo.address.complement : ''}`}
                        onChange={(e) => {
                          const fullAddress = e.target.value;
                          // Parse the address intelligently
                          const parts = fullAddress.split(/[,\n]/);
                          const streetAndNumber = parts[0]?.trim() || '';
                          const complement = parts[1]?.trim() || '';

                          // Extract number from street
                          const match = streetAndNumber.match(/^(.+?)\s+(\d+[a-zA-Z]*)\s*(.*)$/);
                          if (match) {
                            handleCustomerInfoChange('address.street', match[1].trim());
                            handleCustomerInfoChange('address.number', match[2]);
                            if (match[3]) handleCustomerInfoChange('address.complement', match[3]);
                          } else {
                            handleCustomerInfoChange('address.street', streetAndNumber);
                          }
                          if (complement) handleCustomerInfoChange('address.complement', complement);
                        }}
                        className={`input-luxury w-full h-20 resize-none ${
                          customerInfo.address.street && !validationUtils.validateRequiredString(customerInfo.address.street, 3)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Digite sua morada completa com rua, número e complemento</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.zipCode}
                        onChange={(e) => {
                          const zip = e.target.value;
                          handleCustomerInfoChange('address.zipCode', zip);

                          // Auto-complete city and district for Portugal
                          if (customerInfo.country === 'PT' && zip.match(/^\d{4}-?\d{3}$/)) {
                            // Portuguese postal code format detected
                            const postalCodes = {
                              '1000': { city: 'Lisboa', state: 'Lisboa' },
                              '4000': { city: 'Porto', state: 'Porto' },
                              '2830': { city: 'Barreiro', state: 'Setúbal' },
                              '2840': { city: 'Seixal', state: 'Setúbal' },
                              '2850': { city: 'Almada', state: 'Setúbal' },
                              '3000': { city: 'Coimbra', state: 'Coimbra' },
                              '8000': { city: 'Faro', state: 'Faro' },
                            };

                            const prefix = zip.substring(0, 4);
                            const location = postalCodes[prefix];
                            if (location && !customerInfo.address.city) {
                              handleCustomerInfoChange('address.city', location.city);
                              handleCustomerInfoChange('address.state', location.state);
                              handleCustomerInfoChange('address.neighborhood', location.city === 'Lisboa' ? 'Centro' : 'Centro');
                            }
                          }
                        }}
                        className={`input-luxury w-full ${
                          customerInfo.address.zipCode && !validationUtils.validateZipCode(customerInfo.address.zipCode, customerInfo.country)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        required
                      />
                      {customerInfo.address.zipCode && getValidationMessage('zipCode') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('zipCode')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localidade/Bairro *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.neighborhood}
                        onChange={(e) => handleCustomerInfoChange('address.neighborhood', e.target.value)}
                        className="input-luxury w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.city}
                        onChange={(e) => handleCustomerInfoChange('address.city', e.target.value)}
                        className="input-luxury w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado/Distrito *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.state}
                        onChange={(e) => handleCustomerInfoChange('address.state', e.target.value)}
                        className="input-luxury w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método de Entrega *
                      </label>
                      <select
                        value={customerInfo.deliveryMethod}
                        onChange={(e) => handleCustomerInfoChange('deliveryMethod', e.target.value)}
                        className="input-luxury w-full"
                        required
                      >
                        <option value="standard">Entrega Standard (3-5 dias úteis)</option>
                        <option value="express">Entrega Express (1-2 dias úteis)</option>
                        <option value="priority">Entrega Prioritária (24h)</option>
                        <option value="pickup">Recolha na Loja</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Payment Section - Same Page */}
                <div className="bg-white border-2 border-green-200 rounded-lg p-6 relative overflow-hidden">
                  {/* Trust Indicators */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      🔒 SSL Seguro
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      ⚡ Pagamento 1-Click
                    </div>
                  </div>

                  <h2 className="text-xl font-playfair font-medium mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Escolha seu Método de Pagamento
                  </h2>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-600">Cartão de Crédito/Débito</div>
                          <div className="text-xs text-gray-600">Pagamento seguro com Visa, Mastercard, American Express</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {validateStep1() ? (
                    <div className="mt-6">
                      <StripePayment
                        amount={finalTotal}
                        currency="eur"
                        customerInfo={{
                          name: customerInfo.name,
                          email: customerInfo.email,
                          phone: customerInfo.phone,
                        }}
                        items={items.map(item => ({
                          name: item.product.name,
                          quantity: item.quantity,
                          price: item.variant?.price || item.product.price,
                        }))}
                        promoCodeId={promoCodeId}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  ) : (
                    // Pre-render payment form in hidden state for faster loading
                    <div className="hidden">
                      <StripePayment
                        amount={finalTotal}
                        currency="eur"
                        customerInfo={{
                          name: customerInfo.name || 'Cliente',
                          email: customerInfo.email || 'cliente@email.com',
                          phone: customerInfo.phone || '912345678',
                        }}
                        items={[{
                          name: 'Produto',
                          quantity: 1,
                          price: finalTotal,
                        }]}
                        promoCodeId={promoCodeId}
                        onSuccess={() => {}}
                        onError={() => {}}
                      />
                    </div>
                  )}

                  {!validateStep1() && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center mt-4">
                      <p className="text-amber-700 font-medium mb-2">Complete os dados obrigatórios para prosseguir:</p>
                      <div className="text-sm text-amber-600">
                        {!customerInfo.name.trim() && <p>• Nome completo</p>}
                        {!customerInfo.email.includes('@') && <p>• Email válido</p>}
                        {customerInfo.phone.replace(/\D/g, '').length < 6 && <p>• Telefone (mínimo 6 dígitos)</p>}
                      </div>
                      <p className="text-xs text-amber-500 mt-2">O formulário de pagamento aparecerá automaticamente quando todos os campos estiverem preenchidos.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-playfair font-medium mb-4">
                    Resumo do Pedido
                  </h2>

                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-500">Sem Img</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-600">Qtd: {item.quantity}</p>
                          <p className="text-sm font-medium text-amber-600">
                            €{((item.variant?.price || item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <div className="border-t border-gray-200 pt-4">
                    <PromoCodeInput
                      cartTotal={total}
                      cartItems={items.map(item => ({
                        productId: item.product._id,
                        category: item.product.category,
                        quantity: item.quantity,
                        price: item.variant?.price || item.product.price
                      }))}
                      onPromoApplied={handlePromoApplied}
                      onPromoRemoved={handlePromoRemoved}
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto Promocional:</span>
                        <span>-€{promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>IVA (23%):</span>
                      <span>€{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Envio:
                      </span>
                      <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                        {shippingCost === 0 ? 'Grátis' : `€${shippingCost.toFixed(2)}`}
                        {promoFreeShipping && baseShippingCost > 0 && (
                          <span className="ml-1 text-xs">(Promo aplicado)</span>
                        )}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 -mx-4 px-4 py-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-green-700 font-medium">🎉 VOCÊ ECONOMIZA €15!</div>
                          <div className="text-xs text-green-600">Frete GRÁTIS incluso</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 line-through">€{(finalTotal + 15).toFixed(2)}</div>
                          <div className="text-xl font-bold text-green-600">€{finalTotal.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Security & Trust */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-600" />
                    Compra 100% Protegida
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-green-800">SSL 256-bit + PCI DSS</div>
                        <div className="text-green-600 text-xs">Dados protegidos por criptografia militar</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-blue-800">Entrega Garantida</div>
                        <div className="text-blue-600 text-xs">Reembolso total se não chegar</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-purple-800">Suporte Premium 24/7</div>
                        <div className="text-purple-600 text-xs">WhatsApp: +351 928 375 226</div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="mt-6 pt-4 border-t border-green-200">
                    <div className="text-xs text-center text-gray-600 mb-3">O que dizem nossos clientes:</div>
                    <div className="text-xs italic text-center text-gray-700 bg-white rounded-lg p-3">
                      "Produtos autênticos, entrega rápida! Meu cabelo ficou lindo com a progressiva Vogue."
                      <div className="text-yellow-500 mt-1">⭐⭐⭐⭐⭐ <span className="text-gray-600">- Maria, Lisboa</span></div>
                    </div>
                  </div>

                  {/* Guarantee Badge */}
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold">
                      ✓ GARANTIA 30 DIAS
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