/**
 * Exemplos de Uso do Sistema de Cores Profissional para Mega Hair
 * Demonstra como utilizar todas as funcionalidades do sistema
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

/**
 * Exemplo 1: Buscar cores por filtros
 */
export function exemplosBuscaAvancada() {
  console.log('=== EXEMPLOS DE BUSCA AVANÇADA ===\n');

  // Buscar apenas loiros disponíveis
  const loiros = searchHairColors({
    category: 'blonde',
    isAvailable: true
  });
  console.log(`Loiros disponíveis: ${loiros.colors.length} cores`);
  loiros.colors.forEach(color => {
    console.log(`- ${color.code}: ${color.commercialName} (${color.difficulty})`);
  });

  console.log('\n');

  // Buscar cores para iniciantes
  const coresBasicas = searchHairColors({
    difficulty: 'basic',
    priceRange: [1.0, 1.5]
  });
  console.log(`Cores básicas (até 1.5x preço): ${coresBasicas.colors.length} cores`);

  console.log('\n');

  // Buscar cores quentes de nível médio
  const coresQuentes = searchHairColors({
    undertone: 'warm',
    levelRange: [5, 8]
  });
  console.log(`Cores quentes níveis 5-8: ${coresQuentes.colors.length} cores`);
}

/**
 * Exemplo 2: Sistema de harmonização
 */
export function exemplosHarmonizacao() {
  console.log('=== EXEMPLOS DE HARMONIZAÇÃO ===\n');

  // Harmonizar com loiro mel (#16)
  const harmonizacao = generateColorHarmonization('#16');
  if (harmonizacao) {
    console.log(`Harmonizações para ${getColorByCode('#16')?.commercialName}:`);
    harmonizacao.recommendedCombinations.forEach(combo => {
      console.log(`- ${combo.type}: ${combo.description}`);
      console.log(`  Cores: ${combo.colors.join(', ')}`);
    });
  }

  console.log('\n');

  // Cores compatíveis
  const compativeis = getCompatibleColors('#24');
  console.log('Cores compatíveis com Loiro Dourado Natural (#24):');
  compativeis.forEach(color => {
    console.log(`- ${color.code}: ${color.commercialName}`);
  });
}

/**
 * Exemplo 3: Cálculo de custos e validações
 */
export function exemplosCustosValidacao() {
  console.log('=== EXEMPLOS DE CUSTOS E VALIDAÇÃO ===\n');

  // Calcular custo de transformação
  const custo = calculateColorTransformationCost('#2', '#613', 'long');
  console.log(`Transformação de Castanho Escuro para Ultra Claro Acinzentado (cabelo longo): R$ ${custo}`);

  console.log('\n');

  // Validar transformação
  const validacao = validateColorTransformation('#1', '#10');
  console.log('Validação: Preto Natural → Loiro Platinado');
  console.log(`Válida: ${validacao.isValid}`);
  console.log('Avisos:', validacao.warnings);
  console.log('Recomendações:', validacao.recommendations);

  console.log('\n');

  // Formulação para cor complexa
  const formulacao = generateColorFormulation('#27');
  if (formulacao) {
    console.log('Formulação para Ruivo Mel (#27):');
    console.log('Cores base:');
    formulacao.baseColors.forEach(base => {
      console.log(`- ${base.color}: ${base.percentage}%`);
    });
    console.log('Instruções:');
    formulacao.instructions.forEach(instrucao => {
      console.log(`- ${instrucao}`);
    });
    console.log(`Custo estimado: R$ ${formulacao.estimatedCost}`);
  }
}

/**
 * Exemplo 4: Análise de compatibilidade
 */
export function exemplosCompatibilidade() {
  console.log('=== EXEMPLOS DE COMPATIBILIDADE ===\n');

  // Analisar harmonização de múltiplas cores
  const relatorio = generateCompatibilityReport(['#16', '#24', '#27']);
  console.log('Relatório de compatibilidade (Mel Dourado + Loiro Dourado + Ruivo Mel):');
  console.log(`Score: ${relatorio.score}/100`);
  console.log(`Compatível: ${relatorio.compatible}`);
  console.log(`Análise: ${relatorio.analysis}`);
  if (relatorio.suggestions.length > 0) {
    console.log('Sugestões:');
    relatorio.suggestions.forEach(sugestao => {
      console.log(`- ${sugestao}`);
    });
  }

  console.log('\n');

  // Cores similares
  const similares = findSimilarColors('#6', 3);
  console.log('Cores similares ao Loiro Escuro (#6):');
  similares.forEach(color => {
    console.log(`- ${color.code}: ${color.commercialName} (${color.category})`);
  });
}

/**
 * Exemplo 5: Casos de uso práticos para e-commerce
 */
export function exemplosEcommerce() {
  console.log('=== EXEMPLOS PRÁTICOS E-COMMERCE ===\n');

  // Filtro "Cores para iniciantes"
  console.log('1. PRODUTOS PARA INICIANTES:');
  const iniciantes = searchHairColors(ColorFilterUtils.popularFilters.beginner);
  console.log(`${iniciantes.total} cores básicas encontradas`);

  // Mostrar 3 primeiras com preços
  iniciantes.colors.slice(0, 3).forEach(color => {
    const precoBase = 50; // Exemplo de preço base
    const precoFinal = Math.round(precoBase * color.priceMultiplier);
    console.log(`- ${color.commercialName}: R$ ${precoFinal} (${color.difficulty})`);
  });

  console.log('\n');

  // Filtro "Cores premium"
  console.log('2. LINHA PREMIUM:');
  const premium = searchHairColors(ColorFilterUtils.popularFilters.premium);
  console.log(`${premium.total} cores premium disponíveis`);

  premium.colors.slice(0, 3).forEach(color => {
    console.log(`- ${color.commercialName}: ${color.difficulty} (multiplicador ${color.priceMultiplier}x)`);
  });

  console.log('\n');

  // Recomendações baseadas em uma cor
  console.log('3. SISTEMA DE RECOMENDAÇÃO:');
  const corBase = '#8'; // Cliente interessado em Loiro Claro
  const recomendacoes = getCompatibleColors(corBase);
  console.log(`Cliente interessado em ${getColorByCode(corBase)?.commercialName}:`);
  console.log('Você também pode gostar de:');
  recomendacoes.slice(0, 3).forEach(color => {
    console.log(`- ${color.commercialName} (${color.category})`);
  });
}

/**
 * Exemplo 6: Relatório do sistema
 */
export function relatorioSistema() {
  console.log('=== RELATÓRIO DO SISTEMA ===\n');

  console.log(`Total de cores: ${HAIR_COLOR_SYSTEM_INFO.totalColors}`);
  console.log(`Versão: ${HAIR_COLOR_SYSTEM_INFO.version}`);
  console.log(`Padrão: ${HAIR_COLOR_SYSTEM_INFO.standard}`);
  console.log(`Última atualização: ${HAIR_COLOR_SYSTEM_INFO.lastUpdated.toLocaleDateString('pt-BR')}`);

  console.log('\nDistribuição por categoria:');
  Object.entries(HAIR_COLOR_SYSTEM_INFO.categories).forEach(([categoria, quantidade]) => {
    console.log(`- ${categoria}: ${quantidade} cores`);
  });

  console.log('\nFaixa de preços:');
  console.log(`- Mínimo: ${HAIR_COLOR_SYSTEM_INFO.priceRange.min}x`);
  console.log(`- Máximo: ${HAIR_COLOR_SYSTEM_INFO.priceRange.max}x`);

  console.log('\nNíveis de cor:');
  console.log(`- Mais escuro: Nível ${HAIR_COLOR_SYSTEM_INFO.levels.darkest}`);
  console.log(`- Mais claro: Nível ${HAIR_COLOR_SYSTEM_INFO.levels.lightest}`);

  console.log('\nCores mais populares por categoria:');

  // Natural
  const naturaisPopulares = searchHairColors({ category: 'natural', difficulty: 'basic' });
  console.log(`Naturais básicas: ${naturaisPopulares.colors.length} opções`);

  // Loiros
  const loirosPopulares = searchHairColors({ category: 'blonde', isAvailable: true });
  console.log(`Loiros disponíveis: ${loirosPopulares.colors.length} opções`);

  // Fashion
  const fashionPopulares = searchHairColors({ category: 'fashion', isPremium: true });
  console.log(`Fashion premium: ${fashionPopulares.colors.length} opções`);
}

/**
 * Executar todos os exemplos
 */
export function executarTodosExemplos() {
  exemplosBuscaAvancada();
  console.log('\n' + '='.repeat(50) + '\n');

  exemplosHarmonizacao();
  console.log('\n' + '='.repeat(50) + '\n');

  exemplosCustosValidacao();
  console.log('\n' + '='.repeat(50) + '\n');

  exemplosCompatibilidade();
  console.log('\n' + '='.repeat(50) + '\n');

  exemplosEcommerce();
  console.log('\n' + '='.repeat(50) + '\n');

  relatorioSistema();
}

// Para usar no console ou em testes:
// executarTodosExemplos();