#!/bin/bash

# Script para abrir múltiplos terminais no VS Code
# Cada terminal focará em uma configuração pendente

echo "Abrindo terminais para configurações pendentes..."

# Terminal 1: Stripe Configuration
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && echo \"=== TERMINAL 1: STRIPE CONFIGURATION ===\" && echo \"Verificando webhooks e payment intents...\" && ls -la app/api/webhooks/stripe/ app/api/create-payment-intent/ app/api/confirm-payment/ 2>/dev/null && echo \"\" && echo \"Arquivos modificados:\" && git status app/api/webhooks/stripe/route.ts"'

sleep 1

# Terminal 2: NextAuth Configuration
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && echo \"=== TERMINAL 2: NEXTAUTH CONFIGURATION ===\" && echo \"Verificando autenticação...\" && ls -la app/api/auth/ && echo \"\" && echo \"Arquivos modificados:\" && git status app/api/auth/ app/auth/"'

sleep 1

# Terminal 3: Database/Prisma Configuration
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && echo \"=== TERMINAL 3: DATABASE/PRISMA ===\" && echo \"Verificando configuração do banco...\" && cat prisma/schema.prisma | head -30 && echo \"\" && echo \"Status:\" && git status prisma/"'

sleep 1

# Terminal 4: Product Catalog
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && echo \"=== TERMINAL 4: PRODUCT CATALOG ===\" && echo \"Verificando catálogo de produtos...\" && ls -la lib/data/*.json && echo \"\" && echo \"Imagens:\" && ls -la public/images/products/"'

sleep 1

# Terminal 5: Email Configuration
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && echo \"=== TERMINAL 5: EMAIL/SENDGRID ===\" && echo \"Verificando configuração de email...\" && ls -la app/api/send-email/ app/api/notifications/ 2>/dev/null && ls -la test*.js"'

sleep 1

# Terminal 6: Vercel Deploy
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'\" && echo \"=== TERMINAL 6: VERCEL DEPLOY ===\" && echo \"Verificando status do deploy...\" && vercel --version && echo \"\" && echo \"Build local:\" && npm run build 2>&1 | head -20"'

echo "Todos os terminais foram abertos!"
echo "Cada terminal está focado em uma configuração diferente."
