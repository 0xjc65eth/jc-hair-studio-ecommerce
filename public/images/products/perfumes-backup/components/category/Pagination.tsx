'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage,
  className = '' 
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Gerar números das páginas a serem exibidas
  const getPageNumbers = () => {
    const delta = 2; // Número de páginas para mostrar antes e depois da atual
    const range = [];
    const rangeWithDots = [];

    // Calcular o início e fim do range
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // Adicionar páginas no range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Adicionar primeira página e reticências se necessário
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push('...');
      }
    }

    // Adicionar páginas do range
    rangeWithDots.push(...range);

    // Adicionar reticências e última página se necessário
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Informações dos itens */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{' '}
        <span className="font-medium text-gray-900">{endItem}</span> de{' '}
        <span className="font-medium text-gray-900">{totalItems}</span> produtos
      </div>

      {/* Navegação */}
      <div className="flex items-center space-x-1">
        {/* Botão Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
            transition-colors duration-200
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">Anterior</span>
        </button>

        {/* Números das páginas */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`
                  relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                  transition-colors duration-200
                  ${isCurrentPage
                    ? 'bg-black text-white border border-black'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                aria-label={`Página ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
            transition-colors duration-200
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          aria-label="Próxima página"
        >
          <span className="mr-1 hidden sm:inline">Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Componente adicional para seleção de itens por página
interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  options?: number[];
  className?: string;
}

export function ItemsPerPageSelector({ 
  itemsPerPage, 
  onItemsPerPageChange, 
  options = [12, 24, 36, 48],
  className = ''
}: ItemsPerPageSelectorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="items-per-page" className="text-sm text-gray-600">
        Produtos por página:
      </label>
      <select
        id="items-per-page"
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// Hook para gerenciar estado da paginação
export function usePagination(totalItems: number, initialItemsPerPage: number = 12) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset para primeira página quando mudar itens por página
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Reset para primeira página se a página atual for maior que o total
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll suave para o topo da lista de produtos
      const productList = document.getElementById('product-list');
      if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  // Calcular índices para slice do array
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handleItemsPerPageChange
  };
}