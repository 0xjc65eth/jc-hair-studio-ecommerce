#!/usr/bin/env node
/**
 * Script para download das imagens do Google Drive para mega hair
 * Substitui as imagens placeholder pelas imagens reais fornecidas
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Lista de URLs do Google Drive fornecidas
const GDRIVE_URLS = [
  "https://drive.google.com/file/d/1mTL722osDZ7DyLDvt7WpA526jK26Tnca/view?usp=drive_link",
  "https://drive.google.com/file/d/1asEAZVwjuCDZGsicO__onkCDYam0biDD/view?usp=sharing",
  "https://drive.google.com/file/d/1ped80P4IZJgbfoMHs4rJi_vm1oEW6yrk/view?usp=sharing",
  "https://drive.google.com/file/d/1SYSuDRYi-DHBnGJ2M1aJT83D2rl7MQ5Q/view?usp=sharing",
  "https://drive.google.com/file/d/1CyNl67KGS3qemefCCHLDmWhe33R3PcGf/view?usp=sharing",
  "https://drive.google.com/file/d/1O1JETzrcoN8Svzt_sZeqYoIcAntHj02o/view?usp=sharing",
  "https://drive.google.com/file/d/1OXy7eBvm7_IOmJg4CN4-ll7mB0mprWLP/view?usp=sharing",
  "https://drive.google.com/file/d/120MGbp8wtIoG9vH7ZhMOlOhh1kD-Fujy/view?usp=sharing",
  "https://drive.google.com/file/d/15c9wdJN54vwyfrl8L4uP0u59AN8CMVkY/view?usp=sharing",
  "https://drive.google.com/file/d/1FFei2Sum49dWsEq3vkD4SA-MEPvypsRL/view?usp=sharing",
  "https://drive.google.com/file/d/1FFei2Sum49dWsEq3vkD4SA-MEPvypsRL/view?usp=sharing",
  "https://drive.google.com/file/d/1eKvfHuLr1MQP6A8ai_Ezt_6903onr8gP/view?usp=sharing",
  "https://drive.google.com/file/d/1Mylo-fTRZcTedhNiMoXtmdv5_gi7izOS/view?usp=sharing",
  "https://drive.google.com/file/d/1eWIBFLHMTvwIzDA6gxe3m2CjwjCd581V/view?usp=sharing",
  "https://drive.google.com/file/d/1iEA3WTf1AduT8HDzw2BNh-wesCp_VyVK/view?usp=sharing",
  "https://drive.google.com/file/d/1c6__0i02H8Du9vofIggch7aTpvcCX7wA/view?usp=sharing",
  "https://drive.google.com/file/d/1CL_Ilh2ZIVwpyfVTKk4oWSWyctYBiRs9/view?usp=sharing",
  "https://drive.google.com/file/d/1IIWr8F2s2hsaJIOEyKdwPDIOIc2a7eeC/view?usp=sharing",
  "https://drive.google.com/file/d/1HZqxDRdJhNypiSVFR5-O1yLV19UAtFOA/view?usp=sharing",
  "https://drive.google.com/file/d/1f0SUiWv_dU6hlszrzOUkABhYdKaR5pya/view?usp=sharing",
  "https://drive.google.com/file/d/1jYXXZPtgrl1CtIxmtbulwF-V_v1n9vp8/view?usp=sharing",
  "https://drive.google.com/file/d/1ztjZFPs5XNbhJUVbT1Ye3se87pb28P-l/view?usp=sharing",
  "https://drive.google.com/file/d/15dQnKsAFgnph0D2MXzaI8q4eNS7D3hAL/view?usp=sharing",
  "https://drive.google.com/file/d/1d7c80rj4Zgf89VKj4r7jBPd8ord_h8gh/view?usp=sharing",
  "https://drive.google.com/file/d/1WOWKozxJP-uKEqxoI6InLvjTX_TlvWsw/view?usp=sharing",
  "https://drive.google.com/file/d/11KkXEIMxHk4Kcq_IKX8gvfVZaEga8erP/view?usp=sharing",
  "https://drive.google.com/file/d/1nNVivtAkYl58oNLiyWy9mYXN7-Zdsp2e/view?usp=sharing",
  "https://drive.google.com/file/d/1fE-K8XM9QOqSLGZbi1EPxRA_u8jjHusC/view?usp=sharing",
  "https://drive.google.com/file/d/1k2xM_4K1MnPiK-Z7z1S1oOrgSEGHq5Gb/view?usp=sharing",
  "https://drive.google.com/file/d/1UBa3B2OJnV6m9yywgJXRUJ3B2OQfgk5A/view?usp=sharing",
  "https://drive.google.com/file/d/1hj_8-Sij8z-HgoiTz9zaJA7Vp6aUfMqd/view?usp=sharing",
  "https://drive.google.com/file/d/1rqwVikOHbh1ajPdV0PrXbJsiElgE_04-/view?usp=sharing",
  "https://drive.google.com/file/d/1wNFv6lZFZZMmhLkkU2ldP8ofUiACXrCS/view?usp=sharing",
  "https://drive.google.com/file/d/1ADQ46lm--umz8oDk3eE0yYbeNRkhC1-z/view?usp=sharing",
  "https://drive.google.com/file/d/1Z0-bIQvpuB_xbjhxI2h3SS4JeDMaawNf/view?usp=sharing",
  "https://drive.google.com/file/d/1J5yquFfUae2a-59jR7zomk-k_XWpcq4G/view?usp=sharing",
  "https://drive.google.com/file/d/1WWpOsUoolXJK5oIW-h1ARomhKVQ8iOxU/view?usp=sharing",
  "https://drive.google.com/file/d/1uwjIoLmup16qF4zIZEViMz51BlzxX9Tw/view?usp=sharing",
  "https://drive.google.com/file/d/1HA0FTTfW8Hj_fuKAnkDF48w5vFbeDTQc/view?usp=sharing",
  "https://drive.google.com/file/d/17B4r7vpI_-bakyBrMm70F97HL-6upIvZ/view?usp=sharing",
  "https://drive.google.com/file/d/1QW6J3q6NJkfOeTHSyYPFOKgUhJz6eaq4/view?usp=sharing",
  "https://drive.google.com/file/d/17533azn0YjmUbP9mJJI8n35aOsLqy7NN/view?usp=sharing",
  "https://drive.google.com/file/d/1bd3SwQ5n2VupSKumF72WABQ7NeMrIh5B/view?usp=sharing",
  "https://drive.google.com/file/d/1msl_ZNcMYl4onE-iuB36CIBNj9QmTTlb/view?usp=sharing",
  "https://drive.google.com/file/d/1q_k99oL_TfCOshgc3xRntOkzAUm3QRsw/view?usp=sharing",
  "https://drive.google.com/file/d/126z95LHMz9MwTT6YVHibVGJvB5NfMbmu/view?usp=sharing",
  "https://drive.google.com/file/d/17aCkUySpI8RRgsGOui7nR3gE1kamR56p/view?usp=sharing",
  "https://drive.google.com/file/d/1la93pEsSWlqR_5Nd0Q_fEPX-s86YsDLB/view?usp=sharing",
  "https://drive.google.com/file/d/1Xlk_qE5SOfp5EvXes5zOJpc_F57zjfJH/view?usp=sharing",
  "https://drive.google.com/file/d/1KauRt9wM7pqq6xlwZ1KXuP5g98H4ZWm-/view?usp=sharing",
  "https://drive.google.com/file/d/1IS3EyLO7k7xvRn9yS9rERfwzA0-GAfyB/view?usp=sharing",
  "https://drive.google.com/file/d/1rK0uOKvYqG0IHcnEQ1c4T_BPke9QzNwo/view?usp=sharing",
  "https://drive.google.com/file/d/1OoJedhR40fVE2q7RNQjOcWLxkgYaS6MB/view?usp=sharing",
  "https://drive.google.com/file/d/1BW9wUXGwf_FdpOFDqKCUUcPCkqpnbZ0z/view?usp=sharing",
  "https://drive.google.com/file/d/181BkKjE4G7FZ-B-UmKOnqHsfjGps4Jk-/view?usp=sharing",
  "https://drive.google.com/file/d/1VSb9pWxQa4UxQwX8vPFmFTghElmqUPyS/view?usp=sharing",
  "https://drive.google.com/file/d/1HrqOKK9x71mAyPzAtOOAPPIuz8GzusV8/view?usp=sharing",
  "https://drive.google.com/file/d/1pzVz9YBNZPycNz2tpavF0J9z5JeLA6t9/view?usp=sharing",
  "https://drive.google.com/file/d/1xQ7DpZR83F6vGaqQ5-hzKHVnBgK2F5k0/view?usp=sharing",
  "https://drive.google.com/file/d/1qCMNXDInLRYJ0pMpm7GY32Vu94GtAJbr/view?usp=sharing",
  "https://drive.google.com/file/d/1PUKbFI4mnbUPLrRkCKYGXbEGIHgyUk82/view?usp=sharing",
  "https://drive.google.com/file/d/1C08lvAv4OazjSDRVPFLVmPP3wD5DRIfz/view?usp=sharing",
  "https://drive.google.com/file/d/1uM1JmyW5OrepkFE8xvfi_x2IjUu9dtCz/view?usp=sharing",
  "https://drive.google.com/file/d/1eS7ADkQUdnH3RwSTpWKJt5jYzscd958X/view?usp=sharing",
  "https://drive.google.com/file/d/1EpJbop9yhBO2jSCcF2rmptcu63zjcKEj/view?usp=sharing",
  "https://drive.google.com/file/d/1MLcgUlmq_13ioErJRVFfLLZBgisN6dc4/view?usp=sharing",
  "https://drive.google.com/file/d/1GsQ9C1FFavHmjGPKqZW8ZQR01LzKwm7I/view?usp=sharing",
  "https://drive.google.com/file/d/1m8qLWu_x1wZ-Cx7SpqoSwqAIToqOemxc/view?usp=sharing",
  "https://drive.google.com/file/d/16p43BgCHUqMJ4e6wwKQaNe27Vo_ZZqVL/view?usp=sharing",
  "https://drive.google.com/file/d/1Yv3Totd5eIQUGOJlhjdqUDo-YIWtGsJp/view?usp=sharing",
  "https://drive.google.com/file/d/1FXQoKQl0t8CinL6inq5jsAooceGfBGMF/view?usp=sharing",
  "https://drive.google.com/file/d/19VIXVKV2LaVWFk1LXYd2hyyIFldYIspN/view?usp=sharing",
  "https://drive.google.com/file/d/1YouVYIsaQAEEKVxxVYcZd8n2qVFm2mBi/view?usp=sharing",
  "https://drive.google.com/file/d/16v00E0cTDNnUO2OTAf3t-cSxRbI7jBYu/view?usp=sharing",
  "https://drive.google.com/file/d/1eYG9foP0ZQygROgdcr1_p38ndQZh4vvs/view?usp=sharing",
  "https://drive.google.com/file/d/1wjBkD0HTJmG2mppcOg1OTHn3nFMznX0V/view?usp=sharing",
  "https://drive.google.com/file/d/1wQtoEsJTZjXwxh-a7x1dc0-oDlRi0NUk/view?usp=sharing"
];

// Configurações
const CONFIG = {
  downloadDir: path.join(__dirname, '..', 'public', 'images', 'mega-hair'),
  timeout: 45000, // 45 segundos
  maxRetries: 3,
  concurrency: 3, // Download de 3 imagens simultaneamente para evitar rate limits
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

// Download de imagem com retry
const downloadImage = (url, filepath) => {
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
        downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
        return;
      }

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
      await downloadImage(directUrl, filepath);
      return filepath;
    } catch (error) {
      console.log(`⚠️  Tentativa ${i + 1}/${retries + 1} falhou para ${url}`);
      if (i === retries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Backoff
    }
  }
};

const processImageBatch = async (urls, batchIndex) => {
  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const imageIndex = batchIndex * CONFIG.concurrency + i + 1;
    const fileName = `mega-hair-${String(imageIndex).padStart(3, '0')}.jpg`;
    const filepath = path.join(CONFIG.downloadDir, fileName);

    try {
      console.log(`📸 [${imageIndex}/73] Baixando: ${url}`);
      await downloadWithRetry(url, filepath);
      console.log(`✅ Sucesso: ${fileName}`);
      results.push({
        success: true,
        url,
        filepath,
        fileName,
        imageIndex,
        error: null
      });
    } catch (error) {
      console.log(`❌ Erro: ${url} - ${error.message}`);
      results.push({
        success: false,
        url,
        filepath: null,
        fileName: null,
        imageIndex,
        error: error.message
      });
    }

    // Pausa entre downloads para evitar rate limits
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
};

// Atualizar sistema de produtos para usar novas imagens
const updateMegaHairProducts = async (results) => {
  const productFile = path.join(__dirname, '..', 'lib', 'data', 'megaHairProducts.ts');

  try {
    let content = await fs.readFile(productFile, 'utf-8');

    // Substituir placeholders por imagens reais
    content = content.replace(
      /url: `\/images\/placeholders\/mega-hair-placeholder\.svg`/g,
      'url: `/images/mega-hair/mega-hair-${String(skuCounter).padStart(3, "0")}.jpg`'
    );

    content = content.replace(
      /image: `\/images\/placeholders\/mega-hair-placeholder\.svg`/g,
      'image: `/images/mega-hair/mega-hair-${String(skuCounter).padStart(3, "0")}.jpg`'
    );

    await fs.writeFile(productFile, content, 'utf-8');
    console.log('✅ Sistema de produtos atualizado para usar imagens reais!');
  } catch (error) {
    console.error('❌ Erro ao atualizar sistema de produtos:', error.message);
  }
};

// Função principal
async function main() {
  console.log('🚀 Iniciando download de 73 imagens do Google Drive para mega hair...\n');

  // Criar diretório de download
  try {
    await fs.mkdir(CONFIG.downloadDir, { recursive: true });
    console.log(`📁 Diretório criado: ${CONFIG.downloadDir}\n`);
  } catch (error) {
    console.error('❌ Erro ao criar diretório:', error.message);
    process.exit(1);
  }

  // Remover duplicatas mantendo ordem
  const uniqueUrls = [...new Set(GDRIVE_URLS)];
  console.log(`📊 Total de imagens únicas a baixar: ${uniqueUrls.length}\n`);

  // Processar em lotes pequenos para evitar rate limits
  const results = [];
  for (let i = 0; i < uniqueUrls.length; i += CONFIG.concurrency) {
    const batch = uniqueUrls.slice(i, i + CONFIG.concurrency);
    const batchIndex = Math.floor(i / CONFIG.concurrency);

    console.log(`📦 Processando lote ${batchIndex + 1}/${Math.ceil(uniqueUrls.length / CONFIG.concurrency)}`);

    const batchResults = await processImageBatch(batch, batchIndex);
    results.push(...batchResults);

    // Pausa maior entre lotes
    if (i + CONFIG.concurrency < uniqueUrls.length) {
      console.log('⏳ Pausando 3 segundos entre lotes...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Relatório final
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log('\n🎉 DOWNLOAD CONCLUÍDO!');
  console.log(`✅ Sucessos: ${successful.length}`);
  console.log(`❌ Falhas: ${failed.length}`);
  console.log(`📊 Taxa de sucesso: ${((successful.length / results.length) * 100).toFixed(1)}%\n`);

  if (successful.length > 0) {
    console.log('🔄 Atualizando sistema de produtos para usar imagens reais...');
    await updateMegaHairProducts(results);
  }

  if (failed.length > 0) {
    console.log('\n⚠️  URLs que falharam:');
    failed.forEach((failure, index) => {
      console.log(`   ${index + 1}. ${failure.url}`);
      console.log(`      Erro: ${failure.error}`);
    });
  }

  console.log('\n🎯 Processo concluído! As imagens foram organizadas como mega-hair-001.jpg, mega-hair-002.jpg, etc.');
}

// Executar
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = { main };