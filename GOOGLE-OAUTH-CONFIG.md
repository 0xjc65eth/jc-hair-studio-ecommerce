# Google OAuth Configuration Fix

## ❌ Problema Identificado
**Erro:** `redirect_uri_mismatch`

**Causa:** A URL de redirecionamento no Google Console não inclui `http://localhost:3000`

## ✅ Solução

### 1. Acesse o Google Cloud Console
- URL: https://console.developers.google.com/
- Projeto: JC Hair Studio E-commerce

### 2. Configure as URLs de Redirecionamento
No **Google Cloud Console > APIs & Services > Credentials**:

**Client ID OAuth 2.0:** `697129632086-f0l1ob30bpo8r72qjrcr5rfc1s65bgut.apps.googleusercontent.com`

**URIs de redirecionamento autorizados:**
```
https://jchairstudios62.xyz/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### 3. Configuração Atual no .env
```bash
# ✅ CORRETO para desenvolvimento
NEXTAUTH_URL="http://localhost:3000"

# ❌ Era o problema (estava em produção)
# NEXTAUTH_URL="https://jchairstudios62.xyz"
```

### 4. URLs Necessárias por Ambiente

#### **Desenvolvimento Local:**
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3001/api/auth/callback/google` (porta alternativa)

#### **Produção:**
- `https://jchairstudios62.xyz/api/auth/callback/google`

## 🔧 Passos para Corrigir

1. **Acesse:** [Google Cloud Console](https://console.developers.google.com/)
2. **Navegue:** APIs & Services → Credentials
3. **Encontre:** OAuth 2.0 Client ID (697129632086-f0l1ob30bpo8r72qjrcr5rfc1s65bgut)
4. **Clique:** No ícone de edição (lápis)
5. **Adicione** as URIs de redirecionamento em falta
6. **Salve** as alterações

## ✅ Após a Configuração

O login com Google funcionará tanto em:
- **Desenvolvimento:** `http://localhost:3000`
- **Produção:** `https://jchairstudios62.xyz`

## 🚨 Importante

**Para Deploy em Produção:**
- Alterar `NEXTAUTH_URL` de volta para `https://jchairstudios62.xyz`
- Garantir que a URL de produção está nas configurações do Google

## 🔍 Como Testar

1. Iniciar o servidor: `npm run dev`
2. Acessar: `http://localhost:3000/auth/signin`
3. Clicar em "Registrar com Google"
4. Deve funcionar sem erros