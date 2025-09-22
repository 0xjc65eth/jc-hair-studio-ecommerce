'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  PlayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  testimonial: string;
  beforeImage: string;
  afterImage: string;
  videoUrl?: string;
  productUsed: string;
  applicationTime: string;
  professionalName: string;
  techniques: string[];
  results: string[];
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Marina Delacroix',
    location: 'Paris, França',
    date: '2024-01-20',
    rating: 5,
    title: 'Transformação Completa com Mega Hair Premium',
    testimonial: 'Simplesmente incrível! Sempre sonhei com cabelos longos e o resultado superou todas as expectativas. O mega hair da JC Hair Studio tem qualidade excepcional - sedoso, natural e com brilho fantástico. Já faz 8 meses e continua perfeito!',
    beforeImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Antes+-+Cabelo+Curto',
    afterImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Depois+-+Longo+Lindo',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    productUsed: 'Mega Hair Liso Loiro Platinado 613 - 55cm',
    applicationTime: '3h30min',
    professionalName: 'Sylvie Dubois',
    techniques: ['Costura Francesa', 'Colorimetria Avançada'],
    results: ['Volume +150%', 'Comprimento +35cm', 'Brilho Natural']
  },
  {
    id: '2',
    clientName: 'Sofia Rodriguez',
    location: 'Barcelona, Espanha',
    date: '2024-01-15',
    rating: 5,
    title: 'Volume e Naturalidade Perfeitos',
    testimonial: 'Como cabeleireira, sou muito exigente com qualidade. Este mega hair é fantástico - textura natural, cores vibrantes e resistência incrível. Minhas clientes ficam apaixonadas pelo resultado!',
    beforeImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Antes+-+Fino',
    afterImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Depois+-+Volumoso',
    productUsed: 'Mega Hair Ondulado Castanho Natural - 45cm',
    applicationTime: '2h45min',
    professionalName: 'Carlos Mendez',
    techniques: ['Nano Links', 'Corte Dégradé'],
    results: ['Volume Natural', 'Movimento Perfeito', 'Zero Embaraço']
  },
  {
    id: '3',
    clientName: 'Emma Thompson',
    location: 'Londres, Reino Unido',
    date: '2024-01-10',
    rating: 5,
    title: 'Qualidade Europeia Excepcional',
    testimonial: 'Testei várias marcas e esta é incomparável. A origem europeia faz toda diferença - cabelo resistente, cor duradoura e facilidade de manutenção. Investimento que vale cada euro!',
    beforeImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Antes+-+Básico',
    afterImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Depois+-+Elegante',
    productUsed: 'Mega Hair Cacheado Natural - 40cm',
    applicationTime: '4h00min',
    professionalName: 'James Wilson',
    techniques: ['Aplicação Específica Cachos', 'Finalização Profissional'],
    results: ['Cachos Definidos', 'Zero Frizz', 'Formato Natural']
  },
  {
    id: '4',
    clientName: 'Lucia Bianchi',
    location: 'Milão, Itália',
    date: '2024-01-05',
    rating: 5,
    title: 'Rapunzel Collection - Sonho Realizado',
    testimonial: 'A Coleção Rapunzel é um luxo! 90cm de puro glamour. A qualidade Master Class é visível em cada detalhe. Recebo elogios diariamente e me sinto uma princesa. Produto exclusivo e incomparável!',
    beforeImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Antes+-+Médio',
    afterImage: 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=Depois+-+Rapunzel',
    productUsed: 'Mega Hair Rapunzel Collection - 90cm',
    applicationTime: '5h30min',
    professionalName: 'Giuseppe Romano',
    techniques: ['Aplicação Master Class', 'Estruturação Especial'],
    results: ['Comprimento Extremo', 'Leveza Surpreendente', 'Impacto Visual']
  }
];

export default function TestimonialsBeforeAfter() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<'before' | 'after' | null>(null);

  const currentTestimonial = testimonials[currentIndex];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <div key={star}>
            {star <= rating ? (
              <StarIconSolid className="w-5 h-5 text-yellow-400" />
            ) : (
              <StarIcon className="w-5 h-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
      <div className="text-center mb-8">
        <HeartIcon className="w-12 h-12 text-rose-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Transformações Reais de Clientes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Veja os resultados incríveis das nossas clientes em toda Europa.
          Cada transformação conta uma história de autoestima e confiança renovadas.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Before/After Images */}
            <div className="relative">
              <div className="grid grid-cols-2 h-full">
                {/* Before */}
                <div className="relative group cursor-pointer" onClick={() => setSelectedImage('before')}>
                  <Image
                    src={currentTestimonial.beforeImage}
                    alt="Antes"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-semibold">
                      ANTES
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 p-3 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="relative group cursor-pointer" onClick={() => setSelectedImage('after')}>
                  <Image
                    src={currentTestimonial.afterImage}
                    alt="Depois"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 right-4 text-white">
                    <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                      DEPOIS
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 p-3 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Play Button */}
              {currentTestimonial.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute top-4 left-4 bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-full shadow-lg transition-all z-10"
                >
                  <PlayIcon className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Testimonial Content */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                {/* Client Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {currentTestimonial.clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {currentTestimonial.clientName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{currentTestimonial.location}</span>
                      <span>•</span>
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{formatDate(currentTestimonial.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(currentTestimonial.rating)}
                  <span className="text-sm text-gray-600">
                    ({currentTestimonial.rating}.0)
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {currentTestimonial.title}
                </h4>

                {/* Testimonial */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  "{currentTestimonial.testimonial}"
                </p>

                {/* Product Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Produto usado:</span>
                    <span className="font-medium text-gray-900">
                      {currentTestimonial.productUsed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tempo de aplicação:</span>
                    <span className="font-medium text-gray-900">
                      {currentTestimonial.applicationTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profissional:</span>
                    <span className="font-medium text-gray-900">
                      {currentTestimonial.professionalName}
                    </span>
                  </div>
                </div>

                {/* Techniques */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Técnicas Utilizadas:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentTestimonial.techniques.map((technique, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Resultados Alcançados:</h5>
                  <div className="flex flex-wrap gap-2">
                    {currentTestimonial.results.map((result, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                      >
                        ✓ {result}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-rose-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-rose-600 mb-1">98%</div>
            <div className="text-sm text-gray-600">Satisfação</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">2.5k+</div>
            <div className="text-sm text-gray-600">Transformações</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">4.9★</div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">15+</div>
            <div className="text-sm text-gray-600">Países</div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-2xl max-h-full">
              <Image
                src={selectedImage === 'before' ? currentTestimonial.beforeImage : currentTestimonial.afterImage}
                alt={selectedImage === 'before' ? 'Antes' : 'Depois'}
                width={600}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-white font-semibold ${
                  selectedImage === 'before' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {selectedImage === 'before' ? 'ANTES' : 'DEPOIS'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}