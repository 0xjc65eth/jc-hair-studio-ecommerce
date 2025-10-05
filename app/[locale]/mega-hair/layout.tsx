import React from 'react';
import { Metadata } from 'next';
import { generateCategoryMeta } from '@/lib/utils/metaTags';
import { generateUnifiedCatalog } from '@/lib/data/megaHairProducts';

export async function generateMetadata(): Promise<Metadata> {
  const products = generateUnifiedCatalog();

  return generateCategoryMeta('mega-hair', products.map(product => ({
    id: product.id,
    name: product.name,
    brand: product.collection,
    price: product.price,
    preco_eur: product.price,
    category: 'mega-hair'
  })));
}

interface MegaHairLayoutProps {
  children: React.ReactNode;
}

export default function MegaHairLayout({ children }: MegaHairLayoutProps) {
  return (
    <div className="mega-hair-section">
      {children}
    </div>
  );
}