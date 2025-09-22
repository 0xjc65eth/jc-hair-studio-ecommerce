'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  PhotoIcon,
  HandThumbUpIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  beforeAfter?: {
    before: string;
    after: string;
  };
  productUsageTime: string;
  wouldRecommend: boolean;
}

interface ReviewSystemProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Maria Silva',
    userAvatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    title: 'Transformação incrível!',
    comment: 'Produto excepcional! A qualidade é realmente premium, cabelo sedoso e natural. A aplicação foi super tranquila e o resultado ficou perfeito. Durou mais de 6 meses sem perder o brilho.',
    date: '2024-01-15',
    verified: true,
    helpful: 23,
    images: [
      'https://i.ibb.co/6c9qWqnq/613-1800x.webp',
      'https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp'
    ],
    beforeAfter: {
      before: 'https://via.placeholder.com/300x400/f3f4f6/9ca3af?text=Antes',
      after: 'https://via.placeholder.com/300x400/f3f4f6/9ca3af?text=Depois'
    },
    productUsageTime: '6 meses',
    wouldRecommend: true
  },
  {
    id: '2',
    userName: 'Ana Costa',
    userAvatar: 'https://i.pravatar.cc/150?img=2',
    rating: 5,
    title: 'Qualidade europeia excepcional',
    comment: 'Uso este mega hair há 4 meses e continua perfeito. A cor é exatamente como na foto, não desbotou nada. Recebi muitos elogios!',
    date: '2024-01-10',
    verified: true,
    helpful: 18,
    images: [
      'https://i.ibb.co/RG65nmty/Cabelo-3-0182f1c5-3a8d-4dbb-8703-d1057f162b16-1800x.webp'
    ],
    productUsageTime: '4 meses',
    wouldRecommend: true
  },
  {
    id: '3',
    userName: 'Carla Mendes',
    userAvatar: 'https://i.pravatar.cc/150?img=3',
    rating: 4,
    title: 'Ótimo custo-benefício',
    comment: 'Produto muito bom, a única observação é que precisa de cuidados especiais mas vale a pena. O comprimento é perfeito.',
    date: '2024-01-05',
    verified: false,
    helpful: 12,
    productUsageTime: '2 meses',
    wouldRecommend: true
  }
];

export default function ReviewSystem({ productId, averageRating, totalReviews }: ReviewSystemProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [filterByRating, setFilterByRating] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredReviews = mockReviews.filter(review =>
    filterByRating === 0 || review.rating === filterByRating
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return b.helpful - a.helpful;
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: mockReviews.filter(r => r.rating === rating).length,
    percentage: (mockReviews.filter(r => r.rating === rating).length / mockReviews.length) * 100
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && setSelectedRating(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <StarIconSolid className={`w-5 h-5 text-yellow-400`} />
            ) : (
              <StarIcon className={`w-5 h-5 text-gray-300`} />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-light text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.floor(averageRating))}
            </div>
            <div className="text-gray-600 mb-4">
              Baseado em {totalReviews} avaliações
            </div>
            <button
              onClick={() => setShowWriteReview(true)}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              Escrever Avaliação
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <StarIconSolid className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="recent">Mais Recentes</option>
            <option value="helpful">Mais Úteis</option>
            <option value="rating-high">Maior Avaliação</option>
            <option value="rating-low">Menor Avaliação</option>
          </select>

          <select
            value={filterByRating}
            onChange={(e) => setFilterByRating(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          >
            <option value={0}>Todas as Estrelas</option>
            <option value={5}>5 Estrelas</option>
            <option value={4}>4 Estrelas</option>
            <option value={3}>3 Estrelas</option>
            <option value={2}>2 Estrelas</option>
            <option value={1}>1 Estrela</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {sortedReviews.length} de {totalReviews} avaliações
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            {/* User Info */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                {review.userAvatar ? (
                  <Image
                    src={review.userAvatar}
                    alt={review.userName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
                {review.verified && (
                  <CheckBadgeIcon className="w-5 h-5 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Compra Verificada
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4" />
                    {formatDate(review.date)}
                  </div>
                  <span>•</span>
                  <span>Usando há {review.productUsageTime}</span>
                </div>
              </div>

              <div className="text-right">
                {renderStars(review.rating)}
                <div className="text-sm text-gray-600 mt-1">
                  {review.helpful} acharam útil
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {/* Before/After Images */}
            {review.beforeAfter && (
              <div className="mb-4">
                <h6 className="text-sm font-semibold text-gray-900 mb-2">Antes & Depois</h6>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="relative">
                    <Image
                      src={review.beforeAfter.before}
                      alt="Antes"
                      width={200}
                      height={250}
                      className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImageIndex(0)}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Antes
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src={review.beforeAfter.after}
                      alt="Depois"
                      width={200}
                      height={250}
                      className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImageIndex(1)}
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Depois
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="mb-4">
                <h6 className="text-sm font-semibold text-gray-900 mb-2">Fotos do Produto</h6>
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((image, imgIndex) => (
                    <Image
                      key={imgIndex}
                      src={image}
                      alt={`Foto ${imgIndex + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImageIndex(imgIndex)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors">
                  <HandThumbUpIcon className="w-4 h-4" />
                  <span className="text-sm">Útil ({review.helpful})</span>
                </button>
                {review.wouldRecommend && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Recomenda o produto
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowWriteReview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold mb-6">Escrever Avaliação</h3>

              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sua Avaliação
                  </label>
                  <div className="flex gap-1">
                    {renderStars(selectedRating, true)}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título da Avaliação
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Ex: Produto excepcional!"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sua Opinião
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Conte sobre sua experiência com o produto..."
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adicionar Fotos (Opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-300 transition-colors cursor-pointer">
                    <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Clique para adicionar fotos do resultado
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowWriteReview(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Publicar Avaliação
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}