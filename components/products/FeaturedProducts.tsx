'use client';

import React from 'react';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  // Featured products from our Brazilian beauty catalog
  const featuredProductsData = [
    // COCOCHOCO Premium Keratin - Best seller progressiva
    {
      id: 'cocochoco-original-premium',
      nome: 'COCOCHOCO Original Premium Keratin Treatment',
      marca: 'COCOCHOCO',
      descricao: 'Tratamento premium de queratina com terapia de chocolate. Fórmula profissional que proporciona alisamento duradouro, brilho intenso e nutrição profunda para resultados excepcionais.',
      imagens: ['/images/products/progressivas_diversas/progressivas_diversas_1.JPG'],
      badge: 'BEST SELLER',
      destaque: true,
      pricing: {
        basePrice: 189.90,
        ourPrice: 284.85,
        discountPrice: 259.90,
        savings: 24.95,
        margin: "37%",
        competitive: "Baseado em progressivas premium europeias"
      }
    },
    // Mega Hair Premium - Liso Loiro Platinado
    {
      id: 'mega-hair-liso-loiro-platinado',
      nome: 'Mega Hair Liso Loiro Platinado 613 - 50cm',
      marca: 'JC Hair Studio\'s 62',
      descricao: 'Extensão de cabelo 100% humano Remy europeu, loiro platinado 613 com 50cm de comprimento. Cutículas alinhadas, brilho natural e resistência máxima.',
      imagens: ['/images/mega-hair/mega-hair-001.jpg'],
      badge: 'PREMIUM',
      destaque: true,
      pricing: {
        basePrice: 85.00,
        ourPrice: 120.00,
        discountPrice: 85.00,
        savings: 35.00,
        margin: "10%",
        competitive: "Baseado em mega hair premium europeu"
      }
    },
    // Base Mari Maria - Bestseller
    {
      id: 'mari-maria-base-amndoa',
      nome: 'Base Mari Maria - Tom Amêndoa',
      marca: 'Mari Maria',
      descricao: 'Base líquida profissional Mari Maria no tom Amêndoa. Acabamento natural e cobertura modulável para todos os tipos de pele.',
      imagens: ['/images/products/mari-maria-bases/mari-maria-base-amndoa.png'],
      badge: 'BESTSELLER',
      destaque: true,
      pricing: {
        basePrice: 32.00,
        ourPrice: 35.20,
        discountPrice: 28.16,
        savings: 7.04,
        margin: "10%",
        competitive: "Baseado em bases premium do mercado europeu"
      }
    },
    // Base Bruna Tavares - Premium
    {
      id: 'bruna-tavares-bt-skin-d30',
      nome: 'Base BT Skin D30 - Tom Escuro',
      marca: 'Bruna Tavares',
      descricao: 'Base líquida com cobertura natural, alta pigmentação e acabamento aveludado. Ideal para peles escuras com subtom quente.',
      imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D30 Base Bruna Tavares.png'],
      badge: 'DESTAQUE',
      destaque: true,
      pricing: {
        basePrice: 27.50,
        ourPrice: 30.25,
        discountPrice: 24.20,
        savings: 6.05,
        margin: "10%",
        competitive: "Baseado em bases premium do mercado europeu"
      }
    },
    // Mega Hair Castanho Natural
    {
      id: 'mega-hair-liso-castanho-natural',
      nome: 'Mega Hair Liso Castanho Natural - 55cm',
      marca: 'JC Hair Studio\'s 62',
      descricao: 'Mega hair castanho natural premium brasileiro com 55cm de comprimento. Alta densidade 110g, movimento orgânico e compatibilidade perfeita com cabelos nativos.',
      imagens: ['/images/mega-hair/mega-hair-002.jpg'],
      badge: 'NATURAL',
      destaque: true,
      pricing: {
        basePrice: 90.00,
        ourPrice: 130.00,
        discountPrice: 90.00,
        savings: 40.00,
        margin: "10%",
        competitive: "Baseado em mega hair premium brasileiro"
      }
    },
    // COCOCHOCO Gold - Progressiva Premium
    {
      id: 'cocochoco-gold-premium',
      nome: 'COCOCHOCO Gold Premium Keratin Treatment',
      marca: 'COCOCHOCO',
      descricao: 'Tratamento de queratina dourado com brilho extra. Fórmula premium para resultados profissionais com máximo brilho e alisamento perfeito.',
      imagens: ['/images/products/progressivas_diversas/progressivas_diversas_2.JPG'],
      badge: 'PREMIUM',
      destaque: true,
      pricing: {
        basePrice: 149.90,
        ourPrice: 224.85,
        discountPrice: 199.90,
        savings: 24.95,
        margin: "33.4%",
        competitive: "Baseado em progressivas premium europeias"
      }
    },
    // Novex Hidratação - Cuidado capilar
    {
      id: 'novex-creme-antiporosidade-rosa',
      nome: 'Novex Creme Antiporosidade 72H Rosa - Cachos Mega Volume',
      marca: 'NOVEX',
      descricao: 'Creme para pentear com fórmula antiporosidade que proporciona volume e definição para cabelos ressecados. Hidratação intensa por até 72 horas.',
      imagens: ['/images/products/produtos_de_hidratacao/produtos_de_hidratacao_1.WEBP'],
      badge: 'BEST SELLER',
      destaque: true,
      pricing: {
        basePrice: 10.59,
        ourPrice: 15.89,
        discountPrice: 14.50,
        savings: 1.39,
        margin: "37%",
        competitive: "Baseado em produtos de hidratação europeus"
      }
    },
    // Mega Hair Preto Premium
    {
      id: 'mega-hair-liso-preto-premium',
      nome: 'Mega Hair Liso Preto Premium - 60cm',
      marca: 'JC Hair Studio\'s 62',
      descricao: 'Mega hair preto intenso premium, 60cm, brilho natural excepcional. Densidade máxima e brilho espelhado diamond.',
      imagens: ['/images/mega-hair/mega-hair-004.jpg'],
      badge: 'LUXO',
      destaque: true,
      pricing: {
        basePrice: 95.00,
        ourPrice: 130.00,
        discountPrice: 95.00,
        savings: 35.00,
        margin: "10%",
        competitive: "Baseado em mega hair premium brasileiro"
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