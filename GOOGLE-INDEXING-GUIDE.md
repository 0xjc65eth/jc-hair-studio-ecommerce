# Google Search Console Forced Indexation System

## Overview

This system provides multiple automated methods to force Google to index your website pages. It includes:

1. **Google Search Console API** - Primary method using official Google APIs
2. **Puppeteer Automation** - Fallback browser automation for manual GSC UI interaction
3. **IndexNow Protocol** - Alternative for Bing, Yandex, and other search engines
4. **Monitoring System** - Track indexation status over time

## Quick Start

### 1. Setup Google OAuth Credentials (Required for API method)

```bash
npm run seo:setup-oauth
```

This will guide you through:
- Creating OAuth2 credentials in Google Cloud Console
- Authorizing the application
- Saving tokens for future use

### 2. Run Forced Indexation

#### Option A: Master Orchestrator (Recommended)
Tries all methods automatically:
```bash
npm run seo:master-index
```

#### Option B: API Method Only
Uses Google Search Console API:
```bash
npm run seo:force-index
```

#### Option C: Puppeteer Automation
Browser automation (requires manual login):
```bash
npm run seo:force-index:puppeteer

# Or run in headed mode to see the browser:
npm run seo:force-index:headed
```

### 3. Monitor Indexation Status

```bash
# Check once
npm run seo:monitor-index:once

# Continuous monitoring (checks every hour)
npm run seo:monitor-index
```

## Detailed Setup Instructions

### Setting Up Google Search Console API

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Search Console API
   - Web Search Indexing API

#### Step 2: Create OAuth2 Credentials

1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URI: `http://localhost:3000/oauth2callback`
5. Download the credentials JSON file
6. Save it as `google-oauth-credentials.json` in the project root

#### Step 3: Run OAuth Setup

```bash
npm run seo:setup-oauth
```

This will:
- Open your browser for authorization
- Exchange the code for access tokens
- Save tokens for future use
- Test the connection

### Alternative: Service Account (Advanced)

For automated server-side usage:

1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Save as `google-service-account.json` in project root
4. Add the service account email to Google Search Console users

## Available Commands

### Indexation Commands

| Command | Description |
|---------|-------------|
| `npm run seo:force-index` | Force indexation using API |
| `npm run seo:force-index:puppeteer` | Force indexation using browser automation |
| `npm run seo:force-index:headed` | Browser automation with visible browser |
| `npm run seo:master-index` | Try all indexation methods |
| `npm run seo:master-index:api` | Master script - API only |
| `npm run seo:master-index:puppeteer` | Master script - Puppeteer only |
| `npm run seo:master-index:monitor` | Run indexation + start monitoring |

### Monitoring Commands

| Command | Description |
|---------|-------------|
| `npm run seo:monitor-index` | Monitor indexation status (continuous) |
| `npm run seo:monitor-index:once` | Check indexation status once |

### Setup Commands

| Command | Description |
|---------|-------------|
| `npm run seo:setup-oauth` | Set up Google OAuth credentials |

## Script Details

### 1. force-google-indexing.mjs

**Primary indexation script using Google Search Console API**

Features:
- Service Account & OAuth2 authentication
- URL Inspection API integration
- Batch processing with rate limiting (600 requests/min)
- Comprehensive error handling
- Progress logging

Usage:
```bash
# All URLs
node scripts/force-google-indexing.mjs

# Single URL
node scripts/force-google-indexing.mjs --url=https://jchairstudios62.xyz/page

# Verify status only
node scripts/force-google-indexing.mjs --verify-only
```

### 2. puppeteer-gsc-indexing.mjs

**Browser automation fallback for Google Search Console UI**

Features:
- Automated login to Google Search Console
- URL Inspection tool automation
- Request indexing button detection
- Session persistence
- Rate limiting to avoid detection

Usage:
```bash
# Headless mode
node scripts/puppeteer-gsc-indexing.mjs

# Headed mode (visible browser)
node scripts/puppeteer-gsc-indexing.mjs --headed

# Single URL
node scripts/puppeteer-gsc-indexing.mjs --url=https://jchairstudios62.xyz/page
```

### 3. monitor-indexation-status.mjs

**Continuous monitoring of indexation status**

Features:
- Checks all URLs from sitemap
- Tracks changes over time
- Generates progress reports
- Alerts on improvements
- JSON status files

Usage:
```bash
# Continuous monitoring (default: every hour)
node scripts/monitor-indexation-status.mjs

# Run once and exit
node scripts/monitor-indexation-status.mjs --once

# Custom interval (milliseconds)
node scripts/monitor-indexation-status.mjs --interval=3600000
```

### 4. master-force-indexing.mjs

**Master orchestrator that coordinates all indexation methods**

Features:
- Tries multiple methods automatically
- Falls back on failures
- Includes IndexNow submission
- Comprehensive reporting
- Optional continuous monitoring

Usage:
```bash
# Try all methods
node scripts/master-force-indexing.mjs

# Specific method
node scripts/master-force-indexing.mjs --method=api
node scripts/master-force-indexing.mjs --method=puppeteer
node scripts/master-force-indexing.mjs --method=indexnow

# With monitoring
node scripts/master-force-indexing.mjs --monitor
```

### 5. setup-google-oauth.mjs

**Interactive OAuth2 setup wizard**

Features:
- Creates credentials template
- Opens browser for authorization
- Local callback server
- Token exchange and storage
- Connection testing

Usage:
```bash
node scripts/setup-google-oauth.mjs
```

## Rate Limits and Best Practices

### Google Search Console API
- **Quota**: 600 requests per minute
- **Daily limit**: Varies by project
- **Best practice**: Use batch processing, add delays between batches

### Puppeteer Automation
- **Recommended delay**: 5 seconds between URLs
- **Session**: Save and reuse to avoid repeated logins
- **Detection**: Use realistic user agent and delays

### IndexNow
- **Limit**: 10,000 URLs per submission
- **Rate**: No specific limit, but be reasonable
- **Cost**: Free

## Troubleshooting

### Authentication Failures

**Problem**: "Authentication failed"

**Solutions**:
1. Verify credentials file exists and is valid
2. Check API is enabled in Google Cloud Console
3. Ensure redirect URI matches exactly
4. Run `npm run seo:setup-oauth` to re-authenticate

### Rate Limiting

**Problem**: "Too many requests"

**Solutions**:
1. Reduce batch size in script configuration
2. Increase delay between batches
3. Use monitoring to spread requests over time

### No URLs Found

**Problem**: "No URLs found to process"

**Solutions**:
1. Verify sitemap.xml is accessible at https://jchairstudios62.xyz/sitemap.xml
2. Check sitemap contains `<loc>` tags
3. Manually specify URLs in script

### Puppeteer Login Issues

**Problem**: "Login failed"

**Solutions**:
1. Use headed mode to see what's happening
2. Manually log in when browser opens
3. Session will be saved for future use
4. Clear saved session if having issues: `rm gsc-session.json`

## File Structure

```
project-root/
├── scripts/
│   ├── force-google-indexing.mjs       # API method
│   ├── puppeteer-gsc-indexing.mjs      # Browser automation
│   ├── monitor-indexation-status.mjs   # Status monitoring
│   ├── master-force-indexing.mjs       # Master orchestrator
│   └── setup-google-oauth.mjs          # OAuth setup wizard
├── logs/
│   ├── indexing-YYYY-MM-DD.log        # Daily indexation logs
│   ├── monitoring-YYYY-MM-DD.log      # Daily monitoring logs
│   ├── report-YYYY-MM-DD.json         # JSON reports
│   └── indexation-status.json         # Current status
├── google-oauth-credentials.json       # OAuth credentials (gitignored)
├── google-oauth-token.json            # OAuth tokens (gitignored)
├── google-service-account.json        # Service account key (gitignored)
└── gsc-session.json                   # Puppeteer session (gitignored)
```

## Logs and Reports

### Log Files

All scripts write to daily log files in the `logs/` directory:
- `indexing-YYYY-MM-DD.log` - API indexation logs
- `puppeteer-indexing-YYYY-MM-DD.log` - Puppeteer logs
- `monitoring-YYYY-MM-DD.log` - Monitoring logs
- `master-indexing-YYYY-MM-DD.log` - Master orchestrator logs

### JSON Reports

JSON reports are generated for programmatic access:
- `report-YYYY-MM-DD.json` - Indexation results
- `puppeteer-report-YYYY-MM-DD.json` - Puppeteer results
- `status-report-YYYY-MM-DD.json` - Monitoring status
- `master-report-YYYY-MM-DD.json` - Master orchestrator results
- `indexation-status.json` - Current indexation status

## Advanced Configuration

### Modifying Rate Limits

Edit the constants in `force-google-indexing.mjs`:
```javascript
const REQUESTS_PER_MINUTE = 600;  // Google's limit
const BATCH_SIZE = 50;            // URLs per batch
const DELAY_BETWEEN_BATCHES = 60000; // 1 minute
```

### Custom Monitoring Interval

Default is 1 hour, but you can change:
```bash
# Check every 30 minutes
npm run seo:monitor-index -- --interval=1800000

# Check every 6 hours
npm run seo:monitor-index -- --interval=21600000
```

### Adding Custom URLs

If sitemap is not available, add fallback URLs in scripts:
```javascript
const fallbackUrls = [
  `${SITE_URL}/`,
  `${SITE_URL}/your-custom-page`,
  // Add more URLs...
];
```

## Integration with CI/CD

### Daily Automated Indexation

Add to cron or GitHub Actions:
```yaml
name: Force Google Indexation
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
jobs:
  index:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run seo:master-index:api
```

### Monitoring Setup

Continuous monitoring in production:
```bash
# Using PM2 or similar process manager
pm2 start "npm run seo:monitor-index" --name "gsc-monitor"
```

## Support and Troubleshooting

### Common Issues

1. **"No sites found"** - Add your site to Google Search Console
2. **"Permission denied"** - Add credentials email to GSC users
3. **"Invalid credentials"** - Re-run OAuth setup
4. **"Quota exceeded"** - Wait or increase quota in GCP

### Getting Help

- Check logs in `logs/` directory
- Review JSON reports for detailed errors
- Ensure all prerequisites are met
- Verify API access in Google Cloud Console

## Security Notes

**Important**: Never commit these files to version control:
- `google-oauth-credentials.json`
- `google-oauth-token.json`
- `google-service-account.json`
- `gsc-session.json`

These are already in `.gitignore`, but double-check before committing.

## Next Steps

After running forced indexation:

1. **Monitor results**: Use monitoring script to track progress
2. **Check Google Search Console**: Verify requests in GSC UI
3. **Wait patiently**: Indexation can take hours to days
4. **Optimize content**: Focus on quality while waiting
5. **Build backlinks**: Help Google discover your content
6. **Submit sitemap**: Ensure sitemap is submitted in GSC

## Performance Expectations

- **API method**: Fastest, most reliable
- **Puppeteer method**: Slower, but works without API access
- **Indexation speed**: Varies widely (hours to weeks)
- **Success rate**: Depends on content quality and site authority

## License

MIT License - See LICENSE file for details
