'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  /**
   * URL de fallback caso o histórico esteja vazio
   */
  fallbackUrl?: string

  /**
   * Texto do botão (padrão: "Voltar")
   */
  label?: string

  /**
   * Variante visual do botão
   */
  variant?: 'default' | 'ghost' | 'outline'

  /**
   * Mostrar ícone de seta (padrão: true)
   */
  showIcon?: boolean

  /**
   * Classes CSS adicionais
   */
  className?: string

  /**
   * Callback executado antes da navegação
   */
  onBeforeNavigate?: () => void
}

export function BackButton({
  fallbackUrl = '/produtos',
  label = 'Voltar',
  variant = 'ghost',
  showIcon = true,
  className,
  onBeforeNavigate,
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onBeforeNavigate) {
      onBeforeNavigate()
    }

    // Tenta usar o histórico do navegador primeiro
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      // Fallback para URL específica se não houver histórico
      router.push(fallbackUrl)
    }
  }

  const baseClasses = 'inline-flex items-center gap-2 font-medium transition-all duration-200'

  const variantClasses = {
    default: 'text-amber-600 hover:text-amber-700',
    ghost: 'text-gray-600 hover:text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg',
    outline: 'text-gray-700 hover:text-amber-600 border border-gray-300 hover:border-amber-600 px-4 py-2 rounded-lg',
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      aria-label={label}
    >
      {showIcon && <ArrowLeft className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  )
}

/**
 * BackButton com URL de categoria específica
 * Detecta automaticamente para qual categoria voltar baseado no tipo de produto
 */
interface CategoryBackButtonProps extends Omit<BackButtonProps, 'fallbackUrl'> {
  /**
   * Categoria do produto para determinar URL de retorno
   */
  productCategory?: string

  /**
   * Locale para URLs localizadas (pt, en, es, fr)
   */
  locale?: string
}

export function CategoryBackButton({
  productCategory,
  locale,
  label,
  ...props
}: CategoryBackButtonProps) {
  // Mapeia categoria do produto para URL da categoria
  const getCategoryUrl = (category: string | undefined): string => {
    if (!category) return '/produtos'

    const categoryLower = category.toLowerCase()
    const localePrefix = locale ? `/${locale}` : ''

    // Mapeamento de categorias para URLs
    const categoryMap: Record<string, string> = {
      'maquiagem': `${localePrefix}/maquiagens`,
      'makeup': `${localePrefix}/maquiagens`,
      'cosméticos': `${localePrefix}/cosmeticos`,
      'cosmeticos': `${localePrefix}/cosmeticos`,
      'cosmetics': `${localePrefix}/cosmeticos`,
      'esmaltes': `${localePrefix}/cosmeticos`,
      'perfumes': `${localePrefix}/cosmeticos`,
      'mega hair': `${localePrefix}/mega-hair`,
      'mega-hair': `${localePrefix}/mega-hair`,
      'hair extensions': `${localePrefix}/mega-hair`,
      'extensões': `${localePrefix}/mega-hair`,
      'tratamentos': `${localePrefix}/produtos/tratamentos-capilares`,
      'tratamentos capilares': `${localePrefix}/produtos/tratamentos-capilares`,
      'hair treatments': `${localePrefix}/produtos/tratamentos-capilares`,
      'shampoos': `${localePrefix}/produtos/shampoos-condicionadores`,
      'condicionadores': `${localePrefix}/produtos/shampoos-condicionadores`,
      'shampoo': `${localePrefix}/produtos/shampoos-condicionadores`,
      'progressivas': '/produtos/progressivas-alisamentos',
      'alisamentos': '/produtos/progressivas-alisamentos',
      'relaxamentos': '/produtos/progressivas-alisamentos',
      'ferramentas': `${localePrefix}/produtos/ferramentas-profissionais`,
      'tools': `${localePrefix}/produtos/ferramentas-profissionais`,
    }

    // Procura correspondência exata
    if (categoryMap[categoryLower]) {
      return categoryMap[categoryLower]
    }

    // Procura correspondência parcial
    for (const [key, url] of Object.entries(categoryMap)) {
      if (categoryLower.includes(key) || key.includes(categoryLower)) {
        return url
      }
    }

    // Fallback para /produtos
    return `${localePrefix}/produtos`
  }

  const fallbackUrl = getCategoryUrl(productCategory)

  // Customiza o label baseado na categoria
  const customLabel = label || (
    productCategory
      ? `Voltar para ${productCategory}`
      : 'Voltar'
  )

  return (
    <BackButton
      fallbackUrl={fallbackUrl}
      label={customLabel}
      {...props}
    />
  )
}
