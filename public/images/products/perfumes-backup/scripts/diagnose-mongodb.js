const { MongoClient } = require('mongodb');

// Test different connection scenarios
const tests = [
  {
    name: "Teste 1: Conexão sem database específico",
    uri: "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/?retryWrites=true&w=majority"
  },
  {
    name: "Teste 2: Conexão com database admin",
    uri: "mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/admin?retryWrites=true&w=majority"
  },
  {
    name: "Teste 3: Username original (juliocesarurss62)",
    uri: "mongodb+srv://juliocesarurss62:juliocesar65@jchaircluster.o078ehn.mongodb.net/?retryWrites=true&w=majority"
  }
];

async function diagnoseConnection() {
  console.log('🔍 Iniciando diagnóstico MongoDB Atlas...\n');
  
  for (const test of tests) {
    console.log(`\n${test.name}`);
    console.log('='.repeat(50));
    
    const client = new MongoClient(test.uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    try {
      console.log('🔄 Tentando conectar...');
      await client.connect();
      
      console.log('✅ Conexão estabelecida!');
      
      // Test ping
      await client.db("admin").command({ ping: 1 });
      console.log('✅ Ping realizado com sucesso!');
      
      // List databases
      const databases = await client.db().admin().listDatabases();
      console.log(`📁 Databases encontrados: ${databases.databases.length}`);
      databases.databases.forEach(db => {
        console.log(`  - ${db.name}`);
      });
      
      console.log(`🎯 SUCESSO: Este username/configuração funciona!`);
      
    } catch (error) {
      console.log(`❌ Falhou: ${error.message}`);
      
      if (error.message.includes('bad auth')) {
        console.log('🔍 Problema de autenticação - usuário ou senha incorretos');
      } else if (error.message.includes('timeout')) {
        console.log('🔍 Problema de rede - verifique Network Access no Atlas');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('🔍 Problema de DNS - cluster não encontrado');
      }
    } finally {
      await client.close();
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 PRÓXIMOS PASSOS:');
  console.log('1. Se NENHUM teste funcionou: problema nas credenciais');
  console.log('2. Se algum teste funcionou: use essa configuração');
  console.log('3. Acesse cloud.mongodb.com para verificar:');
  console.log('   - Database Access: usuários existentes');
  console.log('   - Network Access: IPs permitidos');
  console.log('   - Clusters: nome correto do cluster');
  console.log('\n📞 Precisa da connection string diretamente do Atlas!');
}

diagnoseConnection().catch(console.error);