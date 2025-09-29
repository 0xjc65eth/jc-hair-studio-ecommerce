'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt: string;
    title: string;
  }>;
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const mainImage = images[selectedImageIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div
          className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onClick={() => setShowZoom(!showZoom)}
        >
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Mega+Hair';
            }}
          />

          {/* Zoom Indicator */}
          <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <MagnifyingGlassPlusIcon className="w-5 h-5" />
          </div>

          {/* Zoom Preview */}
          {showZoom && (
            <div
              className="absolute inset-0 bg-no-repeat rounded-lg border-2 border-white shadow-lg"
              style={{
                backgroundImage: `url(${mainImage.url})`,
                backgroundSize: '200%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                selectedImageIndex === index
                  ? 'ring-2 ring-rose-600 shadow-lg'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/150x150/f3f4f6/9ca3af?text=Mega+Hair';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Additional Images Placeholder */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative h-32 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-rose-600">
            <div className="text-2xl mb-1">📸</div>
            <div className="text-xs font-medium">Vídeo Tutorial</div>
          </div>
        </div>
        <div className="relative h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-blue-600">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-xs font-medium">Antes & Depois</div>
          </div>
        </div>
      </div>

      {/* Full Screen Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowZoom(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowZoom(false)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Mega+Hair';
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}