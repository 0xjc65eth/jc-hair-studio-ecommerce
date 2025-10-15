'use client';

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import ErrorBoundary from '../../../components/ui/ErrorBoundary';
import ProductCard from '../../../components/products/SimpleProductCard';
import { ShoppingBag, Search, Filter } from 'lucide-react';

// Mari Maria Products
const mariMariaProducts = [
  {
    id: 'mari-maria-base-amndoa',
    nome: 'Base Mari Maria - Tom Amêndoa',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Amêndoa. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-amndoa.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 32.00, ourPrice: 35.20, discountPrice: 28.16, savings: 7.04, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-baunilha',
    nome: 'Base Mari Maria - Tom Baunilha',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Baunilha. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-baunilha.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 32.50, ourPrice: 35.75, discountPrice: 28.60, savings: 7.15, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-claro',
    nome: 'Base Mari Maria - Tom Bege Claro',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Claro. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-claro.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 33.50, ourPrice: 36.85, discountPrice: 29.48, savings: 7.37, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-escuro',
    nome: 'Base Mari Maria - Tom Bege Escuro',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Escuro. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-escuro.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 34.00, ourPrice: 37.40, discountPrice: 29.92, savings: 7.48, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-medio',
    nome: 'Base Mari Maria - Tom Bege Médio',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Médio. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-mdio.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 34.50, ourPrice: 37.95, discountPrice: 30.36, savings: 7.59, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-cacau',
    nome: 'Base Mari Maria - Tom Cacau',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Cacau. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-cacau.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 35.00, ourPrice: 38.50, discountPrice: 30.80, savings: 7.70, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-canela',
    nome: 'Base Mari Maria - Tom Canela',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Canela. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-canela.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 35.50, ourPrice: 39.05, discountPrice: 31.24, savings: 7.81, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-caramelo',
    nome: 'Base Mari Maria - Tom Caramelo',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Caramelo. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-caramelo.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 36.00, ourPrice: 39.60, discountPrice: 31.68, savings: 7.92, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-chocolate',
    nome: 'Base Mari Maria - Tom Chocolate',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Chocolate. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-chocolate.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 36.50, ourPrice: 40.15, discountPrice: 32.12, savings: 8.03, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-nude',
    nome: 'Base Mari Maria - Tom Nude',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Nude. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-nude.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 37.00, ourPrice: 40.70, discountPrice: 32.56, savings: 8.14, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'teste-juliana',
    nome: 'Teste Juliana',
    marca: 'JC Hair Studio',
    descricao: 'Produto especial criado para teste do sistema de e-commerce. Perfeito para validar funcionalidades de compra, pagamento e notificações.',
    imagens: ['/images/products/placeholder-product.jpg'],
    badge: 'TESTE',
    pricing: { basePrice: 1.00, ourPrice: 1.00, discountPrice: 1.00, savings: 0.00, margin: '0%', competitive: 'PRODUTO TESTE - Valor especial para Juliana' }
  }
];

// Bruna Tavares Products
const brunaTavaresProducts = [
  {
    id: 'bruna-tavares-bt-skin-d10',
    nome: 'Base BT Skin D10 - Tom Claro',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin com fórmula avançada, cobertura natural e alta pigmentação. Desenvolvida com ácido hialurônico para hidratação prolongada.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D10 Base Bruna Tavares.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 25.00, ourPrice: 27.50, discountPrice: 22.00, savings: 5.50, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-d20',
    nome: 'Base BT Skin D20 - Tom Médio',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin especialmente desenvolvida para peles com subtom quente. Fórmula com ácido hialurônico e proteção contra luz azul.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D20 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 26.00, ourPrice: 28.60, discountPrice: 22.88, savings: 5.72, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-d30',
    nome: 'Base BT Skin D30 - Tom Escuro',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida com cobertura natural, alta pigmentação e acabamento aveludado. Ideal para peles escuras com subtom quente.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D30 Base Bruna Tavares.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 27.50, ourPrice: 30.25, discountPrice: 24.20, savings: 6.05, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-f10',
    nome: 'Base BT Skin F10 - Tom Claro Frio',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin especialmente desenvolvida para peles claras com subtom frio. Fórmula com ácido hialurônico.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin F10 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 25.50, ourPrice: 28.05, discountPrice: 22.44, savings: 5.61, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-l10',
    nome: 'Base BT Skin L10 - Tom Light',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin para peles muito claras. Cobertura natural com acabamento sedoso e longa duração.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin L10 Base Bruna Tavares.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 24.50, ourPrice: 26.95, discountPrice: 21.56, savings: 5.39, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-m10',
    nome: 'Base BT Skin M10 - Tom Medium',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin para peles médias. Fórmula avançada com proteção e hidratação prolongada.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin M10 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 26.50, ourPrice: 29.15, discountPrice: 23.32, savings: 5.83, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  }
];

// Wepink Virginia Products - Premium Base Collection
const wepinkVirginiaProducts = [
  {
    id: 'wepink-virginia-base-cor-01',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 01 Porcelana',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida premium Wepink Beauty com cobertura natural e acabamento sedoso. Fórmula exclusiva para peles muito claras com subtom neutro. 45ml de produto profissional.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-01.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 38.00, ourPrice: 41.80, discountPrice: 33.44, savings: 8.36, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-02',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 02 Marfim',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida premium Wepink Beauty com cobertura modulável e proteção antioxidante. Ideal para peles claras com subtom quente. Textura cremosa e confortável.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-02.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 38.50, ourPrice: 42.35, discountPrice: 33.88, savings: 8.47, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-03',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 03 Bege Rosado',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida de alta performance com tecnologia de longa duração. Perfeita para peles claras com subtom rosado. Controle de oleosidade por até 10 horas.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-03.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 39.00, ourPrice: 42.90, discountPrice: 34.32, savings: 8.58, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-04',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 04 Bege Natural',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com cobertura buildable e acabamento natural. Enriquecida com vitaminas E e C. Ideal para peles claras a médias com subtom neutro.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-04.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 39.50, ourPrice: 43.45, discountPrice: 34.76, savings: 8.69, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-05',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 05 Dourado Claro',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida premium com pigmentos dourados sutis. Fórmula hidratante com ácido hialurônico. Perfeita para peles com subtom dourado.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-05.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 40.00, ourPrice: 44.00, discountPrice: 35.20, savings: 8.80, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-06',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 06 Mel',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com tonalidade mel natural. Textura leve e respirável com proteção anti-poluição. Ideal para peles médias com subtom quente.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-06.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 40.50, ourPrice: 44.55, discountPrice: 35.64, savings: 8.91, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-07',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 07 Caramelo',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida profissional com tom caramelo rico. Fórmula anti-idade com peptídeos. Cobertura uniforme e durabilidade excepcional.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-07.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 41.00, ourPrice: 45.10, discountPrice: 36.08, savings: 9.02, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-08',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 08 Canela',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com tonalidade canela sofisticada. Resistente à água e suor. Perfeita para peles médias a escuras com subtom neutro.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-08.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 41.50, ourPrice: 45.65, discountPrice: 36.52, savings: 9.13, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-09',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 09 Bronze',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com reflexos bronze naturais. Enriquecida com extratos vegetais. Ideal para peles médias com subtom dourado.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-09.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 42.00, ourPrice: 46.20, discountPrice: 36.96, savings: 9.24, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-10',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 10 Amêndoa',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida premium com tom amêndoa elegante. Fórmula vegana livre de parabenos. Cobertura natural com acabamento luminoso.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-10.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 42.50, ourPrice: 46.75, discountPrice: 37.40, savings: 9.35, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-11',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 11 Cacau',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com tonalidade cacau profunda. Tecnologia de microencapsulamento para liberação gradual. Perfeita para peles escuras.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-11.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 43.00, ourPrice: 47.30, discountPrice: 37.84, savings: 9.46, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-12',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 12 Chocolate',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com tom chocolate intenso. Fórmula com proteção solar FPS 15. Ideal para peles escuras com subtom quente.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-12.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 43.50, ourPrice: 47.85, discountPrice: 38.28, savings: 9.57, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-13',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 13 Mocha',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida premium com tonalidade mocha sofisticada. Textura sedosa com efeito blur. Perfeita para peles escuras com subtom frio.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-13.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 44.00, ourPrice: 48.40, discountPrice: 38.72, savings: 9.68, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-14',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 14 Café',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida com tonalidade café rica e elegante. Fórmula de longa duração com controle de brilho. Ideal para peles muito escuras.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-14.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 44.50, ourPrice: 48.95, discountPrice: 39.16, savings: 9.79, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'wepink-virginia-base-cor-15',
    nome: 'Base Wepink Beauty Premium 45ml - Cor 15 Ebony',
    marca: 'Wepink Virginia',
    descricao: 'Base líquida premium com tom ebony profundo. Máxima cobertura com acabamento natural. Enriquecida com manteigas vegetais nutritivas.',
    imagens: ['/images/products/wepink-virginia-bases/wepink-base-cor-15.png'],
    badge: 'EXCLUSIVO',
    pricing: { basePrice: 45.00, ourPrice: 49.50, discountPrice: 39.60, savings: 9.90, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  }
];

// Base Fran Products by Franciny Ehlke
const baseFranProducts = [
  {
    id: 'base-fran-c01',
    nome: 'Base Mate Real Filter C01 - Tom Claro 1',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles claras. Cobertura natural e acabamento sedoso com controle de oleosidade por até 12 horas.',
    imagens: ['/images/products/base-fran/fran-c01.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 28.00, ourPrice: 30.80, discountPrice: 24.64, savings: 6.16, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-c02',
    nome: 'Base Mate Real Filter C02 - Tom Claro 2',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles claras com subtom rosado. Fórmula enriquecida com ácido hialurônico.',
    imagens: ['/images/products/base-fran/fran-c02.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 28.50, ourPrice: 31.35, discountPrice: 25.08, savings: 6.27, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-c03',
    nome: 'Base Mate Real Filter C03 - Tom Claro 3',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles claras com subtom dourado. Proteção anti-poluição e antioxidantes.',
    imagens: ['/images/products/base-fran/fran-c03.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 29.00, ourPrice: 31.90, discountPrice: 25.52, savings: 6.38, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-c04',
    nome: 'Base Mate Real Filter C04 - Tom Claro 4',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles claras com subtom neutro. Fórmula vegana e livre de parabenos.',
    imagens: ['/images/products/base-fran/fran-c04.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 29.50, ourPrice: 32.45, discountPrice: 25.96, savings: 6.49, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-e01',
    nome: 'Base Mate Real Filter E01 - Tom Escuro 1',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles escuras. Cobertura buildable com acabamento natural e resistente à água.',
    imagens: ['/images/products/base-fran/fran-e01.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 30.00, ourPrice: 33.00, discountPrice: 26.40, savings: 6.60, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-e02',
    nome: 'Base Mate Real Filter E02 - Tom Escuro 2',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles escuras com subtom quente. Rica em vitamina E e extratos naturais.',
    imagens: ['/images/products/base-fran/fran-e02.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 30.50, ourPrice: 33.55, discountPrice: 26.84, savings: 6.71, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-e03',
    nome: 'Base Mate Real Filter E03 - Tom Escuro 3',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles escuras com subtom frio. Fórmula com proteção solar FPS 15.',
    imagens: ['/images/products/base-fran/fran-e03.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 31.00, ourPrice: 34.10, discountPrice: 27.28, savings: 6.82, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-e04',
    nome: 'Base Mate Real Filter E04 - Tom Escuro 4',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles escuras com subtom neutro. Textura leve e respirável.',
    imagens: ['/images/products/base-fran/fran-e04.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 31.50, ourPrice: 34.65, discountPrice: 27.72, savings: 6.93, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-m01',
    nome: 'Base Mate Real Filter M01 - Tom Médio 1',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles médias. Controle de brilho e poros com efeito blur instantâneo.',
    imagens: ['/images/products/base-fran/fran-m01.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 29.00, ourPrice: 31.90, discountPrice: 25.52, savings: 6.38, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-m02',
    nome: 'Base Mate Real Filter M02 - Tom Médio 2',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles médias com subtom dourado. Hidratação prolongada e conforto.',
    imagens: ['/images/products/base-fran/fran-m02.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 29.50, ourPrice: 32.45, discountPrice: 25.96, savings: 6.49, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-m03',
    nome: 'Base Mate Real Filter M03 - Tom Médio 3',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles médias com subtom rosado. Fórmula anti-idade com peptídeos.',
    imagens: ['/images/products/base-fran/fran-m03.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 30.00, ourPrice: 33.00, discountPrice: 26.40, savings: 6.60, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  },
  {
    id: 'base-fran-m04',
    nome: 'Base Mate Real Filter M04 - Tom Médio 4',
    marca: 'Fran by Franciny Ehlke',
    descricao: 'Base mate com tecnologia Real Filter para peles médias com subtom neutro. Longa duração e acabamento impecável.',
    imagens: ['/images/products/base-fran/fran-m04.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 30.50, ourPrice: 33.55, discountPrice: 26.84, savings: 6.71, margin: '10%', competitive: 'Baseado em bases premium do mercado brasileiro' }
  }
];

export default function MaquiagensPage() {
  const [filtroMarca, setFiltroMarca] = useState('todas');
  const [termoBusca, setTermoBusca] = useState('');

  const todosProdutos = [...mariMariaProducts, ...brunaTavaresProducts, ...wepinkVirginiaProducts, ...baseFranProducts];

  const produtosFiltrados = todosProdutos.filter(produto => {
    const matchMarca = filtroMarca === 'todas' || produto.marca.toLowerCase().includes(filtroMarca.toLowerCase());
    const matchBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                       produto.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return matchMarca && matchBusca;
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-20 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6">
                Maquiagens Premium
              </h1>
              <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Descubra nossa exclusiva coleção de bases Mari Maria, Bruna Tavares, Wepink Virginia e Base Fran
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  {todosProdutos.length} produtos disponíveis
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="todas">Todas as marcas</option>
                    <option value="mari maria">Mari Maria</option>
                    <option value="bruna tavares">Bruna Tavares</option>
                    <option value="wepink virginia">Wepink Virginia</option>
                    <option value="fran by franciny ehlke">Fran by Franciny Ehlke</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Mostrando {produtosFiltrados.length} de {todosProdutos.length} produtos
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {produtosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProductCard
                    key={produto.id}
                    id={produto.id}
                    nome={produto.nome}
                    marca={produto.marca}
                    descricao={produto.descricao}
                    imagens={produto.imagens}
                    badge={produto.badge}
                    pricing={produto.pricing}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros ou termo de busca
                </p>
                <Button
                  onClick={() => {
                    setFiltroMarca('todas');
                    setTermoBusca('');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-4">
              Fique por dentro das novidades
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Cadastre-se para receber ofertas exclusivas e lançamentos em primeira mão
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-medium">
                Inscrever-se
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}