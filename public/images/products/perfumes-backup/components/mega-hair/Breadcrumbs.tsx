'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link
              href="/"
              className="flex items-center text-gray-500 hover:text-rose-600 transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              <span>Início</span>
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-400 mx-2" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-rose-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}