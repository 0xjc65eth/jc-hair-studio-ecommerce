import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maquiagem Brasileira Premium | JC Hair Studio\'s 62',
  description: 'Maquiagem brasileira original das melhores marcas: Natura, Eudora, Avon, Ruby Rose, Mari Maria. Cosméticos premium do Brasil com entrega em toda Europa.',
  keywords: [
    'maquiagem brasileira europa',
    'natura portugal',
    'eudora bélgica',
    'ruby rose europa',
    'cosméticos brasil',
    'mari maria makeup',
    'maquiagem brasileira portugal',
    'cosméticos brasileiros europa'
  ],
  openGraph: {
    title: 'Maquiagem Brasileira Premium | JC Hair Studio\'s 62',
    description: 'Maquiagem brasileira original: Natura, Eudora, Avon, Ruby Rose. Entrega Europa.',
    url: 'https://jchairstudios62.xyz/maquiagens',
    images: [
      {
        url: '/images/maquiagem-brasileira.jpg',
        width: 1200,
        height: 630,
        alt: 'Maquiagem Brasileira Premium',
      },
    ],
  },
  alternates: {
    canonical: 'https://jchairstudios62.xyz/maquiagens',
    languages: {
      'pt-PT': 'https://jchairstudios62.xyz/maquiagens',
      'en': 'https://jchairstudios62.xyz/en/makeup',
      'es': 'https://jchairstudios62.xyz/es/maquillaje',
      'fr': 'https://jchairstudios62.xyz/fr/maquillage',
    },
  },
};

export default function MaquiagensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
