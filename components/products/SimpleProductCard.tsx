'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/lib/stores/cartStore';
import { toast } from 'react-toastify';
import ImageCarousel from './ImageCarousel';
import { ProductSchema } from '../seo/UnifiedSchema';

interface ProductCardProps {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  destaque?: boolean;
  viewMode?: 'grid' | 'list';
  pricing?: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    savings: number;
    margin: string;
    competitive: string;
  };
  length?: number;
  type?: string;
  color?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

export default function ProductCard({
  id,
  nome,
  marca,
  descricao,
  imagens,
  badge,
  destaque,
  viewMode = 'grid',
  pricing,
  length,
  type,
  color,
  rating,
  reviews,
  inStock = true
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  // Generate product schema for SEO
  const productSchema = {
    id,
    name: nome,
    description: descricao,
    images: imagens || [],
    price: pricing?.discountPrice || pricing?.ourPrice || 0,
    comparePrice: pricing?.ourPrice,
    brand: marca,
    category: 'Mega Hair',
    rating: rating || 4.8,
    reviewCount: reviews || 50,
    inStock,
    sku: `JCH-${id}`,
    color,
    length,
    material: '100% Human Hair',
    countryOfOrigin: 'BR'
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'BEST SELLER':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black';
      case 'PROMOÇÃO':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'NOVO':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'PREMIUM':
        return 'bg-gradient-to-r from-indigo-400 to-blue-600 text-white';
      case 'EXCLUSIVO':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (viewMode === 'list') {
    return (
      <>
        <ProductSchema product={productSchema} />
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex gap-6">
        <div className="relative w-48 h-48 flex-shrink-0">
          {badge && (
            <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold z-10 ${getBadgeColor(badge)}`}>
              {badge}
            </span>
          )}
          
          <ImageCarousel
            images={imagens}
            productName={nome}
            className="w-full h-full rounded-lg overflow-hidden"
          />
        </div>
        
        <div className="flex-1">
          <div className="text-amber-600 text-sm uppercase tracking-wider font-semibold mb-2">
            {marca}
          </div>
          
          <Link href={`/produto/${id}`} className="group">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
              {nome}
            </h3>
          </Link>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {descricao}
          </p>
          
          <div className="flex items-center justify-between">
            {pricing && pricing.discountPrice && (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">€{pricing.ourPrice.toFixed(2)}</span>
                  <span className="text-lg font-bold text-green-600">€{pricing.discountPrice.toFixed(2)}</span>
                </div>
                {pricing.savings !== undefined && (
                  <span className="text-xs text-green-600 font-medium">Economize €{pricing.savings.toFixed(2)}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <ProductSchema product={productSchema} />
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/produto/${id}`}>
        <div className="relative">
          {badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold z-10 ${getBadgeColor(badge)}`}>
              {badge}
            </span>
          )}

          <button
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>

          <div className="aspect-square bg-gray-50 overflow-hidden">
            <ImageCarousel
              images={imagens}
              productName={nome}
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="p-5">
          <div className="text-amber-600 text-xs uppercase tracking-wider font-semibold mb-2">
            {marca}
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {nome}
          </h3>

          <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
            {descricao}
          </p>

          {pricing && pricing.discountPrice && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 line-through">€{pricing.ourPrice?.toFixed(2)}</span>
                <span className="text-lg font-bold text-green-600">€{pricing.discountPrice?.toFixed(2)}</span>
              </div>
              {pricing.savings !== undefined && (
                <div className="text-center">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Economize €{pricing.savings.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="px-5 pb-5">
        <button
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm tracking-wide transform hover:scale-105 transition-transform"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            try {
              addItem({
                productId: id,
                quantity: 1,
                product: {
                  id: id,
                  name: nome,
                  slug: nome.toLowerCase().replace(/\s+/g, '-'),
                  price: pricing?.ourPrice || 0,
                  comparePrice: pricing?.basePrice || undefined,
                  images: imagens?.length ? imagens.map((img, index) => ({
                    url: img,
                    alt: nome,
                    isMain: index === 0
                  })) : [],
                  status: 'ACTIVE' as any,
                  quantity: 999,
                },
              });

              toast.success(`${nome} adicionado ao carrinho!`, {
                position: 'top-right',
                autoClose: 3000,
              });
            } catch (error) {
              console.error('Erro ao adicionar ao carrinho:', error);
              toast.error('Erro ao adicionar produto ao carrinho');
            }
          }}
        >
          ADICIONAR AO CARRINHO
        </button>
      </div>
    </div>
    </>
  );
}