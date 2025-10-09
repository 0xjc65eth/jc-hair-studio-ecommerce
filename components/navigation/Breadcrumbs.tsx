'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`bg-gray-50 border-b border-gray-200 py-4 ${className}`} aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4">
        <ol
          className="flex items-center space-x-2 text-sm"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href="/"
              className="flex items-center text-gray-500 hover:text-amber-600 transition-colors font-medium"
              itemProp="item"
              title="Voltar à página inicial"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              <span itemProp="name">Início</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>

          {items.map((item, index) => {
            const position = index + 2;
            const isLast = index === items.length - 1;

            return (
              <li
                key={index}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-amber-600 transition-colors font-medium"
                    itemProp="item"
                    title={`Ver ${item.label}`}
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className="text-gray-900 font-semibold"
                    itemProp="name"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
                <meta itemProp="position" content={position.toString()} />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

// Utility functions to generate breadcrumbs

export function createCategoryBreadcrumbs(categorySlug: string, categoryName?: string): BreadcrumbItem[] {
  return [
    { label: 'Produtos', href: '/produtos' },
    {
      label: categoryName || formatSlugToName(categorySlug),
      href: `/categoria/${categorySlug}`
    }
  ];
}

export function createProductBreadcrumbs(
  productName: string,
  categorySlug?: string,
  categoryName?: string
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Produtos', href: '/produtos' }
  ];

  if (categorySlug) {
    breadcrumbs.push({
      label: categoryName || formatSlugToName(categorySlug),
      href: `/categoria/${categorySlug}`
    });
  }

  breadcrumbs.push({
    label: productName
  });

  return breadcrumbs;
}

function formatSlugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
