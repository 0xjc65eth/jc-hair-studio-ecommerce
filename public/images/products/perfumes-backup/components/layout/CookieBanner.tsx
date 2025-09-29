'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if cookies were already accepted
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');

    if (!cookiesAccepted) {
      // Small delay to show banner with animation
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }

    setIsLoaded(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  // Don't render on server or if not loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <div
      id="cookie-banner"
      className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 transform transition-transform duration-300"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          Este site utiliza cookies para melhorar sua experiência.
          Ao continuar navegando, você concorda com nossa política de privacidade.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAccept}
            className="btn-primary text-sm px-4 py-2"
          >
            Aceitar
          </button>
          <button
            onClick={handleReject}
            className="btn-secondary text-sm px-4 py-2"
          >
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
}