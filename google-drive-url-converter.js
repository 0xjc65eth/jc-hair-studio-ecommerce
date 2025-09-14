/**
 * Google Drive URL Converter - Converte URLs de compartilhamento para URLs diretas
 * Criado para processar mais de 100 URLs do Google Drive em lote
 */

class GoogleDriveConverter {
    constructor() {
        this.urlPatterns = {
            // Padrões de URL do Google Drive
            shareUrl: /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/,
            openUrl: /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
            fileId: /([a-zA-Z0-9_-]{25,})/
        };

        this.directUrlFormats = {
            // Diferentes formatos de URL direta
            download: 'https://drive.google.com/uc?export=download&id={FILE_ID}',
            view: 'https://drive.google.com/uc?id={FILE_ID}',
            thumbnail: 'https://lh3.googleusercontent.com/d/{FILE_ID}',
            thumbnailSized: 'https://lh3.googleusercontent.com/d/{FILE_ID}=w{WIDTH}-h{HEIGHT}'
        };
    }

    /**
     * Extrai o File ID de uma URL do Google Drive
     * @param {string} url - URL do Google Drive
     * @returns {string|null} - File ID ou null se não encontrado
     */
    extractFileId(url) {
        // Tenta diferentes padrões
        for (const [name, pattern] of Object.entries(this.urlPatterns)) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        return null;
    }

    /**
     * Converte uma URL para formato direto
     * @param {string} url - URL original do Google Drive
     * @param {string} format - Formato desejado ('download', 'view', 'thumbnail', 'thumbnailSized')
     * @param {Object} options - Opções adicionais (width, height para thumbnails)
     * @returns {Object} - Resultado da conversão
     */
    convertUrl(url, format = 'view', options = {}) {
        const fileId = this.extractFileId(url);

        if (!fileId) {
            return {
                success: false,
                originalUrl: url,
                error: 'Não foi possível extrair o File ID da URL'
            };
        }

        let directUrl = this.directUrlFormats[format];
        if (!directUrl) {
            return {
                success: false,
                originalUrl: url,
                error: `Formato '${format}' não suportado`
            };
        }

        // Substitui o FILE_ID
        directUrl = directUrl.replace('{FILE_ID}', fileId);

        // Para thumbnails com dimensões personalizadas
        if (format === 'thumbnailSized') {
            const width = options.width || 600;
            const height = options.height || 600;
            directUrl = directUrl.replace('{WIDTH}', width).replace('{HEIGHT}', height);
        }

        return {
            success: true,
            originalUrl: url,
            fileId: fileId,
            directUrl: directUrl,
            format: format
        };
    }

    /**
     * Processa uma lista de URLs em lote
     * @param {string[]} urls - Array de URLs do Google Drive
     * @param {string} format - Formato desejado para todas as URLs
     * @param {Object} options - Opções adicionais
     * @returns {Object[]} - Array com resultados da conversão
     */
    convertBatch(urls, format = 'view', options = {}) {
        const results = {
            successful: [],
            failed: [],
            summary: {
                total: urls.length,
                successful: 0,
                failed: 0
            }
        };

        urls.forEach((url, index) => {
            const result = this.convertUrl(url, format, options);
            result.index = index;

            if (result.success) {
                results.successful.push(result);
                results.summary.successful++;
            } else {
                results.failed.push(result);
                results.summary.failed++;
            }
        });

        return results;
    }

    /**
     * Gera diferentes formatos para uma URL
     * @param {string} url - URL original do Google Drive
     * @returns {Object} - Objeto com diferentes formatos
     */
    generateAllFormats(url) {
        const fileId = this.extractFileId(url);

        if (!fileId) {
            return {
                success: false,
                error: 'Não foi possível extrair o File ID da URL'
            };
        }

        return {
            success: true,
            originalUrl: url,
            fileId: fileId,
            formats: {
                download: this.directUrlFormats.download.replace('{FILE_ID}', fileId),
                view: this.directUrlFormats.view.replace('{FILE_ID}', fileId),
                thumbnail: this.directUrlFormats.thumbnail.replace('{FILE_ID}', fileId),
                thumbnail300: this.directUrlFormats.thumbnailSized
                    .replace('{FILE_ID}', fileId)
                    .replace('{WIDTH}', '300')
                    .replace('{HEIGHT}', '300'),
                thumbnail600: this.directUrlFormats.thumbnailSized
                    .replace('{FILE_ID}', fileId)
                    .replace('{WIDTH}', '600')
                    .replace('{HEIGHT}', '600'),
                thumbnail1200: this.directUrlFormats.thumbnailSized
                    .replace('{FILE_ID}', fileId)
                    .replace('{WIDTH}', '1200')
                    .replace('{HEIGHT}', '1200')
            }
        };
    }
}

// Função utilitária para uso no Node.js
function convertGoogleDriveUrls(urls, format = 'view', options = {}) {
    const converter = new GoogleDriveConverter();
    return converter.convertBatch(urls, format, options);
}

// Exemplo de uso
const exampleUrls = [
    'https://drive.google.com/file/d/1-8vowAYefIp4OFijb2WlfhhzOX9pIIO9/view?usp=sharing',
    'https://drive.google.com/file/d/1-I3OgcBq4j_iZuYUQ2mDFNeZSvdyTHGY/view?usp=sharing'
];

// Exemplo de conversão
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GoogleDriveConverter, convertGoogleDriveUrls };
} else {
    // Para uso no browser
    window.GoogleDriveConverter = GoogleDriveConverter;
    window.convertGoogleDriveUrls = convertGoogleDriveUrls;
}

// Demo de uso
console.log('=== DEMO DO CONVERSOR DE URLs DO GOOGLE DRIVE ===\n');

const converter = new GoogleDriveConverter();

// Testa com URLs de exemplo
exampleUrls.forEach((url, index) => {
    console.log(`Exemplo ${index + 1}:`);
    console.log(`URL Original: ${url}`);

    const result = converter.generateAllFormats(url);
    if (result.success) {
        console.log(`File ID: ${result.fileId}`);
        console.log('Formatos disponíveis:');
        Object.entries(result.formats).forEach(([format, directUrl]) => {
            console.log(`  ${format}: ${directUrl}`);
        });
    } else {
        console.log(`Erro: ${result.error}`);
    }
    console.log('---\n');
});