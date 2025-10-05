'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve any query parameters from the original login URL
    const queryString = searchParams.toString();
    const signinUrl = queryString ? `/auth/signin?${queryString}` : '/auth/signin';

    // Redirect to the signin page
    router.replace(signinUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-white">JC</span>
        </div>
        <p className="text-gray-600">Redirecionando para o login...</p>
      </div>
    </div>
  );
}

export default function LoginRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">JC</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <LoginRedirectContent />
    </Suspense>
  );
}