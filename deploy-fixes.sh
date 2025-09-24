#!/bin/bash

# Deployment script for JavaScript and API fixes
# Run this script when Vercel deployment limit resets

echo "🚀 Deploying JavaScript and API fixes to production..."

# Verify we have the latest fixes
git log --oneline -3

# Build to verify everything works
echo "🔨 Building locally to verify..."
SKIP_TYPE_CHECK=true npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful, deploying to Vercel..."

    # Deploy to production
    vercel --prod --yes

    echo "✅ Deployment initiated!"
    echo "📱 Check https://jchairstudios62.xyz/admin after deployment completes"
else
    echo "❌ Build failed, not deploying"
    exit 1
fi