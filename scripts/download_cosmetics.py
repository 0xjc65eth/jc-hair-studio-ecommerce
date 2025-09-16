#!/usr/bin/env python3
"""
Script para download e organização de imagens de cosméticos do Google Drive
"""

import os
import json
import requests
import re
from pathlib import Path
from datetime import datetime
import time
from typing import Dict, List, Tuple
import mimetypes

# URLs do Google Drive fornecidas
DRIVE_URLS = [
    "https://drive.google.com/file/d/1-C95wTFlqmZ84Zh3LUYPrbzWtwvGcBaj/view?usp=sharing",
    "https://drive.google.com/file/d/101ifAGkppXAOPVe5XqL-feKlvNU1cn1C/view?usp=sharing",
    "https://drive.google.com/file/d/10NWcjJj2HlTTDCQFntblimNA3KAEVWz5/view?usp=sharing",
    "https://drive.google.com/file/d/10Z6hIOKZ2ozGgphiMdIQiqzO2pavahO-/view?usp=sharing",
    "https://drive.google.com/file/d/10lK-RsY4p36oFLtEZAAksAUKplyv2jUD/view?usp=sharing",
    "https://drive.google.com/file/d/113TE6yHOVIchiVDJAWp5wfA51FxM0QLX/view?usp=sharing",
    "https://drive.google.com/file/d/124TkuKBAhmvC91bcdIcHLmkhIcMrjEfZ/view?usp=sharing",
    "https://drive.google.com/file/d/12n_c8dX_3d-zsxles6eL395LcGvd0GNT/view?usp=sharing",
    "https://drive.google.com/file/d/13TbiVbl-QS6v-wfo2ivlhUWc56pRVc8h/view?usp=sharing",
    "https://drive.google.com/file/d/15eXgmXJJFmbs-nuYm-JLIs4B6TxuPpWa/view?usp=sharing",
    "https://drive.google.com/file/d/160kPr90NEM69PLN32nowHDRapeAyXNYZ/view?usp=sharing",
    "https://drive.google.com/file/d/174o0Msm1DZAj2ccoEG6OAeazPs7BuNL-/view?usp=sharing",
    "https://drive.google.com/file/d/18AO7QNEjprhZxigrj7RMT47ad_YVDdVa/view?usp=sharing",
    "https://drive.google.com/file/d/18iXNdlX8ob6ducMCWjhHPv_4vZ8qrS7a/view?usp=sharing",
    "https://drive.google.com/file/d/195OmXeggxWoQ6rDek3Xpq7UhAj7QJeqO/view?usp=sharing",
    "https://drive.google.com/file/d/197NMWjMumC0eJplpfcHias-XesUyM5Ue/view?usp=sharing",
    "https://drive.google.com/file/d/197Qhn5_7_wXaWARsyKDLJGsETfnHM_BD/view?usp=sharing",
    "https://drive.google.com/file/d/19rrSeH4FG6mETURNNR5YkYacj7ZGgCKu/view?usp=sharing",
    "https://drive.google.com/file/d/1AXNd13-xlyzNCcaOmKrua6Vw8VoumFXz/view?usp=sharing",
    "https://drive.google.com/file/d/1B8Va9Mqz0eUjWKWWUNIiglfGv0eErcfj/view?usp=sharing",
    "https://drive.google.com/file/d/1BeLU37ErPUDFp1iZP9lXA9H2nzLc6xcU/view?usp=sharing",
    "https://drive.google.com/file/d/1CbPcESLSxUht8OU529DuMDHY3J_2PbXq/view?usp=sharing",
    "https://drive.google.com/file/d/1DZ0Vwf3iDOg7uPeHXA5PtD2ZgKC497Ps/view?usp=sharing",
    "https://drive.google.com/file/d/1Dtpeu14OkqVS3iRh5_zi-HWEFdIkuqf7/view?usp=sharing",
    "https://drive.google.com/file/d/1E7LJRDZGYUD50Y6QHlsv3koPs5EPGI5o/view?usp=sharing",
    "https://drive.google.com/file/d/1FGp_6VUty_PgFy6-K6H2R7YJi0kzePIH/view?usp=sharing",
    "https://drive.google.com/file/d/1FpDML61zSjreQvZQ53eP0_Q1emNpGLFC/view?usp=sharing",
    "https://drive.google.com/file/d/1HBt4bHfbjyoPCJQvwScWVBda0Kjl2UfZ/view?usp=sharing",
    "https://drive.google.com/file/d/1I3khobeDfMRpi4RRuRTWjAmV5PbNuf_d/view?usp=sharing",
    "https://drive.google.com/file/d/1JL2tBCiv92ngcw5pb1UlX4W6H6z9aZvV/view?usp=sharing",
    "https://drive.google.com/file/d/1JP5TRZCtWGcPNG_3_W9WFksdyoOqP1Yx/view?usp=sharing",
    "https://drive.google.com/file/d/1JQ_DEZ7IBbsvbg56GnWznRpSPUNh3C4w/view?usp=sharing"
]

# Categorias de cosméticos
COSMETICS_CATEGORIES = {
    'batom': ['batom', 'lipstick', 'labial', 'lip', 'gloss'],
    'base': ['base', 'foundation', 'fundacao', 'fond de teint'],
    'sombra': ['sombra', 'eyeshadow', 'paleta', 'ombre'],
    'blush': ['blush', 'rouge', 'blusher'],
    'rimel': ['rimel', 'mascara', 'cilios', 'lashes'],
    'delineador': ['delineador', 'eyeliner', 'kajal', 'liner'],
    'corretivo': ['corretivo', 'concealer', 'correcteur'],
    'po': ['po', 'powder', 'pó', 'poudre'],
    'bronzer': ['bronzer', 'bronzeador', 'bronze'],
    'primer': ['primer', 'pre-base', 'prebase'],
    'iluminador': ['iluminador', 'highlighter', 'glow'],
    'contorno': ['contorno', 'contouring', 'sculpt'],
    'outros': []
}

class CosmeticsDownloader:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent / "public" / "images" / "cosmeticos"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })

        self.metadata = {
            'processedAt': datetime.now().isoformat(),
            'totalUrls': len(DRIVE_URLS),
            'successfulDownloads': 0,
            'failedDownloads': 0,
            'categories': {},
            'images': [],
            'errors': []
        }

    def extract_file_id(self, url: str) -> str:
        """Extrair ID do arquivo da URL do Google Drive"""
        match = re.search(r'/file/d/([a-zA-Z0-9_-]+)', url)
        return match.group(1) if match else None

    def convert_to_download_url(self, url: str) -> str:
        """Converter URL do Google Drive para URL de download direto"""
        file_id = self.extract_file_id(url)
        if file_id:
            return f"https://drive.google.com/uc?export=download&id={file_id}"
        return None

    def detect_category(self, filename: str) -> str:
        """Detectar categoria baseada no nome do arquivo"""
        filename_lower = filename.lower()

        for category, keywords in COSMETICS_CATEGORIES.items():
            if category == 'outros':
                continue
            for keyword in keywords:
                if keyword in filename_lower:
                    return category

        return 'outros'

    def get_file_extension_from_response(self, response) -> str:
        """Determinar extensão do arquivo baseada no Content-Type"""
        content_type = response.headers.get('content-type', '').lower()

        if 'image/jpeg' in content_type or 'image/jpg' in content_type:
            return '.jpg'
        elif 'image/png' in content_type:
            return '.png'
        elif 'image/webp' in content_type:
            return '.webp'
        elif 'image/gif' in content_type:
            return '.gif'
        else:
            return '.jpg'  # padrão

    def create_directories(self):
        """Criar estrutura de diretórios"""
        for category in COSMETICS_CATEGORIES.keys():
            category_dir = self.base_dir / category
            category_dir.mkdir(parents=True, exist_ok=True)
            print(f"✅ Diretório criado: {category_dir}")

    def download_image(self, url: str, file_id: str) -> Dict:
        """Download de uma imagem"""
        try:
            download_url = self.convert_to_download_url(url)
            if not download_url:
                raise Exception("URL inválida do Google Drive")

            print(f"🔄 Baixando: {file_id}")

            # Primeira requisição para obter informações
            response = self.session.get(download_url, allow_redirects=True, stream=True)
            response.raise_for_status()

            # Determinar extensão do arquivo
            extension = self.get_file_extension_from_response(response)
            filename = f"cosmetic_{file_id}{extension}"

            # Detectar categoria
            category = self.detect_category(filename)

            # Caminho completo do arquivo
            file_path = self.base_dir / category / filename

            # Download da imagem
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            file_size = file_path.stat().st_size

            # Verificar se o arquivo foi baixado corretamente
            if file_size < 1024:  # Menor que 1KB, provavelmente erro
                file_path.unlink()  # Remove arquivo
                raise Exception("Arquivo muito pequeno, possível erro no download")

            return {
                'success': True,
                'filename': filename,
                'category': category,
                'file_path': str(file_path),
                'web_path': f"/images/cosmeticos/{category}/{filename}",
                'size': file_size,
                'extension': extension
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def process_all_urls(self):
        """Processar todas as URLs"""
        print(f"🚀 Iniciando download de {len(DRIVE_URLS)} imagens...\n")

        self.create_directories()

        for i, url in enumerate(DRIVE_URLS, 1):
            print(f"\n[{i}/{len(DRIVE_URLS)}] Processando: {url}")

            file_id = self.extract_file_id(url)
            if not file_id:
                self.metadata['errors'].append({
                    'url': url,
                    'error': 'ID do arquivo não encontrado',
                    'timestamp': datetime.now().isoformat()
                })
                self.metadata['failedDownloads'] += 1
                continue

            result = self.download_image(url, file_id)

            if result['success']:
                self.metadata['successfulDownloads'] += 1

                # Adicionar aos metadados
                image_data = {
                    'id': file_id,
                    'originalUrl': url,
                    'filename': result['filename'],
                    'category': result['category'],
                    'webPath': result['web_path'],
                    'size': result['size'],
                    'extension': result['extension'],
                    'downloadedAt': datetime.now().isoformat()
                }

                self.metadata['images'].append(image_data)

                # Contar por categoria
                if result['category'] not in self.metadata['categories']:
                    self.metadata['categories'][result['category']] = 0
                self.metadata['categories'][result['category']] += 1

                print(f"✅ Sucesso: {result['filename']} ({result['size']} bytes) -> {result['category']}")

            else:
                self.metadata['failedDownloads'] += 1
                self.metadata['errors'].append({
                    'url': url,
                    'fileId': file_id,
                    'error': result['error'],
                    'timestamp': datetime.now().isoformat()
                })
                print(f"❌ Erro: {result['error']}")

            # Delay para não sobrecarregar
            time.sleep(1)

    def save_metadata(self):
        """Salvar metadados em JSON"""
        metadata_file = self.base_dir / "metadata.json"

        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, indent=2, ensure_ascii=False)

        print(f"📄 Metadados salvos: {metadata_file}")

    def generate_catalog_json(self):
        """Gerar catálogo JSON para o frontend"""
        catalog = {
            'metadata': {
                'name': 'Catálogo de Cosméticos JC Hair Studio',
                'description': 'Coleção completa de produtos cosméticos',
                'totalProducts': self.metadata['successfulDownloads'],
                'categories': list(self.metadata['categories'].keys()),
                'lastUpdated': datetime.now().isoformat()
            },
            'categories': {}
        }

        # Organizar por categoria
        for image in self.metadata['images']:
            category = image['category']
            if category not in catalog['categories']:
                catalog['categories'][category] = {
                    'name': category.title(),
                    'count': 0,
                    'products': []
                }

            product = {
                'id': image['id'],
                'name': f"Produto {image['id']}",
                'image': image['webPath'],
                'filename': image['filename'],
                'size': image['size'],
                'addedAt': image['downloadedAt']
            }

            catalog['categories'][category]['products'].append(product)
            catalog['categories'][category]['count'] += 1

        catalog_file = self.base_dir / "catalog.json"

        with open(catalog_file, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)

        print(f"📋 Catálogo gerado: {catalog_file}")

    def generate_report(self):
        """Gerar relatório final"""
        print("\n" + "="*60)
        print("RELATÓRIO DE DOWNLOAD DE COSMÉTICOS")
        print("="*60)
        print(f"Total de URLs processadas: {self.metadata['totalUrls']}")
        print(f"Downloads bem-sucedidos: {self.metadata['successfulDownloads']}")
        print(f"Downloads falharam: {self.metadata['failedDownloads']}")

        success_rate = (self.metadata['successfulDownloads'] / self.metadata['totalUrls']) * 100
        print(f"Taxa de sucesso: {success_rate:.2f}%")

        print(f"\nDistribuição por categoria:")
        for category, count in sorted(self.metadata['categories'].items()):
            print(f"  {category.title()}: {count} imagens")

        print(f"\nArquivos salvos em: {self.base_dir}")

        if self.metadata['errors']:
            print(f"\n⚠️  {len(self.metadata['errors'])} erros encontrados:")
            for error in self.metadata['errors'][:5]:  # Mostrar apenas os primeiros 5
                print(f"  - {error['error']}")
            if len(self.metadata['errors']) > 5:
                print(f"  ... e mais {len(self.metadata['errors']) - 5} erros")

        print("\n✅ Processamento concluído!")
        print("="*60)

    def run(self):
        """Executar todo o processo"""
        try:
            self.process_all_urls()
            self.save_metadata()
            self.generate_catalog_json()
            self.generate_report()
            return True
        except Exception as e:
            print(f"❌ Erro fatal: {e}")
            return False

if __name__ == "__main__":
    downloader = CosmeticsDownloader()
    success = downloader.run()
    exit(0 if success else 1)