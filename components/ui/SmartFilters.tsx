'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, Search, Filter, SlidersHorizontal } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  count: number
  disabled?: boolean
}

interface FilterCategory {
  id: string
  name: string
  type: 'checkbox' | 'radio' | 'range' | 'color'
  options: FilterOption[]
  isExpanded?: boolean
}

interface SmartFiltersProps {
  categories: FilterCategory[]
  activeFilters: Record<string, string[]>
  onFilterChange: (categoryId: string, values: string[]) => void
  onClearAll: () => void
  totalResults: number
  isLoading?: boolean
}

interface PriceRange {
  min: number
  max: number
}

export default function SmartFilters({
  categories,
  activeFilters,
  onFilterChange,
  onClearAll,
  totalResults,
  isLoading = false
}: SmartFiltersProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 })

  // Calculate total active filters
  const totalActiveFilters = useMemo(() => {
    return Object.values(activeFilters).flat().length
  }, [activeFilters])

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories

    return categories.map(category => ({
      ...category,
      options: category.options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.options.length > 0)
  }, [categories, searchTerm])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleFilterToggle = (categoryId: string, value: string) => {
    const currentValues = activeFilters[categoryId] || []
    const category = categories.find(cat => cat.id === categoryId)

    if (category?.type === 'radio') {
      // Radio: only one selection
      onFilterChange(categoryId, currentValues.includes(value) ? [] : [value])
    } else {
      // Checkbox: multiple selections
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      onFilterChange(categoryId, newValues)
    }
  }

  const removeFilter = (categoryId: string, value: string) => {
    const currentValues = activeFilters[categoryId] || []
    const newValues = currentValues.filter(v => v !== value)
    onFilterChange(categoryId, newValues)
  }

  const ColorOption = ({ option, isSelected, onClick }: {
    option: FilterOption
    isSelected: boolean
    onClick: () => void
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative w-8 h-8 rounded-full border-2 ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'
      } ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ backgroundColor: option.value }}
      disabled={option.disabled}
      title={`${option.label} (${option.count})`}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
        </div>
      )}
    </motion.button>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
          {totalActiveFilters > 0 && (
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
              {totalActiveFilters}
            </span>
          )}
        </div>
        {totalActiveFilters > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full" />
              <span>Filtrando...</span>
            </div>
          ) : (
            `${totalResults} ${totalResults === 1 ? 'produto encontrado' : 'produtos encontrados'}`
          )}
        </span>
      </div>

      {/* Search filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar filtros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Active filters tags */}
      {totalActiveFilters > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Filtros ativos:</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([categoryId, values]) => {
              const category = categories.find(cat => cat.id === categoryId)
              return values.map(value => {
                const option = category?.options.find(opt => opt.value === value)
                return (
                  <motion.span
                    key={`${categoryId}-${value}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    {option?.label || value}
                    <button
                      onClick={() => removeFilter(categoryId, value)}
                      className="hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                )
              })
            })}
          </div>
        </div>
      )}

      {/* Filter categories */}
      <div className="space-y-4">
        {filteredCategories.map(category => {
          const isExpanded = expandedCategories.includes(category.id)
          const hasActiveFilters = (activeFilters[category.id] || []).length > 0

          return (
            <div key={category.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors ${
                  hasActiveFilters ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  {hasActiveFilters && (
                    <span className="bg-primary-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {(activeFilters[category.id] || []).length}
                    </span>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 py-3 bg-white border-t"
                  >
                    {category.type === 'color' ? (
                      <div className="grid grid-cols-6 gap-2">
                        {category.options.map(option => (
                          <ColorOption
                            key={option.value}
                            option={option}
                            isSelected={(activeFilters[category.id] || []).includes(option.value)}
                            onClick={() => handleFilterToggle(category.id, option.value)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {category.options.map(option => {
                          const isSelected = (activeFilters[category.id] || []).includes(option.value)
                          return (
                            <label
                              key={option.value}
                              className={`flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors ${
                                option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                              } ${isSelected ? 'bg-primary-50 text-primary-700' : ''}`}
                            >
                              <div className="flex items-center space-x-3">
                                <input
                                  type={category.type === 'radio' ? 'radio' : 'checkbox'}
                                  name={category.id}
                                  checked={isSelected}
                                  onChange={() => handleFilterToggle(category.id, option.value)}
                                  disabled={option.disabled}
                                  className="text-primary-600 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm">{option.label}</span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                option.count === 0 
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {option.count}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* No results */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <Filter className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum filtro encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}