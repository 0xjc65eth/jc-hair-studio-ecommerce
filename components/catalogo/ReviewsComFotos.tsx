'use client';

import { useState } from 'react';
import { Star, Camera, ThumbsUp, MoreHorizontal, Flag, User, Verified, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ReviewWithPhotos } from '../../types/product';

interface ReviewsComFotosProps {
  productId: string;
  reviews: ReviewWithPhotos[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview?: (review: any) => void;
  className?: string;
}

interface NewReview {
  rating: number;
  title: string;
  content: string;
  photos: File[];
  name: string;
  email: string;
}

const RATING_LABELS = {
  1: 'Muito Ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente'
};

export default function ReviewsComFotos({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onSubmitReview,
  className = ''
}: ReviewsComFotosProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 5,
    title: '',
    content: '',
    photos: [],
    name: '',
    email: ''
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'with-photos' | number>('all');

  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;
    const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Filter reviews based on selected filter
  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'with-photos') return review.photos.length > 0;
    if (typeof filter === 'number') return Math.floor(review.rating) === filter;
    return true;
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (newReview.photos.length + files.length > 5) {
      alert('Máximo 5 fotos por avaliação');
      return;
    }
    setNewReview(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const removePhoto = (index: number) => {
    setNewReview(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const submitReview = () => {
    if (!newReview.rating || !newReview.content.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    onSubmitReview?.(newReview);
    
    // Reset form
    setNewReview({
      rating: 5,
      title: '',
      content: '',
      photos: [],
      name: '',
      email: ''
    });
    setShowReviewForm(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : i < rating 
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Avaliações de Clientes
          </h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] transition-colors"
          >
            Avaliar Produto
          </button>
        </div>

        {/* Overall Rating */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(averageRating, 'lg')}
            </div>
            <div className="text-sm text-gray-600">
              {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 max-w-md">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600 w-8">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              filter === 'all'
                ? 'bg-[#8B4513] text-white border-[#8B4513]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#8B4513]'
            }`}
          >
            Todas ({totalReviews})
          </button>
          <button
            onClick={() => setFilter('with-photos')}
            className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
              filter === 'with-photos'
                ? 'bg-[#8B4513] text-white border-[#8B4513]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[#8B4513]'
            }`}
          >
            <Camera className="w-4 h-4" />
            Com Fotos ({reviews.filter(r => r.photos.length > 0).length})
          </button>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
            if (count === 0) return null;
            
            return (
              <button
                key={rating}
                onClick={() => setFilter(rating)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                  filter === rating
                    ? 'bg-[#8B4513] text-white border-[#8B4513]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#8B4513]'
                }`}
              >
                {rating} <Star className="w-3 h-3 fill-current" />
                ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Nenhuma avaliação encontrada com os filtros selecionados.</p>
            <button
              onClick={() => setFilter('all')}
              className="text-[#8B4513] hover:text-[#6B3410] mt-2"
            >
              Ver todas as avaliações
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {review.user.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user.name || 'Usuário'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.user.name || 'Cliente Anônimo'}
                      </span>
                      <Verified className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {renderStars(review.rating, 'sm')}
                      <span>•</span>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Review Content */}
              {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              )}
              <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

              {/* Review Photos */}
              {review.photos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {review.photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedImage(photo.url)}
                      className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.alt || 'Foto da avaliação'}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Útil ({Math.floor(Math.random() * 10)})</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <Flag className="w-4 h-4" />
                  <span>Reportar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Avaliar Produto</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação *
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            i < newReview.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {RATING_LABELS[newReview.rating as keyof typeof RATING_LABELS]}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título (opcional)
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Resumo da sua experiência"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513]"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação *
                </label>
                <textarea
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conte sua experiência com o produto..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513]"
                  required
                />
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos (opcional - máx. 5)
                </label>
                <div className="flex gap-2 mb-3">
                  {newReview.photos.map((photo, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newReview.photos.length < 5 && (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#8B4513] transition-colors">
                      <Camera className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Adicionar</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410]"
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Foto da avaliação"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}