'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { products, featuredProducts } from '../../src/data/products';

export default function FeaturedProducts() {
  const featuredProductsData = products.filter(product => 
    featuredProducts.includes(product.id)
  );

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
              preco_brl={product.preco_brl}
              preco_eur={product.preco_eur}
              imagens={product.imagens}
              badge={product.badge}
              destaque={product.destaque}
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