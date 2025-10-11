import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    'pt': 'Maquiagem Brasileira Premium | JC Hair Studio\'s 62',
    'pt-PT': 'Maquiagem Brasileira Premium | JC Hair Studio\'s 62',
    'en': 'Premium Brazilian Makeup | JC Hair Studio\'s 62',
    'es': 'Maquillaje Brasileño Premium | JC Hair Studio\'s 62',
    'fr': 'Maquillage Brésilien Premium | JC Hair Studio\'s 62',
  };

  const descriptions: Record<string, string> = {
    'pt': 'Maquiagem brasileira original: Natura, Eudora, Avon, Ruby Rose, Mari Maria. Entrega Europa.',
    'pt-PT': 'Maquiagem brasileira original: Natura, Eudora, Avon, Ruby Rose, Mari Maria. Entrega Europa.',
    'en': 'Original Brazilian makeup: Natura, Eudora, Avon, Ruby Rose, Mari Maria. Delivery across Europe.',
    'es': 'Maquillaje brasileño original: Natura, Eudora, Avon, Ruby Rose, Mari Maria. Entrega en Europa.',
    'fr': 'Maquillage brésilien original: Natura, Eudora, Avon, Ruby Rose, Mari Maria. Livraison en Europe.',
  };

  return {
    title: titles[locale] || titles['pt'],
    description: descriptions[locale] || descriptions['pt'],
    alternates: {
      canonical: `https://jchairstudios62.xyz/${locale}/maquiagens`,
      languages: {
        'pt-PT': 'https://jchairstudios62.xyz/pt-PT/maquiagens',
        'en': 'https://jchairstudios62.xyz/en/makeup',
        'es': 'https://jchairstudios62.xyz/es/maquillaje',
        'fr': 'https://jchairstudios62.xyz/fr/maquillage',
      },
    },
  };
}

export default function LocaleMaquiagensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
