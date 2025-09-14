#!/usr/bin/env python3
"""
Google Drive Batch URL Converter
Converte URLs do Google Drive para formatos diretos acessíveis
Processa lotes de 100+ URLs e gera relatórios detalhados
"""

import re
import json
import csv
from typing import List, Dict, Optional, Tuple
from urllib.parse import urlparse, parse_qs
import requests
from dataclasses import dataclass

@dataclass
class ConversionResult:
    """Resultado da conversão de uma URL"""
    success: bool
    original_url: str
    file_id: Optional[str] = None
    direct_url: Optional[str] = None
    format_type: Optional[str] = None
    error: Optional[str] = None
    is_accessible: Optional[bool] = None

class GoogleDriveConverter:
    """Conversor de URLs do Google Drive para formatos diretos"""

    def __init__(self):
        self.url_patterns = {
            'share_url': re.compile(r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)/view'),
            'open_url': re.compile(r'https://drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)'),
            'file_id': re.compile(r'([a-zA-Z0-9_-]{25,})')
        }

        self.direct_url_formats = {
            'download': 'https://drive.google.com/uc?export=download&id={file_id}',
            'view': 'https://drive.google.com/uc?id={file_id}',
            'thumbnail': 'https://lh3.googleusercontent.com/d/{file_id}',
            'thumbnail_sized': 'https://lh3.googleusercontent.com/d/{file_id}=w{width}-h{height}',
            'preview': 'https://drive.google.com/thumbnail?id={file_id}',
            'embed': 'https://drive.google.com/file/d/{file_id}/preview'
        }

    def extract_file_id(self, url: str) -> Optional[str]:
        """Extrai o File ID de uma URL do Google Drive"""
        for pattern_name, pattern in self.url_patterns.items():
            match = pattern.search(url)
            if match:
                return match.group(1)
        return None

    def convert_url(self, url: str, format_type: str = 'view', **kwargs) -> ConversionResult:
        """Converte uma URL para formato direto"""
        file_id = self.extract_file_id(url)

        if not file_id:
            return ConversionResult(
                success=False,
                original_url=url,
                error='Não foi possível extrair o File ID da URL'
            )

        if format_type not in self.direct_url_formats:
            return ConversionResult(
                success=False,
                original_url=url,
                error=f'Formato "{format_type}" não suportado'
            )

        direct_url = self.direct_url_formats[format_type].format(
            file_id=file_id,
            width=kwargs.get('width', 600),
            height=kwargs.get('height', 600)
        )

        return ConversionResult(
            success=True,
            original_url=url,
            file_id=file_id,
            direct_url=direct_url,
            format_type=format_type
        )

    def test_url_accessibility(self, url: str, timeout: int = 10) -> bool:
        """Testa se uma URL é acessível"""
        try:
            response = requests.head(url, timeout=timeout, allow_redirects=True)
            return response.status_code == 200
        except:
            return False

    def convert_batch(self, urls: List[str], format_type: str = 'view',
                     test_accessibility: bool = False, **kwargs) -> Dict:
        """Processa uma lista de URLs em lote"""
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
            print(f"Processando URL {i+1}/{len(urls)}...")

            result = self.convert_url(url, format_type, **kwargs)

            # Testa acessibilidade se solicitado
            if result.success and test_accessibility:
                result.is_accessible = self.test_url_accessibility(result.direct_url)
                if result.is_accessible:
                    results['summary']['accessible'] += 1
                else:
                    results['summary']['inaccessible'] += 1

            if result.success:
                results['successful'].append(result)
                results['summary']['successful'] += 1
            else:
                results['failed'].append(result)
                results['summary']['failed'] += 1

        return results

    def generate_all_formats(self, url: str) -> Dict:
        """Gera todas as variações de formato para uma URL"""
        file_id = self.extract_file_id(url)

        if not file_id:
            return {
                'success': False,
                'error': 'Não foi possível extrair o File ID da URL'
            }

        formats = {}
        for format_name, template in self.direct_url_formats.items():
            if format_name == 'thumbnail_sized':
                # Gera diferentes tamanhos
                for size in [300, 600, 800, 1200]:
                    key = f'thumbnail_{size}x{size}'
                    formats[key] = template.format(
                        file_id=file_id,
                        width=size,
                        height=size
                    )
            else:
                formats[format_name] = template.format(file_id=file_id)

        return {
            'success': True,
            'original_url': url,
            'file_id': file_id,
            'formats': formats
        }

    def save_results_csv(self, results: Dict, filename: str = 'google_drive_conversion_results.csv'):
        """Salva os resultados em CSV"""
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['original_url', 'file_id', 'direct_url', 'format_type', 'success', 'error', 'is_accessible']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()

            for result in results['successful'] + results['failed']:
                writer.writerow({
                    'original_url': result.original_url,
                    'file_id': result.file_id or '',
                    'direct_url': result.direct_url or '',
                    'format_type': result.format_type or '',
                    'success': result.success,
                    'error': result.error or '',
                    'is_accessible': result.is_accessible or ''
                })

    def save_results_json(self, results: Dict, filename: str = 'google_drive_conversion_results.json'):
        """Salva os resultados em JSON"""
        # Converte dataclasses para dict para serialização
        json_results = {
            'successful': [result.__dict__ for result in results['successful']],
            'failed': [result.__dict__ for result in results['failed']],
            'summary': results['summary']
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(json_results, f, indent=2, ensure_ascii=False)

def main():
    """Função principal para demonstração"""
    # URLs de exemplo fornecidas pelo usuário
    example_urls = [
        'https://drive.google.com/file/d/1-8vowAYefIp4OFijb2WlfhhzOX9pIIO9/view?usp=sharing',
        'https://drive.google.com/file/d/1-I3OgcBq4j_iZuYUQ2mDFNeZSvdyTHGY/view?usp=sharing'
    ]

    converter = GoogleDriveConverter()

    print("=== DEMONSTRAÇÃO DO CONVERSOR DE URLs DO GOOGLE DRIVE ===\n")

    # Testa conversão individual
    for i, url in enumerate(example_urls, 1):
        print(f"Exemplo {i}:")
        print(f"URL Original: {url}")

        result = converter.generate_all_formats(url)
        if result['success']:
            print(f"File ID: {result['file_id']}")
            print("Formatos disponíveis:")
            for format_name, direct_url in result['formats'].items():
                print(f"  {format_name}: {direct_url}")
        else:
            print(f"Erro: {result['error']}")
        print("-" * 80 + "\n")

    # Demonstra conversão em lote
    print("=== CONVERSÃO EM LOTE ===\n")
    batch_results = converter.convert_batch(
        example_urls,
        format_type='view',
        test_accessibility=True
    )

    print(f"Resultados do lote:")
    print(f"Total processadas: {batch_results['summary']['total']}")
    print(f"Conversões bem-sucedidas: {batch_results['summary']['successful']}")
    print(f"Conversões falharam: {batch_results['summary']['failed']}")
    print(f"URLs acessíveis: {batch_results['summary']['accessible']}")
    print(f"URLs inacessíveis: {batch_results['summary']['inaccessible']}")

    # Salva resultados
    converter.save_results_csv(batch_results)
    converter.save_results_json(batch_results)
    print(f"\nResultados salvos em 'google_drive_conversion_results.csv' e '.json'")

if __name__ == "__main__":
    main()