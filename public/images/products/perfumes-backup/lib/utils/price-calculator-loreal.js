// Calculadora de Preços L'Oréal - Conversão Real para Euro com Margem de Lucro

const COTACAO_EURO = 6.30; // Cotação atual EUR/BRL (setembro 2024)
const MARGEM_LUCRO = 0.50; // 50% de margem de lucro

// Preços base no Brasil (em Reais)
const precosBrasil = {
  // Excellence Crème (Imédia Excellence)
  excellence: 29.99, // Preço médio baseado na pesquisa

  // Excellence Sem Amônia
  excellenceSemAmonia: 32.99, // Preço estimado (linha premium)

  // Casting Crème Gloss
  casting: 39.29 // Preço encontrado na pesquisa
};

// Função para converter Real para Euro
function converterRealParaEuro(precoReal) {
  return precoReal / COTACAO_EURO;
}

// Função para aplicar margem de lucro
function aplicarMargemLucro(precoEuro) {
  return precoEuro * (1 + MARGEM_LUCRO);
}

// Função para calcular preço final
function calcularPrecoFinal(precoReal) {
  const precoEuro = converterRealParaEuro(precoReal);
  const precoComMargem = aplicarMargemLucro(precoEuro);
  return {
    precoBrasil: precoReal,
    precoEuroSemMargem: parseFloat(precoEuro.toFixed(2)),
    precoEuroFinal: parseFloat(precoComMargem.toFixed(2)),
    margemAplicada: MARGEM_LUCRO * 100
  };
}

// Cálculos para cada linha
const calculosPrecos = {
  excellence: calcularPrecoFinal(precosBrasil.excellence),
  excellenceSemAmonia: calcularPrecoFinal(precosBrasil.excellenceSemAmonia),
  casting: calcularPrecoFinal(precosBrasil.casting)
};

console.log("=== CALCULADORA DE PREÇOS L'ORÉAL ===");
console.log(`Cotação Euro: R$ ${COTACAO_EURO}`);
console.log(`Margem de Lucro: ${MARGEM_LUCRO * 100}%`);
console.log("");

Object.entries(calculosPrecos).forEach(([linha, calculo]) => {
  console.log(`${linha.toUpperCase()}:`);
  console.log(`  Preço Brasil: R$ ${calculo.precoBrasil}`);
  console.log(`  Preço Euro (sem margem): €${calculo.precoEuroSemMargem}`);
  console.log(`  Preço Final (com ${calculo.margemAplicada}%): €${calculo.precoEuroFinal}`);
  console.log("");
});

module.exports = {
  COTACAO_EURO,
  MARGEM_LUCRO,
  precosBrasil,
  converterRealParaEuro,
  aplicarMargemLucro,
  calcularPrecoFinal,
  calculosPrecos
};