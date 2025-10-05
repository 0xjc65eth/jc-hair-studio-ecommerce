#!/bin/bash

echo "🚀 Iniciando migração para Next.js 15..."

# 1. Backup dos arquivos atuais
echo "📦 Criando backup dos arquivos de configuração..."
cp next.config.js next.config.backup.js
cp tsconfig.json tsconfig.backup.json
cp package.json package.backup.json

# 2. Instalar Next.js 15
echo "⬆️ Atualizando para Next.js 15..."
npm install next@^15.0.3

# 3. Atualizar dependências relacionadas
echo "📦 Atualizando dependências do React..."
npm install react@^18.3.1 react-dom@^18.3.1

# 4. Atualizar tipos do Next.js
echo "🔧 Atualizando tipos..."
npm install @types/react@^19.1.12 @types/react-dom@^19.1.9

# 5. Aplicar nova configuração
echo "⚙️ Aplicando nova configuração..."
cp next.config.next15.js next.config.js
cp tsconfig.production.json tsconfig.json

# 6. Limpar cache
echo "🧹 Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

# 7. Reinstalar dependências
echo "📦 Reinstalando dependências..."
npm install

# 8. Executar build de teste
echo "🏗️ Executando build de teste..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Migração para Next.js 15 concluída com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Testar a aplicação localmente: npm run dev"
    echo "2. Verificar todos os recursos funcionam corretamente"
    echo "3. Fazer deploy para ambiente de teste"
    echo "4. Se tudo estiver OK, fazer deploy para produção"
    echo ""
    echo "⚠️ Arquivos de backup criados:"
    echo "  - next.config.backup.js"
    echo "  - tsconfig.backup.json"
    echo "  - package.backup.json"
else
    echo "❌ Erro durante o build. Restaurando configuração anterior..."
    cp next.config.backup.js next.config.js
    cp tsconfig.backup.json tsconfig.json
    cp package.backup.json package.json
    npm install
    echo "🔄 Configuração anterior restaurada."
    exit 1
fi