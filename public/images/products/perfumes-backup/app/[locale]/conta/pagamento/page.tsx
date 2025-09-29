'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CreditCard, Plus, Edit2, Trash2, ArrowLeft, Shield, Calendar } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  brand: 'visa' | 'mastercard' | 'amex' | 'elo';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
  billingAddress: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const brandColors = {
  visa: 'bg-blue-600',
  mastercard: 'bg-red-600',
  amex: 'bg-green-600',
  elo: 'bg-yellow-600'
};

const brandNames = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  elo: 'Elo'
};

export default function PagamentoPage() {
  const { data: session, status } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const [formData, setFormData] = useState({
    type: 'credit' as 'credit' | 'debit',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    billingAddress: {
      street: '',
      number: '',
      city: '',
      state: '',
      zipCode: ''
    },
    isDefault: false
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!session) return;

      try {
        // Mock data - replace with actual API call
        const mockMethods: PaymentMethod[] = [
          {
            id: '1',
            type: 'credit',
            brand: 'visa',
            lastFour: '4532',
            expiryMonth: 12,
            expiryYear: 2026,
            holderName: 'João Silva',
            isDefault: true,
            billingAddress: {
              street: 'Rua das Flores',
              number: '123',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01310-100'
            }
          },
          {
            id: '2',
            type: 'credit',
            brand: 'mastercard',
            lastFour: '8765',
            expiryMonth: 8,
            expiryYear: 2025,
            holderName: 'João Silva',
            isDefault: false,
            billingAddress: {
              street: 'Rua das Flores',
              number: '123',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01310-100'
            }
          }
        ];

        setPaymentMethods(mockMethods);
      } catch (error) {
        console.error('Erro ao carregar métodos de pagamento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [session]);

  const detectCardBrand = (cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'elo' => {
    const number = cardNumber.replace(/\s/g, '');

    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('34') || number.startsWith('37')) return 'amex';
    if (number.startsWith('6') || number.startsWith('50')) return 'elo';

    return 'visa'; // default
  };

  const formatCardNumber = (value: string) => {
    const number = value.replace(/\s/g, '');
    const formatted = number.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      const brand = detectCardBrand(cardNumber);
      const lastFour = cardNumber.slice(-4);

      if (editingMethod) {
        // Update existing method
        setPaymentMethods(prev => prev.map(method =>
          method.id === editingMethod.id
            ? {
                ...method,
                type: formData.type,
                brand,
                lastFour,
                expiryMonth: parseInt(formData.expiryMonth),
                expiryYear: parseInt(formData.expiryYear),
                holderName: formData.holderName,
                billingAddress: formData.billingAddress,
                isDefault: formData.isDefault
              }
            : method
        ));
      } else {
        // Add new method
        const newMethod: PaymentMethod = {
          id: Date.now().toString(),
          type: formData.type,
          brand,
          lastFour,
          expiryMonth: parseInt(formData.expiryMonth),
          expiryYear: parseInt(formData.expiryYear),
          holderName: formData.holderName,
          billingAddress: formData.billingAddress,
          isDefault: formData.isDefault
        };
        setPaymentMethods(prev => [...prev, newMethod]);
      }

      // Reset form
      setFormData({
        type: 'credit',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        billingAddress: {
          street: '',
          number: '',
          city: '',
          state: '',
          zipCode: ''
        },
        isDefault: false
      });
      setShowForm(false);
      setEditingMethod(null);
    } catch (error) {
      console.error('Erro ao salvar método de pagamento:', error);
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setFormData({
      type: method.type,
      cardNumber: `**** **** **** ${method.lastFour}`,
      expiryMonth: method.expiryMonth.toString().padStart(2, '0'),
      expiryYear: method.expiryYear.toString(),
      cvv: '',
      holderName: method.holderName,
      billingAddress: method.billingAddress,
      isDefault: method.isDefault
    });
    setEditingMethod(method);
    setShowForm(true);
  };

  const handleDelete = async (methodId: string) => {
    if (confirm('Tem certeza que deseja excluir este método de pagamento?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    }
  };

  const handleSetDefault = async (methodId: string) => {
    setPaymentMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Você precisa estar logado para gerenciar seus métodos de pagamento.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">Formas de Pagamento</h1>
              <p className="text-gray-600">Gerencie seus cartões e métodos de pagamento</p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingMethod(null);
                setFormData({
                  type: 'credit',
                  cardNumber: '',
                  expiryMonth: '',
                  expiryYear: '',
                  cvv: '',
                  holderName: '',
                  billingAddress: {
                    street: '',
                    number: '',
                    city: '',
                    state: '',
                    zipCode: ''
                  },
                  isDefault: false
                });
              }}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Cartão
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">Suas informações estão seguras</h3>
              <p className="text-sm text-blue-700">
                Utilizamos criptografia de ponta e não armazenamos dados completos do cartão.
              </p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              {editingMethod ? 'Editar Cartão' : 'Novo Cartão'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cartão
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="credit"
                      checked={formData.type === 'credit'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="mr-2"
                    />
                    Crédito
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="debit"
                      checked={formData.type === 'debit'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="mr-2"
                    />
                    Débito
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                  disabled={!!editingMethod}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mês de Validade
                  </label>
                  <select
                    value={formData.expiryMonth}
                    onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  >
                    <option value="">Mês</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                        {(i + 1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano de Validade
                  </label>
                  <select
                    value={formData.expiryYear}
                    onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  >
                    <option value="">Ano</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  value={formData.holderName}
                  onChange={(e) => setFormData({ ...formData, holderName: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="JOÃO SILVA"
                  required
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço de Cobrança</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress, street: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.number}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress, number: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress, city: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress, zipCode: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      placeholder="Ex: 00000-000, SW1A 1AA, 10001"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Definir como método padrão
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editingMethod ? 'Atualizar' : 'Salvar'} Cartão
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMethod(null);
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-gray-600 mb-6">Adicione um cartão para facilitar suas compras.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Adicionar Primeiro Cartão
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className={`h-32 ${brandColors[method.brand]} text-white p-6 relative`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">{method.type === 'credit' ? 'Crédito' : 'Débito'}</p>
                      <p className="text-lg font-medium">{brandNames[method.brand]}</p>
                    </div>
                    {method.isDefault && (
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        Padrão
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <p className="text-xl font-mono">•••• •••• •••• {method.lastFour}</p>
                    <p className="text-sm opacity-90 mt-1">
                      {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear.toString().slice(-2)}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="font-medium text-gray-900">{method.holderName}</p>
                    <p className="text-sm text-gray-600">
                      {method.billingAddress.street}, {method.billingAddress.number}
                    </p>
                    <p className="text-sm text-gray-600">
                      {method.billingAddress.city}, {method.billingAddress.state}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(method)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="w-full mt-2 text-sm text-blue-600 hover:text-blue-900"
                    >
                      Definir como padrão
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}