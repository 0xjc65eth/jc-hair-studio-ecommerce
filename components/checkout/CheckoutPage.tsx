'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { countries, getShippingCost } from '@/lib/config/shipping';
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

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
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

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    country: 'PT',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const [selectedPayment, setSelectedPayment] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  // Redirect if cart is empty
  if (isEmpty) {
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

  const validateStep1 = () => {
    const { name, email, phone, address } = customerInfo;
    return name && email && phone &&
           address.street && address.number &&
           address.neighborhood && address.city &&
           address.state && address.zipCode;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleProcessOrder = async () => {
    if (!selectedPayment) {
      alert('Por favor, selecione uma forma de pagamento');
      return;
    }

    setIsProcessing(true);

    // Simular processamento do pedido
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular sucesso
      setOrderComplete(true);
      clearCart();

    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
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
                        className="input-luxury w-full"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                        className="input-luxury w-full"
                        placeholder="+351 912 345 678"
                        required
                      />
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
                        className="input-luxury w-full"
                        placeholder="1000-001"
                        required
                      />
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
                    <div className="md:col-span-2">
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
                    Forma de Pagamento
                  </h2>

                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedPayment === method.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <method.icon className="w-6 h-6 text-gray-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPayment === method.id
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPayment === method.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handleProcessOrder}
                      disabled={!selectedPayment || isProcessing}
                      size="lg"
                      className="flex-1"
                      isLoading={isProcessing}
                    >
                      {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
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