# 🛒 Amazon Marketplace Integration - JC Hair Studio

Este documento explica como configurar e usar a integração com o Amazon Marketplace para vender produtos da JC Hair Studio na Amazon.

## 📋 Pré-requisitos

### 1. Conta Amazon Professional
- Conta Amazon Seller Professional (US$39.99/mês)
- Acesso ao Seller Central da Amazon
- Aprovação para vender produtos de beleza/cosméticos

### 2. Documentos Necessários
- **CNPJ** da empresa
- **Conta bancária** válida no Brasil
- **Endereço comercial** verificado
- **Licenças sanitárias** para produtos cosméticos
- **Certificados de qualidade** dos produtos

### 3. Aprovações Específicas
- **Produtos de beleza** requerem aprovação prévia da Amazon
- **Produtos capilares** devem atender aos requisitos de segurança
- **Conformidade com regulamentações** brasileiras e americanas

## 🔧 Configuração

### 1. Configurar Credenciais Amazon SP-API

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Amazon Marketplace Configuration
AMAZON_CLIENT_ID="your_amazon_client_id_here"
AMAZON_CLIENT_SECRET="your_amazon_client_secret_here"
AMAZON_REFRESH_TOKEN="your_amazon_refresh_token_here"
AMAZON_ACCESS_KEY_ID="your_aws_access_key_here"
AMAZON_SECRET_ACCESS_KEY="your_aws_secret_key_here"
AMAZON_SELLER_ID="your_amazon_seller_id_here"
AMAZON_ROLE="your_sp_api_role_arn_here"
AMAZON_ENVIRONMENT="sandbox"  # ou "production"
```

### 2. Obter Credenciais

#### Amazon Developer Central
1. Acesse [Amazon Developer Central](https://developer.amazonservices.com)
2. Crie uma aplicação SP-API
3. Obtenha `CLIENT_ID` e `CLIENT_SECRET`
4. Configure o refresh token

#### AWS IAM
1. Crie um usuário IAM na AWS
2. Anexe as políticas necessárias para SP-API
3. Obtenha `ACCESS_KEY_ID` e `SECRET_ACCESS_KEY`

#### Role ARN
1. Crie uma role no AWS IAM
2. Configure trust policy para SP-API
3. Obtenha o ARN da role

## 🚀 Comandos Disponíveis

### Validar Produtos
```bash
# Validar todos os produtos para Amazon
npm run amazon:validate

# Validar produtos de uma categoria específica
npm run amazon:validate -- --category=mega-hair

# Validar apenas os primeiros 10 produtos
npm run amazon:validate -- --limit=10
```

### Sincronização (Dry Run)
```bash
# Ver o que seria sincronizado sem fazer alterações
npm run amazon:sync:dry

# Dry run para categoria específica
npm run amazon:sync:dry -- --category=mega-hair
```

### Sincronização Real
```bash
# Sincronizar todos os produtos
npm run amazon:sync

# Sincronizar apenas mega hair
npm run amazon:sync:mega-hair

# Sincronizar com limite
npm run amazon:sync -- --limit=50
```

### Ajuda
```bash
# Ver todas as opções disponíveis
npm run amazon:help
```

## 📊 APIs Disponíveis

### Status da Integração
```bash
GET /api/amazon/sync
```

### Sincronizar Produtos
```bash
POST /api/amazon/sync
{
  "action": "products",
  "productIds": ["opcional", "lista", "de", "ids"]
}
```

### Sincronizar Inventário
```bash
POST /api/amazon/sync
{
  "action": "inventory",
  "productIds": ["opcional"]
}
```

### Validar Produtos
```bash
POST /api/amazon/sync
{
  "action": "validate"
}
```

### Buscar Pedidos Amazon
```bash
GET /api/amazon/orders?startDate=2024-01-01&endDate=2024-01-31
```

### Atualizar Inventário Individual
```bash
PUT /api/amazon/inventory
{
  "productId": "product-123",
  "quantity": 50
}
```

## 📦 Mapeamento de Produtos

### Categorias Amazon Suportadas
- **Mega Hair** → Beauty / Hair Extensions
- **Tintas Capilares** → Beauty / Hair Care
- **Esmaltes** → Beauty / Nail Polish
- **Maquiagem** → Beauty / Makeup
- **Perfumes** → Beauty / Fragrance

### Validações de Produto
- ✅ Nome com pelo menos 5 caracteres
- ✅ Descrição com pelo menos 20 caracteres
- ✅ Preço válido (> 0)
- ✅ Pelo menos uma imagem
- ✅ Categoria definida
- ✅ Marca especificada (para produtos de beleza)

### Formato de Feed
Os produtos são convertidos para o formato TSV (Tab-Separated Values) requerido pela Amazon:

```tsv
sku	product-name	price	quantity	brand-name	description
mega-hair-1	Mega Hair Liso 60cm	299.90	100	JC Hair Studio	Mega hair...
```

## 🔍 Monitoramento

### Logs de Sincronização
- Todos os logs são salvos no console durante a execução
- Status de sucesso/erro para cada operação
- IDs de feed para rastreamento na Amazon

### Status de Feed
Após submeter um feed, monitore o status no Seller Central:
1. Seller Central → Inventory → Add Products via Upload
2. Monitor Feed Processing Summary
3. Verifique erros e avisos

## ⚠️ Requisitos Importantes

### Produtos de Beleza
- **Aprovação prévia** necessária
- **Ingredientes seguros** apenas
- **Rótulos conformes** com FDA
- **Documentação completa** de segurança

### Imagens
- **Resolução mínima**: 1000x1000 pixels
- **Formato**: JPG, PNG
- **Fundo branco** para imagem principal
- **Máximo 9 imagens** por produto

### Preços
- **Moeda**: BRL (Real Brasileiro)
- **Margem de preço**: 20% acima/abaixo do preço base
- **Preços competitivos** recomendados

## 🚨 Solução de Problemas

### Erro de Conexão
```bash
❌ Failed to connect to Amazon: [erro]
```
**Solução**: Verifique credenciais no arquivo `.env`

### Produtos Inválidos
```bash
❌ Invalid products: 5
  • Produto X - Description too short
```
**Solução**: Corrija as validações indicadas

### Feed Rejeitado
**Solução**:
1. Verifique logs no Seller Central
2. Corrija erros de formato
3. Reenvie o feed

### Aprovação Pendente
**Solução**:
1. Submeta documentação adicional
2. Aguarde aprovação da Amazon
3. Entre em contato com Seller Support

## 📞 Suporte

- **Amazon Seller Support**: Via Seller Central
- **Documentação SP-API**: https://developer-docs.amazon.com/sp-api/
- **AWS Support**: Para questões de IAM/credenciais

## 🔐 Segurança

- ✅ Credenciais armazenadas em variáveis de ambiente
- ✅ Tokens de acesso com tempo limitado
- ✅ Validação de dados antes do envio
- ✅ Logs sem informações sensíveis

---

## 📈 Próximos Passos

1. **Configurar credenciais** no ambiente de produção
2. **Solicitar aprovação** para produtos de beleza
3. **Testar em ambiente sandbox** primeiro
4. **Implementar sincronização automática** (webhooks)
5. **Monitorar performance** de vendas na Amazon