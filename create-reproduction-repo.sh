#!/bin/bash

echo "🔄 Criando repositório de reprodução para o bug Stripe/Vercel..."

# Criar diretório temporário
TEMP_DIR="/tmp/vercel-stripe-bug-reproduction"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Inicializar projeto Next.js minimal
echo "📦 Criando projeto Next.js minimal..."

cat > package.json << 'EOF'
{
  "name": "vercel-stripe-connection-bug",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.5.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "stripe": "^14.14.0"
  }
}
EOF

# Criar app directory
mkdir -p app/api/test-stripe

# Criar página inicial
cat > app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div style={{ padding: '50px', fontFamily: 'system-ui' }}>
      <h1>Vercel + Stripe Connection Bug Reproduction</h1>
      <p>This minimal reproduction demonstrates the connection failure between Vercel Functions and Stripe Live API.</p>

      <h2>Test Endpoints:</h2>
      <ul>
        <li><a href="/api/test-stripe">/api/test-stripe</a> - Test Stripe connection</li>
      </ul>

      <h2>Issue:</h2>
      <p>Error: "An error occurred with our connection to Stripe. Request was retried X times."</p>

      <h2>Environment:</h2>
      <ul>
        <li>Next.js: 15.5.3</li>
        <li>Stripe SDK: 14.14.0</li>
        <li>Deployment: Vercel</li>
      </ul>
    </div>
  );
}
EOF

# Criar layout
cat > app/layout.tsx << 'EOF'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# Criar API route de teste
cat > app/api/test-stripe/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  };

  // Test 1: Check if Stripe key exists
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  results.tests.push({
    name: 'Environment Variable',
    status: hasKey ? 'found' : 'missing',
    keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'none'
  });

  if (!hasKey) {
    return NextResponse.json({
      error: 'STRIPE_SECRET_KEY not configured',
      info: 'Set STRIPE_SECRET_KEY in Vercel environment variables',
      results
    }, { status: 500 });
  }

  // Test 2: Try minimal Stripe connection
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion
    });

    // Simplest possible API call
    const account = await stripe.accounts.retrieve();

    results.tests.push({
      name: 'Stripe Connection',
      status: 'success',
      accountId: account.id
    });

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error: any) {
    results.tests.push({
      name: 'Stripe Connection',
      status: 'failed',
      error: error?.message || 'Unknown error',
      code: error?.code || 'unknown'
    });

    return NextResponse.json({
      success: false,
      error: 'Stripe connection failed',
      message: error?.message || 'Unknown error',
      results
    }, { status: 500 });
  }
}
EOF

# Criar .env.example
cat > .env.example << 'EOF'
# Add your Stripe secret key here
STRIPE_SECRET_KEY=sk_live_your_key_here
EOF

# Criar README
cat > README.md << 'EOF'
# Vercel + Stripe Connection Bug Reproduction

This minimal reproduction demonstrates a critical connection failure between Vercel Functions and Stripe Live API.

## Issue

Production site cannot connect to Stripe API from Vercel Functions, resulting in 100% payment failure.

**Error:** `An error occurred with our connection to Stripe. Request was retried X times.`

## Setup

1. Clone this repository
2. Add your Stripe secret key to Vercel environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_your_key_here
   ```
3. Deploy to Vercel
4. Visit `/api/test-stripe` to see the error

## Expected Behavior

The API should successfully connect to Stripe and return account information.

## Actual Behavior

Connection fails with the error mentioned above.

## Important Notes

- The same code works perfectly locally
- The issue only occurs in Vercel production environment
- Both test and live Stripe keys fail with the same error

## Related Issue

Original issue: #84136 (closed due to missing reproduction)

## Test Locally

```bash
npm install
npm run dev
# Visit http://localhost:3000/api/test-stripe
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xjc65eth/vercel-stripe-bug-reproduction)
EOF

# Criar .gitignore
cat > .gitignore << 'EOF'
node_modules
.next
.env
.env.local
EOF

# Criar next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOF

# Criar tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

echo "✅ Repositório de reprodução criado em: $TEMP_DIR"
echo ""
echo "📝 Próximos passos:"
echo "1. cd $TEMP_DIR"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial reproduction of Vercel-Stripe connection bug'"
echo "5. Criar repositório no GitHub: https://github.com/new"
echo "6. git remote add origin https://github.com/0xjc65eth/vercel-stripe-bug-reproduction.git"
echo "7. git push -u origin main"
echo ""
echo "🔗 Depois crie novo issue em: https://github.com/vercel/next.js/issues/new"