// Adicionar no next.config.js dentro de async redirects()
const canonicalRedirects = [
  // Redirecionar todas as versões com locale para versão sem locale
  {
    source: '/:locale(pt|en|es)/produtos',
    destination: '/produtos',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/produtos/:path*',
    destination: '/produtos/:path*',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/mega-hair',
    destination: '/mega-hair',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/mega-hair/:path*',
    destination: '/mega-hair/:path*',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/maquiagens',
    destination: '/maquiagens',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/maquiagens/:path*',
    destination: '/maquiagens/:path*',
    permanent: true,
  },
];
