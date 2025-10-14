#!/usr/bin/env node

/**
 * Script para adicionar informação sobre o redirect de /relaxamentos
 *
 * IMPORTANTE: /relaxamentos não existe como rota
 * Rota correta: /categoria/relaxamentos
 *
 * Para criar um redirect, adicione em next.config.js:
 *
 * async redirects() {
 *   return [
 *     {
 *       source: '/relaxamentos',
 *       destination: '/categoria/relaxamentos',
 *       permanent: true,
 *     },
 *   ]
 * }
 */

console.log('ℹ️  INFORMAÇÃO SOBRE ROTAS:');
console.log('');
console.log('❌ /relaxamentos - NÃO EXISTE (404)');
console.log('✅ /categoria/relaxamentos - ROTA CORRETA');
console.log('✅ /produtos - Página com abas (Progressivas | Relaxamentos)');
console.log('');
console.log('Para criar um redirect automático de /relaxamentos → /categoria/relaxamentos,');
console.log('adicione a configuração acima no arquivo next.config.js');
