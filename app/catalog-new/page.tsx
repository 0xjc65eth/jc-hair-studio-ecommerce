import JCHairStudioCatalog from '@/components/catalog/JCHairStudioCatalog';

export const metadata = {
  title: 'Catálogo Completo - JC Hair Studio | Cosméticos Premium Europeus',
  description: 'Descubra nossa coleção completa de cosméticos, progressivas e produtos capilares. Esmaltes, tintas de cabelo, tratamentos profissionais e muito mais com preços em euros.',
  keywords: 'cosméticos, esmaltes, tintas de cabelo, progressivas, produtos capilares, JC Hair Studio, europa, preços euros',
  openGraph: {
    title: 'JC Hair Studio - Catálogo Completo',
    description: 'Cosméticos premium brasileiros na Europa. Esmaltes, tintas, progressivas e tratamentos capilares.',
    images: ['/og-catalog.jpg'],
  },
};

/**
 * New Catalog Page with Reorganized Product Structure
 *
 * Features:
 * - 3 Main Categories: Cosméticos, Progressivas, Produtos Capilares
 * - Proper EUR pricing (BRL * 0.158 * 1.5)
 * - Image carousel for products with multiple images
 * - Advanced filtering and search
 * - Responsive design
 * - Brand identification for progressives (no more "diversas")
 */
export default function NewCatalogPage() {
  return (
    <div className="min-h-screen">
      <JCHairStudioCatalog />
    </div>
  );
}