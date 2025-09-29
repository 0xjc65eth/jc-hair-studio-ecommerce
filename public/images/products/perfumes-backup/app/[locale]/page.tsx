import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import FeaturedProducts from '../../components/products/FeaturedProducts';
import VideoHeroCarousel from '../../components/home/VideoHeroCarousel';
import BrazilianElegantHomepage from '../../components/home/BrazilianElegantHomepage';

export const metadata: Metadata = {
  title: '62 Beauty\'s 62 - Extensões de Cabelo Premium',
  description: 'Loja online especializada em extensões de cabelo de alta qualidade, mega hair, progressivas e produtos capilares profissionais.',
  openGraph: {
    title: '62 Beauty\'s 62 - Extensões de Cabelo Premium',
    description: 'Extensões de cabelo de alta qualidade, mega hair e produtos capilares profissionais.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: '62 Beauty\'s 62 - Extensões de Cabelo Premium'
    }],
    type: 'website'
  }
};

export default function HomePage() {
  return <BrazilianElegantHomepage />;
}