module.exports = {
  ci: {
    collect: {
      url: [
        'https://jc-hair-studio.vercel.app',
        'https://jc-hair-studio.vercel.app/produtos',
        'https://jc-hair-studio.vercel.app/sobre',
        'https://jc-hair-studio.vercel.app/mega-hair',
        'https://jc-hair-studio.vercel.app/cosmeticos',
        'https://jc-hair-studio.vercel.app/contato'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['uses-http2']
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],

        // Core Web Vitals
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],

        // Accessibility specific
        'color-contrast': 'error',
        'image-alt': 'error',
        'heading-order': 'error',
        'button-name': 'error',
        'link-name': 'error',

        // Performance
        'unused-javascript': ['warn', { maxNumericValue: 50 }],
        'unused-css-rules': ['warn', { maxNumericValue: 50 }],
        'render-blocking-resources': 'warn',

        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'hreflang': 'off', // Pode ser desabilitado se não usar múltiplos idiomas

        // Best Practices
        'uses-https': 'error', // Habilitado para produção
        'is-on-https': 'error'  // Habilitado para produção
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};