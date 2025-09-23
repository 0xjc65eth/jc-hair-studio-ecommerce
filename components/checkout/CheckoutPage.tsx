'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { countries, getShippingCost } from '@/lib/config/shipping';
import { StripePayment } from './StripePayment';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');

  // Client technical information for fraud prevention and order tracking
  const [clientInfo, setClientInfo] = useState({
    ip: '',
    userAgent: '',
    timestamp: ''
  });

  // Debug logs only in development and when there are issues - moved to useEffect to prevent initialization errors

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

  const [selectedPayment, setSelectedPayment] = useState<string>('');

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
     * Validates phone number format (international support)
     */
    validatePhone: (phone: string): boolean => {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      const phoneRegex = /^[+]?[\d]{8,15}$/;
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
  const shippingCost = getShippingCost(customerInfo.country);
  const finalTotal = total + shippingCost;

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      name: 'Cartão de Crédito',
      icon: CreditCard,
      description: 'Visa, MasterCard, Amex'
    },
    {
      id: 'bank_transfer',
      name: 'Transferência Bancária',
      icon: Home,
      description: 'MB Way, IBAN'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Shield,
      description: 'Pagamento seguro via PayPal'
    }
  ];

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

  /**
   * Comprehensive validation for Step 1 - Customer Information
   * Validates all required fields including personal data and complete address
   * Uses robust validation utilities for format checking
   */
  const validateStep1 = () => {
    const { name, email, phone, cpfNif, address, deliveryMethod } = customerInfo;

    // Required field validation using utility functions
    const validationResults = {
      name: validationUtils.validateRequiredString(name, 2),
      email: validationUtils.validateEmail(email),
      phone: validationUtils.validatePhone(phone),
      cpfNif: validationUtils.validateCpfNif(cpfNif),
      street: validationUtils.validateRequiredString(address.street, 3),
      number: validationUtils.validateRequiredString(address.number, 1),
      neighborhood: validationUtils.validateRequiredString(address.neighborhood, 2),
      city: validationUtils.validateRequiredString(address.city, 2),
      state: validationUtils.validateRequiredString(address.state, 2),
      zipCode: validationUtils.validateZipCode(address.zipCode, customerInfo.country),
      deliveryMethod: validationUtils.validateRequiredString(deliveryMethod, 3)
    };

    // Check if all validations pass
    const isValid = Object.values(validationResults).every(result => result === true);

    // Comprehensive validation logging for development
    if (process.env.NODE_ENV === 'development' && !isValid) {
      console.log('📋 COMPREHENSIVE FORM VALIDATION:', {
        isValid,
        validationResults,
        fieldValues: {
          name: name || '(empty)',
          email: email ? email.substring(0, 3) + '***@' + email.split('@')[1] : '(empty)',
          phone: phone ? phone.substring(0, 3) + '***' : '(empty)',
          cpfNif: cpfNif ? cpfNif.substring(0, 3) + '***' : '(empty)',
          country: customerInfo.country,
          deliveryMethod: deliveryMethod || '(empty)'
        },
        failedFields: Object.keys(validationResults).filter(key =>
          validationResults[key as keyof typeof validationResults] === false
        )
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
          ? 'Telefone deve ter formato válido (+351 912 345 678)' : '';
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

  const handleProcessOrder = async () => {
    console.log('🚀 HANDLE PROCESS ORDER - START:', {
      selectedPayment,
      items: items.length,
      isEmpty,
      currentStep
    });

    if (!selectedPayment) {
      console.log('⚠️ NO PAYMENT METHOD SELECTED');
      alert('Por favor, selecione uma forma de pagamento');
      return;
    }

    // 🚨 CRITICAL CHECK: Verify cart before processing
    if (isEmpty || items.length === 0) {
      console.log('🚨 CRITICAL ERROR: Trying to process empty cart!');
      const localStorageCheck = localStorage.getItem('jc-cart-storage-manual');
      console.log('🚨 localStorage content:', localStorageCheck ? JSON.parse(localStorageCheck) : null);
      alert('Erro: Carrinho vazio. Adicione produtos antes de continuar.');
      return;
    }

    // 🔍 DEBUG: Log state before processing
    console.log('💳 PROCESSING ORDER - BEFORE:', {
      selectedPayment,
      itemsLength: items.length,
      itemsCount,
      subtotal,
      isEmpty,
      cartItems: items.map(item => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }))
    });

    setIsProcessing(true);

    // Simular processamento do pedido
    try {
      // 🔍 DEBUG: Log before processing
      console.log('💳 PROCESSING ORDER - STARTING:', {
        itemsLength: items.length,
        localStorageContent: localStorage.getItem('jc-cart-storage-manual')
      });

      // Simular processamento (MANTER o carrinho durante processamento)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 🔍 DEBUG: Log processing success
      console.log('✅ ORDER PROCESSED SUCCESSFULLY - Before clearing cart:', {
        itemsLength: items.length,
        localStorageContent: localStorage.getItem('jc-cart-storage-manual')
      });

      // Generate order ID
      const orderId = `JC-${Date.now().toString().slice(-6)}`;

      // Send order confirmation email
      try {
        console.log('📧 Sending order confirmation email...');

        const orderData = {
          orderId,
          customerName: customerInfo.name || 'Cliente',
          customerEmail: customerInfo.email || 'juliocesarurss65@gmail.com',
          items: items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.variant?.price || item.product.price
          })),
          total: finalTotal,
          paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name || 'Não especificado'
        };

        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'order-confirmation',
            data: orderData
          }),
        });

        if (emailResponse.ok) {
          console.log('✅ Order confirmation email sent successfully');
        } else {
          console.error('❌ Failed to send order confirmation email');
        }
      } catch (emailError) {
        console.error('❌ Error sending order confirmation email:', emailError);
      }

      // APENAS limpar carrinho APÓS sucesso confirmado
      setOrderComplete(true);

      // Aguardar o estado de pedido completo ser atualizado antes de limpar
      setTimeout(() => {
        console.log('🧹 NOW CLEARING CART - After order confirmed:', {
          itemsLength: items.length,
          localStorageContent: localStorage.getItem('jc-cart-storage-manual')
        });

        clearCart();

        console.log('✅ CART CLEARED - AFTER successful order:', {
          newLocalStorageContent: localStorage.getItem('jc-cart-storage-manual')
        });
      }, 500); // Aguardar meio segundo para garantir que o estado foi atualizado

    } catch (error) {
      console.error('❌ Erro ao processar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle successful payment processing with comprehensive data collection
   * Sends complete customer information, order details, and technical data to payment-success API
   */
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    console.log('💳 Payment successful - Processing comprehensive order data:', paymentIntentId);

    setPaymentIntentId(paymentIntentId);
    setIsProcessing(true);

    try {
      // 🚨 CRITICAL: Call payment-success API with ALL customer and technical data
      console.log('📧 Calling payment-success API with comprehensive data...');

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

      if (paymentSuccessResponse.ok) {
        const responseData = await paymentSuccessResponse.json();
        console.log('✅ Payment success API called successfully:', responseData);
      } else {
        const errorData = await paymentSuccessResponse.text();
        console.error('❌ Failed to call payment-success API:', errorData);
      }

      // Marcar pedido como completo
      setOrderComplete(true);

      // Limpar carrinho após um delay
      setTimeout(() => {
        clearCart();
        console.log('✅ CART CLEARED - AFTER successful payment');
      }, 500);

    } catch (error) {
      console.error('❌ Error processing order after payment:', error);
    } finally {
      setIsProcessing(false);
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
              <p className="text-2xl font-bold text-amber-600">#JC-{Date.now().toString().slice(-6)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Um email de confirmação foi enviado para {customerInfo.email || 'juliocesarurss65@gmail.com'}
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/produtos">
                <Button size="lg" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full">
                  Voltar ao Início
                </Button>
              </Link>
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

      {/* Progress Steps */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Dados Pessoais</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2 text-sm font-medium">Pagamento</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-playfair font-medium mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Dados Pessoais
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
                        placeholder="Seu nome completo"
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
                        placeholder="seu@email.com"
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
                        placeholder="+351 912 345 678"
                        required
                      />
                      {customerInfo.phone && getValidationMessage('phone') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('phone')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF/NIF *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.cpfNif}
                        onChange={(e) => handleCustomerInfoChange('cpfNif', e.target.value)}
                        className={`input-luxury w-full ${
                          customerInfo.cpfNif && !validationUtils.validateCpfNif(customerInfo.cpfNif)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        placeholder="123.456.789-00 ou 123456789"
                        required
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
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.zipCode}
                        onChange={(e) => handleCustomerInfoChange('address.zipCode', e.target.value)}
                        className={`input-luxury w-full ${
                          customerInfo.address.zipCode && !validationUtils.validateZipCode(customerInfo.address.zipCode, customerInfo.country)
                            ? 'border-red-300 focus:border-red-500' : ''
                        }`}
                        placeholder="1000-001"
                        required
                      />
                      {customerInfo.address.zipCode && getValidationMessage('zipCode') && (
                        <p className="text-red-500 text-xs mt-1">{getValidationMessage('zipCode')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.street}
                        onChange={(e) => handleCustomerInfoChange('address.street', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="Nome da rua"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.number}
                        onChange={(e) => handleCustomerInfoChange('address.number', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="123"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.complement}
                        onChange={(e) => handleCustomerInfoChange('address.complement', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="Andar, apartamento, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address.neighborhood}
                        onChange={(e) => handleCustomerInfoChange('address.neighborhood', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="Nome do bairro"
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
                        placeholder="Digite sua cidade"
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
                        placeholder="Estado/Região/Distrito"
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

                  <div className="mt-6">
                    <Button
                      onClick={handleNextStep}
                      disabled={!validateStep1()}
                      size="lg"
                      className="w-full"
                    >
                      Continuar para Pagamento
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-playfair font-medium mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Pagamento Seguro
                  </h2>

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
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="w-full"
                    >
                      ← Voltar para Dados Pessoais
                    </Button>
                  </div>
                </div>
              )}
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

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
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
                      <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                        {shippingCost === 0 ? 'Grátis' : `€${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-amber-600">€{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Compra Segura
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Envio rápido e confiável</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Suporte ao cliente</span>
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