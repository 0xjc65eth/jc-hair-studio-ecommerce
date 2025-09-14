#!/usr/bin/env node
/**
 * Script para download dos vídeos do Google Drive para o carrossel da home
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// URLs dos vídeos do Google Drive
const VIDEO_URLS = [
  "https://drive.google.com/file/d/1YhEWlTsMQgPli4IU5GK1F5y9g4ROYGy7/view?usp=drive_link",
  "https://drive.google.com/file/d/1kzCdAd-i-bbMbp3KvHfKoX6Sbeu3OKLD/view?usp=drive_link"
];

// Configurações
const CONFIG = {
  downloadDir: path.join(__dirname, '..', 'public', 'videos'),
  timeout: 120000, // 2 minutos para vídeos
  maxRetries: 3,
};

// Extrair ID do Google Drive e converter para URL de download direto
function extractGDriveId(url) {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function convertToDirectDownloadUrl(gdriveUrl) {
  const fileId = extractGDriveId(gdriveUrl);
  if (!fileId) {
    throw new Error(`Unable to extract file ID from: ${gdriveUrl}`);
  }
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Download de vídeo com retry
const downloadVideo = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout downloading ${url}`));
    }, CONFIG.timeout);

    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      // Seguir redirecionamentos
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        clearTimeout(timeout);
        const redirectUrl = response.headers.location;
        downloadVideo(redirectUrl, filepath).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode === 200) {
        const file = createWriteStream(filepath);
        let downloadedBytes = 0;
        const totalBytes = parseInt(response.headers['content-length']) || 0;

        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          if (totalBytes > 0) {
            const progress = ((downloadedBytes / totalBytes) * 100).toFixed(1);
            process.stdout.write(`\r📥 Progresso: ${progress}% (${(downloadedBytes / 1024 / 1024).toFixed(1)}MB)`);
          }
        });

        response.pipe(file);

        file.on('finish', () => {
          clearTimeout(timeout);
          file.close();
          console.log(''); // Nova linha após progresso
          resolve(filepath);
        });

        file.on('error', (err) => {
          clearTimeout(timeout);
          fs.unlink(filepath).catch(() => {});
          reject(err);
        });
      } else {
        clearTimeout(timeout);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
    });

    request.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    request.setTimeout(CONFIG.timeout);
  });
};

const downloadWithRetry = async (url, filepath, retries = CONFIG.maxRetries) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const directUrl = convertToDirectDownloadUrl(url);
      await downloadVideo(directUrl, filepath);
      return filepath;
    } catch (error) {
      console.log(`\n⚠️  Tentativa ${i + 1}/${retries + 1} falhou para ${url}`);
      console.log(`   Erro: ${error.message}`);
      if (i === retries) {
        throw error;
      }
      console.log('🔄 Tentando novamente em 5 segundos...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Função principal
async function main() {
  console.log('🎬 Iniciando download de 2 vídeos do Google Drive para carrossel da home...\n');

  // Criar diretório de download
  try {
    await fs.mkdir(CONFIG.downloadDir, { recursive: true });
    console.log(`📁 Diretório criado: ${CONFIG.downloadDir}\n`);
  } catch (error) {
    console.error('❌ Erro ao criar diretório:', error.message);
    process.exit(1);
  }

  const results = [];

  // Download sequencial para vídeos (evitar sobrecarga)
  for (let i = 0; i < VIDEO_URLS.length; i++) {
    const url = VIDEO_URLS[i];
    const videoName = `hero-video-${i + 1}.mp4`;
    const filepath = path.join(CONFIG.downloadDir, videoName);

    try {
      console.log(`🎥 [${i + 1}/2] Baixando: ${videoName}`);
      await downloadWithRetry(url, filepath);
      console.log(`✅ Sucesso: ${videoName}`);

      // Verificar tamanho do arquivo
      const stats = await fs.stat(filepath);
      const sizeInMB = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`📊 Tamanho: ${sizeInMB}MB\n`);

      results.push({
        success: true,
        url,
        filepath,
        fileName: videoName,
        size: sizeInMB,
        error: null
      });
    } catch (error) {
      console.log(`❌ Erro: ${url} - ${error.message}\n`);
      results.push({
        success: false,
        url,
        filepath: null,
        fileName: videoName,
        size: null,
        error: error.message
      });
    }
  }

  // Relatório final
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log('🎉 DOWNLOAD DE VÍDEOS CONCLUÍDO!');
  console.log(`✅ Sucessos: ${successful.length}`);
  console.log(`❌ Falhas: ${failed.length}`);
  console.log(`📊 Taxa de sucesso: ${((successful.length / results.length) * 100).toFixed(1)}%\n`);

  if (successful.length > 0) {
    console.log('📹 Vídeos baixados:');
    successful.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.fileName} (${result.size}MB)`);
    });
    console.log('\n🎯 Vídeos prontos para uso no carrossel da home!');
    console.log('   📂 Localização: /public/videos/');
    console.log('   🎬 hero-video-1.mp4');
    console.log('   🎬 hero-video-2.mp4');
  }

  if (failed.length > 0) {
    console.log('\n⚠️  URLs que falharam:');
    failed.forEach((failure, index) => {
      console.log(`   ${index + 1}. ${failure.fileName}`);
      console.log(`      URL: ${failure.url}`);
      console.log(`      Erro: ${failure.error}`);
    });
  }

  console.log('\n🚀 Próximo passo: Criar componente de carrossel de vídeos na home!');
}

// Executar
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = { main };