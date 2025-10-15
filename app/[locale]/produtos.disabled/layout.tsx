import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    'pt': 'Produtos Capilares Brasileiros | JC Hair Studio\'s 62',
    'pt-PT': 'Produtos Capilares Brasileiros | JC Hair Studio\'s 62',
    'en': 'Brazilian Hair Products | JC Hair Studio\'s 62',
    'es': 'Productos Capilares Brasileños | JC Hair Studio\'s 62',
    'fr': 'Produits Capillaires Brésiliens | JC Hair Studio\'s 62',
  };

  const descriptions: Record<string, string> = {
    'pt': 'Progressivas Vogue, BTX capilar e tratamentos brasileiros premium. Entrega Europa.',
    'pt-PT': 'Progressivas Vogue, BTX capilar e tratamentos brasileiros premium. Entrega Europa.',
    'en': 'Vogue progressives, capillary BTX and premium Brazilian treatments. Europe delivery.',
    'es': 'Progresivas Vogue, BTX capilar y tratamientos brasileños premium. Entrega en Europa.',
    'fr': 'Progressives Vogue, BTX capillaire et traitements brésiliens premium. Livraison Europe.',
  };

  return {
    title: titles[locale] || titles['pt'],
    description: descriptions[locale] || descriptions['pt'],
    alternates: {
      canonical: `https://jchairstudios62.xyz/${locale}/produtos`,
      languages: {
        'pt-PT': 'https://jchairstudios62.xyz/pt-PT/produtos',
        'en': 'https://jchairstudios62.xyz/en/products',
        'es': 'https://jchairstudios62.xyz/es/productos',
        'fr': 'https://jchairstudios62.xyz/fr/produits',
      },
    },
  };
}

export default function LocaleProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
