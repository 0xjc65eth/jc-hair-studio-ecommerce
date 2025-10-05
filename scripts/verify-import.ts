import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;

async function verifyImport() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('jc-hair-studio-ecommerce');

    const products = await db.collection('products').find({}).limit(5).toArray();

    console.log('\n📊 PRIMEIROS 5 PRODUTOS NO BANCO:');
    console.log('='.repeat(70));
    products.forEach((p: any) => {
      console.log(`✅ ${p.name}`);
      console.log(`   Preço: €${p.price.toFixed(2)} | SKU: ${p.sku}`);
      console.log(`   Em estoque: ${p.stock} unidades`);
      console.log('');
    });

    const total = await db.collection('products').countDocuments();
    console.log(`\n📦 Total de produtos no banco: ${total}`);

    await client.close();
  } catch (error) {
    console.error('Erro:', error);
  }
}

verifyImport();
