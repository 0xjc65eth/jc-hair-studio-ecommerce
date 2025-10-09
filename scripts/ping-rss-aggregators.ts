/**
 * Ping RSS Aggregators and Search Engines
 * Notifies services about RSS feed updates
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://jchairstudios62.xyz';
const FEED_URL = `${SITE_URL}/feed.xml`;

interface PingService {
  name: string;
  url: string;
  method: 'GET' | 'POST';
}

const RSS_PING_SERVICES: PingService[] = [
  {
    name: 'Google PubSubHubbub',
    url: `https://pubsubhubbub.appspot.com/publish?hub.mode=publish&hub.url=${encodeURIComponent(FEED_URL)}`,
    method: 'POST',
  },
  {
    name: 'FeedBurner Ping',
    url: `https://ping.feedburner.google.com/?url=${encodeURIComponent(FEED_URL)}`,
    method: 'GET',
  },
  {
    name: 'Bing RSS Ping',
    url: `https://www.bing.com/webmaster/ping.aspx?siteMap=${encodeURIComponent(FEED_URL)}`,
    method: 'GET',
  },
];

async function pingService(service: PingService): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const url = new URL(service.url);
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: service.method,
      timeout: 10000,
      headers: {
        'User-Agent': 'JC Hair Studio RSS Feed Pinger/1.0',
      },
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            success: true,
            message: `Successfully pinged ${service.name} (Status: ${res.statusCode})`,
          });
        } else {
          resolve({
            success: false,
            message: `Failed to ping ${service.name} (Status: ${res.statusCode})`,
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        message: `Error pinging ${service.name}: ${error.message}`,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        message: `Timeout pinging ${service.name}`,
      });
    });

    if (service.method === 'POST') {
      req.write('');
    }

    req.end();
  });
}

async function pingAllServices(): Promise<void> {
  console.log('Pinging RSS aggregators and search engines...\n');
  console.log(`Feed URL: ${FEED_URL}\n`);

  const results = await Promise.all(
    RSS_PING_SERVICES.map((service) => pingService(service))
  );

  console.log('=== Ping Results ===\n');

  results.forEach((result, index) => {
    const service = RSS_PING_SERVICES[index];
    const icon = result.success ? '✓' : '✗';
    console.log(`${icon} ${service.name}`);
    console.log(`  ${result.message}\n`);
  });

  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;

  console.log('=== Summary ===');
  console.log(`Successful pings: ${successCount}/${totalCount}`);

  if (successCount === totalCount) {
    console.log('\n✓ All services were notified successfully!');
    process.exit(0);
  } else if (successCount > 0) {
    console.log('\n⚠ Some services were notified, but some failed.');
    console.log('This is normal - not all services may be available at all times.');
    process.exit(0);
  } else {
    console.log('\n✗ Failed to notify any services.');
    console.log('Please check your internet connection and try again.');
    process.exit(1);
  }
}

// Additional ping: IndexNow for immediate indexing
async function pingIndexNow(): Promise<void> {
  console.log('\n=== IndexNow Notification ===\n');

  const indexNowEndpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  const indexNowBody = {
    host: 'jchairstudios62.xyz',
    key: process.env.INDEXNOW_KEY || 'your-indexnow-key',
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    urlList: [FEED_URL],
  };

  for (const endpoint of indexNowEndpoints) {
    try {
      const url = new URL(endpoint);
      const postData = JSON.stringify(indexNowBody);

      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 10000,
      };

      await new Promise<void>((resolve, reject) => {
        const req = https.request(options, (res) => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✓ IndexNow notified via ${endpoint}`);
            resolve();
          } else {
            console.log(`⚠ IndexNow responded with status ${res.statusCode} from ${endpoint}`);
            resolve();
          }
        });

        req.on('error', (error) => {
          console.log(`⚠ Error notifying IndexNow via ${endpoint}: ${error.message}`);
          resolve();
        });

        req.on('timeout', () => {
          req.destroy();
          console.log(`⚠ Timeout notifying IndexNow via ${endpoint}`);
          resolve();
        });

        req.write(postData);
        req.end();
      });
    } catch (error: any) {
      console.log(`⚠ Error with IndexNow ${endpoint}: ${error.message}`);
    }
  }
}

async function main() {
  try {
    await pingAllServices();

    // Optionally ping IndexNow for immediate indexing
    if (process.env.INDEXNOW_KEY) {
      await pingIndexNow();
    } else {
      console.log('\nSkipping IndexNow (set INDEXNOW_KEY environment variable to enable)');
    }
  } catch (error: any) {
    console.error('Error during ping process:', error.message);
    process.exit(1);
  }
}

main();
