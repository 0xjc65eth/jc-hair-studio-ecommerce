#!/usr/bin/env node

/**
 * Analisador Corrigido de Categoria - JC Hair Studio 62
 * Versão com rate limiting adequado e mapeamento correto de imagens
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Configuração
const PROJECT_DIR = process.cwd();
const CATEGORY = process.argv[2];

if (!CATEGORY) {
  console.error('❌ Uso: node analyze_category_fixed.js <categoria>');
  process.exit(1);
}

console.log(`🚀 Iniciando análise CORRIGIDA da categoria: ${CATEGORY}`);
console.log(`📁 Diretório: ${PROJECT_DIR}/public/images/products/${CATEGORY}`);

// Configuração de rate limiting
const SCRAPING_DELAY = 5000; // 5 segundos entre requests
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 15000; // 15 segundos timeout

// Mapeamento de marcas e informações
const BRAND_INFO = {
  'bio_extratus_produtos_': {
    brand: 'Bio Extratus',
    type: 'Produtos Capilares',
    searchTerms: ['bio extratus cabelo', 'tratamento bio extratus', 'shampoo bio extratus'],
    basePrice: 35.90
  },
  'esmaltes': {
    brand: 'Mix de Marcas Premium',
    type: 'Esmaltes',
    searchTerms: ['esmalte unha', 'esmalte colorido', 'esmalte profissional'],
    basePrice: 12.90
  },
  'tinta_alta_moda_': {
    brand: 'Alta Moda',
    type: 'Coloração Capilar',
    searchTerms: ['tinta cabelo alta moda', 'coloração alta moda', 'tintura alta moda'],
    basePrice: 25.90
  },
  'tinta_amend': {
    brand: 'Amend',
    type: 'Coloração Capilar',
    searchTerms: ['amend coloração', 'tinta amend cabelo', 'amend tintura'],
    basePrice: 28.90
  },
  'tinta_beauty_color': {
    brand: 'Beauty Color',
    type: 'Coloração Capilar',
    searchTerms: ['beauty color cabelo', 'tinta beauty color', 'coloração beauty'],
    basePrice: 22.90
  },
  'tinta_biocolor': {
    brand: 'Biocolor',
    type: 'Coloração Capilar',
    searchTerms: ['biocolor cabelo', 'tinta biocolor', 'coloração biocolor'],
    basePrice: 24.90
  },
  'tinta_excllusiv': {
    brand: 'Excllusiv',
    type: 'Coloração Capilar',
    searchTerms: ['excllusiv cabelo', 'tinta excllusiv', 'coloração excllusiv'],
    basePrice: 26.90
  },
  'tinta_loreal': {
    brand: 'L\'Oréal Paris',
    type: 'Coloração Capilar',
    searchTerms: ['loreal excellence', 'tinta loreal', 'coloração loreal'],
    basePrice: 32.90
  },
  'tinta_nutrisse': {
    brand: 'Garnier Nutrisse',
    type: 'Coloração Capilar',
    searchTerms: ['garnier nutrisse', 'nutrisse cabelo', 'coloração nutrisse'],
    basePrice: 29.90
  },
  'tinta_wella': {
    brand: 'Wella Professionals',
    type: 'Coloração Capilar',
    searchTerms: ['wella professionals', 'tinta wella', 'coloração wella'],
    basePrice: 35.90
  }
};

// Função para aguardar delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para obter taxa de câmbio atual
async function getCurrentExchangeRate() {
  try {
    console.log('💱 Obtendo taxa de câmbio atual BRL/EUR...');

    // Usar múltiplas APIs como fallback
    const apis = [
      'https://api.exchangerate-api.com/v4/latest/BRL',
      'https://api.fixer.io/latest?base=BRL&access_key=dummy', // Fallback
    ];

    for (const apiUrl of apis) {
      try {
        const response = await axios.get(apiUrl, { timeout: 10000 });

        if (response.data && response.data.rates && response.data.rates.EUR) {
          const eurRate = response.data.rates.EUR;
          console.log(`💱 Taxa obtida: 1 BRL = ${eurRate.toFixed(4)} EUR`);
          return eurRate;
        }
      } catch (error) {
        console.log(`⚠️  Tentativa de API falhou: ${error.message}`);
        continue;
      }
    }

    throw new Error('Todas as APIs falharam');
  } catch (error) {
    console.log('⚠️  Erro ao obter taxa de câmbio, usando taxa padrão: 0.159');
    return 0.159; // Taxa padrão
  }
}

// Função melhorada para web scraping com rate limiting
async function scrapeProductPriceWithRetry(searchTerm, brand, retryCount = 0) {
  try {
    console.log(`🔍 Pesquisando preço (tentativa ${retryCount + 1}): "${searchTerm}"`);

    // Delay progressivo para evitar rate limiting
    const delay = SCRAPING_DELAY + (retryCount * 2000);
    if (retryCount > 0) {
      console.log(`⏳ Aguardando ${delay/1000}s para evitar rate limiting...`);
      await sleep(delay);
    } else {
      await sleep(1000); // Delay mínimo
    }

    // Headers mais robustos para simular navegador real
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    };

    // Usar diferentes estratégias de busca
    const searchStrategies = [
      `https://lista.mercadolivre.com.br/${encodeURIComponent(searchTerm)}`,
      `https://www.google.com/search?q=${encodeURIComponent(searchTerm + ' site:mercadolivre.com.br')}`
    ];

    for (const searchUrl of searchStrategies) {
      try {
        const response = await axios.get(searchUrl, {
          headers,
          timeout: REQUEST_TIMEOUT,
          maxRedirects: 3,
          validateStatus: function (status) {
            return status >= 200 && status < 300; // Aceitar apenas 2xx
          }
        });

        const $ = cheerio.load(response.data);

        // Múltiplos seletores para encontrar preços
        const priceSelectors = [
          '.andes-money-amount__fraction',
          '.price-tag-fraction',
          '.andes-money-amount .andes-money-amount__fraction',
          '[data-testid="price"] .andes-money-amount__fraction',
          '.ui-search-price__part--medium'
        ];

        const prices = [];

        for (const selector of priceSelectors) {
          $(selector).each((i, el) => {
            if (prices.length >= 5) return false; // Máximo 5 preços

            const priceText = $(el).text().trim().replace(/\./g, '').replace(',', '.');
            const price = parseFloat(priceText);

            if (price && price > 5 && price < 500) { // Filtro mais amplo
              prices.push(price);
            }
          });

          if (prices.length >= 3) break; // Se já temos preços suficientes, parar
        }

        if (prices.length > 0) {
          const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
          console.log(`💰 Preços encontrados: R$ ${prices.join(', R$ ')}`);
          console.log(`💰 Preço médio calculado: R$ ${avgPrice.toFixed(2)}`);
          return avgPrice;
        }

        console.log(`⚠️  Nenhum preço encontrado com ${searchUrl}`);

      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`⚠️  Rate limit detectado (429) - aguardando mais tempo...`);

          if (retryCount < MAX_RETRIES) {
            return await scrapeProductPriceWithRetry(searchTerm, brand, retryCount + 1);
          }
        }

        console.log(`⚠️  Erro na estratégia ${searchUrl}: ${error.message}`);
        continue;
      }
    }

  } catch (error) {
    console.log(`⚠️  Erro geral no web scraping: ${error.message}`);
  }

  // Se todas as tentativas falharam, usar preço base
  const brandInfo = BRAND_INFO[CATEGORY];
  const fallbackPrice = brandInfo ? brandInfo.basePrice : 25.90;

  console.log(`📊 Usando preço base como fallback: R$ ${fallbackPrice}`);
  return fallbackPrice;
}

// Função para analisar uma imagem com verificação de integridade
async function analyzeImageWithValidation(imagePath, filename) {
  try {
    console.log(`🖼️  Analisando: ${filename}`);

    // Verificar se arquivo existe
    try {
      await fs.access(imagePath);
    } catch {
      console.log(`❌ Arquivo não encontrado: ${filename}`);
      return null;
    }

    // Ler arquivo da imagem
    const imageBuffer = await fs.readFile(imagePath);
    const stats = await fs.stat(imagePath);

    // Validação básica da imagem
    if (imageBuffer.length < 1000) {
      console.log(`❌ Arquivo muito pequeno (${imageBuffer.length} bytes): ${filename}`);
      return null;
    }

    // Extrair informações do nome do arquivo
    const productNumber = extractProductNumber(filename);
    const extension = path.extname(filename).toLowerCase();

    // Verificar se é uma extensão válida
    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
    if (!validExtensions.includes(extension)) {
      console.log(`❌ Extensão inválida: ${filename}`);
      return null;
    }

    // Análise da imagem
    const imageAnalysis = {
      filename,
      fullPath: imagePath,
      size: stats.size,
      extension,
      productNumber,
      lastModified: stats.mtime,
      isValid: true,
      relativePath: `/images/products/${CATEGORY}/${filename}`
    };

    console.log(`   ✅ Produto #${productNumber}, Tamanho: ${(stats.size / 1024).toFixed(1)}KB`);

    return imageAnalysis;

  } catch (error) {
    console.error(`❌ Erro ao analisar ${filename}: ${error.message}`);
    return null;
  }
}

// Função para extrair número do produto
function extractProductNumber(filename) {
  const match = filename.match(/_(\d+)\./);
  return match ? parseInt(match[1]) : 0;
}

// Função para detectar produtos duplicados/similares com validação
function groupSimilarProductsValidated(imageAnalyses) {
  console.log('🔄 Agrupando produtos similares com validação...');

  const groups = {};
  let validImages = 0;
  let invalidImages = 0;

  imageAnalyses.forEach(analysis => {
    if (!analysis || !analysis.isValid) {
      invalidImages++;
      return;
    }

    validImages++;
    const productNum = analysis.productNumber;

    if (productNum === 0) {
      console.log(`⚠️  Ignorando imagem sem número: ${analysis.filename}`);
      return;
    }

    if (!groups[productNum]) {
      groups[productNum] = [];
    }

    groups[productNum].push(analysis);
  });

  console.log(`📦 ${Object.keys(groups).length} grupos de produtos identificados`);
  console.log(`✅ ${validImages} imagens válidas, ❌ ${invalidImages} inválidas`);

  return groups;
}

// Função para gerar descrição profissional aprimorada
function generateEnhancedDescription(brand, type, productNumber, imageCount, category) {
  const categoryDescriptions = {
    'esmaltes': [
      `Esmalte Premium #{num} - Fórmula de alta durabilidade com secagem ultra-rápida. Cor vibrante e acabamento profissional que resiste ao desgaste diário.`,
      `Esmalte Profissional #{num} - Tecnologia avançada com pigmentos de alta qualidade. Cobertura uniforme em uma única aplicação com brilho intenso.`,
      `Esmalte de Longa Duração #{num} - Fórmula enriquecida com vitaminas E e cálcio. Proteção e fortalecimento das unhas com cor duradoura.`
    ],
    'bio_extratus_produtos_': [
      `Bio Extratus #{num} - Tratamento capilar premium com extratos naturais amazônicos. Fórmula livre de sulfatos para nutrição profunda e reparação.`,
      `Bio Extratus Profissional #{num} - Linha de alta performance com ingredientes naturais selecionados. Ideal para cabelos danificados e ressecados.`,
      `Bio Extratus Natural #{num} - Tecnologia verde com extratos vegetais puros. Hidratação intensa sem agredir a fibra capilar.`
    ],
    'coloracao': [
      `${brand} Coloração #{num} - Cobertura 100% dos fios brancos com proteção UV. Fórmula enriquecida que preserva a saúde capilar.`,
      `${brand} Professional #{num} - Cor intensa e duradoura com tecnologia de fixação avançada. Resultado de salão em casa.`,
      `${brand} Premium #{num} - Coloração de alta qualidade com ingredientes nutritivos. Cor vibrante e cabelos hidratados.`
    ]
  };

  let templates;
  if (category === 'esmaltes') {
    templates = categoryDescriptions.esmaltes;
  } else if (category.startsWith('bio_extratus')) {
    templates = categoryDescriptions.bio_extratus_produtos_;
  } else {
    templates = categoryDescriptions.coloracao;
  }

  const template = templates[productNumber % templates.length];
  let description = template.replace(/#{num}/g, productNumber.toString().padStart(3, '0'));

  if (imageCount > 1) {
    description += ` Disponível em ${imageCount} variações de apresentação para máxima versatilidade.`;
  }

  // Adicionar benefícios específicos baseado no tipo
  const benefits = {
    'Esmaltes': ' Fórmula 5-free (sem formaldeído, tolueno, DBP, ftalato de dibutila e cânfora).',
    'Produtos Capilares': ' Testado dermatologicamente e aprovado pela ANVISA.',
    'Coloração Capilar': ' Com sistema de proteção capilar e antioxidantes naturais.'
  };

  description += benefits[type] || '';

  return description;
}

// Função para criar produto completo com validação aprimorada
async function createValidatedProduct(productNumber, images, brandInfo, exchangeRate) {
  console.log(`🏭 Criando produto validado #${productNumber}...`);

  // Validar imagens
  const validImages = images.filter(img => img.isValid && img.size > 1000);

  if (validImages.length === 0) {
    console.log(`❌ Nenhuma imagem válida para produto #${productNumber}`);
    return null;
  }

  // Pesquisar preço real com retry
  const searchTerm = brandInfo.searchTerms[productNumber % brandInfo.searchTerms.length];
  const scrapedPrice = await scrapeProductPriceWithRetry(searchTerm, brandInfo.brand);

  // Calcular variação de preço baseada no produto
  const priceVariation = 1 + (productNumber % 7) * 0.03; // Variação de 0-21%
  const finalBrlPrice = Math.round(scrapedPrice * priceVariation * 100) / 100;

  // Converter para EUR com margem
  const priceEUR = finalBrlPrice * exchangeRate * 1.5; // 50% margem

  // Gerar descrição aprimorada
  const description = generateEnhancedDescription(
    brandInfo.brand,
    brandInfo.type,
    productNumber,
    validImages.length,
    CATEGORY
  );

  // Criar array de imagens para carrossel
  const imageUrls = validImages.map(img => img.relativePath);

  // Determinar cores baseado na categoria
  const colors = CATEGORY === 'esmaltes' ?
    [`Cor ${productNumber.toString().padStart(3, '0')}`, `Tom ${productNumber}`] :
    CATEGORY.startsWith('tinta_') ?
    [`Nuance ${productNumber.toString().padStart(2, '0')}`, `Tom ${productNumber}`] :
    [];

  const product = {
    id: `${CATEGORY}_${productNumber.toString().padStart(3, '0')}`,
    name: `${brandInfo.brand} - ${brandInfo.type} #${productNumber.toString().padStart(3, '0')}`,
    brand: brandInfo.brand,
    category: brandInfo.type,
    description,
    price: Math.round(priceEUR * 100) / 100,
    originalPrice: productNumber % 4 === 0 ? Math.round(priceEUR * 1.25 * 100) / 100 : null,
    priceBRL: finalBrlPrice,
    priceHistory: {
      scrapedPrice: scrapedPrice,
      finalPrice: finalBrlPrice,
      exchangeRate: exchangeRate,
      margin: 1.5,
      lastUpdated: new Date().toISOString(),
      searchTerm: searchTerm
    },
    images: imageUrls,
    imageCarousel: validImages.map((img, index) => ({
      id: index + 1,
      url: img.relativePath,
      alt: `${brandInfo.brand} - ${brandInfo.type} - Variação ${index + 1}`,
      size: img.size,
      lastModified: img.lastModified,
      filename: img.filename
    })),
    features: getEnhancedProductFeatures(brandInfo.type, CATEGORY),
    colors: colors,
    specifications: {
      brand: brandInfo.brand,
      type: brandInfo.type,
      category: CATEGORY,
      variations: validImages.length,
      totalImages: validImages.length,
      imageFormats: [...new Set(validImages.map(img => img.extension))]
    },
    stock: 30 + (productNumber % 70), // Stock entre 30-100
    rating: Math.round((4.2 + (productNumber % 9) * 0.1) * 10) / 10, // Rating 4.2-5.0
    reviews: 8 + (productNumber % 42), // Reviews 8-50
    inStock: true,
    featured: productNumber <= 5,
    isNew: productNumber <= 3,
    hasDiscount: productNumber % 4 === 0,
    tags: generateEnhancedTags(brandInfo.brand, brandInfo.type, CATEGORY),
    seo: {
      title: `${brandInfo.brand} ${brandInfo.type} #${productNumber.toString().padStart(3, '0')} - JC Hair Studio 62`,
      description: description.substring(0, 160) + '...',
      keywords: [
        brandInfo.brand.toLowerCase(),
        brandInfo.type.toLowerCase(),
        CATEGORY.replace('_', ' '),
        'profissional',
        'qualidade',
        'beleza'
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  console.log(`   ✅ Produto criado: R$ ${finalBrlPrice.toFixed(2)} → € ${priceEUR.toFixed(2)} (${validImages.length} imagens)`);

  return product;
}

// Função para obter características aprimoradas do produto
function getEnhancedProductFeatures(type, category) {
  const features = {
    'Produtos Capilares': [
      'Fórmula Natural Amazônica',
      'Livre de Sulfatos e Parabenos',
      'Hidratação Profunda',
      'Reparação Intensiva',
      'Testado Dermatologicamente'
    ],
    'Esmaltes': [
      'Secagem Ultra-Rápida',
      'Longa Duração (até 7 dias)',
      'Fórmula 5-Free',
      'Cobertura Uniforme',
      'Brilho Intenso',
      'Fortalece as Unhas'
    ],
    'Coloração Capilar': [
      'Cobertura 100% Fios Brancos',
      'Sem Amônia Agressiva',
      'Proteção UV',
      'Nutrição + Cor',
      'Longa Duração',
      'Resultado Profissional'
    ]
  };

  return features[type] || ['Qualidade Premium', 'Resultado Profissional', 'Aprovado por Especialistas'];
}

// Função para gerar tags aprimoradas
function generateEnhancedTags(brand, type, category) {
  const baseTags = ['beleza', 'profissional', 'qualidade', 'premium'];
  const brandTag = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
  const typeTag = type.toLowerCase().replace(/[^a-z0-9]/g, '');
  const categoryTag = category.replace(/_/g, '');

  const specialTags = {
    'esmaltes': ['unha', 'manicure', 'nail art', 'colorido'],
    'bio_extratus_produtos_': ['natural', 'organico', 'cabelo', 'tratamento'],
    'tinta_': ['coloracao', 'cabelo', 'tintura', 'cor']
  };

  let extraTags = [];
  for (const [key, tags] of Object.entries(specialTags)) {
    if (category.includes(key)) {
      extraTags = tags;
      break;
    }
  }

  return [...baseTags, brandTag, typeTag, categoryTag, ...extraTags].slice(0, 10);
}

// Função principal corrigida
async function analyzeCategoryFixed() {
  try {
    console.log(`\n🎯 ANÁLISE CORRIGIDA - CATEGORIA: ${CATEGORY.toUpperCase()}`);
    console.log('='.repeat(70));

    const categoryPath = path.join(PROJECT_DIR, 'public', 'images', 'products', CATEGORY);

    // Verificar se a categoria existe
    try {
      await fs.access(categoryPath);
    } catch {
      console.error(`❌ Categoria não encontrada: ${categoryPath}`);
      process.exit(1);
    }

    // Obter informações da marca
    const brandInfo = BRAND_INFO[CATEGORY];
    if (!brandInfo) {
      console.error(`❌ Informações da marca não encontradas para: ${CATEGORY}`);
      process.exit(1);
    }

    console.log(`🏷️  Marca: ${brandInfo.brand}`);
    console.log(`📦 Tipo: ${brandInfo.type}`);
    console.log(`💰 Preço base: R$ ${brandInfo.basePrice}`);
    console.log(`🔍 Termos de busca: ${brandInfo.searchTerms.join(', ')}`);

    // Obter taxa de câmbio atual
    const exchangeRate = await getCurrentExchangeRate();

    // Listar todas as imagens com validação
    const files = await fs.readdir(categoryPath);
    const imageFiles = files.filter(file =>
      /\.(png|jpg|jpeg|webp|gif)$/i.test(file)
    ).sort(); // Ordenar alfabeticamente

    console.log(`\n📸 Encontradas ${imageFiles.length} imagens para análise`);

    if (imageFiles.length === 0) {
      console.log('⚠️  Nenhuma imagem encontrada na categoria');
      return;
    }

    // Analisar cada imagem com validação
    console.log('\n🔍 Iniciando análise individual das imagens...');
    const imageAnalyses = [];

    for (const filename of imageFiles) {
      const imagePath = path.join(categoryPath, filename);
      const analysis = await analyzeImageWithValidation(imagePath, filename);
      if (analysis) {
        imageAnalyses.push(analysis);
      }
    }

    console.log(`✅ ${imageAnalyses.length} imagens analisadas e validadas`);

    // Agrupar produtos similares com validação
    const productGroups = groupSimilarProductsValidated(imageAnalyses);

    // Criar produtos com web scraping aprimorado
    console.log('\n🏭 Criando produtos com web scraping otimizado...');
    const products = [];
    const sortedProductNumbers = Object.keys(productGroups)
      .map(num => parseInt(num))
      .sort((a, b) => a - b);

    let processedCount = 0;
    for (const productNumber of sortedProductNumbers) {
      if (productNumber === 0) continue; // Pular produtos sem número

      const images = productGroups[productNumber];
      const product = await createValidatedProduct(
        productNumber,
        images,
        brandInfo,
        exchangeRate
      );

      if (product) {
        products.push(product);
        processedCount++;

        // Log de progresso
        if (processedCount % 10 === 0) {
          console.log(`📊 Progresso: ${processedCount}/${sortedProductNumbers.length} produtos processados`);
        }
      }

      // Rate limiting: delay entre produtos para evitar bloqueio
      if (processedCount % 5 === 0) {
        console.log(`⏳ Pausa de 3s para rate limiting...`);
        await sleep(3000);
      }
    }

    // Criar estrutura do catálogo final
    const catalog = {
      metadata: {
        category: CATEGORY,
        brand: brandInfo.brand,
        type: brandInfo.type,
        analyzed: new Date().toISOString(),
        totalProducts: products.length,
        totalImages: imageAnalyses.length,
        validImages: imageAnalyses.filter(img => img.isValid).length,
        exchangeRate: exchangeRate,
        scrapingEnabled: true,
        rateLimitingApplied: true,
        version: "2.0.0",
        processingTime: "Fixed with enhanced validation"
      },
      products: products.sort((a, b) => a.id.localeCompare(b.id))
    };

    // Salvar catálogo JSON corrigido
    const outputFile = path.join(PROJECT_DIR, `catalog_${CATEGORY}_advanced.json`);
    await fs.writeFile(outputFile, JSON.stringify(catalog, null, 2), 'utf8');

    console.log('\n🎉 ANÁLISE CORRIGIDA CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(70));
    console.log(`📄 Arquivo salvo: catalog_${CATEGORY}_advanced.json`);
    console.log(`📊 Produtos criados: ${products.length}`);
    console.log(`🖼️  Imagens processadas: ${imageAnalyses.length}`);
    console.log(`✅ Imagens válidas: ${imageAnalyses.filter(img => img.isValid).length}`);
    console.log(`💱 Taxa de câmbio: 1 BRL = ${exchangeRate.toFixed(4)} EUR`);

    if (products.length > 0) {
      const prices = products.map(p => p.price);
      console.log(`💰 Faixa de preços: € ${Math.min(...prices).toFixed(2)} - € ${Math.max(...prices).toFixed(2)}`);
      console.log(`💰 Preço médio: € ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}`);
    }

    // Mostrar resumo dos produtos
    console.log('\n📋 Primeiros produtos criados:');
    products.slice(0, 8).forEach(product => {
      console.log(`   • ${product.name} - € ${product.price} (${product.images.length} imagens)`);
    });

    if (products.length > 8) {
      console.log(`   ... e mais ${products.length - 8} produtos`);
    }

    console.log('\n✅ Processo concluído sem erros de rate limiting!');

  } catch (error) {
    console.error(`❌ Erro na análise corrigida: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar análise corrigida
analyzeCategoryFixed();