const { MongoClient, ServerApiVersion } = require('mongodb');

// Teste de conexão MongoDB - Credenciais corretas
const uri = "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/?retryWrites=true&w=majority&appName=JCHairCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    console.log('🔄 Testando conexão MongoDB...');
    
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    
    console.log("✅ Sucesso! Conectado ao MongoDB Atlas!");
    console.log("🎯 Cluster: JCHairCluster");
    console.log("👤 Usuário: juliocesar62");
    
    // Listar databases existentes
    const databases = await client.db().admin().listDatabases();
    console.log("\n📁 Databases disponíveis:");
    databases.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
  } catch (error) {
    console.error("❌ Erro de conexão:", error.message);
    
    if (error.message.includes('bad auth')) {
      console.log("\n💡 Possíveis soluções:");
      console.log("1. Verifique se o usuário 'juliocesar62' existe no MongoDB Atlas");
      console.log("2. Confirme se a senha 'juliocesar65' está correta");
      console.log("3. Verifique se o usuário tem permissões adequadas");
      console.log("4. Confirme se o Network Access permite sua conexão");
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

testConnection().catch(console.dir);