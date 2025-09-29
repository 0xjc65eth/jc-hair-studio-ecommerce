'use client';

import React, { useState } from 'react';
import { Package, Sparkles, Droplet, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  products: any[];
}

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string;
  activeSubcategory?: string;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange?: (subcategoryId: string) => void;
  showSubcategories?: boolean;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  activeCategory,
  activeSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  showSubcategories = false
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'progressivas':
        return <Sparkles className="w-5 h-5" />;
      case 'produtos-capilares':
        return <Droplet className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (categoryId: string, isActive: boolean) => {
    const baseColors = {
      'progressivas': isActive ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'produtos-capilares': isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    };
    return baseColors[categoryId as keyof typeof baseColors] || 'bg-gray-100 text-gray-700';
  };

  const getTotalProductCount = (category: Category) => {
    return category.subcategories.reduce((total, sub) => total + sub.products.length, 0);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId && showSubcategories) {
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    } else {
      onCategoryChange(categoryId);
      if (showSubcategories) {
        setExpandedCategory(categoryId);
      }
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const isExpanded = expandedCategory === category.id;

            return (
              <div key={category.id} className="relative">
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    w-full flex flex-col items-center p-6 rounded-xl transition-all duration-300 transform
                    ${getCategoryColor(category.id, isActive)}
                    ${isActive ? 'shadow-lg scale-105 ring-2 ring-offset-2 ring-current' : 'shadow-md hover:shadow-lg hover:scale-102'}
                  `}
                >
                  {/* Icon */}
                  <div className="flex items-center gap-3 mb-3">
                    {getCategoryIcon(category.id)}
                    <span className="text-xl font-bold">{category.name}</span>
                    {showSubcategories && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-center opacity-90 mb-2">
                    {category.description}
                  </p>

                  {/* Product Count */}
                  <span className="text-xs font-medium px-3 py-1 bg-white/20 rounded-full">
                    {getTotalProductCount(category)} produtos
                  </span>
                </button>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2
                                  w-0 h-0 border-l-8 border-l-transparent
                                  border-r-8 border-r-transparent
                                  border-t-8 border-t-current opacity-80">
                  </div>
                )}

                {/* Subcategories Dropdown */}
                {showSubcategories && isExpanded && (
                  <div className="absolute top-full left-0 right-0 mt-8 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Subcategorias de {category.name}
                      </h4>
                      <div className="space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => {
                              onSubcategoryChange?.(subcategory.id);
                              setExpandedCategory(null);
                            }}
                            className={`
                              w-full text-left p-3 rounded-lg transition-colors
                              ${activeSubcategory === subcategory.id
                                ? 'bg-gray-100 text-gray-900 font-medium'
                                : 'hover:bg-gray-50 text-gray-700'
                              }
                            `}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{subcategory.name}</span>
                                <p className="text-sm text-gray-500 mt-1">
                                  {subcategory.description}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {subcategory.products.length}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Breadcrumb */}
        {activeCategory && (
          <div className="pb-4">
            <div className="flex items-center text-sm text-gray-600">
              <span>Você está em:</span>
              <span className="mx-2">›</span>
              <span className="font-medium text-gray-900">
                {categories.find(c => c.id === activeCategory)?.name}
              </span>
              {activeSubcategory && (
                <>
                  <span className="mx-2">›</span>
                  <span className="font-medium text-gray-900">
                    {categories
                      .find(c => c.id === activeCategory)
                      ?.subcategories.find(s => s.id === activeSubcategory)
                      ?.name
                    }
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CategoryNavigation;