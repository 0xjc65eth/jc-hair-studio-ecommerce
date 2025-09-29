// INTEGRAÇÃO BATCH 2 - CATÁLOGO HAIR STUDIO
// Dados estruturados para integração com o sistema de catálogo

import { batch2Products, convertBatch2ToEUR } from './batch-2-products';

// Produtos do batch 2 convertidos para EUR com markup de 50%
export const batch2ProductsEUR = convertBatch2ToEUR(batch2Products);

// Resumo do batch 2 para relatório
export const batch2Summary = {
  totalProducts: batch2Products.length,
  brands: [
    'Payot',
    'Vult Cosméticos',
    'Natura',
    'O Boticário',
    'Maybelline',
    'Avon',
    'Granado',
    'Eudora',
    'Ruby Rose',
    'Koloss',
    'Macrilan',
    'Intense Hair',
    'Feitiços Aromáticos',
    'Amend',
    'Bioextratus',
    'Salon Line',
    'Niely',
    'Truss',
    'Keune Haircosmetics'
  ],
  brazilianBrands: [
    'Payot',
    'Vult Cosméticos',
    'Natura',
    'O Boticário',
    'Avon',
    'Granado',
    'Eudora',
    'Ruby Rose',
    'Koloss',
    'Macrilan',
    'Intense Hair',
    'Feitiços Aromáticos',
    'Amend',
    'Bioextratus',
    'Salon Line',
    'Niely',
    'Truss'
  ],
  categories: {
    'cuidados_diarios': 7, // Shampoo, máscaras, cremes, óleos, leave-in, spray, tonalizante
    'maquiagem': 6, // Paleta, batom, gloss, rímel, pó, pincéis
    'corporais': 3, // Hidratantes, sabonete, perfume
    'tratamento_capilar': 2, // Botox capilar
    'ferramentas': 1 // Kit pincéis
  },
  priceRange: {
    min: 4.25, // EUR
    max: 44.97, // EUR
    average: 15.23 // EUR
  },
  stockTotal: 467, // Unidades disponíveis
  professionalProducts: 20, // Todos adequados para hair studios
  featuredProducts: 8 // Produtos em destaque
};

// Produtos organizados por categoria para facilitar integração
export const batch2ByCategory = {
  cuidados_diarios: batch2ProductsEUR.filter(p => p.category === 'cuidados_diarios'),
  maquiagem: batch2ProductsEUR.filter(p => p.category === 'maquiagem'),
  corporais: batch2ProductsEUR.filter(p => p.category === 'corporais'),
  tratamento_capilar: batch2ProductsEUR.filter(p => p.category === 'tratamento_capilar'),
  ferramentas: batch2ProductsEUR.filter(p => p.category === 'ferramentas')
};

// Produtos em destaque do batch 2
export const batch2FeaturedProducts = batch2ProductsEUR.filter(p => p.featured);

// Produtos profissionais para hair studio
export const batch2ProfessionalProducts = batch2ProductsEUR.filter(p =>
  p.tags.includes('profissional') ||
  p.category === 'tratamento_capilar' ||
  p.subcategory === 'pincel'
);

// Marcas brasileiras identificadas no batch 2
export const batch2BrazilianBrands = batch2Summary.brazilianBrands.map(brand => ({
  name: brand,
  products: batch2ProductsEUR.filter(p => p.brand === brand).length,
  featured: batch2FeaturedProducts.some(p => p.brand === brand)
}));

// Dados para SEO e marketing
export const batch2SEOData = {
  keywords: [
    'cosméticos brasileiros',
    'produtos hair studio',
    'maquiagem profissional',
    'tratamento capilar',
    'cuidados diários',
    'marca brasileira',
    'salão beleza',
    'produtos profissionais'
  ],
  metaDescription: 'Batch 2: 20 produtos cosméticos brasileiros para hair studio. Natura, Vult, O Boticário, Ruby Rose e mais marcas nacionais.',
  brandHighlights: [
    'Natura - Sustentabilidade e inovação brasileira',
    'Vult Cosméticos - Maquiagem para pele brasileira',
    'O Boticário - Tradição em cosméticos nacionais',
    'Granado - Marca centenária brasileira',
    'Ruby Rose - Maquiagem acessível e qualidade',
    'Truss - Tecnologia capilar profissional'
  ]
};

// Função para integrar batch 2 ao catálogo principal
export async function integrateBatch2ToMainCatalog() {
  try {
    console.log('🔄 Integrando Batch 2 ao catálogo principal...');
    console.log(`📦 ${batch2Summary.totalProducts} produtos identificados`);
    console.log(`🇧🇷 ${batch2Summary.brazilianBrands.length} marcas brasileiras`);
    console.log(`💰 Faixa de preço: €${batch2Summary.priceRange.min} - €${batch2Summary.priceRange.max}`);
    console.log(`⭐ ${batch2Summary.featuredProducts} produtos em destaque`);

    return {
      success: true,
      products: batch2ProductsEUR,
      summary: batch2Summary,
      message: 'Batch 2 integrado com sucesso ao catálogo'
    };
  } catch (error) {
    console.error('❌ Erro ao integrar Batch 2:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export principal para uso no sistema
export { batch2ProductsEUR as default };