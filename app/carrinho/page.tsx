import { Metadata } from 'next';
import { Suspense } from 'react';
import CartPage from '../../components/cart/CartPage';

export const metadata: Metadata = {
  title: 'Carrinho - JC Hair Studio\'s 62',
  description: 'Revise seus produtos selecionados e proceda para o checkout.',
  openGraph: {
    title: 'Carrinho - JC Hair Studio\'s 62',
    description: 'Revise seus produtos selecionados e proceda para o checkout.',
    images: ['/og-cart.jpg'],
  },
};

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton-text w-48 h-8"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border space-y-4">
                <div className="flex gap-4">
                  <div className="skeleton-image w-20 h-20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text w-3/4"></div>
                    <div className="skeleton-text w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border space-y-4">
              <div className="skeleton-text w-32 h-6"></div>
              <div className="space-y-2">
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
              </div>
              <div className="skeleton-text h-12 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartPage />
    </Suspense>
  );
}