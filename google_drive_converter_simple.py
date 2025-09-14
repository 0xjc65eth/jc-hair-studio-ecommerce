#!/usr/bin/env python3
"""
Google Drive Simple URL Converter
Versão simplificada sem dependências externas
Converte URLs do Google Drive para formatos diretos
"""

import re
import json
import csv
import sys
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
import socket

class GoogleDriveConverter:
    """Conversor simples de URLs do Google Drive"""

    def __init__(self):
        self.url_patterns = [
            re.compile(r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)/view'),
            re.compile(r'https://drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)'),
            re.compile(r'([a-zA-Z0-9_-]{25,})')
        ]

        self.formats = {
            'view': 'https://drive.google.com/uc?id={file_id}',
            'download': 'https://drive.google.com/uc?export=download&id={file_id}',
            'thumbnail': 'https://lh3.googleusercontent.com/d/{file_id}',
            'thumbnail_300': 'https://lh3.googleusercontent.com/d/{file_id}=w300-h300',
            'thumbnail_600': 'https://lh3.googleusercontent.com/d/{file_id}=w600-h600',
            'thumbnail_800': 'https://lh3.googleusercontent.com/d/{file_id}=w800-h800',
            'thumbnail_1200': 'https://lh3.googleusercontent.com/d/{file_id}=w1200-h1200',
            'preview': 'https://drive.google.com/thumbnail?id={file_id}',
            'embed': 'https://drive.google.com/file/d/{file_id}/preview'
        }

    def extract_file_id(self, url):
        """Extrai o File ID de uma URL do Google Drive"""
        for pattern in self.url_patterns:
            match = pattern.search(url)
            if match:
                return match.group(1)
        return None

    def convert_url(self, url, format_type='view'):
        """Converte uma URL para formato direto"""
        file_id = self.extract_file_id(url)

        if not file_id:
            return {
                'success': False,
                'original_url': url,
                'error': 'File ID não encontrado'
            }

        if format_type not in self.formats:
            return {
                'success': False,
                'original_url': url,
                'error': f'Formato "{format_type}" não suportado'
            }

        direct_url = self.formats[format_type].format(file_id=file_id)

        return {
            'success': True,
            'original_url': url,
            'file_id': file_id,
            'direct_url': direct_url,
            'format': format_type
        }

    def test_url_accessibility(self, url, timeout=10):
        """Testa se uma URL é acessível (versão simples)"""
        try:
            socket.setdefaulttimeout(timeout)
            response = urlopen(url)
            return response.getcode() == 200
        except (URLError, HTTPError, socket.timeout):
            return False
        except Exception:
            return False

    def generate_all_formats(self, url):
        """Gera todas as variações de formato para uma URL"""
        file_id = self.extract_file_id(url)

        if not file_id:
            return {
                'success': False,
                'error': 'File ID não encontrado'
            }

        result = {
            'success': True,
            'original_url': url,
            'file_id': file_id,
            'formats': {}
        }

        for format_name, template in self.formats.items():
            result['formats'][format_name] = template.format(file_id=file_id)

        return result

    def convert_batch(self, urls, format_type='view', test_accessibility=False):
        """Processa lista de URLs em lote"""
        results = {
            'successful': [],
            'failed': [],
            'summary': {
                'total': len(urls),
                'successful': 0,
                'failed': 0,
                'accessible': 0,
                'inaccessible': 0
            }
        }

        for i, url in enumerate(urls):
            print(f"Processando {i+1}/{len(urls)}: {url[:60]}...")

            # Remove espaços e quebras de linha
            url = url.strip()
            if not url:
                continue

            result = self.convert_url(url, format_type)

            if result['success']:
                # Testa acessibilidade se solicitado
                if test_accessibility and 'direct_url' in result:
                    result['is_accessible'] = self.test_url_accessibility(result['direct_url'])
                    if result['is_accessible']:
                        results['summary']['accessible'] += 1
                    else:
                        results['summary']['inaccessible'] += 1

                results['successful'].append(result)
                results['summary']['successful'] += 1
            else:
                results['failed'].append(result)
                results['summary']['failed'] += 1

        return results

    def save_to_csv(self, results, filename='google_drive_results.csv'):
        """Salva resultados em CSV"""
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['original_url', 'file_id', 'direct_url', 'format', 'success', 'error', 'is_accessible']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            for result in results['successful'] + results['failed']:
                writer.writerow({
                    'original_url': result.get('original_url', ''),
                    'file_id': result.get('file_id', ''),
                    'direct_url': result.get('direct_url', ''),
                    'format': result.get('format', ''),
                    'success': result.get('success', False),
                    'error': result.get('error', ''),
                    'is_accessible': result.get('is_accessible', '')
                })

        print(f"Resultados salvos em: {filename}")

    def save_to_json(self, results, filename='google_drive_results.json'):
        """Salva resultados em JSON"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Resultados JSON salvos em: {filename}")

def main():
    """Função principal"""
    converter = GoogleDriveConverter()

    # URLs de exemplo
    example_urls = [
        'https://drive.google.com/file/d/1-8vowAYefIp4OFijb2WlfhhzOX9pIIO9/view?usp=sharing',
        'https://drive.google.com/file/d/1-I3OgcBq4j_iZuYUQ2mDFNeZSvdyTHGY/view?usp=sharing'
    ]

    print("=== CONVERSOR DE URLs DO GOOGLE DRIVE (PYTHON) ===\n")

    # Demonstração com URLs individuais
    print("1. DEMONSTRAÇÃO COM URLs INDIVIDUAIS:")
    for i, url in enumerate(example_urls, 1):
        print(f"\nExemplo {i}:")
        print(f"URL Original: {url}")

        result = converter.generate_all_formats(url)
        if result['success']:
            print(f"File ID: {result['file_id']}")
            print("Formatos disponíveis:")
            for format_name, direct_url in result['formats'].items():
                print(f"  {format_name:12}: {direct_url}")
        else:
            print(f"Erro: {result['error']}")

    print("\n" + "="*80)
    print("\n2. PROCESSAMENTO EM LOTE:")

    # Processamento em lote
    batch_results = converter.convert_batch(
        example_urls,
        format_type='view',
        test_accessibility=True
    )

    # Mostra resumo
    print(f"\nRESUMO:")
    print(f"Total processadas: {batch_results['summary']['total']}")
    print(f"Conversões bem-sucedidas: {batch_results['summary']['successful']}")
    print(f"Conversões falharam: {batch_results['summary']['failed']}")
    print(f"URLs acessíveis: {batch_results['summary']['accessible']}")
    print(f"URLs inacessíveis: {batch_results['summary']['inaccessible']}")

    # Salva resultados
    converter.save_to_csv(batch_results, 'python_drive_results.csv')
    converter.save_to_json(batch_results, 'python_drive_results.json')

    # Mostra URLs convertidas
    print(f"\nURLs CONVERTIDAS:")
    for result in batch_results['successful']:
        print(f"Original: {result['original_url']}")
        print(f"Direta:   {result['direct_url']}")
        accessible = result.get('is_accessible', 'N/A')
        print(f"Acessível: {accessible}")
        print()

if __name__ == "__main__":
    # Se receber argumentos, processa arquivo
    if len(sys.argv) > 1:
        converter = GoogleDriveConverter()

        filename = sys.argv[1]
        format_type = sys.argv[2] if len(sys.argv) > 2 else 'view'

        try:
            with open(filename, 'r') as f:
                urls = [line.strip() for line in f if line.strip()]

            print(f"Processando {len(urls)} URLs do arquivo: {filename}")
            results = converter.convert_batch(urls, format_type, test_accessibility=True)

            converter.save_to_csv(results, f'{filename}_converted.csv')
            converter.save_to_json(results, f'{filename}_converted.json')

            print(f"Processamento concluído!")
            print(f"Sucessos: {results['summary']['successful']}")
            print(f"Falhas: {results['summary']['failed']}")

        except FileNotFoundError:
            print(f"Erro: Arquivo '{filename}' não encontrado")
            sys.exit(1)
    else:
        main()