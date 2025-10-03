/**
 * ========================================================================
 * EXEMPLO DE INTEGRAÇÃO - VALIDAÇÕES ROBUSTAS NO CHECKOUT
 * ========================================================================
 * Este arquivo mostra como integrar as validações no componente CheckoutPage
 *
 * @file INTEGRATION_EXAMPLE.tsx
 * @description Exemplo completo de implementação
 * @author JC Hair Studio Development Team
 */

'use client';

import { useState } from 'react';
import { validationUtils, getValidationErrorMessage } from './validation';

/**
 * EXEMPLO 1: IMPORTAR E USAR AS VALIDAÇÕES
 * ========================================
 */

// No início do arquivo CheckoutPage.tsx, substitua:
// ❌ ANTES (validações fracas inline)
// ✅ DEPOIS (importar validações robustas)
import { validationUtils, getValidationErrorMessage } from '@/components/checkout/validation';

/**
 * EXEMPLO 2: ESTADO DO FORMULÁRIO COM ERROS
 * =========================================
 */

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  cpfNif: string;
  zipCode: string;
  address: string;
  city: string;
}

function CheckoutPageExample() {
  // Estado do formulário
  const [customerInfo, setCustomerInfo] = useState({
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
    }
  });

  // Estado dos erros
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    phone: '',
    cpfNif: '',
    zipCode: '',
    address: '',
    city: '',
  });

  // Estado de "campo tocado" (touched) - só mostrar erro após usuário interagir
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * EXEMPLO 3: VALIDAÇÃO EM TEMPO REAL
   * ==================================
   */

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!validationUtils.validateFullName(value)) {
          error = getValidationErrorMessage('name', value);
        }
        break;

      case 'email':
        if (!validationUtils.validateEmail(value)) {
          error = getValidationErrorMessage('email', value);
        }
        break;

      case 'phone':
        if (!validationUtils.validatePhone(value)) {
          error = getValidationErrorMessage('phone', value);
        }
        break;

      case 'cpfNif':
        if (value && !validationUtils.validateCpfNif(value)) {
          error = getValidationErrorMessage('cpfNif', value);
        }
        break;

      case 'zipCode':
        if (!validationUtils.validateZipCode(value, customerInfo.country)) {
          error = getValidationErrorMessage('zipCode', value, customerInfo.country);
        }
        break;

      case 'address':
        if (!validationUtils.validateAddress(value)) {
          error = getValidationErrorMessage('address', value);
        }
        break;

      case 'city':
        if (!validationUtils.validateCity(value)) {
          error = getValidationErrorMessage('city', value);
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  /**
   * EXEMPLO 4: HANDLERS DE INPUT
   * ============================
   */

  const handleFieldChange = (field: string, value: string) => {
    // Atualizar valor
    setCustomerInfo(prev => ({ ...prev, [field]: value }));

    // Validar apenas se o campo já foi tocado
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string, value: string) => {
    // Marcar campo como tocado
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validar campo
    validateField(field, value);
  };

  /**
   * EXEMPLO 5: VALIDAÇÃO ANTES DE SUBMIT
   * ====================================
   */

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {
      name: '',
      email: '',
      phone: '',
      cpfNif: '',
      zipCode: '',
      address: '',
      city: '',
    };

    let isValid = true;

    // Validar nome
    if (!validationUtils.validateFullName(customerInfo.name)) {
      newErrors.name = getValidationErrorMessage('name', customerInfo.name);
      isValid = false;
    }

    // Validar email
    if (!validationUtils.validateEmail(customerInfo.email)) {
      newErrors.email = getValidationErrorMessage('email', customerInfo.email);
      isValid = false;
    }

    // Validar telefone
    if (!validationUtils.validatePhone(customerInfo.phone)) {
      newErrors.phone = getValidationErrorMessage('phone', customerInfo.phone);
      isValid = false;
    }

    // Validar CPF/NIF (opcional, mas se preenchido deve ser válido)
    if (customerInfo.cpfNif && !validationUtils.validateCpfNif(customerInfo.cpfNif)) {
      newErrors.cpfNif = getValidationErrorMessage('cpfNif', customerInfo.cpfNif);
      isValid = false;
    }

    // Validar código postal
    if (!validationUtils.validateZipCode(customerInfo.address.zipCode, customerInfo.country)) {
      newErrors.zipCode = getValidationErrorMessage('zipCode', customerInfo.address.zipCode, customerInfo.country);
      isValid = false;
    }

    // Validar endereço
    const fullAddress = `${customerInfo.address.street} ${customerInfo.address.number}`;
    if (!validationUtils.validateAddress(fullAddress)) {
      newErrors.address = getValidationErrorMessage('address', fullAddress);
      isValid = false;
    }

    // Validar cidade
    if (!validationUtils.validateCity(customerInfo.address.city)) {
      newErrors.city = getValidationErrorMessage('city', customerInfo.address.city);
      isValid = false;
    }

    setErrors(newErrors);

    // Marcar todos os campos como tocados
    setTouched({
      name: true,
      email: true,
      phone: true,
      cpfNif: true,
      zipCode: true,
      address: true,
      city: true,
    });

    return isValid;
  };

  /**
   * EXEMPLO 6: JSX COM VALIDAÇÕES VISUAIS
   * =====================================
   */

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout com Validações Robustas</h1>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (validateAllFields()) {
          console.log('✅ Formulário válido! Enviando...', customerInfo);
          // Enviar dados
        } else {
          console.log('❌ Formulário inválido. Corrija os erros.');
        }
      }}>

        {/* Campo Nome */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            onBlur={(e) => handleFieldBlur('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.name && errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="João Silva"
          />
          {touched.name && errors.name && (
            <div className="mt-1 flex items-start gap-1">
              <span className="text-red-500 text-xs">⚠️</span>
              <p className="text-red-500 text-xs">{errors.name}</p>
            </div>
          )}
          {touched.name && !errors.name && customerInfo.name && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-500 text-xs">Nome válido</p>
            </div>
          )}
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            onBlur={(e) => handleFieldBlur('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.email && errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="exemplo@email.com"
          />
          {touched.email && errors.email && (
            <div className="mt-1 flex items-start gap-1">
              <span className="text-red-500 text-xs">⚠️</span>
              <p className="text-red-500 text-xs">{errors.email}</p>
            </div>
          )}
          {touched.email && !errors.email && customerInfo.email && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-500 text-xs">Email válido</p>
            </div>
          )}
        </div>

        {/* Campo Telefone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            onBlur={(e) => handleFieldBlur('phone', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.phone && errors.phone
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="+351 912 345 678"
          />
          {touched.phone && errors.phone && (
            <div className="mt-1 flex items-start gap-1">
              <span className="text-red-500 text-xs">⚠️</span>
              <p className="text-red-500 text-xs">{errors.phone}</p>
            </div>
          )}
          {touched.phone && !errors.phone && customerInfo.phone && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-500 text-xs">Telefone válido</p>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Formatos aceitos: PT (+351), BR (+55), ou internacional
          </p>
        </div>

        {/* Campo CPF/NIF */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPF/NIF <span className="text-gray-500 text-xs">(opcional)</span>
          </label>
          <input
            type="text"
            value={customerInfo.cpfNif}
            onChange={(e) => handleFieldChange('cpfNif', e.target.value)}
            onBlur={(e) => handleFieldBlur('cpfNif', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              touched.cpfNif && errors.cpfNif
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="123.456.789-09 ou 123456789"
          />
          {touched.cpfNif && errors.cpfNif && (
            <div className="mt-1 flex items-start gap-1">
              <span className="text-red-500 text-xs">⚠️</span>
              <p className="text-red-500 text-xs">{errors.cpfNif}</p>
            </div>
          )}
          {touched.cpfNif && !errors.cpfNif && customerInfo.cpfNif && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-green-500 text-xs">✓</span>
              <p className="text-green-500 text-xs">Documento válido</p>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500">
            CPF (Brasil - 11 dígitos) ou NIF (Portugal - 9 dígitos)
          </p>
        </div>

        {/* Botão Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continuar para Pagamento
        </button>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Estado Atual (Debug)</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ customerInfo, errors, touched }, null, 2)}
          </pre>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPageExample;

/**
 * EXEMPLO 7: RESUMO DE VALIDAÇÕES POR CAMPO
 * =========================================
 */

/*
┌─────────────────────────────────────────────────────────────────────┐
│ CAMPO         │ VALIDAÇÃO                    │ EXEMPLO VÁLIDO       │
├─────────────────────────────────────────────────────────────────────┤
│ Nome          │ validateFullName()           │ "João Silva"         │
│ Email         │ validateEmail()              │ "user@example.com"   │
│ Telefone      │ validatePhone()              │ "+351 912 345 678"   │
│ CPF           │ validateCPF()                │ "123.456.789-09"     │
│ NIF           │ validateNIF()                │ "123456789"          │
│ Código Postal │ validateZipCode(value, país) │ "1000-001" (PT)      │
│ Endereço      │ validateAddress()            │ "Rua das Flores, 123"│
│ Cidade        │ validateCity()               │ "Lisboa"             │
└─────────────────────────────────────────────────────────────────────┘
*/

/**
 * EXEMPLO 8: PASSOS PARA INTEGRAÇÃO COMPLETA
 * ==========================================
 */

/*
PASSO 1: Importar validações
────────────────────────────────
import { validationUtils, getValidationErrorMessage } from '@/components/checkout/validation';

PASSO 2: Adicionar estado de erros
────────────────────────────────
const [errors, setErrors] = useState<FormErrors>({...});
const [touched, setTouched] = useState<Record<string, boolean>>({});

PASSO 3: Criar função validateField()
────────────────────────────────
const validateField = (field: string, value: string) => {
  // Validar e setar erro
};

PASSO 4: Adicionar onBlur nos inputs
────────────────────────────────
<input
  onBlur={(e) => handleFieldBlur('name', e.target.value)}
/>

PASSO 5: Mostrar mensagens de erro
────────────────────────────────
{touched.name && errors.name && (
  <p className="text-red-500 text-xs">{errors.name}</p>
)}

PASSO 6: Validar antes de submit
────────────────────────────────
const handleSubmit = (e) => {
  e.preventDefault();
  if (validateAllFields()) {
    // Enviar
  }
};
*/
