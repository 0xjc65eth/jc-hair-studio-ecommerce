# 📧 Guia Completo - Sistema de Emails JC Hair Studio's 62

## 🎯 Como Enviar Emails Após Finalizar Etapas

### 📋 **Opções Disponíveis:**

1. **Painel Web Administrativo** (Mais Fácil)
2. **API Direta** (Para Integrações)
3. **Automação por Status** (Automático)

---

## 🌐 **1. Painel Web Administrativo**

### 📍 **Acesso:** `https://seusite.com/admin`

#### ✅ **Para Notificar Despacho:**
1. Acesse `/admin`
2. Preencha o formulário "Notificar Despacho"
3. Clique em "Enviar Notificação"

**Campos obrigatórios:**
- ID do Pedido
- Nome do Cliente
- Email do Cliente
- Código de Rastreamento
- Transportadora

---

## 🔌 **2. API Direta**

### 📦 **Notificar Despacho:**
```bash
POST /api/notify-shipping
Content-Type: application/json

{
  "orderId": "JC123456",
  "customerName": "Maria Silva",
  "customerEmail": "maria@email.com",
  "trackingCode": "BR123456789BR",
  "carrier": "Correios",
  "estimatedDelivery": "2024-01-15",
  "shippingAddress": "Rua das Flores, 123\nSão Paulo - SP",
  "items": [
    { "name": "Shampoo Loreal", "quantity": 2 },
    { "name": "Condicionador Wella", "quantity": 1 }
  ]
}
```

### 📞 **Email de Contato/Suporte:**
```bash
POST /api/contact
Content-Type: application/json

{
  "customerName": "João Silva",
  "customerEmail": "joao@email.com",
  "subject": "Dúvida sobre produto",
  "message": "Gostaria de mais informações...",
  "phone": "(11) 99999-9999",
  "orderId": "JC123456"
}
```

### ✅ **Confirmação de Pedido:**
```bash
POST /api/send-email
Content-Type: application/json

{
  "type": "order-confirmation",
  "data": {
    "orderId": "JC123456",
    "customerName": "Ana Costa",
    "customerEmail": "ana@email.com",
    "paymentMethod": "Cartão de Crédito",
    "total": 157.90,
    "items": [
      { "name": "Kit Progressiva", "quantity": 1, "price": 89.90 },
      { "name": "Shampoo Wella", "quantity": 2, "price": 34.00 }
    ]
  }
}
```

---

## 🤖 **3. Automação por Status do Pedido**

### 🔄 **API de Automação:**
```bash
POST /api/update-order-status
Content-Type: application/json

{
  "orderId": "JC123456",
  "oldStatus": "PROCESSING",
  "newStatus": "SHIPPED",
  "orderData": {
    "customerName": "Maria Silva",
    "customerEmail": "maria@email.com",
    "items": [{"name": "Produto", "quantity": 1, "price": 29.90}],
    "total": 29.90,
    "paymentMethod": "Cartão",
    "trackingCode": "BR123456789BR",
    "carrier": "Correios",
    "estimatedDelivery": "2024-01-15",
    "shippingAddress": "Endereço completo",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T14:00:00Z"
  }
}
```

### 📊 **Status e Emails Automáticos:**

| Status | Email Enviado | Quando Usar |
|--------|---------------|-------------|
| `PENDING` | ❌ Nenhum | Pedido criado |
| `CONFIRMED` | ✅ Confirmação | Pagamento aprovado |
| `PROCESSING` | ❌ Nenhum | Preparando pedido |
| `SHIPPED` | ✅ **Despacho** | **Pedido enviado** |
| `DELIVERED` | ✅ Entrega | Pedido entregue |
| `CANCELLED` | ✅ Cancelamento | Pedido cancelado |

---

## 🛠️ **4. Fluxo Prático de Trabalho**

### 📦 **Quando Despachar um Pedido:**

#### **Opção A - Painel Web (Recomendado):**
1. Vá para `/admin`
2. Preencha dados do despacho
3. Clique em enviar

#### **Opção B - API:**
```bash
curl -X POST https://seusite.com/api/notify-shipping \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "JC123456",
    "customerName": "Cliente",
    "customerEmail": "cliente@email.com",
    "trackingCode": "BR123456789BR",
    "carrier": "Correios"
  }'
```

#### **Opção C - Automação:**
```bash
curl -X POST https://seusite.com/api/update-order-status \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "JC123456",
    "newStatus": "SHIPPED",
    "orderData": {...}
  }'
```

---

## ⚙️ **5. Configuração Necessária**

### 🔑 **Variáveis de Ambiente (.env.local):**
```bash
# SendGrid
SENDGRID_API_KEY="SG.sua_api_key_aqui"
FROM_EMAIL="orders@jchairstudios62.com"
SUPPORT_EMAIL="suporte@jchairstudios62.com"

# Site
NEXT_PUBLIC_SITE_URL="https://seusite.com"
```

### 📧 **Configurar SendGrid:**
1. Crie conta no [SendGrid.com](https://sendgrid.com)
2. Vá em Settings > API Keys
3. Crie nova API key
4. Configure no `.env.local`

---

## 🧪 **6. Testes**

### 🚀 **Testar Sistema:**
```bash
# Testar todos os emails
node test-emails.js

# Testar SendGrid básico
node test-sendgrid.js
```

### 📱 **URLs de Teste:**
- **Admin:** `http://localhost:3000/admin`
- **API Docs:** `http://localhost:3000/api/notify-shipping` (GET)
- **Status API:** `http://localhost:3000/api/update-order-status` (GET)

---

## 📋 **7. Transportadoras Suportadas**

| Transportadora | Código |
|----------------|--------|
| Correios | `"Correios"` |
| Jadlog | `"Jadlog"` |
| Loggi | `"Loggi"` |
| Mercado Envios | `"Mercado Envios"` |
| Outros | `"Outros"` |

---

## 🆘 **8. Solução de Problemas**

### ❌ **Email não enviado:**
1. Verificar API key do SendGrid
2. Verificar se email remetente está verificado
3. Conferir logs no console
4. Testar com `test-sendgrid.js`

### 🔍 **Debug:**
```bash
# Ver logs em tempo real
npm run dev

# Testar API
curl -X GET https://seusite.com/api/notify-shipping
```

---

## 💡 **9. Dicas Importantes**

### ✅ **Boas Práticas:**
- Use o painel admin para envios manuais
- Configure automação para emails frequentes
- Sempre teste antes de usar em produção
- Mantenha emails de suporte verificados no SendGrid

### 🎯 **Momentos de Envio:**
- **Confirmação:** Pagamento aprovado (automático via Stripe)
- **Despacho:** Quando embalar e enviar o pedido
- **Entrega:** Quando confirmar recebimento
- **Contato:** Cliente envia dúvidas via formulário

---

**🎉 Sistema pronto para uso! Configure a API key e comece a enviar emails profissionais!**