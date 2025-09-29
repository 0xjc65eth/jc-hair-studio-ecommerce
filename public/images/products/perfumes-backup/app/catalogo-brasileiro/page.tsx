'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Filter, Search, Flame, ArrowRight, Globe, Shield, Clock } from 'lucide-react'

interface Product {
  id: number
  name: string
  image: string
  category: 'progressivas' | 'tratamentos' | 'shampoos' | 'maquiagem' | 'esmaltes' | 'corpo'
  brand: string
  sizes: string[]
  prices: { [key: string]: number }
  originalPrice?: number
  description: string
  emotionalTrigger: string
  whyItSells: string
  featured?: boolean
  viral?: boolean
  newProduct?: boolean
  bestseller?: boolean
  hairType?: string[]
  freeFrom?: string[]
  origin: string
}

const products: Product[] = [
  // PROGRESSIVAS E ALISAMENTOS
  {
    id: 1,
    name: "Cadiveu Plástica dos Fios",
    image: "https://http2.mlstatic.com/D_NQ_NP_831456-MLB54994080516_052023-O.webp",
    category: "progressivas",
    brand: "Cadiveu",
    sizes: ["Kit Completo (3 passos)"],
    prices: { "Kit Completo": 95 },
    description: "A progressiva mais famosa do Brasil. Alisa e reconstrói o cabelo simultaneamente. Duração de 3-4 meses.",
    emotionalTrigger: "⭐ Produto dos sonhos das brasileiras",
    whyItSells: "Marca premium reconhecida internacionalmente, resultados duradouros, status symbol entre brasileiras",
    featured: true,
    hairType: ["Todos"],
    freeFrom: ["Formol"],
    origin: "Brasil"
  },
  {
    id: 2,
    name: "ZAP All Time Organic Progressiva",
    image: "https://http2.mlstatic.com/D_NQ_NP_994715-MLB72031897007_102023-O.webp",
    category: "progressivas",
    brand: "ZAP",
    sizes: ["Kit 2x1L"],
    prices: { "Kit 2x1L": 75 },
    description: "Progressiva orgânica sem formol. Aprovada para uso na Europa. Resultado profissional.",
    emotionalTrigger: "✅ Sem Formol - Aprovado UE",
    whyItSells: "Única progressiva brasileira aprovada para Europa, sem formol, resultado profissional",
    hairType: ["Todos"],
    freeFrom: ["Formol", "Chumbo"],
    origin: "Brasil"
  },
  {
    id: 3,
    name: "Forever Liss BTX Zero",
    image: "https://http2.mlstatic.com/D_NQ_NP_845021-MLB50403708365_062022-O.webp",
    category: "progressivas",
    brand: "Forever Liss",
    sizes: ["250g", "1kg"],
    prices: { "250g": 45, "1kg": 85 },
    description: "Botox capilar sem formol. Reduz volume e alinha os fios. Tratamento profissional em casa.",
    emotionalTrigger: "💝 Igual ao salão por fração do preço",
    whyItSells: "Custo-benefício excepcional, sem formol (adequado UE), resultado profissional",
    bestseller: true,
    hairType: ["Todos"],
    freeFrom: ["Formol"],
    origin: "Brasil"
  },

  // TRATAMENTOS CAPILARES
  {
    id: 4,
    name: "Karseell Collagen Máscara",
    image: "https://http2.mlstatic.com/D_NQ_NP_991374-MLB71435965396_092023-O.webp",
    category: "tratamentos",
    brand: "Karseell",
    sizes: ["500ml", "1000ml"],
    prices: { "500ml": 28, "1000ml": 48 },
    description: "Fenômeno viral do TikTok! Máscara de colágeno com resultado instantâneo. Cabelo liso japonês.",
    emotionalTrigger: "🔥 Viral no TikTok - 970K seguidores",
    whyItSells: "Viral globalmente, resultado profissional instantâneo, preço irresistível comparado a tratamentos europeus",
    viral: true,
    featured: true,
    hairType: ["Liso", "Ondulado"],
    origin: "Brasil"
  },
  {
    id: 5,
    name: "Maria Escandalosa Botox White",
    image: "https://http2.mlstatic.com/D_NQ_NP_799925-MLB50498415651_062022-O.webp",
    category: "tratamentos",
    brand: "Maria Escandalosa",
    sizes: ["500g", "1kg"],
    prices: { "500g": 35, "1kg": 65 },
    description: "Botox matizador para loiras. Remove amarelado enquanto trata. Resultado platinado perfeito.",
    emotionalTrigger: "👱‍♀️ Loiro dos sonhos",
    whyItSells: "Especializado em loiras, remove amarelado, resultado platinado europeu",
    hairType: ["Loiro"],
    origin: "Brasil"
  },
  {
    id: 6,
    name: "TRUSS Uso Obrigatório",
    image: "https://http2.mlstatic.com/D_NQ_NP_628405-MLB31751589018_082019-O.webp",
    category: "tratamentos",
    brand: "TRUSS",
    sizes: ["650ml"],
    prices: { "650ml": 75 },
    description: "Tratamento profissional de salão. Reconstrói cabelos extremamente danificados.",
    emotionalTrigger: "💎 Marca premium dos salões",
    whyItSells: "Qualidade profissional reconhecida, resultado imediato visível",
    featured: true,
    hairType: ["Todos"],
    origin: "Brasil"
  },

  // SHAMPOOS E CONDICIONADORES
  {
    id: 7,
    name: "Natura Ekos Murumuru Kit",
    image: "https://http2.mlstatic.com/D_NQ_NP_841515-MLB52317249457_112022-O.webp",
    category: "shampoos",
    brand: "Natura",
    sizes: ["Kit Shampoo + Condicionador 300ml"],
    prices: { "Kit 300ml": 38 },
    description: "Ingredientes da Amazônia. Murumuru reconstrói cabelos danificados. Cheiro único do Brasil.",
    emotionalTrigger: "🌿 Amazônia em cada gota",
    whyItSells: "Sustentabilidade + exclusividade da Amazônia, impossível substituir na Europa",
    featured: true,
    hairType: ["Todos"],
    origin: "Amazônia - Brasil"
  },
  {
    id: 8,
    name: "Bio Extratus Jaborandi Antiqueda",
    image: "https://http2.mlstatic.com/D_NQ_NP_935604-MLB49518073829_032022-O.webp",
    category: "shampoos",
    brand: "Bio Extratus",
    sizes: ["250ml", "1L"],
    prices: { "250ml": 18, "1L": 45 },
    description: "Fórmula tradicional brasileira contra queda. Jaborandi exclusivo do Brasil. Resultado comprovado.",
    emotionalTrigger: "🍃 Segredo indígena brasileiro",
    whyItSells: "Ingrediente exclusivo brasileiro (jaborandi), tamanho profissional econômico",
    bestseller: true,
    hairType: ["Todos"],
    origin: "Brasil"
  },
  {
    id: 9,
    name: "O Boticário Nativa SPA Matcha",
    image: "https://http2.mlstatic.com/D_NQ_NP_991456-MLB54147398925_032023-O.webp",
    category: "shampoos",
    brand: "O Boticário",
    sizes: ["Kit Shampoo + Condicionador 300ml"],
    prices: { "Kit 300ml": 32 },
    description: "Detox capilar com matcha. Fragrância exclusiva que lembra o Brasil. Hidratação profunda.",
    emotionalTrigger: "🎋 Cheiro de saudade",
    whyItSells: "Fragrâncias exclusivas brasileiras, marca com 47 anos de história",
    hairType: ["Todos"],
    origin: "Brasil"
  },

  // MAQUIAGEM
  {
    id: 10,
    name: "Mari Maria Base Hype Up",
    image: "https://http2.mlstatic.com/D_NQ_NP_760156-MLB71791287639_092023-O.webp",
    category: "maquiagem",
    brand: "Mari Maria",
    sizes: ["17 tons + 6 corretores"],
    prices: { "Base + Corretor": 35 },
    description: "Base da influencer Mari Maria. Perfeita para pele brasileira. Cobertura HD.",
    emotionalTrigger: "💄 Sonho de consumo realizado",
    whyItSells: "Maior variedade tons pele brasileira, influencer com milhões de seguidoras",
    featured: true,
    origin: "Brasil"
  },
  {
    id: 11,
    name: "Boca Rosa Beauty Stick Multifuncional",
    image: "https://http2.mlstatic.com/D_NQ_NP_924521-MLB44153355023_112020-O.webp",
    category: "maquiagem",
    brand: "Boca Rosa",
    sizes: ["6 tons tropicais"],
    prices: { "Stick 3 em 1": 28 },
    description: "3 em 1: blush, batom e sombra. Cores vibrantes brasileiras. Prático para viagem.",
    emotionalTrigger: "🌺 18M de seguidoras",
    whyItSells: "Praticidade para viagem, cores vibrantes brasileiras, influencer com 18M seguidores",
    viral: true,
    origin: "Brasil"
  },
  {
    id: 12,
    name: "Vult Make Up Kit Completo",
    image: "https://http2.mlstatic.com/D_NQ_NP_835621-MLB31007089454_062019-O.webp",
    category: "maquiagem",
    brand: "Vult",
    sizes: ["Maleta profissional"],
    prices: { "Kit 50 itens": 85 },
    description: "Kit completo com 50 itens. Paleta tropical exclusiva. Qualidade profissional.",
    emotionalTrigger: "🎨 Maquiador profissional em casa",
    whyItSells: "Kit completo profissional, paletas tropicais exclusivas, valor excepcional",
    origin: "Brasil"
  },

  // ESMALTES
  {
    id: 13,
    name: "Risqué Coleção Clássicos",
    image: "https://http2.mlstatic.com/D_NQ_NP_884621-MLB52491028945_112022-O.webp",
    category: "esmaltes",
    brand: "Risqué",
    sizes: ["Unidade", "Kit 6 cores"],
    prices: { "Unidade": 8, "Kit 6 cores": 42 },
    description: "Esmaltes com nomes emocionais brasileiros. 75 anos de tradição. Cores impossíveis de encontrar na Europa.",
    emotionalTrigger: "💅 Nostalgia em vidrinhos",
    whyItSells: "75 anos de tradição, cores tropicais únicas, storytelling poderoso",
    bestseller: true,
    origin: "Brasil"
  },
  {
    id: 14,
    name: "Risqué Coleção Verão Brasileiro",
    image: "https://http2.mlstatic.com/D_NQ_NP_799456-MLB71791234567_092023-O.webp",
    category: "esmaltes",
    brand: "Risqué",
    sizes: ["Kit 4 cores tropicais"],
    prices: { "Kit 4 cores": 32 },
    description: "Cores do verão brasileiro. Amarelo Ipanema, Verde Água de Coco, Laranja Guaraná, Rosa Açaí.",
    emotionalTrigger: "☀️ Verão eterno nas unhas",
    whyItSells: "Cores do verão brasileiro, edição limitada, nomes evocativos",
    newProduct: true,
    origin: "Brasil"
  },
  {
    id: 15,
    name: "Dailus Esmaltes Veganos",
    image: "https://http2.mlstatic.com/D_NQ_NP_645821-MLB52491056789_112022-O.webp",
    category: "esmaltes",
    brand: "Dailus",
    sizes: ["Kit 6 cores"],
    prices: { "Kit 6 cores": 35 },
    description: "Esmaltes veganos 5-free. Cores brasileiras modernas. Durabilidade superior.",
    emotionalTrigger: "🌱 Beleza consciente",
    whyItSells: "Veganos certificados, cores brasileiras modernas, durabilidade superior",
    freeFrom: ["5-Free"],
    origin: "Brasil"
  },

  // CUIDADOS COM O CORPO
  {
    id: 16,
    name: "O Boticário Nativa SPA Ameixa",
    image: "https://http2.mlstatic.com/D_NQ_NP_825463-MLB49518096754_032022-O.webp",
    category: "corpo",
    brand: "O Boticário",
    sizes: ["Creme 400ml", "Óleo 250ml"],
    prices: { "Creme 400ml": 25, "Óleo 250ml": 30 },
    description: "Hidratante com fragrância icônica. Ameixa dourada exclusiva. 48h de hidratação.",
    emotionalTrigger: "✨ Cheiro que define o Brasil",
    whyItSells: "Fragrância icônica brasileira, hidratação 48h, nostalgia instantânea",
    bestseller: true,
    origin: "Brasil"
  },
  {
    id: 17,
    name: "Natura Ekos Castanha Hidratante",
    image: "https://http2.mlstatic.com/D_NQ_NP_991234-MLB52317245678_112022-O.webp",
    category: "corpo",
    brand: "Natura",
    sizes: ["400ml"],
    prices: { "400ml": 28 },
    description: "Castanha-do-pará da Amazônia. Hidratação profunda. Sustentável e exclusivo.",
    emotionalTrigger: "🌰 Amazônia na sua pele",
    whyItSells: "Ingrediente amazônico exclusivo, sustentabilidade, hidratação profunda",
    featured: true,
    origin: "Amazônia - Brasil"
  },
  {
    id: 18,
    name: "Match Boticário Desodorante Colônia",
    image: "https://http2.mlstatic.com/D_NQ_NP_745632-MLB49518073456_032022-O.webp",
    category: "corpo",
    brand: "O Boticário",
    sizes: ["6 aromas jovens"],
    prices: { "100ml": 22 },
    description: "Fragrâncias divertidas e marcantes. Cheiro de juventude brasileira.",
    emotionalTrigger: "🎉 Memórias da adolescência",
    whyItSells: "Fragrâncias jovens brasileiras, memória afetiva, preço acessível",
    origin: "Brasil"
  }
]

interface ActiveFilters {
  category: string | null
  brand: string | null
  priceRange: string | null
  hairType: string | null
}

export default function BrazilianBeautyStorePage() {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: null,
    brand: null,
    priceRange: null,
    hairType: null
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [wishlistIds, setWishlistIds] = useState<number[]>([])
  const [comparisonIds, setComparisonIds] = useState<number[]>([])

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (activeFilters.category) {
      filtered = filtered.filter(p => p.category === activeFilters.category)
    }

    // Brand filter
    if (activeFilters.brand) {
      filtered = filtered.filter(p => p.brand === activeFilters.brand)
    }

    // Price range filter
    if (activeFilters.priceRange) {
      const ranges = {
        '10-30': [10, 30],
        '30-50': [30, 50],
        '50-100': [50, 100],
        '100+': [100, 1000]
      }
      const [min, max] = ranges[activeFilters.priceRange as keyof typeof ranges]
      filtered = filtered.filter(p => {
        const minPrice = Math.min(...Object.values(p.prices))
        return minPrice >= min && minPrice <= max
      })
    }

    // Hair type filter
    if (activeFilters.hairType && activeFilters.category !== 'maquiagem' && activeFilters.category !== 'esmaltes' && activeFilters.category !== 'corpo') {
      filtered = filtered.filter(p => 
        p.hairType?.includes(activeFilters.hairType as string) || p.hairType?.includes('Todos')
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => Math.min(...Object.values(a.prices)) - Math.min(...Object.values(b.prices)))
        break
      case 'price-desc':
        filtered.sort((a, b) => Math.min(...Object.values(b.prices)) - Math.min(...Object.values(a.prices)))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'popularity':
      default:
        filtered.sort((a, b) => {
          const aScore = (a.featured ? 3 : 0) + (a.bestseller ? 2 : 0) + (a.viral ? 2 : 0) + (a.newProduct ? 1 : 0)
          const bScore = (b.featured ? 3 : 0) + (b.bestseller ? 2 : 0) + (b.viral ? 2 : 0) + (b.newProduct ? 1 : 0)
          return bScore - aScore
        })
        break
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }))
  }

  const clearFilters = () => {
    setActiveFilters({
      category: null,
      brand: null,
      priceRange: null,
      hairType: null
    })
    setSearchTerm('')
  }

  const openModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
    document.body.style.overflow = 'auto'
  }

  const contactWhatsApp = (product: Product) => {
    const phoneNumber = '320494989860'
    const minPrice = Math.min(...Object.values(product.prices))
    const message = `🌟 *BRAZILIAN BEAUTY STORE - CONSULTA ESPECIALIZADA*

👋 Olá! Gostaria de informações sobre:

📦 *${product.name}*
🏷️ *Marca:* ${product.brand}
💰 *Preço:* €${minPrice} + frete
🌍 *Origem:* ${product.origin}

🔍 *Preciso de orientação sobre:*
• ✅ Disponibilidade e prazo de entrega (15-25 dias)
• 💳 Formas de pagamento (PIX/Transferência/PayPal)
• 🚚 Custos de frete para meu país
• 📋 Certificações EU e documentação
• 🎯 Orientação de uso e cuidados
• 🛡️ Garantia de originalidade

*O melhor da beleza brasileira agora na Europa!*

Obrigado(a) 😊`

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const toggleWishlist = (productId: number) => {
    setWishlistIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleComparison = (productId: number) => {
    setComparisonIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              🇧🇷 Produtos 100% Originais do Brasil
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light tracking-widest mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            BRAZILIAN BEAUTY STORE
          </h1>
          <p className="text-2xl md:text-3xl text-yellow-400 tracking-wider mb-3">Produtos Exclusivos do Brasil</p>
          <p className="text-lg text-gray-300 font-light mb-8">O melhor da beleza brasileira agora na Europa</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Globe className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold">{products.length}</div>
              <div className="text-sm opacity-75">Produtos Exclusivos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-xl font-bold">100%</div>
              <div className="text-sm opacity-75">Originais Certificados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold">15-25</div>
              <div className="text-sm opacity-75">Dias de Entrega</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold">€10+</div>
              <div className="text-sm opacity-75">Preços a partir de</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produtos ou marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="popularity">Mais Populares</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <Filter className="w-8 h-8 text-yellow-600" />
              Filtros Profissionais
            </h2>
            <p className="text-gray-600">Encontre exatamente o que procura</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Categoria</h3>
              <div className="flex flex-wrap gap-2">
                {['progressivas', 'tratamentos', 'shampoos', 'maquiagem', 'esmaltes', 'corpo'].map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange('category', category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilters.category === category
                        ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-0.5'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Marca</h3>
              <div className="flex flex-wrap gap-2">
                {['Cadiveu', 'Natura', 'Karseell', 'Bio Extratus', 'Risqué', 'O Boticário', 'Forever Liss', 'Mari Maria'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => handleFilterChange('brand', brand)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilters.brand === brand
                        ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-0.5'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Faixa de Preço</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '10-30', label: '€10-30' },
                  { value: '30-50', label: '€30-50' },
                  { value: '50-100', label: '€50-100' },
                  { value: '100+', label: '€100+' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleFilterChange('priceRange', value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilters.priceRange === value
                        ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-0.5'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Type Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Por Tipo de Cabelo</h3>
              <div className="flex flex-wrap gap-2">
                {['Liso', 'Ondulado', 'Cacheado', 'Todos'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('hairType', type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilters.hairType === type
                        ? 'bg-yellow-500 text-white shadow-lg transform -translate-y-0.5'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-8 text-center">
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              🔄 Limpar Todos os Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl p-6 text-center font-semibold shadow-lg">
          {filteredProducts.length === products.length ? (
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base">
              <span>📊 {filteredProducts.length} Produtos Exclusivos</span>
              <span>⭐ {filteredProducts.filter(p => p.featured).length} Master Class</span>
              <span>🔥 {filteredProducts.filter(p => p.viral).length} Virais TikTok</span>
              <span>🚚 Frete Grátis €150+</span>
              <span>🌍 Entrega Europa</span>
            </div>
          ) : (
            <div>
              🔍 Encontrados {filteredProducts.length} produtos • ⭐ {filteredProducts.filter(p => p.featured).length} Master Class • 🔄 <button onClick={clearFilters} className="underline hover:no-underline">Ver catálogo completo</button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl text-gray-600 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-4">Tente ajustar os filtros para ver mais opções.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
            >
              Ver Todos os Produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 border border-gray-100 relative"
                onClick={() => openModal(product)}
              >
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  {product.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ MASTER CLASS
                    </div>
                  )}
                  {product.viral && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Flame className="w-3 h-3 inline mr-1" />
                      VIRAL
                    </div>
                  )}
                  {product.bestseller && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      🏆 BEST SELLER
                    </div>
                  )}
                  {product.newProduct && (
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      🆕 NOVO
                    </div>
                  )}
                </div>

                {/* Wishlist & Compare buttons */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(product.id)
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      wishlistIds.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="text-white text-xs font-semibold">
                      {product.brand} • {product.origin}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-lg">
                    <p className="text-yellow-800 text-xs font-medium italic">
                      {product.emotionalTrigger}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                      {product.brand}
                    </span>
                    {product.freeFrom && product.freeFrom.map(free => (
                      <span key={free} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        ✅ {free}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-yellow-600 flex items-baseline">
                      €{Math.min(...Object.values(product.prices))}
                      <span className="text-sm text-gray-500 font-normal ml-2">+ frete</span>
                    </div>
                    {Object.keys(product.prices).length > 1 && (
                      <div className="text-xs text-gray-500">
                        Várias opções disponíveis
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 text-green-700 text-center py-2 px-3 rounded-lg text-sm mb-4 font-medium">
                    🇧🇷 100% Original do Brasil
                  </div>

                  <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                    👁️ Ver Detalhes Completos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que Comprar Conosco?
            </h2>
            <p className="text-gray-300 text-lg">
              Sua garantia de autenticidade e qualidade brasileira na Europa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-lg font-semibold mb-2">✅ Produtos 100% originais do Brasil</h3>
              <p className="text-gray-300 text-sm">
                Importados diretamente do Brasil com nota fiscal brasileira incluída
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">✅ Conformidade com regulamentações EU</h3>
              <p className="text-gray-300 text-sm">
                Todos os produtos aprovados para uso na União Europeia
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">✅ Suporte em português</h3>
              <p className="text-gray-300 text-sm">
                Atendimento especializado com mais de 30 anos de experiência
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900 truncate pr-4">
                {selectedProduct.name}
              </h2>
              <button
                onClick={closeModal}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="space-y-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Master Class
                      </span>
                    )}
                    {selectedProduct.viral && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        🔥 Viral TikTok
                      </span>
                    )}
                    {selectedProduct.bestseller && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        🏆 Best Seller
                      </span>
                    )}
                    {selectedProduct.newProduct && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        🆕 Novo
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                      <h4 className="text-yellow-800 font-semibold mb-2">💡 Gatilho Emocional:</h4>
                      <p className="text-yellow-700">{selectedProduct.emotionalTrigger}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-gray-800 font-semibold mb-3">📋 Especificações:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marca:</span>
                        <span className="font-medium">{selectedProduct.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categoria:</span>
                        <span className="font-medium">{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origem:</span>
                        <span className="font-medium">{selectedProduct.origin}</span>
                      </div>
                      {selectedProduct.hairType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tipo de Cabelo:</span>
                          <span className="font-medium">{selectedProduct.hairType.join(', ')}</span>
                        </div>
                      )}
                      {selectedProduct.freeFrom && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Livre de:</span>
                          <span className="font-medium text-green-600">{selectedProduct.freeFrom.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <h4 className="text-blue-800 font-semibold mb-2">🎯 Por que este produto vende tanto:</h4>
                    <p className="text-blue-700 text-sm">{selectedProduct.whyItSells}</p>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">💰 Preços e Opções:</h4>
                    <div className="space-y-3">
                      {Object.entries(selectedProduct.prices).map(([size, price]) => (
                        <div key={size} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{size}</span>
                          <span className="text-xl font-bold text-yellow-600">€{price}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      * Frete calculado separadamente (€15-25 dependendo do peso)
                      <br />
                      * Prazo de entrega: 15-25 dias úteis
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 text-center text-green-700">
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                      <span>✅ Garantia de Qualidade Premium</span>
                      <span>🚚 Frete Grátis para pedidos €150+</span>
                      <span>🛡️ 100% Original</span>
                    </div>
                  </div>

                  <button
                    onClick={() => contactWhatsApp(selectedProduct)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg"
                  >
                    📱 Consulta Especializada via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

