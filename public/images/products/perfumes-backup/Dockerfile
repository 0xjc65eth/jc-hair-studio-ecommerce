# ============================
# 1. Build Stage
# ============================
FROM node:20-slim AS builder

# Instalar dependências básicas do sistema
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos de dependências primeiro (para melhor cache)
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar cliente Prisma (se estiver sendo usado)
RUN npx prisma generate || echo "Prisma não configurado"

# Build de produção
RUN npm run build

# ============================
# 2. Production Stage
# ============================
FROM node:20-slim AS runner

WORKDIR /app

# Instalar dependências básicas do sistema
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar Playwright para testes E2E (se necessário)
RUN npx playwright install-deps || echo "Playwright deps não instaladas"

# Configurar ambiente
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Criar usuário sem privilégios
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos da stage de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/tests ./tests
COPY --from=builder /app/playwright.config.ts ./
COPY --from=builder /app/jest.config.js ./
COPY --from=builder /app/next.config.js ./

# Instalar Playwright browsers para testes
RUN npx playwright install || echo "Playwright browsers não instalados"

# Ajustar permissões
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npm", "start"]