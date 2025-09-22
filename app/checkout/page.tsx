import { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutPage from '@/components/checkout/CheckoutPage';

export const metadata: Metadata = {
  title: 'Checkout - JC Hair Studio\'s 62',
  description: 'Finalize sua compra de forma segura e rápida.',
  openGraph: {
    title: 'Checkout - JC Hair Studio\'s 62',
    description: 'Finalize sua compra de forma segura e rápida.',
  },
};

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="skeleton-text w-48 h-6 mb-4"></div>
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="skeleton-text w-24 h-4"></div>
                    <div className="skeleton-text w-full h-10"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="skeleton-text w-32 h-6 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="skeleton-text w-full h-16"></div>
                ))}
              </div>
            </div>
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

export default function Checkout() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPage />
    </Suspense>
  );
}