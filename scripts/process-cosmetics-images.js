#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

// URLs do Google Drive fornecidas
const DRIVE_URLS = [
  'https://drive.google.com/file/d/1-C95wTFlqmZ84Zh3LUYPrbzWtwvGcBaj/view?usp=sharing',
  'https://drive.google.com/file/d/101ifAGkppXAOPVe5XqL-feKlvNU1cn1C/view?usp=sharing',
  'https://drive.google.com/file/d/10NWcjJj2HlTTDCQFntblimNA3KAEVWz5/view?usp=sharing',
  'https://drive.google.com/file/d/10Z6hIOKZ2ozGgphiMdIQiqzO2pavahO-/view?usp=sharing',
  'https://drive.google.com/file/d/10lK-RsY4p36oFLtEZAAksAUKplyv2jUD/view?usp=sharing',
  'https://drive.google.com/file/d/113TE6yHOVIchiVDJAWp5wfA51FxM0QLX/view?usp=sharing',
  'https://drive.google.com/file/d/124TkuKBAhmvC91bcdIcHLmkhIcMrjEfZ/view?usp=sharing',
  'https://drive.google.com/file/d/12n_c8dX_3d-zsxles6eL395LcGvd0GNT/view?usp=sharing',
  'https://drive.google.com/file/d/13TbiVbl-QS6v-wfo2ivlhUWc56pRVc8h/view?usp=sharing',
  'https://drive.google.com/file/d/15eXgmXJJFmbs-nuYm-JLIs4B6TxuPpWa/view?usp=sharing',
  'https://drive.google.com/file/d/160kPr90NEM69PLN32nowHDRapeAyXNYZ/view?usp=sharing',
  'https://drive.google.com/file/d/174o0Msm1DZAj2ccoEG6OAeazPs7BuNL-/view?usp=sharing',
  'https://drive.google.com/file/d/18AO7QNEjprhZxigrj7RMT47ad_YVDdVa/view?usp=sharing',
  'https://drive.google.com/file/d/18iXNdlX8ob6ducMCWjhHPv_4vZ8qrS7a/view?usp=sharing',
  'https://drive.google.com/file/d/195OmXeggxWoQ6rDek3Xpq7UhAj7QJeqO/view?usp=sharing',
  'https://drive.google.com/file/d/197NMWjMumC0eJplpfcHias-XesUyM5Ue/view?usp=sharing',
  'https://drive.google.com/file/d/197Qhn5_7_wXaWARsyKDLJGsETfnHM_BD/view?usp=sharing',
  'https://drive.google.com/file/d/19rrSeH4FG6mETURNNR5YkYacj7ZGgCKu/view?usp=sharing',
  'https://drive.google.com/file/d/1AXNd13-xlyzNCcaOmKrua6Vw8VoumFXz/view?usp=sharing',
  'https://drive.google.com/file/d/1B8Va9Mqz0eUjWKWWUNIiglfGv0eErcfj/view?usp=sharing',
  'https://drive.google.com/file/d/1BeLU37ErPUDFp1iZP9lXA9H2nzLc6xcU/view?usp=sharing',
  'https://drive.google.com/file/d/1CbPcESLSxUht8OU529DuMDHY3J_2PbXq/view?usp=sharing',
  'https://drive.google.com/file/d/1DZ0Vwf3iDOg7uPeHXA5PtD2ZgKC497Ps/view?usp=sharing',
  'https://drive.google.com/file/d/1Dtpeu14OkqVS3iRh5_zi-HWEFdIkuqf7/view?usp=sharing',
  'https://drive.google.com/file/d/1E7LJRDZGYUD50Y6QHlsv3koPs5EPGI5o/view?usp=sharing',
  'https://drive.google.com/file/d/1FGp_6VUty_PgFy6-K6H2R7YJi0kzePIH/view?usp=sharing',
  'https://drive.google.com/file/d/1FpDML61zSjreQvZQ53eP0_Q1emNpGLFC/view?usp=sharing',
  'https://drive.google.com/file/d/1HBt4bHfbjyoPCJQvwScWVBda0Kjl2UfZ/view?usp=sharing',
  'https://drive.google.com/file/d/1I3khobeDfMRpi4RRuRTWjAmV5PbNuf_d/view?usp=sharing',
  'https://drive.google.com/file/d/1JL2tBCiv92ngcw5pb1UlX4W6H6z9aZvV/view?usp=sharing',
  'https://drive.google.com/file/d/1JP5TRZCtWGcPNG_3_W9WFksdyoOqP1Yx/view?usp=sharing',
  'https://drive.google.com/file/d/1JQ_DEZ7IBbsvbg56GnWznRpSPUNh3C4w/view?usp=sharing'
];

// Categorias de cosméticos para organização
const COSMETICS_CATEGORIES = {
  'batom': ['batom', 'lipstick', 'labial', 'lip'],
  'base': ['base', 'foundation', 'fundacao'],
  'sombra': ['sombra', 'eyeshadow', 'paleta'],
  'blush': ['blush', 'rouge'],
  'rimel': ['rimel', 'mascara', 'cilios'],
  'delineador': ['delineador', 'eyeliner', 'kajal'],
  'corretivo': ['corretivo', 'concealer'],
  'po': ['po', 'powder', 'pó'],
  'bronzer': ['bronzer', 'bronzeador'],
  'primer': ['primer', 'pre-base'],
  'outros': []
};

class CosmeticsImageProcessor {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'public', 'images', 'cosmeticos');
    this.metadata = {
      processedAt: new Date().toISOString(),
      totalImages: 0,
      categories: {},
      successfulDownloads: 0,
      failedDownloads: 0,
      images: []
    };
    this.errors = [];
  }

  // Converter URL do Google Drive para URL de download direto
  convertGoogleDriveUrl(url) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return null;
  }

  // Detectar categoria baseada no nome do arquivo
  detectCategory(filename) {
    const lowerFilename = filename.toLowerCase();

    for (const [category, keywords] of Object.entries(COSMETICS_CATEGORIES)) {
      if (category === 'outros') continue;

      for (const keyword of keywords) {
        if (lowerFilename.includes(keyword)) {
          return category;
        }
      }
    }

    return 'outros';
  }

  // Criar estrutura de diretórios
  async createDirectories() {
    const categories = Object.keys(COSMETICS_CATEGORIES);

    for (const category of categories) {
      const categoryDir = path.join(this.outputDir, category);
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
        console.log(`Criado diretório: ${categoryDir}`);
      }
    }
  }

  // Download de uma imagem
  async downloadImage(url, filename, category) {
    return new Promise((resolve, reject) => {
      const downloadUrl = this.convertGoogleDriveUrl(url);
      if (!downloadUrl) {
        reject(new Error('URL inválida do Google Drive'));
        return;
      }

      const filePath = path.join(this.outputDir, category, filename);
      const file = fs.createWriteStream(filePath);

      https.get(downloadUrl, (response) => {
        // Verificar se é um redirecionamento
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location;
          https.get(redirectUrl, (redirectResponse) => {
            redirectResponse.pipe(file);

            file.on('finish', () => {
              file.close();
              resolve({
                success: true,
                filePath,
                size: fs.statSync(filePath).size
              });
            });
          }).on('error', reject);
        } else {
          response.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve({
              success: true,
              filePath,
              size: fs.statSync(filePath).size
            });
          });
        }
      }).on('error', reject);

      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Remove arquivo parcial
        reject(err);
      });
    });
  }

  // Processar todas as URLs
  async processUrls() {
    console.log(`Iniciando processamento de ${DRIVE_URLS.length} URLs...`);

    await this.createDirectories();

    for (let i = 0; i < DRIVE_URLS.length; i++) {
      const url = DRIVE_URLS[i];
      console.log(`\nProcessando ${i + 1}/${DRIVE_URLS.length}: ${url}`);

      try {
        // Extrair ID do arquivo para criar nome único
        const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (!fileIdMatch) {
          throw new Error('ID do arquivo não encontrado na URL');
        }

        const fileId = fileIdMatch[1];
        const filename = `cosmetic_${fileId}.jpg`; // Assumindo JPG por padrão
        const category = this.detectCategory(filename);

        const result = await this.downloadImage(url, filename, category);

        if (result.success) {
          this.metadata.successfulDownloads++;

          // Adicionar aos metadados
          const imageMetadata = {
            id: fileId,
            originalUrl: url,
            filename: filename,
            category: category,
            filePath: `/images/cosmeticos/${category}/${filename}`,
            size: result.size,
            downloadedAt: new Date().toISOString()
          };

          this.metadata.images.push(imageMetadata);

          // Contar por categoria
          if (!this.metadata.categories[category]) {
            this.metadata.categories[category] = 0;
          }
          this.metadata.categories[category]++;

          console.log(`✅ Sucesso: ${filename} (${result.size} bytes) -> ${category}`);
        }

      } catch (error) {
        this.metadata.failedDownloads++;
        this.errors.push({
          url: url,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.log(`❌ Erro: ${error.message}`);
      }

      // Pequeno delay para não sobrecarregar o servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.metadata.totalImages = this.metadata.successfulDownloads;
  }

  // Salvar metadados
  async saveMetadata() {
    const metadataPath = path.join(this.outputDir, 'metadata.json');
    const errorsPath = path.join(this.outputDir, 'errors.json');

    fs.writeFileSync(metadataPath, JSON.stringify(this.metadata, null, 2));
    console.log(`Metadados salvos em: ${metadataPath}`);

    if (this.errors.length > 0) {
      fs.writeFileSync(errorsPath, JSON.stringify(this.errors, null, 2));
      console.log(`Erros salvos em: ${errorsPath}`);
    }
  }

  // Gerar relatório
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('RELATÓRIO DE PROCESSAMENTO DE IMAGENS');
    console.log('='.repeat(60));
    console.log(`Total de URLs processadas: ${DRIVE_URLS.length}`);
    console.log(`Downloads bem-sucedidos: ${this.metadata.successfulDownloads}`);
    console.log(`Downloads falharam: ${this.metadata.failedDownloads}`);
    console.log(`Taxa de sucesso: ${((this.metadata.successfulDownloads / DRIVE_URLS.length) * 100).toFixed(2)}%`);

    console.log('\nDistribuição por categoria:');
    for (const [category, count] of Object.entries(this.metadata.categories)) {
      console.log(`  ${category}: ${count} imagens`);
    }

    console.log(`\nImagens salvas em: ${this.outputDir}`);
    console.log(`Estrutura de pastas criada para: ${Object.keys(COSMETICS_CATEGORIES).join(', ')}`);

    if (this.errors.length > 0) {
      console.log(`\n⚠️  ${this.errors.length} erros encontrados. Ver errors.json para detalhes.`);
    }

    console.log('\n✅ Processamento concluído!');
    console.log('='.repeat(60));
  }

  // Executar todo o processo
  async run() {
    try {
      console.log('🚀 Iniciando processamento de imagens de cosméticos...\n');

      await this.processUrls();
      await this.saveMetadata();
      this.generateReport();

      return {
        success: true,
        metadata: this.metadata,
        errors: this.errors
      };
    } catch (error) {
      console.error('❌ Erro fatal:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const processor = new CosmeticsImageProcessor();
  processor.run().then((result) => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = CosmeticsImageProcessor;