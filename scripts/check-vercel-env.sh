#!/bin/bash

# Vercel Environment Variables Check Script
# This script verifies that all required environment variables are properly set in Vercel production

echo "🔍 Checking Vercel Production Environment Variables..."
echo "================================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

# List of required environment variables
REQUIRED_VARS=(
    "NODE_ENV"
    "MONGODB_URI"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "SENDGRID_API_KEY"
    "SENDGRID_FROM_EMAIL"
    "FROM_EMAIL"
    "SUPPORT_EMAIL"
    "FROM_NAME"
    "SENDGRID_SANDBOX_MODE"
    "FORCE_SEND_EMAILS"
)

# Get list of production environment variables
echo "📋 Fetching production environment variables..."
VERCEL_VARS=$(vercel env ls production 2>/dev/null | tail -n +2 | awk '{print $1}' | head -n -1)

if [ $? -ne 0 ]; then
    echo "❌ Failed to fetch Vercel environment variables"
    echo "   Make sure you're logged in: vercel login"
    exit 1
fi

echo "✅ Successfully fetched environment variables"
echo ""

# Check each required variable
MISSING_VARS=()
FOUND_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if echo "$VERCEL_VARS" | grep -q "^$var$"; then
        FOUND_VARS+=("$var")
        echo "✅ $var - Found"
    else
        MISSING_VARS+=("$var")
        echo "❌ $var - Missing"
    fi
done

echo ""
echo "📊 Summary:"
echo "=========="
echo "✅ Found: ${#FOUND_VARS[@]} variables"
echo "❌ Missing: ${#MISSING_VARS[@]} variables"

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo ""
    echo "🎉 All required environment variables are configured!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm run validate-env"
    echo "2. Deploy: vercel --prod"
else
    echo ""
    echo "🚨 Missing variables need to be added:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   vercel env add $var production"
    done

    echo ""
    echo "⚠️  Please add the missing variables before deploying to production!"
    exit 1
fi

echo ""
echo "🔧 Available commands:"
echo "   vercel env ls production     - List all production variables"
echo "   vercel env add VAR production - Add a new variable"
echo "   vercel env rm VAR production  - Remove a variable"
echo "   npm run validate-env         - Validate environment configuration"