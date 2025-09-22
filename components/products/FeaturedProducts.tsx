'use client';

import React from 'react';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  // Products from our European pricing catalog
  const featuredProductsData = [
    // Coloração Amend - from products-with-european-pricing.json
    {
      id: 'amend-coloracao-profissional',
      nome: 'Amend Coloração Capilar Profissional',
      marca: 'Amend',
      descricao: 'Coloração profissional brasileira com tecnologia avançada. Cores intensas e duradouras com proteção e nutrição dos fios.',
      imagens: ['/images/products/tinta_amend/tinta_amend_1.PNG'],
      badge: 'PROFISSIONAL',
      destaque: true,
      pricing: {
        basePrice: 12.00,
        ourPrice: 13.20,
        discountPrice: 10.56,
        savings: 2.64,
        margin: "10%",
        competitive: "Estimativa baseada em produtos brasileiros premium"
      }
    },
    // Tinta Wella - from catalog
    {
      id: 'wella-koleston-perfect',
      nome: 'Wella Koleston Perfect Coloração',
      marca: 'Wella',
      descricao: 'Coloração profissional Wella com tecnologia ME+ para redução de alergias. Cobertura uniforme e cores vibrantes.',
      imagens: ['/images/products/tinta_wella/tinta_wella_2.PNG'],
      badge: 'HIPOALERGÊNICA',
      destaque: true,
      pricing: {
        basePrice: 11.50,
        ourPrice: 12.65,
        discountPrice: 10.12,
        savings: 2.53,
        margin: "10%",
        competitive: "Baseado em preços Wella Europa"
      }
    },
    // Base Bruna Tavares - from bruna-tavares catalog
    {
      id: 'bruna-tavares-bt-skin-d30',
      nome: 'Base BT Skin D30 - Tom Escuro',
      marca: 'Bruna Tavares',
      descricao: 'Base líquida BT Skin com fórmula avançada, cobertura natural e alta pigmentação. Desenvolvida com ácido hialurônico para hidratação prolongada.',
      imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D30 Base Bruna Tavares.png'],
      badge: 'PREMIUM',
      destaque: true,
      pricing: {
        basePrice: 27.50,
        ourPrice: 30.25,
        discountPrice: 24.20,
        savings: 6.05,
        margin: "10%",
        competitive: "Baseado em catálogo existente + pesquisa Europa"
      }
    },
    // Tinta L'Oréal - from catalog
    {
      id: 'loreal-excellage-cores-variadas',
      nome: 'L\'Oréal Paris Excellence Age Perfect',
      marca: 'L\'Oréal Paris',
      descricao: 'Coloração permanente especialmente desenvolvida para cabelos maduros. Cobertura total dos brancos com cor vibrante que dura até 100 dias.',
      imagens: ['/images/products/tinta_loreal/tinta_loreal_1.PNG'],
      badge: 'BESTSELLER',
      destaque: true,
      pricing: {
        basePrice: 8.50,
        ourPrice: 9.35,
        discountPrice: 7.48,
        savings: 1.87,
        margin: "10%",
        competitive: "Baseado em preços farmácias europeias"
      }
    },
    // Botox Capilar - from catalog
    {
      id: 'forever-liss-btx-zero-formol-250g',
      nome: 'Forever Liss BTX Zero Formol 250g',
      marca: 'Forever Liss',
      descricao: 'Botox capilar zero formol que alisa, reconstrói e hidrata profundamente os fios. Resultado natural com redução de volume e frizz.',
      imagens: ['/images/products/botox/botox_1.png'],
      badge: 'SEM FORMOL',
      destaque: true,
      pricing: {
        basePrice: 22.90,
        ourPrice: 25.19,
        discountPrice: 20.15,
        savings: 5.04,
        margin: "10%",
        competitive: "Baseado preço brasileiro convertido + margem importação"
      }
    },
    // Progressiva - from catalog
    {
      id: 'cadiveu-professional-brasil-cacau-1l',
      nome: 'Cadiveu Professional Brasil Cacau Alisante 1L',
      marca: 'Cadiveu',
      descricao: 'Tratamento alisante profissional com óleo de cacau que proporciona cabelos lisos, sedosos e com brilho intenso. Reduz o volume e elimina o frizz por até 4 meses.',
      imagens: ['/images/products/progressivas_diversas/progressivas_diversas_1.JPG'],
      badge: 'PROFISSIONAL',
      destaque: true,
      pricing: {
        basePrice: 222.27,
        ourPrice: 244.50,
        discountPrice: 195.60,
        savings: 48.90,
        margin: "10%",
        competitive: "Baseado em Bellasil €222.27"
      }
    },
    // Tinta Beauty Color - from catalog
    {
      id: 'beauty-color-economica',
      nome: 'Beauty Color Coloração Vibrante',
      marca: 'Beauty Color',
      descricao: 'Coloração brasileira econômica com cores vibrantes e proteção dos fios. Ótima relação custo-benefício.',
      imagens: ['/images/products/tinta_beauty_color/tinta_beauty_color_1.PNG'],
      badge: 'ECONÔMICA',
      destaque: true,
      pricing: {
        basePrice: 6.50,
        ourPrice: 7.15,
        discountPrice: 5.72,
        savings: 1.43,
        margin: "10%",
        competitive: "Posicionamento econômico brasileiro"
      }
    },
    // Base Bruna Tavares Variação - from catalog
    {
      id: 'bruna-tavares-bt-skin-m20',
      nome: 'Base BT Skin M20 - Tom Médio',
      marca: 'Bruna Tavares',
      descricao: 'Base líquida BT Skin para peles médias com subtom quente. Acabamento natural aveludado com tecnologia brasileira de ponta.',
      imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin M20 Base Bruna Tavares.png'],
      badge: 'TOM MÉDIO',
      destaque: true,
      pricing: {
        basePrice: 27.50,
        ourPrice: 30.25,
        discountPrice: 24.20,
        savings: 6.05,
        margin: "10%",
        competitive: "Baseado em catálogo existente + pesquisa Europa"
      }
    }
  ];

  if (!featuredProductsData.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Carregando produtos em destaque...</p>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
            PRODUTOS EM DESTAQUE
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Os favoritos dos profissionais brasileiros agora na Europa
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {featuredProductsData.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              nome={product.nome}
              marca={product.marca}
              descricao={product.descricao}
              imagens={product.imagens}
              badge={product.badge}
              destaque={product.destaque}
              pricing={product.pricing}
            />
          ))}
        </div>

        <div className="text-center">
          <a 
            href="/produtos" 
            className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-8 py-4 rounded-full hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 font-semibold tracking-wide transform hover:-translate-y-1"
          >
            Ver Todos os Produtos
          </a>
        </div>
      </div>
    </section>
  );
}