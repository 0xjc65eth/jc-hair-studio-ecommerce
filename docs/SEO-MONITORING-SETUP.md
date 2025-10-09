# SEO Monitoring System - Complete Setup Guide

## Overview

This comprehensive SEO monitoring system provides:

1. **Google Analytics 4** - Enhanced e-commerce tracking
2. **Google Tag Manager** - Centralized tag management
3. **Conversion Event Tracking** - Track all major user actions
4. **Search Console Integration** - Monitor search performance
5. **Keyword Ranking Tracking** - Track positions across search engines
6. **404 & Redirect Monitoring** - Detect broken links
7. **Traffic Drop Alerts** - Get notified of significant changes
8. **SEO Metrics Dashboard** - Centralized monitoring interface

## Quick Start

```bash
# Run the setup wizard
npm run seo:setup

# Start monitoring (run hourly via cron)
npm run seo:monitor

# View dashboard
# Navigate to: http://localhost:3001/admin/seo
```

## Detailed Setup Instructions

### 1. Google Tag Manager Setup

#### Create GTM Account
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account"
3. Enter account details:
   - Account Name: JC Hair Studio
   - Container Name: jchairstudios62.xyz
   - Target Platform: Web
4. Accept Terms of Service
5. Copy your GTM ID (format: `GTM-XXXXXXX`)

#### Add GTM ID to Environment
```bash
# .env.local
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
```

#### Configure Tags in GTM

**Google Analytics 4 Tag:**
1. In GTM, click "Add a new tag"
2. Choose "Google Analytics: GA4 Configuration"
3. Enter your Measurement ID
4. Set trigger to "All Pages"
5. Save and publish

**E-commerce Events:**
The system automatically pushes these events to GTM:
- `view_item` - Product views
- `add_to_cart` - Add to cart
- `remove_from_cart` - Remove from cart
- `begin_checkout` - Checkout started
- `purchase` - Order completed
- `search` - Site search
- `newsletter_signup` - Newsletter subscription

### 2. Google Analytics 4 Setup

#### Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Admin" → "Create Property"
3. Enter property details:
   - Property name: JC Hair Studio
   - Time zone: Europe/Lisbon
   - Currency: EUR
4. Complete setup and copy Measurement ID (format: `G-XXXXXXXXXX`)

#### Add GA4 ID to Environment
```bash
# .env.local
NEXT_PUBLIC_GA4_ID="G-XXXXXXXXXX"
```

#### Configure Enhanced E-commerce
1. In GA4, go to "Configure" → "Events"
2. Enable enhanced measurement
3. Create custom conversion events:
   - `purchase` - Mark as conversion
   - `add_to_cart` - Mark as conversion
   - `begin_checkout` - Mark as conversion

### 3. Google Search Console API

#### Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "jc-hair-studio-seo"
3. Enable APIs:
   - Search Console API
   - Web Search Indexing API
4. Create Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: "seo-monitoring"
   - Grant role: "Editor"
5. Create and download JSON key

#### Extract Credentials
From the downloaded JSON file:
```json
{
  "client_email": "seo-monitoring@project-id.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

#### Add to Environment
```bash
# .env.local
GOOGLE_CLIENT_EMAIL="seo-monitoring@project-id.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SEARCH_CONSOLE_SITE_URL="https://jchairstudios62.xyz"
```

#### Add Service Account to Search Console
1. Go to [Search Console](https://search.google.com/search-console)
2. Select your property
3. Click "Settings" → "Users and permissions"
4. Click "Add user"
5. Enter service account email
6. Grant "Full" permissions

### 4. Site Verification

#### Google Search Console
1. Go to Search Console
2. Add property: `https://jchairstudios62.xyz`
3. Choose verification method: "HTML tag"
4. Copy verification code
5. Add to environment:
```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-code"
```

#### Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site
3. Get verification code
4. Add to environment:
```bash
NEXT_PUBLIC_BING_VERIFICATION="your-bing-code"
```

### 5. MongoDB Collections

Create these collections in MongoDB:

```javascript
// seo_rankings
{
  keyword: String,
  position: Number,
  url: String,
  searchEngine: String,
  country: String,
  date: Date,
  createdAt: Date
}

// seo_404_errors
{
  url: String,
  statusCode: Number,
  referrer: String,
  userAgent: String,
  timestamp: Date,
  ip: String,
  country: String,
  createdAt: Date
}

// seo_redirects
{
  from: String,
  to: String,
  statusCode: Number,
  timestamp: Date,
  createdAt: Date
}

// seo_traffic_alerts
{
  type: String, // 'drop', 'spike', 'anomaly'
  severity: String, // 'low', 'medium', 'high', 'critical'
  metric: String,
  currentValue: Number,
  previousValue: Number,
  change: Number,
  changePercent: Number,
  message: String,
  timestamp: Date,
  resolved: Boolean,
  resolvedAt: Date,
  createdAt: Date
}
```

### 6. Alert Configuration

Set up email alerts:

```bash
# .env.local
ALERT_EMAIL="seo-alerts@jchairstudios62.xyz"
```

Alerts are sent for:
- Traffic drops > 30%
- Critical ranking changes (> 5 positions)
- High bounce rate increases
- Repeated 404 errors (> 10/day)

## Usage

### Track Conversions in Code

```typescript
import { trackPurchase, trackAddToCart } from '@/lib/analytics/conversionEvents';

// Track purchase
trackPurchase({
  orderId: 'ORD-12345',
  total: 150.00,
  tax: 30.00,
  shipping: 10.00,
  items: [
    {
      id: 'mega-hair-1',
      name: 'Mega Hair Brasileiro 100% Humano',
      category: 'Mega Hair',
      brand: 'Brazilian',
      price: 150.00,
      quantity: 1
    }
  ]
});

// Track add to cart
trackAddToCart({
  id: 'mega-hair-1',
  name: 'Mega Hair Brasileiro',
  category: 'Mega Hair',
  price: 150.00
}, 1);
```

### Use GTM DataLayer

```typescript
import { gtmTrack } from '@/components/analytics/GoogleTagManager';

// Track custom event
gtmTrack.customEvent('mega_hair_filter', {
  filter_type: 'length',
  filter_value: '60cm'
});

// Track product view
gtmTrack.viewItem(product);
```

### Monitor SEO Dashboard

Access the dashboard at `/admin/seo` (requires admin authentication):

- **Overview Tab**: Key metrics and alerts
- **Queries Tab**: Top search queries from Google
- **Pages Tab**: Top performing pages
- **Errors Tab**: 404 and redirect reports
- **Rankings Tab**: Keyword position tracking

### API Endpoints

```bash
# Get dashboard data
GET /api/seo/dashboard

# Get specific metric
GET /api/seo/dashboard?metric=queries&startDate=2025-01-01&endDate=2025-01-31

# Trigger manual updates
POST /api/seo/dashboard
{
  "action": "refresh-rankings" | "check-indexing" | "clear-404s"
}
```

## Automated Monitoring

### Cron Jobs Setup

Add to crontab (`crontab -e`):

```bash
# Run SEO monitoring every hour
0 * * * * cd /path/to/project && npm run seo:monitor >> /var/log/seo-monitor.log 2>&1

# Track rankings daily at 2 AM
0 2 * * * cd /path/to/project && npm run seo:track-rankings >> /var/log/seo-rankings.log 2>&1

# Generate weekly report on Monday at 8 AM
0 8 * * 1 cd /path/to/project && npm run seo:weekly-report >> /var/log/seo-reports.log 2>&1

# Clean old logs monthly
0 0 1 * * cd /path/to/project && npm run seo:cleanup >> /var/log/seo-cleanup.log 2>&1
```

### NPM Scripts

```bash
# Setup
npm run seo:setup              # Interactive setup wizard

# Monitoring
npm run seo:monitor            # Run hourly monitoring checks
npm run seo:track-rankings     # Track keyword rankings
npm run seo:check-indexing     # Check Google indexing status

# Reports
npm run seo:weekly-report      # Generate weekly report
npm run seo:monthly-report     # Generate monthly report

# Maintenance
npm run seo:cleanup            # Clean old logs (90+ days)
npm run seo:test-alerts        # Test alert system
```

## Troubleshooting

### GTM Not Loading
- Check `NEXT_PUBLIC_GTM_ID` is set
- Verify GTM container is published
- Check browser console for errors
- Ensure not blocked by ad blockers

### Search Console API Errors
- Verify service account has permissions
- Check credentials are correct
- Ensure API is enabled in Cloud Console
- Verify site is verified in Search Console

### No Tracking Data
- Check events in GA4 DebugView
- Verify GTM preview mode
- Check browser console for errors
- Ensure cookies are accepted

### Email Alerts Not Sending
- Verify `ALERT_EMAIL` is set
- Check SendGrid configuration
- Review email logs
- Test with `npm run seo:test-alerts`

## Best Practices

### For Brazilian Products Focus

1. **Track Portuguese Keywords**:
   - "mega hair brasileiro"
   - "progressiva vogue"
   - "maquiagem brasileira"
   - "produtos brasileiros portugal"

2. **Monitor European Markets**:
   - Track rankings in PT, ES, FR, IT, DE
   - Monitor currency-specific performance
   - Track multilingual content

3. **E-commerce Specific**:
   - Track cart abandonment
   - Monitor checkout funnel
   - Track product category performance
   - Monitor shipping country distribution

### Performance Optimization

1. **Lazy Load Analytics**: Scripts load after interactive
2. **Batch Events**: Group related events
3. **Use GTM**: Centralize all tracking scripts
4. **Cache API Calls**: Reduce Search Console API calls

### Security

1. **Never Commit**: Keep credentials in `.env.local`
2. **Rotate Keys**: Change service account keys quarterly
3. **Limit Permissions**: Give minimum required access
4. **Monitor Access**: Review API usage logs

## Support

For issues or questions:
- Check logs: `tail -f /var/log/seo-monitor.log`
- Review documentation: `/docs/SEO-MONITORING-SETUP.md`
- Test configuration: `npm run seo:test`

## License

Proprietary - JC Hair Studio's 62
