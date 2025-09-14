/**
 * Testes do Sistema Profissional de Cores para Mega Hair
 */

import {
  searchHairColors,
  getColorByCode,
  getCompatibleColors,
  generateColorHarmonization,
  calculateColorTransformationCost,
  generateColorFormulation,
  validateColorTransformation,
  findSimilarColors,
  generateCompatibilityReport,
  ColorFilterUtils
} from '@/lib/utils/hairColorUtils';

import { PROFESSIONAL_HAIR_COLORS, HAIR_COLOR_SYSTEM_INFO } from '@/lib/data/hairColors';

describe('Sistema de Cores - Testes Básicos', () => {
  test('deve ter cores cadastradas', () => {
    expect(PROFESSIONAL_HAIR_COLORS).toHaveLength(HAIR_COLOR_SYSTEM_INFO.totalColors);
    expect(PROFESSIONAL_HAIR_COLORS.length).toBeGreaterThan(0);
  });

  test('deve ter cores com estrutura correta', () => {
    const cor = PROFESSIONAL_HAIR_COLORS[0];
    expect(cor).toHaveProperty('code');
    expect(cor).toHaveProperty('commercialName');
    expect(cor).toHaveProperty('technicalName');
    expect(cor).toHaveProperty('category');
    expect(cor).toHaveProperty('undertone');
    expect(cor).toHaveProperty('level');
    expect(cor).toHaveProperty('difficulty');
    expect(cor).toHaveProperty('hexColor');
    expect(cor).toHaveProperty('priceMultiplier');
    expect(cor).toHaveProperty('compatibility');
  });

  test('deve ter códigos únicos', () => {
    const codigos = PROFESSIONAL_HAIR_COLORS.map(c => c.code);
    const codigosUnicos = new Set(codigos);
    expect(codigos).toHaveLength(codigosUnicos.size);
  });

  test('deve ter níveis válidos (1-10)', () => {
    PROFESSIONAL_HAIR_COLORS.forEach(cor => {
      expect(cor.level).toBeGreaterThanOrEqual(1);
      expect(cor.level).toBeLessThanOrEqual(10);
    });
  });

  test('deve ter multiplicadores de preço válidos', () => {
    PROFESSIONAL_HAIR_COLORS.forEach(cor => {
      expect(cor.priceMultiplier).toBeGreaterThan(0);
      expect(cor.priceMultiplier).toBeLessThanOrEqual(3); // Máximo razoável
    });
  });
});

describe('Busca de Cores', () => {
  test('deve buscar por código', () => {
    const cor = getColorByCode('#1');
    expect(cor).toBeDefined();
    expect(cor?.code).toBe('#1');
    expect(cor?.commercialName).toBe('Preto Natural');
  });

  test('deve retornar undefined para código inexistente', () => {
    const cor = getColorByCode('#999');
    expect(cor).toBeUndefined();
  });

  test('deve buscar por categoria', () => {
    const resultado = searchHairColors({ category: 'natural' });
    expect(resultado.colors.length).toBeGreaterThan(0);
    resultado.colors.forEach(cor => {
      expect(cor.category).toBe('natural');
    });
  });

  test('deve buscar por múltiplas categorias', () => {
    const resultado = searchHairColors({ category: ['natural', 'blonde'] });
    expect(resultado.colors.length).toBeGreaterThan(0);
    resultado.colors.forEach(cor => {
      expect(['natural', 'blonde']).toContain(cor.category);
    });
  });

  test('deve buscar por faixa de nível', () => {
    const resultado = searchHairColors({ levelRange: [5, 8] });
    expect(resultado.colors.length).toBeGreaterThan(0);
    resultado.colors.forEach(cor => {
      expect(cor.level).toBeGreaterThanOrEqual(5);
      expect(cor.level).toBeLessThanOrEqual(8);
    });
  });

  test('deve buscar por undertone', () => {
    const resultado = searchHairColors({ undertone: 'warm' });
    expect(resultado.colors.length).toBeGreaterThan(0);
    resultado.colors.forEach(cor => {
      expect(cor.undertone).toBe('warm');
    });
  });

  test('deve buscar por dificuldade', () => {
    const resultado = searchHairColors({ difficulty: 'basic' });
    expect(resultado.colors.length).toBeGreaterThan(0);
    resultado.colors.forEach(cor => {
      expect(cor.difficulty).toBe('basic');
    });
  });

  test('deve buscar cores premium', () => {
    const resultado = searchHairColors({ isPremium: true });
    expect(resultado.colors.length).toBeGreaterThan(0);
    resultado.colors.forEach(cor => {
      expect(cor.isPremium).toBe(true);
    });
  });

  test('deve retornar estatísticas dos filtros', () => {
    const resultado = searchHairColors({ category: 'blonde' });
    expect(resultado.filters).toBeDefined();
    expect(resultado.filters.categories).toBeDefined();
    expect(resultado.filters.undertones).toBeDefined();
    expect(resultado.filters.difficulties).toBeDefined();
    expect(resultado.filters.levels).toBeDefined();
  });
});

describe('Sistema de Compatibilidade', () => {
  test('deve retornar cores compatíveis', () => {
    const compativeis = getCompatibleColors('#6');
    expect(compativeis.length).toBeGreaterThan(0);
    compativeis.forEach(cor => {
      expect(cor).toHaveProperty('code');
    });
  });

  test('deve gerar harmonização', () => {
    const harmonizacao = generateColorHarmonization('#16');
    expect(harmonizacao).toBeDefined();
    expect(harmonizacao?.baseColor).toBe('#16');
    expect(harmonizacao?.recommendedCombinations.length).toBeGreaterThan(0);
  });

  test('deve encontrar cores similares', () => {
    const similares = findSimilarColors('#6', 3);
    expect(similares).toHaveLength(3);
    similares.forEach(cor => {
      expect(cor.code).not.toBe('#6'); // Não deve incluir a cor base
    });
  });

  test('deve gerar relatório de compatibilidade', () => {
    const relatorio = generateCompatibilityReport(['#16', '#24']);
    expect(relatorio).toBeDefined();
    expect(relatorio.score).toBeGreaterThanOrEqual(0);
    expect(relatorio.score).toBeLessThanOrEqual(100);
    expect(relatorio).toHaveProperty('compatible');
    expect(relatorio).toHaveProperty('analysis');
    expect(relatorio).toHaveProperty('suggestions');
  });

  test('deve detectar incompatibilidade', () => {
    // Cores que sabemos serem incompatíveis
    const relatorio = generateCompatibilityReport(['#1', '#613']);
    expect(relatorio.score).toBeLessThan(50); // Score baixo
  });
});

describe('Cálculos de Transformação', () => {
  test('deve calcular custo de transformação', () => {
    const custo = calculateColorTransformationCost('#2', '#8', 'medium');
    expect(custo).toBeGreaterThan(0);
    expect(typeof custo).toBe('number');
  });

  test('deve calcular custos diferentes para comprimentos diferentes', () => {
    const custoMedio = calculateColorTransformationCost('#2', '#8', 'medium');
    const custoLongo = calculateColorTransformationCost('#2', '#8', 'long');
    expect(custoLongo).toBeGreaterThan(custoMedio);
  });

  test('deve validar transformações', () => {
    const validacao = validateColorTransformation('#1', '#10');
    expect(validacao).toHaveProperty('isValid');
    expect(validacao).toHaveProperty('warnings');
    expect(validacao).toHaveProperty('recommendations');
    expect(Array.isArray(validacao.warnings)).toBe(true);
    expect(Array.isArray(validacao.recommendations)).toBe(true);
  });

  test('deve gerar formulação', () => {
    const formulacao = generateColorFormulation('#1');
    expect(formulacao).toBeDefined();
    expect(formulacao?.targetColor).toBe('#1');
    expect(formulacao?.baseColors.length).toBeGreaterThan(0);
    expect(formulacao?.instructions.length).toBeGreaterThan(0);
    expect(formulacao?.estimatedCost).toBeGreaterThan(0);
  });

  test('deve somar 100% nas cores base da formulação', () => {
    const formulacao = generateColorFormulation('#16');
    if (formulacao) {
      const totalPercentage = formulacao.baseColors.reduce(
        (sum, base) => sum + base.percentage,
        0
      );
      expect(totalPercentage).toBe(100);
    }
  });
});

describe('Filtros Predefinidos', () => {
  test('deve ter filtros populares definidos', () => {
    expect(ColorFilterUtils.popularFilters).toBeDefined();
    expect(ColorFilterUtils.popularFilters.natural).toBeDefined();
    expect(ColorFilterUtils.popularFilters.blonde).toBeDefined();
    expect(ColorFilterUtils.popularFilters.premium).toBeDefined();
    expect(ColorFilterUtils.popularFilters.beginner).toBeDefined();
  });

  test('deve ter opções para selects', () => {
    expect(ColorFilterUtils.categoryOptions.length).toBeGreaterThan(0);
    expect(ColorFilterUtils.undertoneOptions.length).toBeGreaterThan(0);
    expect(ColorFilterUtils.difficultyOptions.length).toBeGreaterThan(0);
    expect(ColorFilterUtils.levelOptions.length).toBe(10);
  });

  test('filtros populares devem retornar resultados', () => {
    Object.entries(ColorFilterUtils.popularFilters).forEach(([nome, filtro]) => {
      const resultado = searchHairColors(filtro);
      expect(resultado.colors.length).toBeGreaterThan(0);
    });
  });
});

describe('Validações de Dados', () => {
  test('todas as cores devem ter compatibilidades válidas', () => {
    PROFESSIONAL_HAIR_COLORS.forEach(cor => {
      expect(Array.isArray(cor.compatibility.harmonious)).toBe(true);
      expect(Array.isArray(cor.compatibility.gradient)).toBe(true);
      expect(Array.isArray(cor.compatibility.highlights)).toBe(true);
      expect(Array.isArray(cor.compatibility.avoid)).toBe(true);
    });
  });

  test('códigos de compatibilidade devem existir', () => {
    PROFESSIONAL_HAIR_COLORS.forEach(cor => {
      const todosOsCodigos = [
        ...cor.compatibility.harmonious,
        ...cor.compatibility.gradient,
        ...cor.compatibility.highlights,
        ...cor.compatibility.avoid
      ];

      todosOsCodigos.forEach(codigo => {
        expect(getColorByCode(codigo)).toBeDefined();
      });
    });
  });

  test('deve ter cores de diferentes categorias', () => {
    const categorias = [...new Set(PROFESSIONAL_HAIR_COLORS.map(c => c.category))];
    expect(categorias).toContain('natural');
    expect(categorias).toContain('blonde');
    expect(categorias).toContain('fashion');
  });

  test('deve ter cores de diferentes undertones', () => {
    const undertones = [...new Set(PROFESSIONAL_HAIR_COLORS.map(c => c.undertone))];
    expect(undertones).toContain('cool');
    expect(undertones).toContain('warm');
    expect(undertones).toContain('neutral');
  });

  test('deve ter cores de diferentes dificuldades', () => {
    const dificuldades = [...new Set(PROFESSIONAL_HAIR_COLORS.map(c => c.difficulty))];
    expect(dificuldades).toContain('basic');
    expect(dificuldades).toContain('intermediate');
    expect(dificuldades).toContain('advanced');
    expect(dificuldades).toContain('premium');
  });

  test('cores hex devem ter formato válido', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    PROFESSIONAL_HAIR_COLORS.forEach(cor => {
      expect(hexRegex.test(cor.hexColor)).toBe(true);
    });
  });
});

describe('Performance e Edge Cases', () => {
  test('busca sem filtros deve retornar todas as cores', () => {
    const resultado = searchHairColors();
    expect(resultado.colors).toHaveLength(PROFESSIONAL_HAIR_COLORS.length);
  });

  test('deve lidar com códigos inválidos graciosamente', () => {
    expect(() => getColorByCode('')).not.toThrow();
    expect(() => getColorByCode(null as any)).not.toThrow();
    expect(() => getColorByCode(undefined as any)).not.toThrow();
  });

  test('deve lidar com arrays vazios na compatibilidade', () => {
    expect(() => generateCompatibilityReport([])).not.toThrow();
    const relatorio = generateCompatibilityReport([]);
    expect(relatorio.compatible).toBe(false);
    expect(relatorio.score).toBe(0);
  });

  test('deve lidar com códigos inexistentes na compatibilidade', () => {
    const relatorio = generateCompatibilityReport(['#999', '#888']);
    expect(relatorio.compatible).toBe(false);
    expect(relatorio.suggestions.length).toBeGreaterThan(0);
  });

  test('busca por faixa de preço inválida deve retornar array vazio', () => {
    const resultado = searchHairColors({ priceRange: [10, 5] }); // Min > Max
    expect(resultado.colors).toHaveLength(0);
  });
});

describe('Informações do Sistema', () => {
  test('deve ter metadados corretos', () => {
    expect(HAIR_COLOR_SYSTEM_INFO.totalColors).toBe(PROFESSIONAL_HAIR_COLORS.length);
    expect(HAIR_COLOR_SYSTEM_INFO.version).toBeDefined();
    expect(HAIR_COLOR_SYSTEM_INFO.lastUpdated).toBeInstanceOf(Date);
  });

  test('contadores por categoria devem estar corretos', () => {
    const naturalCount = PROFESSIONAL_HAIR_COLORS.filter(c => c.category === 'natural').length;
    const blondeCount = PROFESSIONAL_HAIR_COLORS.filter(c => c.category === 'blonde').length;
    const fashionCount = PROFESSIONAL_HAIR_COLORS.filter(c => c.category === 'fashion').length;

    expect(HAIR_COLOR_SYSTEM_INFO.categories.natural).toBe(naturalCount);
    expect(HAIR_COLOR_SYSTEM_INFO.categories.blonde).toBe(blondeCount);
    expect(HAIR_COLOR_SYSTEM_INFO.categories.fashion).toBe(fashionCount);
  });

  test('faixa de preços deve estar correta', () => {
    const multiplicadores = PROFESSIONAL_HAIR_COLORS.map(c => c.priceMultiplier);
    const minReal = Math.min(...multiplicadores);
    const maxReal = Math.max(...multiplicadores);

    expect(HAIR_COLOR_SYSTEM_INFO.priceRange.min).toBe(minReal);
    expect(HAIR_COLOR_SYSTEM_INFO.priceRange.max).toBe(maxReal);
  });
});