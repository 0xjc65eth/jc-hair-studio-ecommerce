import { Search, SlidersHorizontal } from 'lucide-react';

/**
 * Props para opção de select
 */
interface SelectOption {
  value: string;
  label: string;
}

/**
 * Props do FilterBar
 */
interface FilterBarProps {
  /**
   * Filtros disponíveis
   */
  filters: {
    /**
     * Opções de status
     */
    statusOptions?: SelectOption[];
    /**
     * Valor do filtro de status
     */
    statusValue?: string;
    /**
     * Callback ao mudar status
     */
    onStatusChange?: (value: string) => void;

    /**
     * Valor de busca/pesquisa
     */
    searchValue?: string;
    /**
     * Placeholder para campo de busca
     */
    searchPlaceholder?: string;
    /**
     * Callback ao mudar busca
     */
    onSearchChange?: (value: string) => void;

    /**
     * Opções de ordenação
     */
    sortOptions?: SelectOption[];
    /**
     * Valor de ordenação
     */
    sortValue?: string;
    /**
     * Callback ao mudar ordenação
     */
    onSortChange?: (value: string) => void;

    /**
     * Opções de ordem (asc/desc)
     */
    orderOptions?: SelectOption[];
    /**
     * Valor de ordem
     */
    orderValue?: string;
    /**
     * Callback ao mudar ordem
     */
    onOrderChange?: (value: string) => void;
  };

  /**
   * Callback para resetar filtros
   */
  onReset?: () => void;

  /**
   * Se deve mostrar botão de resetar
   */
  showReset?: boolean;
}

/**
 * FilterBar Component
 *
 * Barra de filtros reutilizável para tabelas e listagens.
 * Suporta múltiplos tipos de filtros: status, busca, ordenação, etc.
 *
 * Features:
 * - Filtro por status (dropdown)
 * - Busca por texto
 * - Ordenação personalizável
 * - Ordem (crescente/decrescente)
 * - Botão de reset
 * - Layout responsivo (grid adaptativo)
 *
 * @component
 *
 * @example
 * <FilterBar
 *   filters={{
 *     statusOptions: [
 *       { value: 'all', label: 'Todos' },
 *       { value: 'pending', label: 'Pendente' }
 *     ],
 *     statusValue: filters.status,
 *     onStatusChange: (value) => updateFilter('status', value),
 *     searchValue: filters.customer,
 *     searchPlaceholder: "Buscar cliente...",
 *     onSearchChange: (value) => updateFilter('customer', value)
 *   }}
 *   onReset={resetFilters}
 *   showReset={true}
 * />
 */
export function FilterBar({
  filters,
  onReset,
  showReset = false,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro de Status */}
        {filters.statusOptions && filters.onStatusChange && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              value={filters.statusValue || 'all'}
              onChange={(e) => filters.onStatusChange?.(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {filters.statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Campo de Busca */}
        {filters.onSearchChange && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={filters.searchPlaceholder || 'Buscar...'}
                value={filters.searchValue || ''}
                onChange={(e) => filters.onSearchChange?.(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Filtro de Ordenação */}
        {filters.sortOptions && filters.onSortChange && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Ordenar por
            </label>
            <select
              value={filters.sortValue || 'date'}
              onChange={(e) => filters.onSortChange?.(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {filters.sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtro de Ordem */}
        {filters.orderOptions && filters.onOrderChange && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Ordem
            </label>
            <select
              value={filters.orderValue || 'desc'}
              onChange={(e) => filters.onOrderChange?.(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {filters.orderOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Botão de Reset */}
      {showReset && onReset && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}
