#!/usr/bin/env python3
import requests
import re
import json
import os
from urllib.parse import urlparse
import time

# Google Drive links to process
gdrive_links = [
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
    "https://drive.google.com/file/d/1B8Va9Mqz0eUjWKWWUNIiglfGv0eErcfj/view?usp=sharing"
]

def extract_file_id(gdrive_url):
    """Extract file ID from Google Drive share URL"""
    match = re.search(r'/file/d/([a-zA-Z0-9-_]+)', gdrive_url)
    return match.group(1) if match else None

def gdrive_to_direct_download(gdrive_url):
    """Convert Google Drive share URL to direct download URL"""
    file_id = extract_file_id(gdrive_url)
    if file_id:
        return f"https://drive.google.com/uc?export=download&id={file_id}"
    return None

def download_image(url, filename, max_retries=3):
    """Download image from URL with retry logic"""
    for attempt in range(max_retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }

            response = requests.get(url, headers=headers, timeout=30, stream=True)

            # Handle Google Drive download confirmation
            if 'download_warning' in response.text or 'virus scan warning' in response.text:
                # Look for the actual download link
                confirm_match = re.search(r'href="(/uc\?export=download&amp;confirm=[^"]+)"', response.text)
                if confirm_match:
                    confirm_url = 'https://drive.google.com' + confirm_match.group(1).replace('&amp;', '&')
                    response = requests.get(confirm_url, headers=headers, timeout=30, stream=True)

            if response.status_code == 200:
                # Get file extension from content type
                content_type = response.headers.get('content-type', '')
                if 'image/jpeg' in content_type:
                    ext = '.jpg'
                elif 'image/png' in content_type:
                    ext = '.png'
                elif 'image/webp' in content_type:
                    ext = '.webp'
                else:
                    # Try to detect from first few bytes
                    first_bytes = response.content[:10]
                    if first_bytes.startswith(b'\xff\xd8\xff'):
                        ext = '.jpg'
                    elif first_bytes.startswith(b'\x89PNG'):
                        ext = '.png'
                    else:
                        ext = '.jpg'  # default

                filepath = f"{filename}{ext}"

                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)

                return filepath, len(response.content)
            else:
                print(f"Failed to download (attempt {attempt + 1}): HTTP {response.status_code}")

        except Exception as e:
            print(f"Error downloading (attempt {attempt + 1}): {e}")

        if attempt < max_retries - 1:
            time.sleep(2)  # Wait before retry

    return None, 0

def main():
    base_dir = "/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/product-images/cosmetics"
    successful_downloads = []
    failed_downloads = []

    print("Starting Google Drive image downloads...")

    for i, link in enumerate(gdrive_links, 1):
        print(f"\nProcessing image {i}/20...")
        print(f"Original URL: {link}")

        # Convert to direct download URL
        direct_url = gdrive_to_direct_download(link)
        if not direct_url:
            print(f"Failed to extract file ID from: {link}")
            failed_downloads.append({"index": i, "url": link, "reason": "Failed to extract file ID"})
            continue

        print(f"Direct URL: {direct_url}")

        # Download the image
        filename_base = os.path.join(base_dir, f"product_{i:02d}")
        filepath, file_size = download_image(direct_url, filename_base)

        if filepath:
            print(f"Successfully downloaded: {filepath} ({file_size} bytes)")
            successful_downloads.append({
                "index": i,
                "original_url": link,
                "direct_url": direct_url,
                "filepath": filepath,
                "file_size": file_size
            })
        else:
            print(f"Failed to download image {i}")
            failed_downloads.append({"index": i, "url": link, "reason": "Download failed"})

    # Save results
    results = {
        "successful_downloads": successful_downloads,
        "failed_downloads": failed_downloads,
        "summary": {
            "total": len(gdrive_links),
            "successful": len(successful_downloads),
            "failed": len(failed_downloads)
        }
    }

    results_path = "/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/product-data/download_results.json"
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\nDownload Summary:")
    print(f"Total: {results['summary']['total']}")
    print(f"Successful: {results['summary']['successful']}")
    print(f"Failed: {results['summary']['failed']}")
    print(f"Results saved to: {results_path}")

if __name__ == "__main__":
    main()