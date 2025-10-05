/**
 * Utilities para navegação e mapeamento de categorias
 */

export interface Product {
  id: string
  category?: string
  type?: string
  [key: string]: any
}

export interface CategoryMapping {
  patterns: string[]
  url: string
  localizable: boolean
}

/**
 * Mapeamento completo de categorias para URLs
 */
export const CATEGORY_MAPPINGS: Record<string, CategoryMapping> = {
  maquiagem: {
    patterns: ['maquiagem', 'makeup', 'maquillaje', 'maquillage'],
    url: '/maquiagens',
    localizable: true,
  },
  cosmeticos: {
    patterns: [
      'cosméticos',
      'cosmeticos',
      'cosmetics',
      'esmaltes',
      'perfumes',
      'nail polish',
      'parfum',
    ],
    url: '/cosmeticos',
    localizable: true,
  },
  megaHair: {
    patterns: [
      'mega hair',
      'mega-hair',
      'megahair',
      'hair extensions',
      'extensões',
      'extensiones',
      'extensions',
      'hair',
    ],
    url: '/mega-hair',
    localizable: true,
  },
  tratamentos: {
    patterns: [
      'tratamentos',
      'tratamentos capilares',
      'hair treatments',
      'tratamientos',
      'traitements',
      'hidratação',
      'reconstrução',
      'nutrição',
      'botox',
      'máscara',
    ],
    url: '/produtos/tratamentos-capilares',
    localizable: true,
  },
  shampoos: {
    patterns: [
      'shampoo',
      'shampoos',
      'condicionador',
      'condicionadores',
      'conditioner',
      'champu',
      'co-wash',
    ],
    url: '/produtos/shampoos-condicionadores',
    localizable: true,
  },
  progressivas: {
    patterns: [
      'progressiva',
      'progressivas',
      'alisamento',
      'alisamentos',
      'relaxamento',
      'relaxamentos',
      'smoothing',
      'straightening',
      'lissage',
    ],
    url: '/produtos/progressivas-alisamentos',
    localizable: false, // Esta URL não usa locale prefix
  },
  ferramentas: {
    patterns: [
      'ferramentas',
      'ferramentas profissionais',
      'tools',
      'professional tools',
      'herramientas',
      'outils',
      'chapinha',
      'secador',
    ],
    url: '/produtos/ferramentas-profissionais',
    localizable: true,
  },
}

/**
 * Obtém a URL da categoria baseado no produto
 * @param product - Produto para determinar a categoria
 * @param locale - Locale para URLs localizadas (pt, en, es, fr)
 * @returns URL da categoria ou '/produtos' como fallback
 */
export function getCategoryUrlFromProduct(
  product: Product | null | undefined,
  locale?: string
): string {
  if (!product) {
    return locale ? `/${locale}/produtos` : '/produtos'
  }

  const categoryText = (product.category || product.type || '').toLowerCase()

  // Tenta encontrar correspondência no mapeamento
  for (const [, mapping] of Object.entries(CATEGORY_MAPPINGS)) {
    for (const pattern of mapping.patterns) {
      if (categoryText.includes(pattern) || pattern.includes(categoryText)) {
        const baseUrl = mapping.url

        // Adiciona locale apenas se a URL suportar localização
        if (mapping.localizable && locale) {
          return `/${locale}${baseUrl}`
        }

        return baseUrl
      }
    }
  }

  // Fallback para página geral de produtos
  return locale ? `/${locale}/produtos` : '/produtos'
}

/**
 * Obtém label de navegação amigável baseado na categoria
 * @param product - Produto para determinar a categoria
 * @param locale - Locale para tradução
 * @returns Label amigável como "Voltar para Maquiagem"
 */
export function getBackButtonLabel(
  product: Product | null | undefined,
  locale: string = 'pt'
): string {
  if (!product || !product.category) {
    const labels = {
      pt: 'Voltar para Produtos',
      en: 'Back to Products',
      es: 'Volver a Productos',
      fr: 'Retour aux Produits',
    }
    return labels[locale as keyof typeof labels] || labels.pt
  }

  const category = product.category

  // Tradução de categorias por locale
  const categoryTranslations: Record<string, Record<string, string>> = {
    pt: {
      maquiagem: 'Maquiagem',
      cosmeticos: 'Cosméticos',
      'mega-hair': 'Mega Hair',
      tratamentos: 'Tratamentos',
      shampoos: 'Shampoos',
      progressivas: 'Progressivas',
      ferramentas: 'Ferramentas',
    },
    en: {
      maquiagem: 'Makeup',
      cosmeticos: 'Cosmetics',
      'mega-hair': 'Hair Extensions',
      tratamentos: 'Treatments',
      shampoos: 'Shampoos',
      progressivas: 'Smoothing',
      ferramentas: 'Tools',
    },
    es: {
      maquiagem: 'Maquillaje',
      cosmeticos: 'Cosméticos',
      'mega-hair': 'Extensiones',
      tratamentos: 'Tratamientos',
      shampoos: 'Champús',
      progressivas: 'Alisado',
      ferramentas: 'Herramientas',
    },
    fr: {
      maquiagem: 'Maquillage',
      cosmeticos: 'Cosmétiques',
      'mega-hair': 'Extensions',
      tratamentos: 'Traitements',
      shampoos: 'Shampooings',
      progressivas: 'Lissage',
      ferramentas: 'Outils',
    },
  }

  const categoryKey = category.toLowerCase().replace(/\s+/g, '-')
  const translations = categoryTranslations[locale] || categoryTranslations.pt
  const categoryName = translations[categoryKey] || category

  const backPhrases = {
    pt: 'Voltar para',
    en: 'Back to',
    es: 'Volver a',
    fr: 'Retour à',
  }

  const backPhrase = backPhrases[locale as keyof typeof backPhrases] || backPhrases.pt

  return `${backPhrase} ${categoryName}`
}

/**
 * Determina se deve usar router.back() ou URL específica
 * @param hasHistory - Se o navegador tem histórico disponível
 * @param referrer - URL de referência (se disponível)
 * @returns true se deve usar router.back(), false se deve usar URL específica
 */
export function shouldUseHistoryBack(
  hasHistory: boolean = true,
  referrer?: string
): boolean {
  // Se não há histórico, não pode usar back()
  if (!hasHistory) return false

  // Se há referrer e é do mesmo domínio, pode usar back()
  if (referrer) {
    try {
      const referrerUrl = new URL(referrer)
      const currentHost = typeof window !== 'undefined' ? window.location.host : ''

      return referrerUrl.host === currentHost
    } catch {
      return false
    }
  }

  // Por padrão, prefere usar back() se há histórico
  return true
}

/**
 * Extrai locale da URL atual
 * @param pathname - Pathname atual da URL
 * @returns Locale extraído ou undefined
 */
export function getLocaleFromPath(pathname: string): string | undefined {
  const localeRegex = /^\/(pt|en|es|fr)\//
  const match = pathname.match(localeRegex)
  return match ? match[1] : undefined
}

/**
 * Constrói breadcrumb items baseado no produto e categoria
 * @param product - Produto atual
 * @param locale - Locale para URLs localizadas
 * @returns Array de breadcrumb items
 */
export interface BreadcrumbItem {
  label: string
  href?: string
}

export function getBreadcrumbItems(
  product: Product | null | undefined,
  locale?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = []

  const homeLabel = {
    pt: 'Início',
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil',
  }[locale || 'pt'] || 'Início'

  const productsLabel = {
    pt: 'Produtos',
    en: 'Products',
    es: 'Productos',
    fr: 'Produits',
  }[locale || 'pt'] || 'Produtos'

  // Home
  items.push({
    label: homeLabel,
    href: locale ? `/${locale}` : '/',
  })

  // Produtos
  items.push({
    label: productsLabel,
    href: locale ? `/${locale}/produtos` : '/produtos',
  })

  // Categoria (se disponível)
  if (product?.category) {
    const categoryUrl = getCategoryUrlFromProduct(product, locale)
    items.push({
      label: product.category,
      href: categoryUrl,
    })
  }

  // Produto atual (sem link)
  if (product?.name) {
    items.push({
      label: product.name,
    })
  }

  return items
}

/**
 * Valida se uma URL é interna (mesmo domínio)
 * @param url - URL para validar
 * @returns true se é URL interna
 */
export function isInternalUrl(url: string): boolean {
  if (!url) return false

  // URLs relativas são sempre internas
  if (url.startsWith('/')) return true

  // Valida URLs absolutas
  try {
    const urlObj = new URL(url)
    const currentHost = typeof window !== 'undefined' ? window.location.host : ''
    return urlObj.host === currentHost
  } catch {
    return false
  }
}
