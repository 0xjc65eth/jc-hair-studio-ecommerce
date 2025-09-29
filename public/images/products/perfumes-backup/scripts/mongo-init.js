// Script de inicialização do MongoDB
// Este script é executado automaticamente quando o container MongoDB é criado

// Criar usuário da aplicação
db = db.getSiblingDB('jc_hair_studio');

db.createUser({
  user: 'jc_hair_user',
  pwd: 'jc_hair_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'jc_hair_studio'
    }
  ]
});

// Criar collections iniciais
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('cart_items');
db.createCollection('reviews');
db.createCollection('newsletter_subscribers');

// Inserir dados de teste básicos
db.products.insertMany([
  {
    _id: ObjectId(),
    name: 'Shampoo Premium Test',
    description: 'Produto de teste para pipeline automatizado',
    price: 29.90,
    category: 'hidratacao',
    inStock: true,
    image: '/images/products/test-product.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Condicionador Test',
    description: 'Produto de teste para carrinho e checkout',
    price: 24.90,
    category: 'hidratacao',
    inStock: true,
    image: '/images/products/test-conditioner.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Inserir usuário de teste
db.users.insertOne({
  _id: ObjectId(),
  name: 'Cliente Teste',
  email: 'cliente-teste@jchairstudio.com',
  password: '$2b$10$example_hashed_password',
  role: 'customer',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Criar índices para performance
db.products.createIndex({ name: 'text', description: 'text' });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ createdAt: -1 });
db.users.createIndex({ email: 1 }, { unique: true });

print('✅ MongoDB inicializado com dados de teste para JC Hair Studio');
print('🛒 2 produtos de teste criados');
print('👤 1 usuário de teste criado');
print('📊 Índices de performance criados');