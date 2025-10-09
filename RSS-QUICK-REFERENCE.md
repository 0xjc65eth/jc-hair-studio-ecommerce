# RSS Feed - Quick Reference Guide

## Feed Information

- **URL**: https://jchairstudios62.xyz/feed.xml
- **Local Path**: `/public/feed.xml`
- **Items**: 50 most recent products
- **Format**: RSS 2.0 with Media, Atom, Dublin Core, and Google namespaces
- **Update Frequency**: 24 hours (TTL: 1440 minutes)

## Quick Commands

### Generate RSS Feed
```bash
npm run seo:generate-rss
```

### Validate RSS Feed
```bash
npm run seo:validate-rss
```

### Check Feed Status
```bash
npm run seo:check-rss
```

### Notify Search Engines
```bash
npm run seo:ping-rss
```

### Complete Update Workflow
```bash
npm run seo:update-rss
```
*Runs: generate → validate → ping*

### All SEO Tasks (includes RSS)
```bash
npm run seo:all
```

## Feed Features

### Included in Each Item
- Product title
- Product link (GUID)
- CDATA-wrapped description
- Publication date
- Product category
- Brand (dc:creator)
- Badge (atom:category)
- Product image (media:content + enclosure)
- Price in EUR (g:price)
- Availability status
- Condition (new)

### Namespaces Used
- **xmlns:atom**: Atom Syndication Format
- **xmlns:dc**: Dublin Core
- **xmlns:media**: Media RSS
- **xmlns:g**: Google Shopping

## Testing URLs

### Validators
- **W3C**: https://validator.w3.org/feed/#validate_by_uri+https%3A%2F%2Fjchairstudios62.xyz%2Ffeed.xml
- **RSS Validator**: https://www.feedvalidator.org/check.cgi?url=https%3A%2F%2Fjchairstudios62.xyz%2Ffeed.xml

### Direct Access
- **Production**: https://jchairstudios62.xyz/feed.xml
- **Local**: http://localhost:3001/feed.xml

## Search Engine Submission

### Google Search Console
1. Go to https://search.google.com/search-console
2. Select your property
3. Navigate to "Sitemaps" section
4. Add: `https://jchairstudios62.xyz/feed.xml`

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Select your site
3. Navigate to "RSS" or "Feeds" section
4. Submit: `https://jchairstudios62.xyz/feed.xml`

### Yandex Webmaster
1. Go to https://webmaster.yandex.com
2. Select your site
3. Navigate to "Indexing" → "RSS"
4. Add: `https://jchairstudios62.xyz/feed.xml`

## Autodiscovery

The feed is automatically discoverable via HTML `<head>` tags:

```html
<link rel="alternate" type="application/rss+xml"
      title="JC Hair Studio's 62 - Feed RSS de Produtos"
      href="/feed.xml" />
```

Browsers and aggregators will find this automatically.

## Monitoring

### Health Check
```bash
npm run seo:check-rss
```

Expected output:
```
✓ File exists
✓ Valid XML structure
✓ 50 items
✓ Accessible online
```

### Validation Check
```bash
npm run seo:validate-rss
```

Expected output:
```
Statistics:
  - Total items: 50
  - Items with categories: 50
  - Items with media content: 50
  - Items with prices: 50

✓ RSS feed is valid and ready for production!
```

## Troubleshooting

### Feed not generating
```bash
# Check for errors
npm run seo:generate-rss

# Verify product data
node -e "console.log(require('./lib/data/staticProducts').getAllStaticProducts().length)"
```

### Feed not accessible online
```bash
# Check local file
ls -lh public/feed.xml

# Check remote access
curl -I https://jchairstudios62.xyz/feed.xml

# Full status check
npm run seo:check-rss
```

### Validation errors
```bash
# Run validator
npm run seo:validate-rss

# Check XML syntax
xmllint --noout public/feed.xml

# Or use Python
python3 -c "import xml.etree.ElementTree as ET; ET.parse('public/feed.xml'); print('Valid XML')"
```

### Search engines not indexing
1. Verify feed is accessible: https://jchairstudios62.xyz/feed.xml
2. Check robots.txt doesn't block `/feed.xml`
3. Submit manually to search consoles
4. Wait 24-48 hours after submission
5. Check for errors in webmaster tools

## Best Practices

### When to Update
- **New products added**: Immediately
- **Price changes**: Daily
- **Description updates**: Weekly
- **Stock changes**: As needed

### Update Process
```bash
# After making product changes
npm run seo:update-rss
```

### Automated Updates
Add to your CI/CD pipeline:
```yaml
# Example for GitHub Actions
- name: Update RSS Feed
  run: npm run seo:update-rss
```

## SEO Benefits

1. **Faster Indexing**: Search engines discover new products faster
2. **Rich Snippets**: Images and prices improve search results
3. **Freshness Signal**: Regular updates improve ranking
4. **Google Discover**: Optimized for mobile discovery
5. **Aggregators**: Feedly, Inoreader users can follow store

## Support

- **Documentation**: `/docs/RSS-FEED.md`
- **Email**: suporte@jchairstudios62.xyz
- **Scripts Location**: `/scripts/*rss*.ts`

## Changelog

### v1.0.0 (2025-10-09)
- Initial RSS feed implementation
- 50 most recent products
- Full Media RSS support
- Google Shopping integration
- Automatic categorization
- Autodiscovery
- Complete validation suite
- Search engine ping system
