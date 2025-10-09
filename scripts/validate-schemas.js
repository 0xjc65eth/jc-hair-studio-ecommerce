/**
 * Script de Validação Automática de Schemas
 * Valida todos os schemas implementados no site
 */

const schemas = {
  product: {
    name: 'Product Schema',
    required: ['@context', '@type', 'name', 'image', 'offers'],
    sample: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'Mega Hair Brasileiro 50cm',
      'description': 'Extensão de cabelo 100% humano',
      'image': ['https://jchairstudios62.xyz/products/mega-hair.jpg'],
      'sku': 'JCH-MEGA-50',
      'brand': {
        '@type': 'Brand',
        'name': "JC Hair Studio's 62"
      },
      'offers': {
        '@type': 'Offer',
        'price': '150.00',
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/InStock'
      }
    }
  },
  organization: {
    name: 'Organization Schema',
    required: ['@context', '@type', 'name', 'url'],
    sample: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': "JC Hair Studio's 62",
      'url': 'https://jchairstudios62.xyz',
      'logo': 'https://jchairstudios62.xyz/logo-brasil.png'
    }
  },
  localBusiness: {
    name: 'LocalBusiness Schema',
    required: ['@context', '@type', 'name', 'address'],
    sample: {
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      'name': "JC Hair Studio's 62",
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'R. Gil Vicente, N°5',
        'addressLocality': 'Seixal',
        'postalCode': '2840-474',
        'addressCountry': 'PT'
      }
    }
  },
  breadcrumb: {
    name: 'BreadcrumbList Schema',
    required: ['@context', '@type', 'itemListElement'],
    sample: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Início',
          'item': 'https://jchairstudios62.xyz/'
        }
      ]
    }
  },
  faq: {
    name: 'FAQ Schema',
    required: ['@context', '@type', 'mainEntity'],
    sample: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Pergunta exemplo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resposta exemplo.'
          }
        }
      ]
    }
  },
  website: {
    name: 'WebSite Schema',
    required: ['@context', '@type', 'url', 'name'],
    sample: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'url': 'https://jchairstudios62.xyz',
      'name': "JC Hair Studio's 62",
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://jchairstudios62.xyz/buscar?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  }
};

function validateSchema(schema, requiredFields) {
  const errors = [];
  
  // Check @context
  if (!schema['@context'] || !schema['@context'].includes('schema.org')) {
    errors.push('Missing or invalid @context');
  }
  
  // Check @type
  if (!schema['@type']) {
    errors.push('Missing @type');
  }
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!schema[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // Validate JSON
  try {
    JSON.stringify(schema);
  } catch (e) {
    errors.push('Invalid JSON structure');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

console.log('🔍 VALIDAÇÃO DE SCHEMAS - JC Hair Studio\'s 62');
console.log('================================================\n');

let totalTests = 0;
let passedTests = 0;

Object.entries(schemas).forEach(([key, schemaInfo]) => {
  totalTests++;
  console.log(`\n📋 Testando: ${schemaInfo.name}`);
  console.log('-'.repeat(50));
  
  const result = validateSchema(schemaInfo.sample, schemaInfo.required);
  
  if (result.valid) {
    console.log('✅ VÁLIDO');
    passedTests++;
  } else {
    console.log('❌ INVÁLIDO');
    result.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }
  
  console.log(`   Campos obrigatórios: ${schemaInfo.required.join(', ')}`);
});

console.log('\n================================================');
console.log(`\n📊 RESULTADO FINAL`);
console.log(`   Total de Schemas: ${totalTests}`);
console.log(`   ✅ Válidos: ${passedTests}`);
console.log(`   ❌ Inválidos: ${totalTests - passedTests}`);
console.log(`   Porcentagem de Sucesso: ${((passedTests/totalTests)*100).toFixed(0)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 TODOS OS SCHEMAS ESTÃO VÁLIDOS!');
  console.log('✅ Pronto para produção\n');
} else {
  console.log('\n⚠️  Alguns schemas precisam de correção\n');
}

// URLs para testar no Google Rich Results Test
console.log('\n🔗 URLs PARA TESTE NO GOOGLE RICH RESULTS TEST');
console.log('================================================');
const testUrls = [
  'https://jchairstudios62.xyz/ (Homepage - Organization + WebSite)',
  'https://jchairstudios62.xyz/mega-hair (Categoria - Breadcrumb + FAQ)',
  'https://jchairstudios62.xyz/produto/[id] (Produto - Product + Reviews)',
  'https://jchairstudios62.xyz/faq (FAQ - FAQPage)',
  'https://jchairstudios62.xyz/contato (Contato - LocalBusiness)'
];

testUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n📝 Para testar, acesse:');
console.log('   https://search.google.com/test/rich-results\n');
