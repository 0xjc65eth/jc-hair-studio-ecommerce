'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Star, 
  StarHalf, 
  ThumbsUp, 
  ThumbsDown, 
  Camera, 
  Plus,
  User,
  Calendar,
  Check,
  X
} from 'lucide-react';

interface ReviewPhoto {
  id: string;
  url: string;
  alt?: string;
}

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  photos?: ReviewPhoto[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  userVote?: 'helpful' | 'not-helpful';
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewSystemProps {
  productId: string;
  reviews: Review[];
  summary: ReviewSummary;
  onSubmitReview?: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'notHelpful'>) => void;
  onVoteReview?: (reviewId: string, vote: 'helpful' | 'not-helpful') => void;
  allowReviews?: boolean;
}

export default function ReviewSystem({
  productId,
  reviews,
  summary,
  onSubmitReview,
  onVoteReview,
  allowReviews = true
}: ReviewSystemProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful'>('newest');
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    title: '',
    comment: '',
    photos: [] as File[]
  });

  // Render star rating (readonly)
  const renderStarRating = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    const sizeClasses = {
      small: 'w-4 h-4',
      medium: 'w-5 h-5',
      large: 'w-6 h-6'
    };

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
      );
    }

    return stars;
  };

  // Render interactive star rating (for forms)
  const renderInteractiveStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-colors hover:scale-110 transform duration-200"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating ? review.rating === filterRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  // Get all photos from reviews
  const allPhotos = reviews.flatMap(review => review.photos || []);

  // Handle new review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReview && newReview.rating > 0) {
      onSubmitReview({
        userName: newReview.userName,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        verified: false,
        userVote: undefined
      });
      
      // Reset form
      setNewReview({
        userName: '',
        rating: 0,
        title: '',
        comment: '',
        photos: []
      });
      setShowReviewForm(false);
    }
  };

  // Handle vote on review
  const handleVoteReview = (reviewId: string, vote: 'helpful' | 'not-helpful') => {
    if (onVoteReview) {
      onVoteReview(reviewId, vote);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações dos Clientes</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStarRating(summary.averageRating, 'large')}
            </div>
            <p className="text-gray-600">{summary.totalReviews} avaliações</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution];
              const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-8">{stars} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        {allowReviews && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Escrever Avaliação
            </button>
          </div>
        )}
      </div>

      {/* Photos from Reviews */}
      {allPhotos.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Fotos dos Clientes ({allPhotos.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {allPhotos.slice(0, showAllPhotos ? allPhotos.length : 12).map((photo, index) => (
              <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={photo.url}
                  alt={photo.alt || `Foto do cliente ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              </div>
            ))}
          </div>
          
          {allPhotos.length > 12 && !showAllPhotos && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              Ver todas as {allPhotos.length} fotos
            </button>
          )}
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Todas as avaliações</option>
              <option value="5">5 estrelas</option>
              <option value="4">4 estrelas</option>
              <option value="3">3 estrelas</option>
              <option value="2">2 estrelas</option>
              <option value="1">1 estrela</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigas</option>
              <option value="rating-high">Maior avaliação</option>
              <option value="rating-low">Menor avaliação</option>
              <option value="helpful">Mais úteis</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  {review.userAvatar ? (
                    <Image
                      src={review.userAvatar}
                      alt={review.userName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{review.userName}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Compra verificada
                      </span>
                    )}
                  </div>

                  {/* Rating and Date */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center">
                      {renderStarRating(review.rating, 'small')}
                    </div>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                </div>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                  {review.photos.map((photo) => (
                    <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        src={photo.url}
                        alt={photo.alt || 'Foto da avaliação'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Esta avaliação foi útil?</span>
                <button
                  onClick={() => handleVoteReview(review.id, 'helpful')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    review.userVote === 'helpful'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Sim ({review.helpful})
                </button>
                <button
                  onClick={() => handleVoteReview(review.id, 'not-helpful')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    review.userVote === 'not-helpful'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  Não ({review.notHelpful})
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma avaliação encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReviewForm(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Escrever Avaliação</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Sua avaliação *
                  </label>
                  {renderInteractiveStars(newReview.rating, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Título da avaliação
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Resumo da sua experiência"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Comentário *
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Conte-nos sobre sua experiência com o produto..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={newReview.rating === 0 || !newReview.userName || !newReview.comment}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    Publicar Avaliação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}