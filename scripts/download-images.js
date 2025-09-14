#!/usr/bin/env node
/**
 * Script para download automático das imagens externas
 * e substituição dos links no código
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const crypto = require('crypto');

// Lista de todos os links de imagens encontrados no projeto
const IMAGE_URLS = {
  'i.ibb.co': [
    // URLs encontradas no produtos-completo.html
    'https://i.ibb.co/1frXR5R/1.jpg',
    'https://i.ibb.co/jZGVY1T/2.jpg',
    'https://i.ibb.co/s93dm5C/3.jpg',
    'https://i.ibb.co/9BbSKGL/4.jpg',
    'https://i.ibb.co/0R24w9P/5.jpg',
    'https://i.ibb.co/1tfQ7Dx/6.jpg',
    'https://i.ibb.co/v46qJyD/7.jpg',
    'https://i.ibb.co/kVVg714/8.jpg',
    'https://i.ibb.co/4gMc4Fy/9.jpg',
    'https://i.ibb.co/4nxLgHR/10.jpg',
    'https://i.ibb.co/vCNb3F2/11.jpg',
    'https://i.ibb.co/VYRhtZ7/12.jpg',
    'https://i.ibb.co/G4Ct4Sp/13.jpg',
    'https://i.ibb.co/677Hw81/14.jpg',
    'https://i.ibb.co/9kHnrQD/15.jpg',
    'https://i.ibb.co/RpdFn7v/16.jpg',
    'https://i.ibb.co/Dg7T2Y5/17.jpg',
    'https://i.ibb.co/FbhV1Xc/18.jpg',
    'https://i.ibb.co/9Sf2WQc/19.jpg',
    'https://i.ibb.co/wrdJSLQ/20.jpg',
    'https://i.ibb.co/QvKVHmz/21.jpg',
    'https://i.ibb.co/h1wrgc6/22.jpg',
    'https://i.ibb.co/Hfn8Gvw/23.jpg',
    'https://i.ibb.co/wZW3wVt/24.jpg',
    'https://i.ibb.co/4RLsFsN/25.jpg',
    'https://i.ibb.co/ZRdNxqY/26.jpg',
    'https://i.ibb.co/27M9WPV/27.jpg',
    'https://i.ibb.co/M51W3Kh/28.jpg',
    'https://i.ibb.co/QjmH7NV/29.jpg',
    'https://i.ibb.co/0RgfscG/30.jpg',
    'https://i.ibb.co/Rk8GC5S/31.jpg',
    'https://i.ibb.co/QjCsDjx/32.jpg',
    'https://i.ibb.co/pGNxKdN/33.jpg',
    'https://i.ibb.co/xq9MsHp/34.jpg',
    'https://i.ibb.co/nMwR4cz/35.jpg',
    'https://i.ibb.co/1tQ8DYt/36.jpg',
    'https://i.ibb.co/mF575Gc/37.jpg',
    'https://i.ibb.co/LhnFBFH/38.jpg',
    'https://i.ibb.co/mm7KBJ0/39.jpg',
    'https://i.ibb.co/nsHQwDT/40.jpg',
    'https://i.ibb.co/1Y104Y2/41.jpg',
    'https://i.ibb.co/tM635LH/42.jpg',
    'https://i.ibb.co/vxJVTQ9/43.jpg',
    'https://i.ibb.co/vn2jBn2/44.jpg',
    'https://i.ibb.co/8RTLxgP/45.jpg',
    'https://i.ibb.co/Jw47Zjp/46.jpg',
    'https://i.ibb.co/gMx0QCx/47.jpg',
    'https://i.ibb.co/tPNjSQZ/48.jpg',
    'https://i.ibb.co/7ty3yC5/49.jpg',
    'https://i.ibb.co/ZRJZKT8/50.jpg',
    'https://i.ibb.co/4gjV3HZ/51.jpg',
    'https://i.ibb.co/4kSsZ5w/52.jpg',
    'https://i.ibb.co/4w8WgHG/53.jpg',
    'https://i.ibb.co/xKbmwRy/54.jpg',
    'https://i.ibb.co/WWWJnfH/55.jpg',
    'https://i.ibb.co/JjXcYL6/56.jpg',
    'https://i.ibb.co/NhCFsHF/57.jpg',
    'https://i.ibb.co/d0m6J0x/58.jpg',
    'https://i.ibb.co/PvPGncG/59.jpg',
    'https://i.ibb.co/kswykgY/60.jpg',
    'https://i.ibb.co/qFdgLvp/61.jpg',
    'https://i.ibb.co/JjwmSMP/62.jpg',
    'https://i.ibb.co/CKwqgzH/63.jpg',
    'https://i.ibb.co/fV4Th2m/64.jpg',
    'https://i.ibb.co/n8RkHNS/65.jpg',
    'https://i.ibb.co/JRxVvJG/66.jpg',
    'https://i.ibb.co/svXYrRJ/67.jpg',
    'https://i.ibb.co/20YpD4S/68.jpg',
    'https://i.ibb.co/7Fp37PV/69.jpg',
    'https://i.ibb.co/BVRDw3x/70.jpg',
    'https://i.ibb.co/MD4bmKH/71.jpg',
    'https://i.ibb.co/HTXY1dt/72.jpg',
    'https://i.ibb.co/nMczySB/73.jpg',
    'https://i.ibb.co/8npzG3z/74.jpg',
    'https://i.ibb.co/LDk0mqp/75.jpg',
    'https://i.ibb.co/4wxTwhP/76.jpg',

    // URLs encontradas nos scripts
    'https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp',
    'https://i.ibb.co/LzDqR5H/ondulado-6-45cm.webp'
  ],
  'images.pexels.com': [
    'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ],
  'images.unsplash.com': [
    // URLs encontradas no products-complete.json
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop'
  ]
};

// Configurações
const CONFIG = {
  downloadDir: path.join(__dirname, '..', 'public', 'images', 'downloads'),
  timeout: 30000, // 30 segundos
  maxRetries: 3,
  concurrency: 5, // Download de 5 imagens simultaneamente
  quality: {
    webp: 80,
    jpg: 85,
    png: 90
  }
};

// Utilitários
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateFileName = (url, index = 0) => {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/');
  const originalName = pathParts[pathParts.length - 1];
  const ext = path.extname(originalName) || '.jpg';
  const baseName = path.basename(originalName, ext);

  // Gerar nome único baseado no URL
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
  const fileName = index > 0 ? `${baseName}_${hash}_${index}${ext}` : `${baseName}_${hash}${ext}`;

  return fileName.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout downloading ${url}`));
    }, CONFIG.timeout);

    const request = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      if (response.statusCode === 200) {
        const file = createWriteStream(filepath);
        response.pipe(file);

        file.on('finish', () => {
          clearTimeout(timeout);
          file.close();
          resolve(filepath);
        });

        file.on('error', (err) => {
          clearTimeout(timeout);
          fs.unlink(filepath).catch(() => {});
          reject(err);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        clearTimeout(timeout);
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location for ${url}`));
        }
      } else {
        clearTimeout(timeout);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
    });

    request.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    request.on('timeout', () => {
      clearTimeout(timeout);
      request.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });

    request.setTimeout(CONFIG.timeout);
  });
};

const downloadWithRetry = async (url, filepath, retries = CONFIG.maxRetries) => {
  for (let i = 0; i <= retries; i++) {
    try {
      await downloadImage(url, filepath);
      return filepath;
    } catch (error) {
      console.log(`Tentativa ${i + 1}/${retries + 1} falhou para ${url}: ${error.message}`);
      if (i === retries) {
        throw error;
      }
      await sleep(1000 * (i + 1)); // Backoff exponencial
    }
  }
};

const processImageBatch = async (urls, batchIndex) => {
  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const fileName = generateFileName(url, batchIndex * CONFIG.concurrency + i);
    const filepath = path.join(CONFIG.downloadDir, fileName);

    try {
      console.log(`📸 Baixando: ${url}`);
      await downloadWithRetry(url, filepath);
      console.log(`✅ Sucesso: ${fileName}`);
      results.push({
        success: true,
        url,
        filepath,
        fileName,
        error: null
      });
    } catch (error) {
      console.log(`❌ Erro: ${url} - ${error.message}`);
      results.push({
        success: false,
        url,
        filepath: null,
        fileName: null,
        error: error.message
      });
    }
  }

  return results;
};

const replaceUrlsInFile = async (filePath, urlMappings) => {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let replaced = false;

    for (const [oldUrl, newPath] of Object.entries(urlMappings)) {
      if (content.includes(oldUrl)) {
        content = content.replace(new RegExp(escapeRegExp(oldUrl), 'g'), newPath);
        replaced = true;
      }
    }

    if (replaced) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`🔄 Atualizado: ${path.basename(filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}: ${error.message}`);
    return false;
  }
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const findFilesToUpdate = async (rootDir) => {
  const files = [];
  const extensions = ['.html', '.js', '.ts', '.tsx', '.json'];

  const searchDir = async (dir) => {
    try {
      const items = await fs.readdir(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          await searchDir(fullPath);
        } else if (item.isFile() && extensions.includes(path.extname(item.name))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(`⚠️  Não foi possível acessar: ${dir}`);
    }
  };

  await searchDir(rootDir);
  return files;
};

const generateImageReport = (results) => {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  const report = {
    summary: {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: `${((successful.length / results.length) * 100).toFixed(1)}%`
    },
    successful: successful.map(r => ({
      url: r.url,
      fileName: r.fileName,
      size: 'N/A' // Pode ser implementado posteriormente
    })),
    failed: failed.map(r => ({
      url: r.url,
      error: r.error
    })),
    urlMappings: {}
  };

  // Criar mapeamento de URLs antigas para novas
  successful.forEach(result => {
    report.urlMappings[result.url] = `/images/downloads/${result.fileName}`;
  });

  return report;
};

// Função principal
async function main() {
  console.log('🚀 Iniciando download de imagens externas...\n');

  // Criar diretório de download
  try {
    await fs.mkdir(CONFIG.downloadDir, { recursive: true });
    console.log(`📁 Diretório criado: ${CONFIG.downloadDir}`);
  } catch (error) {
    console.error('❌ Erro ao criar diretório:', error.message);
    process.exit(1);
  }

  // Coletar todas as URLs
  const allUrls = [];
  Object.values(IMAGE_URLS).forEach(urls => {
    allUrls.push(...urls);
  });

  console.log(`📊 Total de imagens a baixar: ${allUrls.length}\n`);

  // Processar em lotes
  const results = [];
  for (let i = 0; i < allUrls.length; i += CONFIG.concurrency) {
    const batch = allUrls.slice(i, i + CONFIG.concurrency);
    const batchIndex = Math.floor(i / CONFIG.concurrency);

    console.log(`📦 Processando lote ${batchIndex + 1}/${Math.ceil(allUrls.length / CONFIG.concurrency)}`);

    const batchResults = await processImageBatch(batch, batchIndex);
    results.push(...batchResults);

    // Pausa entre lotes para evitar sobrecarga
    if (i + CONFIG.concurrency < allUrls.length) {
      await sleep(1000);
    }
  }

  // Gerar relatório
  const report = generateImageReport(results);

  console.log('\n📊 RELATÓRIO FINAL:');
  console.log(`Total: ${report.summary.total}`);
  console.log(`Sucessos: ${report.summary.successful}`);
  console.log(`Falhas: ${report.summary.failed}`);
  console.log(`Taxa de sucesso: ${report.summary.successRate}\n`);

  // Salvar relatório
  const reportPath = path.join(__dirname, 'image-download-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Relatório salvo em: ${reportPath}`);

  // Perguntar se deve substituir URLs nos arquivos
  if (report.summary.successful > 0) {
    console.log('\n🔄 Iniciando substituição de URLs nos arquivos...');

    const projectRoot = path.join(__dirname, '..');
    const filesToUpdate = await findFilesToUpdate(projectRoot);

    console.log(`📁 Encontrados ${filesToUpdate.length} arquivos para verificar`);

    let updatedFiles = 0;
    for (const filePath of filesToUpdate) {
      const wasUpdated = await replaceUrlsInFile(filePath, report.urlMappings);
      if (wasUpdated) {
        updatedFiles++;
      }
    }

    console.log(`\n✅ Processo concluído!`);
    console.log(`📄 Arquivos atualizados: ${updatedFiles}`);
    console.log(`🖼️  Imagens baixadas: ${report.summary.successful}`);
  }

  if (report.summary.failed > 0) {
    console.log('\n⚠️  Algumas imagens falharam no download. Verifique o relatório para detalhes.');
    report.failed.forEach(failure => {
      console.log(`   ❌ ${failure.url}: ${failure.error}`);
    });
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = { main, CONFIG, IMAGE_URLS };