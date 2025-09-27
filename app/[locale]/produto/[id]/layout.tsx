import { Metadata } from 'next';
import { resolveProductById } from '@/lib/services/productResolver';
import { generateProductMeta } from '@/lib/utils/metaTags';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { id } = await params;

  // Get product data
  const product = resolveProductById(id);

  if (!product) {
    return {
      title: 'Produto não encontrado | JC Hair Studio\'s 62',
      description: 'Produto não encontrado. Explore nossa coleção completa de produtos brasileiros premium.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  // Generate optimized meta tags
  return generateProductMeta(product);
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
}