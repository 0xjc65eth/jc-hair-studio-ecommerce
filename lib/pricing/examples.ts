/**
 * Exemplos de uso do Sistema de Pricing Inteligente para Mega Hair
 *
 * Este arquivo demonstra como usar o sistema de pricing e valida
 * os resultados com base na pesquisa de mercado realizada.
 */

import {
  calculateMegaHairPrice,
  getMarketBasedPrice,
  analyzePriceCompetitiveness,
  TechnicalComplexity,
  HairQuality,
  HairOrigin,
  quickPriceCalculation,
  completeProductAnalysis,
  formatPricingResult,
  calculateVolumeDiscount,
  getComplexityByColor,
  getQualityByDescription,
  getOriginByCountry,
  generatePriceAnalysisReport,
  MARKET_COMPETITORS,
  getMarketAverage
} from './index';

/**
 * Exemplo 1: Produto Básico - Cabelo Brasileiro Natural
 */
export const exemploBasico = () => {
  console.log('=== EXEMPLO 1: Produto Básico ===');

  const resultado = calculateMegaHairPrice({
    basePrice: 380, // baseado na pesquisa de mercado
    weight: 100,
    length: 50,
    complexity: TechnicalComplexity.BASIC,
    quality: HairQuality.STANDARD,
    origin: HairOrigin.BRASILEIRO
  });

  const formatado = formatPricingResult(resultado);

  console.log('Parâmetros:');
  console.log('- Peso: 100g');
  console.log('- Comprimento: 50cm');
  console.log('- Complexidade: Básica (cores naturais)');
  console.log('- Qualidade: Standard');
  console.log('- Origem: Brasileiro');
  console.log('');
  console.log('Resultado:');
  console.log(`- Preço Final: ${formatado.formattedPrice}`);
  console.log(`- Preço de Custo: ${formatado.formattedCost}`);
  console.log(`- Margem: ${formatado.formattedMargin}`);
  console.log(`- Parcelamento: ${formatado.installments}`);
  console.log('');

  return resultado;
};

/**
 * Exemplo 2: Produto Premium - Cabelo Virgem Europeu com Fashion Colors
 */
export const exemploPremium = () => {
  console.log('=== EXEMPLO 2: Produto Premium ===');

  const resultado = calculateMegaHairPrice({
    basePrice: 950, // preço premium baseado em pesquisa
    weight: 150,
    length: 70,
    complexity: TechnicalComplexity.PREMIUM, // coleção especial
    quality: HairQuality.VIRGIN_AAA,
    origin: HairOrigin.EUROPEU
  });

  const formatado = formatPricingResult(resultado);

  console.log('Parâmetros:');
  console.log('- Peso: 150g');
  console.log('- Comprimento: 70cm');
  console.log('- Complexidade: Premium (coleção especial)');
  console.log('- Qualidade: Virgem AAA+');
  console.log('- Origem: Europeu');
  console.log('');
  console.log('Resultado:');
  console.log(`- Preço Final: ${formatado.formattedPrice}`);
  console.log(`- Preço de Custo: ${formatado.formattedCost}`);
  console.log(`- Margem: ${formatado.formattedMargin}`);
  console.log(`- Parcelamento: ${formatado.installments}`);
  console.log('');

  return resultado;
};

/**
 * Exemplo 3: Análise de Competitividade
 */
export const exemploAnaliseCompetitividade = () => {
  console.log('=== EXEMPLO 3: Análise de Competitividade ===');

  const peso = 100;
  const comprimento = 60;
  const precoTeste = 650;

  const analise = analyzePriceCompetitiveness(precoTeste, peso, comprimento);

  console.log(`Analisando preço de R$ ${precoTeste} para produto ${peso}g x ${comprimento}cm:`);
  console.log(`- Posição no mercado: ${analise.position}`);
  console.log(`- Média do mercado: R$ ${analise.marketAverage.toFixed(2)}`);
  console.log(`- Diferença: ${analise.difference > 0 ? '+' : ''}${analise.difference}%`);
  console.log(`- Recomendação: ${analise.recommendation}`);
  console.log('');

  return analise;
};

/**
 * Exemplo 4: Cálculo Automático por Características
 */
export const exemploCalculoAutomatico = () => {
  console.log('=== EXEMPLO 4: Cálculo Automático ===');

  // Simula entrada do usuário
  const peso = 200;
  const comprimento = 70;
  const cor = 'OMBRE'; // cor especial
  const qualidade = 'cabelo virgem brasileiro premium';
  const origem = 'brasileiro';

  const resultado = quickPriceCalculation(peso, comprimento, cor, qualidade, origem);
  const formatado = formatPricingResult(resultado);

  console.log('Entrada do usuário:');
  console.log(`- Peso: ${peso}g`);
  console.log(`- Comprimento: ${comprimento}cm`);
  console.log(`- Cor: ${cor}`);
  console.log(`- Qualidade: ${qualidade}`);
  console.log(`- Origem: ${origem}`);
  console.log('');

  console.log('Sistema identificou:');
  console.log(`- Complexidade: ${getComplexityByColor(cor)}`);
  console.log(`- Qualidade: ${getQualityByDescription(qualidade)}`);
  console.log(`- Origem: ${getOriginByCountry(origem)}`);
  console.log('');

  console.log('Resultado:');
  console.log(`- Preço Final: ${formatado.formattedPrice}`);
  console.log(`- Margem: ${formatado.formattedMargin}`);
  console.log('');

  return resultado;
};

/**
 * Exemplo 5: Desconto por Volume
 */
export const exemploDescontoVolume = () => {
  console.log('=== EXEMPLO 5: Desconto por Volume ===');

  const precoUnitario = 480;
  const quantidades = [1, 2, 3, 5, 10];

  quantidades.forEach(qty => {
    const desconto = calculateVolumeDiscount(qty, precoUnitario);
    console.log(`${qty} unidade(s):`);
    console.log(`- Desconto: ${(desconto.discount * 100).toFixed(0)}%`);
    console.log(`- Preço unitário: R$ ${desconto.finalPrice}`);
    console.log(`- Total: R$ ${(desconto.finalPrice * qty).toFixed(2)}`);
    console.log(`- Economia: R$ ${desconto.totalSavings.toFixed(2)}`);
    console.log('');
  });
};

/**
 * Exemplo 6: Análise Completa de Produto
 */
export const exemploAnaliseCompleta = () => {
  console.log('=== EXEMPLO 6: Análise Completa de Produto ===');

  const peso = 150;
  const comprimento = 60;

  const analise = completeProductAnalysis(peso, comprimento);

  console.log(`Análise completa para produto ${peso}g x ${comprimento}cm:`);
  console.log('');

  console.log('ANÁLISE DE MERCADO:');
  console.log(`- Preço médio do mercado: R$ ${analise.marketAnalysis.average.toFixed(2)}`);
  console.log(`- Posição competitiva: ${analise.marketAnalysis.competitiveness.position}`);
  console.log('');

  console.log('CENÁRIOS DE PRICING:');
  console.log(`- Básico: R$ ${analise.pricingScenarios.basic.finalPrice.toFixed(2)} (margem: ${analise.pricingScenarios.basic.margin.toFixed(1)}%)`);
  console.log(`- Premium: R$ ${analise.pricingScenarios.premium.finalPrice.toFixed(2)} (margem: ${analise.pricingScenarios.premium.margin.toFixed(1)}%)`);
  console.log(`- Luxury: R$ ${analise.pricingScenarios.luxury.finalPrice.toFixed(2)} (margem: ${analise.pricingScenarios.luxury.margin.toFixed(1)}%)`);
  console.log('');

  console.log('PRODUTOS SUGERIDOS:');
  analise.recommendations.suggestedProducts.forEach(produto => {
    console.log(`- ${produto.type} (${produto.weight}g): ${produto.description}`);
    console.log(`  Motivo: ${produto.reason}`);
  });
  console.log('');

  return analise;
};

/**
 * Validação dos Dados de Mercado
 */
export const validarDadosMercado = () => {
  console.log('=== VALIDAÇÃO DOS DADOS DE MERCADO ===');

  // Valida contra dados reais coletados na pesquisa
  const validacoes = [
    {
      nome: 'DonaChique 37.5g x 51cm',
      esperado: 141,
      calculado: getMarketAverage(37.5, 51),
      tolerancia: 0.15 // 15%
    },
    {
      nome: 'DonaChique 37.5g x 61cm',
      esperado: 176.5,
      calculado: getMarketAverage(37.5, 61),
      tolerancia: 0.15
    },
    {
      nome: 'Dana Mega Hair 200g x 70cm',
      esperado: 2235.25,
      calculado: getMarketAverage(200, 70),
      tolerancia: 0.20 // 20% para produtos premium
    }
  ];

  let validacoesPassaram = 0;

  validacoes.forEach(validacao => {
    const diferenca = Math.abs(validacao.calculado - validacao.esperado) / validacao.esperado;
    const passou = diferenca <= validacao.tolerancia;

    console.log(`${validacao.nome}:`);
    console.log(`- Esperado: R$ ${validacao.esperado}`);
    console.log(`- Calculado: R$ ${validacao.calculado.toFixed(2)}`);
    console.log(`- Diferença: ${(diferenca * 100).toFixed(1)}%`);
    console.log(`- Status: ${passou ? '✅ PASSOU' : '❌ FALHOU'}`);
    console.log('');

    if (passou) validacoesPassaram++;
  });

  console.log(`RESULTADO: ${validacoesPassaram}/${validacoes.length} validações passaram`);
  console.log('');

  return validacoesPassaram === validacoes.length;
};

/**
 * Demonstração Completa
 */
export const demonstracaoCompleta = () => {
  console.log('🎯 SISTEMA DE PRICING INTELIGENTE PARA MEGA HAIR');
  console.log('📊 Baseado em pesquisa real do mercado brasileiro 2024-2025');
  console.log('');

  // Executa todos os exemplos
  exemploBasico();
  exemploPremium();
  exemploAnaliseCompetitividade();
  exemploCalculoAutomatico();
  exemploDescontoVolume();
  exemploAnaliseCompleta();

  // Valida sistema
  const sistemaValido = validarDadosMercado();

  console.log('📈 COMPETIDORES ANALISADOS:');
  MARKET_COMPETITORS.forEach(comp => {
    console.log(`- ${comp.name} (${comp.positioning}) - R$ ${comp.averagePrice.per100g}/100g`);
  });

  console.log('');
  console.log(`🎉 Sistema ${sistemaValido ? 'VALIDADO' : 'REQUER AJUSTES'} e pronto para uso!`);
  console.log('');

  return sistemaValido;
};

// Executa demonstração se executado diretamente
if (typeof require !== 'undefined' && require.main === module) {
  demonstracaoCompleta();
}