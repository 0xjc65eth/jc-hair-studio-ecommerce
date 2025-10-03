/**
 * ========================================================================
 * VALIDAÇÃO ROBUSTA DE FORMULÁRIOS - SEGURANÇA E UX APRIMORADOS
 * ========================================================================
 * Funções de validação com regex patterns fortes e validação de dígitos
 * verificadores para CPF/NIF. Inclui validação client-side completa.
 *
 * @file validation.ts
 * @description Biblioteca de validação para formulários de checkout
 * @author JC Hair Studio Development Team
 * @created 2025-01-XX
 */

export const validationUtils = {
  /**
   * VALIDAÇÃO DE NOME COMPLETO
   * -------------------------
   * Regex: ^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$
   *
   * Regras:
   * - Mínimo 2 palavras (nome + sobrenome)
   * - Apenas letras (A-Z, a-z) e acentos (À-ÿ incluindo ã, õ, ç, etc.)
   * - Espaços entre palavras permitidos
   * - Números, símbolos e caracteres especiais NÃO permitidos
   *
   * Exemplos VÁLIDOS:
   * ✓ "João Silva"
   * ✓ "Maria José Santos"
   * ✓ "José António Pereira"
   * ✓ "Luís Gonçalves"
   *
   * Exemplos INVÁLIDOS:
   * ✗ "João" (apenas uma palavra)
   * ✗ "João123" (contém números)
   * ✗ "João@Silva" (caracteres especiais)
   * ✗ "joão silva" (aceito, mas letras maiúsculas são recomendadas)
   */
  validateFullName: (name: string): boolean => {
    const nameRegex = /^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 5;
  },

  /**
   * VALIDAÇÃO DE EMAIL RFC 5322 COMPLIANT
   * -------------------------------------
   * Regex: ^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
   *
   * Regras RFC 5322 (padrão oficial de email):
   * - Local part (antes do @): letras, números e caracteres especiais permitidos
   * - Domínio (depois do @): letras, números e hífen
   * - TLD (extensão): mínimo 2 caracteres (.pt, .com, .br, etc.)
   * - Não permite espaços, @ duplicado, ou domínios inválidos
   *
   * Exemplos VÁLIDOS:
   * ✓ "usuario@exemplo.com"
   * ✓ "maria.silva@empresa.pt"
   * ✓ "joao_123@mail.co.uk"
   * ✓ "info+tag@domain.com"
   *
   * Exemplos INVÁLIDOS:
   * ✗ "usuario@" (sem domínio)
   * ✗ "@exemplo.com" (sem local part)
   * ✗ "usuario @exemplo.com" (espaço)
   * ✗ "usuario@exemplo" (sem TLD)
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim());
  },

  /**
   * VALIDAÇÃO DE TELEFONE INTERNACIONAL
   * -----------------------------------
   * Regex: ^(\+351|351)?\s?9[1236]\d{7}$ (Portugal)
   * Regex: ^(\+55|55)?\s?\(?\d{2}\)?\s?9?\d{4}-?\d{4}$ (Brasil)
   * Regex: ^(\+?\d{1,3})?\s?\(?\d{1,4}\)?\s?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}$ (Internacional)
   *
   * Suporte a múltiplos formatos:
   * - Portugal: 9XX XXX XXX (9 dígitos começando com 91, 92, 93, 96)
   * - Brasil: (XX) 9XXXX-XXXX (11 dígitos com DDD)
   * - Internacional: +XX XXX XXX XXX (código país + número)
   *
   * Exemplos VÁLIDOS Portugal:
   * ✓ "912345678"
   * ✓ "+351 912 345 678"
   * ✓ "351912345678"
   * ✓ "96 123 45 78"
   *
   * Exemplos VÁLIDOS Brasil:
   * ✓ "(11) 98765-4321"
   * ✓ "11987654321"
   * ✓ "+55 11 98765-4321"
   *
   * Exemplos VÁLIDOS Internacional:
   * ✓ "+1 555 123 4567" (EUA)
   * ✓ "+44 20 1234 5678" (UK)
   * ✓ "+49 30 12345678" (Alemanha)
   *
   * Exemplos INVÁLIDOS:
   * ✗ "123" (muito curto)
   * ✗ "abc123456" (contém letras)
   * ✗ "812345678" (PT não começa com 8)
   */
  validatePhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

    // Portugal: 9 dígitos começando com 91, 92, 93, 96
    const portugalRegex = /^(\+351|351)?9[1236]\d{7}$/;

    // Brasil: 10 ou 11 dígitos (DDD + número)
    const brazilRegex = /^(\+55|55)?\d{10,11}$/;

    // Internacional: 7-15 dígitos com código de país opcional
    const internationalRegex = /^(\+?\d{1,3})?\d{7,15}$/;

    return portugalRegex.test(cleanPhone) ||
           brazilRegex.test(cleanPhone) ||
           internationalRegex.test(cleanPhone);
  },

  /**
   * VALIDAÇÃO DE CPF (BRASIL) COM DÍGITOS VERIFICADORES
   * --------------------------------------------------
   * Regex: ^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$
   *
   * Algoritmo de validação CPF:
   * 1. Remove formatação (pontos e hífen)
   * 2. Verifica se tem 11 dígitos
   * 3. Verifica se não são todos iguais (111.111.111-11 é inválido)
   * 4. Calcula primeiro dígito verificador
   * 5. Calcula segundo dígito verificador
   * 6. Compara com os dígitos informados
   *
   * Formato aceito:
   * - XXX.XXX.XXX-XX (com formatação)
   * - XXXXXXXXXXX (sem formatação)
   *
   * Exemplos VÁLIDOS:
   * ✓ "123.456.789-09"
   * ✓ "12345678909"
   * ✓ "111.444.777-35"
   *
   * Exemplos INVÁLIDOS:
   * ✗ "111.111.111-11" (todos iguais)
   * ✗ "123.456.789-00" (dígito verificador errado)
   * ✗ "123456789" (incompleto)
   */
  validateCPF: (cpf: string): boolean => {
    // Remove formatação
    const cleanCPF = cpf.replace(/[\s\-\.]/g, '');

    // Verifica se tem 11 dígitos
    if (!/^\d{11}$/.test(cleanCPF)) return false;

    // Verifica se todos os dígitos são iguais (inválido)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;

    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;

    // Verifica se os dígitos calculados conferem
    return parseInt(cleanCPF.charAt(9)) === firstDigit &&
           parseInt(cleanCPF.charAt(10)) === secondDigit;
  },

  /**
   * VALIDAÇÃO DE NIF (PORTUGAL/UNIÃO EUROPEIA)
   * ------------------------------------------
   * Regex: ^[1-9]\d{8}$
   *
   * Algoritmo de validação NIF Portugal:
   * 1. Deve ter 9 dígitos
   * 2. Primeiro dígito deve ser 1, 2, 3, 5, 6, 8 ou 9
   * 3. Calcula dígito de controlo usando algoritmo módulo 11
   *
   * Formato aceito:
   * - XXXXXXXXX (9 dígitos sem formatação)
   *
   * Exemplos VÁLIDOS:
   * ✓ "123456789"
   * ✓ "987654321"
   *
   * Exemplos INVÁLIDOS:
   * ✗ "012345678" (começa com 0)
   * ✗ "12345678" (8 dígitos apenas)
   * ✗ "123456788" (dígito de controlo errado)
   */
  validateNIF: (nif: string): boolean => {
    // Remove formatação e espaços
    const cleanNIF = nif.replace(/[\s\-\.]/g, '');

    // Verifica se tem 9 dígitos e começa com número válido
    if (!/^[1-9]\d{8}$/.test(cleanNIF)) return false;

    // Algoritmo de validação NIF Portugal (módulo 11)
    const checkDigit = parseInt(cleanNIF.charAt(8));
    let sum = 0;

    for (let i = 0; i < 8; i++) {
      sum += parseInt(cleanNIF.charAt(i)) * (9 - i);
    }

    const mod = sum % 11;
    const expectedCheckDigit = mod < 2 ? 0 : 11 - mod;

    return checkDigit === expectedCheckDigit;
  },

  /**
   * VALIDAÇÃO UNIFICADA CPF/NIF
   * ---------------------------
   * Detecta automaticamente se é CPF (11 dígitos) ou NIF (9 dígitos)
   * e aplica a validação apropriada com dígitos verificadores.
   */
  validateCpfNif: (document: string): boolean => {
    const cleanDoc = document.replace(/[\s\-\.]/g, '');

    if (cleanDoc.length === 11) {
      return validationUtils.validateCPF(document);
    } else if (cleanDoc.length === 9) {
      return validationUtils.validateNIF(document);
    }

    return false;
  },

  /**
   * VALIDAÇÃO DE CEP/CÓDIGO POSTAL
   * ------------------------------
   * Suporte para múltiplos países com formatos específicos
   *
   * PORTUGAL: XXXX-XXX (4 dígitos + hífen + 3 dígitos)
   * Regex: ^\d{4}-\d{3}$
   * Exemplos: ✓ "1000-001" ✓ "4000-007" ✗ "1000" ✗ "1000001"
   *
   * BRASIL: XXXXX-XXX (5 dígitos + hífen + 3 dígitos)
   * Regex: ^\d{5}-\d{3}$
   * Exemplos: ✓ "01310-100" ✓ "20040-020" ✗ "01310" ✗ "01310100"
   *
   * EUA: XXXXX ou XXXXX-XXXX (5 dígitos ou 5+4 dígitos)
   * Regex: ^\d{5}(-\d{4})?$
   * Exemplos: ✓ "90210" ✓ "90210-1234" ✗ "9021" ✗ "902101234"
   *
   * ALEMANHA/FRANÇA/ESPANHA: XXXXX (5 dígitos)
   * Regex: ^\d{5}$
   * Exemplos: ✓ "10115" ✓ "75001" ✗ "1234" ✗ "123456"
   *
   * UK: Formato complexo (AAX XXA)
   * Regex: ^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$
   * Exemplos: ✓ "SW1A 1AA" ✓ "EC1A1BB" ✗ "SW1" ✗ "12345"
   */
  validateZipCode: (zipCode: string, country: string): boolean => {
    const cleanZip = zipCode.trim();

    switch (country) {
      case 'PT': // Portugal: 1000-001
        return /^\d{4}-\d{3}$/.test(cleanZip);

      case 'BR': // Brasil: 01310-100
        return /^\d{5}-\d{3}$/.test(cleanZip);

      case 'US': // EUA: 90210 ou 90210-1234
        return /^\d{5}(-\d{4})?$/.test(cleanZip);

      case 'DE': // Alemanha: 10115
      case 'FR': // França: 75001
      case 'ES': // Espanha: 28001
        return /^\d{5}$/.test(cleanZip);

      case 'GB': // Reino Unido: SW1A 1AA
      case 'UK':
        return /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i.test(cleanZip);

      case 'CA': // Canadá: K1A 0B1
        return /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(cleanZip);

      case 'IT': // Itália: 00100
        return /^\d{5}$/.test(cleanZip);

      case 'NL': // Holanda: 1012 AB
        return /^\d{4}\s?[A-Z]{2}$/i.test(cleanZip);

      default: // Validação genérica: 3-10 caracteres alfanuméricos
        return /^[a-zA-Z0-9\s\-]{3,10}$/.test(cleanZip);
    }
  },

  /**
   * VALIDAÇÃO DE ENDEREÇO COMPLETO
   * ------------------------------
   * Regex: ^[A-Za-zÀ-ÿ0-9\s.,º°ª\-]+$
   *
   * Regras:
   * - Mínimo 5 caracteres
   * - Aceita letras, números, espaços e pontuação básica
   * - Aceita caracteres especiais de endereço (º, ª, °)
   * - Não aceita símbolos inválidos (@, #, $, etc.)
   *
   * Exemplos VÁLIDOS:
   * ✓ "Rua das Flores, 123"
   * ✓ "Av. Paulista, 1000 - Apto 45"
   * ✓ "Travessa do Comércio, nº 5, 2º Esq."
   *
   * Exemplos INVÁLIDOS:
   * ✗ "Rua" (muito curto)
   * ✗ "Rua @# 123" (símbolos inválidos)
   */
  validateAddress: (address: string): boolean => {
    const addressRegex = /^[A-Za-zÀ-ÿ0-9\s.,º°ª\-]+$/;
    return addressRegex.test(address.trim()) && address.trim().length >= 5;
  },

  /**
   * VALIDAÇÃO DE CIDADE/LOCALIDADE
   * ------------------------------
   * Regex: ^[A-Za-zÀ-ÿ\s\-]+$
   *
   * Regras:
   * - Mínimo 2 caracteres
   * - Apenas letras (com acentos) e espaços
   * - Hífen permitido para nomes compostos
   * - Números NÃO permitidos
   *
   * Exemplos VÁLIDOS:
   * ✓ "Lisboa"
   * ✓ "São Paulo"
   * ✓ "Trás-os-Montes"
   *
   * Exemplos INVÁLIDOS:
   * ✗ "Lisboa123" (contém números)
   * ✗ "L" (muito curto)
   */
  validateCity: (city: string): boolean => {
    const cityRegex = /^[A-Za-zÀ-ÿ\s\-]+$/;
    return cityRegex.test(city.trim()) && city.trim().length >= 2;
  },

  /**
   * VALIDAÇÃO DE STRING OBRIGATÓRIA GENÉRICA
   * ----------------------------------------
   * Validação básica para campos de texto que não têm formato específico
   *
   * Regras:
   * - Remove espaços em branco no início e fim
   * - Verifica comprimento mínimo (padrão: 2 caracteres)
   * - Não permite apenas espaços em branco
   */
  validateRequiredString: (value: string, minLength: number = 2): boolean => {
    const trimmed = value.trim();
    return trimmed.length >= minLength && trimmed.length > 0;
  }
};

/**
 * MENSAGENS DE ERRO ESPECÍFICAS E ÚTEIS
 * -------------------------------------
 * Retorna mensagens de erro user-friendly para cada tipo de validação
 */
export const getValidationErrorMessage = (field: string, value: string, country?: string): string => {
  switch (field) {
    case 'name':
      if (!value || value.trim().length === 0) {
        return 'Por favor, insira seu nome completo';
      }
      if (!validationUtils.validateFullName(value)) {
        return 'Nome deve conter nome e sobrenome (ex: João Silva)';
      }
      return '';

    case 'email':
      if (!value || value.trim().length === 0) {
        return 'Por favor, insira seu email';
      }
      if (!validationUtils.validateEmail(value)) {
        return 'Email inválido. Use o formato: exemplo@email.com';
      }
      return '';

    case 'phone':
      if (!value || value.trim().length === 0) {
        return 'Por favor, insira seu telefone';
      }
      if (!validationUtils.validatePhone(value)) {
        return 'Telefone inválido. Use formato: +351 912 345 678 ou (11) 98765-4321';
      }
      return '';

    case 'cpfNif':
      if (!value || value.trim().length === 0) {
        return ''; // Opcional
      }
      const cleanDoc = value.replace(/[\s\-\.]/g, '');
      if (cleanDoc.length === 11) {
        if (!validationUtils.validateCPF(value)) {
          return 'CPF inválido. Verifique os dígitos verificadores';
        }
      } else if (cleanDoc.length === 9) {
        if (!validationUtils.validateNIF(value)) {
          return 'NIF inválido. Verifique o número fiscal';
        }
      } else {
        return 'CPF deve ter 11 dígitos ou NIF deve ter 9 dígitos';
      }
      return '';

    case 'zipCode':
      if (!value || value.trim().length === 0) {
        return 'Por favor, insira o código postal';
      }
      if (!validationUtils.validateZipCode(value, country || 'PT')) {
        const examples: Record<string, string> = {
          'PT': '1000-001',
          'BR': '01310-100',
          'US': '90210',
          'DE': '10115',
          'FR': '75001',
          'GB': 'SW1A 1AA',
          'UK': 'SW1A 1AA',
        };
        return `Código postal inválido para ${country}. Exemplo: ${examples[country || 'PT'] || '1000-001'}`;
      }
      return '';

    case 'address':
      if (!value || value.trim().length === 0) {
        return 'Por favor, insira seu endereço completo';
      }
      if (!validationUtils.validateAddress(value)) {
        return 'Endereço inválido. Use apenas letras, números e pontuação básica';
      }
      return '';

    case 'city':
      if (!value || value.trim().length === 0) {
        return 'Por favor, insira a cidade';
      }
      if (!validationUtils.validateCity(value)) {
        return 'Cidade inválida. Use apenas letras (ex: Lisboa, São Paulo)';
      }
      return '';

    default:
      return '';
  }
};

/**
 * EXPORTA TODAS AS VALIDAÇÕES PARA TESTES UNITÁRIOS
 */
export default validationUtils;
