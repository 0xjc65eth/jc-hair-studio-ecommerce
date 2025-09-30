import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

async function fixNullSlugs() {
  console.log('🔧 Starting null slug fix...')

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('jc-hair-studio-ecommerce')
    const collection = db.collection('products')

    // Find products with null or empty slugs
    const productsWithNullSlugs = await collection.find({
      $or: [
        { slug: null },
        { slug: "" },
        { slug: { $exists: false } }
      ]
    }).toArray()

    console.log(`📊 Found ${productsWithNullSlugs.length} products with null/empty slugs`)

    if (productsWithNullSlugs.length === 0) {
      console.log('✅ No products with null slugs found')
      return
    }

    // Fix each product
    for (let i = 0; i < productsWithNullSlugs.length; i++) {
      const product = productsWithNullSlugs[i]

      let newSlug = generateSlug(product.name || `product-${product._id}`)

      // Ensure slug is unique
      let counter = 1
      let finalSlug = newSlug

      while (await collection.findOne({ slug: finalSlug, _id: { $ne: product._id } })) {
        finalSlug = `${newSlug}-${counter}`
        counter++
      }

      // Update the product
      await collection.updateOne(
        { _id: product._id },
        { $set: { slug: finalSlug } }
      )

      console.log(`✅ Fixed product ${i + 1}/${productsWithNullSlugs.length}: ${product.name} -> ${finalSlug}`)
    }

    console.log('🎉 All null slugs fixed!')

  } catch (error) {
    console.error('❌ Error fixing null slugs:', error)
    throw error
  } finally {
    await client.close()
    console.log('📦 Database connection closed')
  }
}

// Run if called directly
if (require.main === module) {
  fixNullSlugs()
    .then(() => {
      console.log('✅ Null slug fix completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Null slug fix failed:', error)
      process.exit(1)
    })
}

export { fixNullSlugs }