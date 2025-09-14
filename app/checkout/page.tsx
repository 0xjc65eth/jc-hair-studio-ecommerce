import { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutPage from '../../components/checkout/CheckoutPage';

export const metadata: Metadata = {
  title: 'Checkout - JC Hair Studio\'s 62',
  description: 'Complete sua compra de forma segura e rápida.',
  openGraph: {
    title: 'Checkout - JC Hair Studio\'s 62',
    description: 'Complete sua compra de forma segura e rápida.',
    images: ['/og-checkout.jpg'],
  },
};

function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form skeleton */}
          <div className="space-y-8">
            <div className="skeleton-text w-48 h-8"></div>
            
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="skeleton-text w-32 h-6"></div>
              <div className="skeleton-text h-12"></div>
              <div className="skeleton-text h-12"></div>
            </div>
            
            {/* Shipping */}
            <div className="space-y-4">
              <div className="skeleton-text w-32 h-6"></div>
              <div className="skeleton-text h-12"></div>
              <div className="skeleton-text h-12"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton-text h-12"></div>
                <div className="skeleton-text h-12"></div>
              </div>
            </div>
            
            {/* Payment */}
            <div className="space-y-4">
              <div className="skeleton-text w-32 h-6"></div>
              <div className="skeleton-text h-12"></div>
            </div>
          </div>
          
          {/* Summary skeleton */}
          <div className="space-y-6">
            <div className="skeleton-text w-32 h-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton-image w-16 h-16"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text w-3/4"></div>
                  </div>
                </div>
              ))}
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