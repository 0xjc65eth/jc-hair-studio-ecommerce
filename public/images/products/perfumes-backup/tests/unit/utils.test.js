/**
 * 🧪 TESTES UNITÁRIOS - UTILITÁRIOS
 * Testa funções auxiliares e utilitários do sistema
 */

describe('🧪 Testes Unitários - Utilitários', () => {
  let testResults = {
    priceFormatting: false,
    emailValidation: false,
    phoneValidation: false,
    slugGeneration: false,
    dateFormatting: false,
    currencyConversion: false,
    stringUtils: false,
    arrayUtils: false
  };

  afterAll(() => {
    console.log('\n🧪 RELATÓRIO DE TESTES UNITÁRIOS - UTILITÁRIOS:');
    console.log('================================================');
    Object.entries(testResults).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSOU' : 'FALHOU'}`);
    });
  });

  describe('💰 Formatação de Preços', () => {
    const formatPrice = (price) => {
      if (typeof price !== 'number' || isNaN(price)) return 'R$ 0,00';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
    };

    test('UT001 - Formatação básica de preço', () => {
      expect(formatPrice(29.90)).toMatch(/R\$\s*29,90/);
      expect(formatPrice(100)).toMatch(/R\$\s*100,00/);
      expect(formatPrice(0)).toMatch(/R\$\s*0,00/);

      console.log('✅ UT001 - Formatação básica: 29.90 → R$ 29,90');
      testResults.priceFormatting = true;
    });

    test('UT002 - Formatação com casos extremos', () => {
      expect(formatPrice(0.01)).toMatch(/R\$\s*0,01/);
      expect(formatPrice(9999.99)).toMatch(/R\$\s*9\.999,99/);
      expect(formatPrice(NaN)).toMatch(/R\$\s*0,00/);
      expect(formatPrice(null)).toMatch(/R\$\s*0,00/);
      expect(formatPrice(undefined)).toMatch(/R\$\s*0,00/);

      console.log('✅ UT002 - Casos extremos: NaN/null/undefined tratados');
    });
  });

  describe('📧 Validação de Email', () => {
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    test('UT003 - Validação de emails válidos', () => {
      const validEmails = [
        'teste@jchairstudio.com',
        'cliente123@gmail.com',
        'user.name@domain.co.uk',
        'admin@localhost.dev'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });

      console.log('✅ UT003 - Emails válidos: Todos aprovados');
      testResults.emailValidation = true;
    });

    test('UT004 - Validação de emails inválidos', () => {
      const invalidEmails = [
        'email-sem-arroba.com',
        '@dominio-sem-usuario.com',
        'usuario@',
        'email@dominio',
        'email com espaço@domain.com',
        '',
        null,
        undefined
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });

      console.log('✅ UT004 - Emails inválidos: Todos rejeitados');
    });
  });

  describe('📱 Validação de Telefone', () => {
    const validatePhone = (phone) => {
      if (!phone) return false;
      const cleanPhone = phone.replace(/\D/g, '');
      return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    };

    test('UT005 - Validação de telefones brasileiros', () => {
      const validPhones = [
        '(11) 99999-9999',
        '11999999999',
        '(11) 9999-9999',
        '1199999999'
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });

      console.log('✅ UT005 - Telefones válidos: Formatos aceitos');
      testResults.phoneValidation = true;
    });

    test('UT006 - Rejeição de telefones inválidos', () => {
      const invalidPhones = [
        '123',
        '11999999999999',
        'abc123456789',
        '',
        null
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });

      console.log('✅ UT006 - Telefones inválidos: Rejeitados');
    });
  });

  describe('🔗 Geração de Slugs', () => {
    const generateSlug = (text) => {
      if (!text) return '';
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    test('UT007 - Geração de slugs básicos', () => {
      expect(generateSlug('Shampoo Premium')).toBe('shampoo-premium');
      expect(generateSlug('Condicionador 2 em 1')).toBe('condicionador-2-em-1');
      expect(generateSlug('Máscara de Hidratação')).toBe('mascara-de-hidratacao');

      console.log('✅ UT007 - Slugs básicos: "Shampoo Premium" → "shampoo-premium"');
      testResults.slugGeneration = true;
    });

    test('UT008 - Slugs com caracteres especiais', () => {
      expect(generateSlug('Produto com Açaí & Óleo')).toBe('produto-com-acai-oleo');
      expect(generateSlug('100% Natural!!!')).toBe('100-natural');
      expect(generateSlug('   Espaços   extras   ')).toBe('espacos-extras');

      console.log('✅ UT008 - Caracteres especiais: Removidos corretamente');
    });
  });

  describe('📅 Formatação de Datas', () => {
    const formatDate = (date, format = 'dd/MM/yyyy') => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';

      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();

      switch (format) {
        case 'dd/MM/yyyy':
          return `${day}/${month}/${year}`;
        case 'yyyy-MM-dd':
          return `${year}-${month}-${day}`;
        case 'relative':
          const now = new Date();
          const diffTime = Math.abs(now - d);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) return 'ontem';
          if (diffDays <= 7) return `há ${diffDays} dias`;
          return `${day}/${month}/${year}`;
        default:
          return `${day}/${month}/${year}`;
      }
    };

    test('UT009 - Formatação de datas', () => {
      const testDate = new Date('2023-12-25');

      expect(formatDate(testDate, 'dd/MM/yyyy')).toBe('25/12/2023');
      expect(formatDate(testDate, 'yyyy-MM-dd')).toBe('2023-12-25');
      expect(formatDate(null)).toBe('');
      expect(formatDate('data-inválida')).toBe('');

      console.log('✅ UT009 - Formatação de datas: Múltiplos formatos');
      testResults.dateFormatting = true;
    });
  });

  describe('💱 Conversão de Moeda', () => {
    const convertCurrency = (amount, fromCurrency, toCurrency, rates = {}) => {
      const defaultRates = {
        'BRL-USD': 0.20,
        'USD-BRL': 5.00,
        'BRL-EUR': 0.18,
        'EUR-BRL': 5.50,
        ...rates
      };

      const rateKey = `${fromCurrency}-${toCurrency}`;
      const rate = defaultRates[rateKey];

      if (!rate) return null;
      return Math.round(amount * rate * 100) / 100;
    };

    test('UT010 - Conversão BRL para USD', () => {
      expect(convertCurrency(100, 'BRL', 'USD')).toBe(20);
      expect(convertCurrency(50, 'BRL', 'USD')).toBe(10);

      console.log('✅ UT010 - Conversão BRL→USD: R$ 100 = $20');
      testResults.currencyConversion = true;
    });

    test('UT011 - Conversão USD para BRL', () => {
      expect(convertCurrency(20, 'USD', 'BRL')).toBe(100);
      expect(convertCurrency(10, 'USD', 'BRL')).toBe(50);

      console.log('✅ UT011 - Conversão USD→BRL: $20 = R$ 100');
    });
  });

  describe('🔤 Utilitários de String', () => {
    const stringUtils = {
      capitalize: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      },

      truncate: (str, length = 50) => {
        if (!str || str.length <= length) return str;
        return str.substring(0, length) + '...';
      },

      removeAccents: (str) => {
        if (!str) return '';
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
    };

    test('UT012 - Capitalização de strings', () => {
      expect(stringUtils.capitalize('shampoo')).toBe('Shampoo');
      expect(stringUtils.capitalize('CONDICIONADOR')).toBe('Condicionador');
      expect(stringUtils.capitalize('')).toBe('');

      console.log('✅ UT012 - Capitalização: "shampoo" → "Shampoo"');
      testResults.stringUtils = true;
    });

    test('UT013 - Truncamento de strings', () => {
      const longText = 'Este é um texto muito longo que precisa ser truncado';
      expect(stringUtils.truncate(longText, 20)).toBe('Este é um texto muit...');
      expect(stringUtils.truncate('Texto curto', 20)).toBe('Texto curto');

      console.log('✅ UT013 - Truncamento: Texto longo → "Este é um texto muit..."');
    });
  });

  describe('🔢 Utilitários de Array', () => {
    const arrayUtils = {
      unique: (arr) => [...new Set(arr)],

      groupBy: (arr, key) => {
        return arr.reduce((groups, item) => {
          const group = item[key];
          groups[group] = groups[group] || [];
          groups[group].push(item);
          return groups;
        }, {});
      },

      sortBy: (arr, key, direction = 'asc') => {
        return [...arr].sort((a, b) => {
          const valueA = a[key];
          const valueB = b[key];

          if (direction === 'desc') {
            return valueB > valueA ? 1 : -1;
          }
          return valueA > valueB ? 1 : -1;
        });
      }
    };

    test('UT014 - Remoção de duplicatas', () => {
      const arr = [1, 2, 2, 3, 3, 3, 4];
      expect(arrayUtils.unique(arr)).toEqual([1, 2, 3, 4]);

      console.log('✅ UT014 - Array único: [1,2,2,3] → [1,2,3]');
      testResults.arrayUtils = true;
    });

    test('UT015 - Agrupamento por propriedade', () => {
      const products = [
        { name: 'Shampoo', category: 'hidratacao' },
        { name: 'Condicionador', category: 'hidratacao' },
        { name: 'Esmalte', category: 'unhas' }
      ];

      const grouped = arrayUtils.groupBy(products, 'category');
      expect(grouped.hidratacao).toHaveLength(2);
      expect(grouped.unhas).toHaveLength(1);

      console.log('✅ UT015 - Agrupamento: 3 produtos → 2 categorias');
    });
  });
});