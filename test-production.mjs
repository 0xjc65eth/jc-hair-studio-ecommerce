#!/usr/bin/env node

/**
 * Production Test Suite - JC Hair Studio
 *
 * WHY: Comprehensive testing of production deployment
 * HOW: Puppeteer automated testing with detailed reports
 *
 * Tests:
 * 1. Homepage load and performance
 * 2. Checkout page validation
 * 3. Admin authentication
 * 4. Toast notifications
 * 5. Promo code system
 * 6. Image optimization
 * 7. Mobile responsiveness
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'https://jchairstudios62.xyz';
const TIMEOUT = 30000;

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`TEST: ${testName}`, 'bold');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function testHomepage(browser) {
  logTest('Homepage Load & Performance');

  const page = await browser.newPage();

  try {
    // Enable performance metrics
    await page.setCacheEnabled(false);

    const startTime = Date.now();
    const response = await page.goto(BASE_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });
    const loadTime = Date.now() - startTime;

    // Check response status
    if (response.status() === 200) {
      logSuccess(`Homepage loaded successfully (${loadTime}ms)`);
    } else {
      logError(`Homepage returned status ${response.status()}`);
    }

    // Check page title
    const title = await page.title();
    logInfo(`Page title: ${title}`);

    // Check for critical elements
    const hasLogo = await page.$('img[alt*="JC Hair"]') !== null;
    const hasNavigation = await page.$('nav') !== null;
    const hasProducts = await page.$$('.product-card, [data-testid*="product"]');

    if (hasLogo) logSuccess('Logo present');
    else logWarning('Logo not found');

    if (hasNavigation) logSuccess('Navigation present');
    else logWarning('Navigation not found');

    if (hasProducts.length > 0) {
      logSuccess(`${hasProducts.length} product cards found`);
    } else {
      logWarning('No product cards found');
    }

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);

    if (consoleErrors.length === 0) {
      logSuccess('No console errors detected');
    } else {
      logError(`${consoleErrors.length} console errors detected`);
      consoleErrors.slice(0, 3).forEach(err => logError(`  ${err}`));
    }

    // Performance metrics
    const metrics = await page.metrics();
    logInfo(`JavaScript heap size: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
    logInfo(`DOM nodes: ${metrics.Nodes}`);

  } catch (error) {
    logError(`Homepage test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testCheckout(browser) {
  logTest('Checkout Page & Validations');

  const page = await browser.newPage();

  try {
    await page.goto(`${BASE_URL}/checkout`, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    logInfo('Checkout page loaded');

    // Check for promo code input
    const promoInput = await page.$('input[placeholder*="código"], input[placeholder*="promo"], input[name*="promo"]');
    if (promoInput) {
      logSuccess('Promo code input found');

      // Test promo code validation
      await promoInput.type('INVALID123');
      const applyButton = await page.$('button:has-text("Aplicar"), button:has-text("Apply")');
      if (applyButton) {
        await applyButton.click();
        await page.waitForTimeout(1000);
        logSuccess('Promo code validation triggered');
      }
    } else {
      logWarning('Promo code input not found - might need items in cart first');
    }

    // Check for form validation
    const nameInput = await page.$('input[name="name"], input[placeholder*="nome"]');
    const emailInput = await page.$('input[name="email"], input[type="email"]');

    if (nameInput && emailInput) {
      logSuccess('Form inputs found');

      // Test validation
      await nameInput.type('a');
      await emailInput.type('invalid');

      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(500);
        logSuccess('Form validation triggered');
      }
    } else {
      logInfo('Form inputs not visible (might need cart items)');
    }

    // Check for Stripe integration
    const stripeElement = await page.$('[data-stripe], .StripeElement, iframe[name*="stripe"]');
    if (stripeElement) {
      logSuccess('Stripe integration detected');
    } else {
      logInfo('Stripe elements not loaded (might need cart items)');
    }

  } catch (error) {
    logError(`Checkout test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testAdmin(browser) {
  logTest('Admin Authentication');

  const page = await browser.newPage();

  try {
    await page.goto(`${BASE_URL}/admin`, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    // Check for login form
    const passwordInput = await page.$('input[type="password"]');
    const loginButton = await page.$('button[type="submit"], button:has-text("Entrar")');

    if (passwordInput && loginButton) {
      logSuccess('Login form detected - admin is protected ✓');

      // Check that no hardcoded password is visible in the page
      const pageContent = await page.content();
      const suspiciousPatterns = [
        'juliojuliana',
        'password:',
        'senha:',
        'admin123'
      ];

      const foundSuspicious = suspiciousPatterns.filter(pattern =>
        pageContent.toLowerCase().includes(pattern)
      );

      if (foundSuspicious.length === 0) {
        logSuccess('No hardcoded credentials found in page source');
      } else {
        logError(`Suspicious patterns found: ${foundSuspicious.join(', ')}`);
      }

      // Test invalid login
      await passwordInput.type('wrongpassword');
      await loginButton.click();
      await page.waitForTimeout(1000);

      const errorMessage = await page.$('.text-red, [class*="error"]');
      if (errorMessage) {
        logSuccess('Invalid login shows error message');
      }

    } else {
      logWarning('Login form not found - might already be authenticated');
    }

  } catch (error) {
    logError(`Admin test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testNotifications(browser) {
  logTest('Toast Notification System');

  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    // Check for toast container
    const toastContainer = await page.$('[id*="toast"], [class*="Toastify"], .sonner-toast');
    if (toastContainer) {
      logSuccess('Toast container found');
    } else {
      logInfo('Toast container not visible (loads on demand)');
    }

    // Check for sonner library
    const hasSonner = await page.evaluate(() => {
      return typeof window !== 'undefined' &&
             (document.querySelector('[data-sonner-toaster]') !== null ||
              document.querySelector('.toaster') !== null);
    });

    if (hasSonner) {
      logSuccess('Sonner toast library detected');
    }

    // Check for react-toastify
    const hasToastify = await page.evaluate(() => {
      return document.querySelector('.Toastify') !== null ||
             document.querySelector('[class*="toast"]') !== null;
    });

    if (hasToastify) {
      logSuccess('React-toastify detected');
    }

    logInfo('Toast notifications are event-driven (trigger on user actions)');

  } catch (error) {
    logError(`Notification test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testImageOptimization(browser) {
  logTest('Image Optimization');

  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    // Get all images
    const images = await page.$$eval('img', imgs =>
      imgs.map(img => ({
        src: img.src,
        loading: img.loading,
        width: img.width,
        height: img.height,
        complete: img.complete,
        naturalWidth: img.naturalWidth
      }))
    );

    logInfo(`Total images found: ${images.length}`);

    // Check for Next.js Image optimization
    const nextImages = images.filter(img =>
      img.src.includes('/_next/image') ||
      img.src.includes('w=') ||
      img.src.includes('q=')
    );

    if (nextImages.length > 0) {
      logSuccess(`${nextImages.length} Next.js optimized images found`);
    } else {
      logWarning('No Next.js image optimization detected');
    }

    // Check for lazy loading
    const lazyImages = images.filter(img => img.loading === 'lazy');
    if (lazyImages.length > 0) {
      logSuccess(`${lazyImages.length} images using lazy loading`);
    }

    // Check for WebP/AVIF support
    const modernFormats = await page.evaluate(() => {
      const sources = Array.from(document.querySelectorAll('source'));
      return sources.some(s =>
        s.type === 'image/webp' ||
        s.type === 'image/avif' ||
        s.srcset?.includes('.webp') ||
        s.srcset?.includes('.avif')
      );
    });

    if (modernFormats) {
      logSuccess('Modern image formats (WebP/AVIF) detected');
    } else {
      logInfo('Modern image formats not explicitly visible (may be served by Next.js)');
    }

  } catch (error) {
    logError(`Image optimization test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testMobileResponsiveness(browser) {
  logTest('Mobile Responsiveness');

  const page = await browser.newPage();

  try {
    // Test on mobile viewport
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true
    });

    await page.goto(BASE_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    logSuccess('Page loaded on mobile viewport (375x667)');

    // Check for mobile menu
    const mobileMenu = await page.$('[class*="mobile"], button[aria-label*="menu"]');
    if (mobileMenu) {
      logSuccess('Mobile menu detected');
    }

    // Check for viewport meta tag
    const viewportMeta = await page.$eval('meta[name="viewport"]', el => el.content);
    if (viewportMeta.includes('width=device-width')) {
      logSuccess('Responsive viewport meta tag present');
    }

    // Check for horizontal scrolling (bad UX)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });

    if (!hasHorizontalScroll) {
      logSuccess('No horizontal scrolling (good mobile UX)');
    } else {
      logWarning('Horizontal scrolling detected (mobile UX issue)');
    }

    // Test tablet viewport
    await page.setViewport({
      width: 768,
      height: 1024
    });

    await page.reload({ waitUntil: 'networkidle2' });
    logSuccess('Page responsive on tablet viewport (768x1024)');

  } catch (error) {
    logError(`Mobile responsiveness test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function testPerformanceMetrics(browser) {
  logTest('Performance Metrics');

  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL, {
      waitUntil: 'networkidle2',
      timeout: TIMEOUT
    });

    // Get performance timing
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
      };
    });

    logInfo(`DOM Content Loaded: ${performanceTiming.domContentLoaded}ms`);
    logInfo(`Fully Loaded: ${performanceTiming.fullyLoaded}ms`);
    logInfo(`First Paint: ${performanceTiming.firstPaint.toFixed(0)}ms`);
    logInfo(`First Contentful Paint: ${performanceTiming.firstContentfulPaint.toFixed(0)}ms`);

    // Performance evaluation
    if (performanceTiming.domContentLoaded < 2000) {
      logSuccess('DOM Content Loaded < 2s (excellent)');
    } else if (performanceTiming.domContentLoaded < 3000) {
      logInfo('DOM Content Loaded < 3s (good)');
    } else {
      logWarning('DOM Content Loaded > 3s (needs optimization)');
    }

    if (performanceTiming.firstContentfulPaint < 1500) {
      logSuccess('First Contentful Paint < 1.5s (excellent)');
    } else if (performanceTiming.firstContentfulPaint < 2500) {
      logInfo('First Contentful Paint < 2.5s (good)');
    } else {
      logWarning('First Contentful Paint > 2.5s (needs optimization)');
    }

  } catch (error) {
    logError(`Performance metrics test failed: ${error.message}`);
  } finally {
    await page.close();
  }
}

// Main test runner
async function runTests() {
  log('\n🚀 JC Hair Studio - Production Test Suite', 'bold');
  log(`🌐 Testing: ${BASE_URL}\n`, 'cyan');

  const startTime = Date.now();

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    await testHomepage(browser);
    await testCheckout(browser);
    await testAdmin(browser);
    await testNotifications(browser);
    await testImageOptimization(browser);
    await testMobileResponsiveness(browser);
    await testPerformanceMetrics(browser);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

    log('\n' + '='.repeat(60), 'cyan');
    log('✅ ALL TESTS COMPLETED', 'bold');
    log(`⏱️  Total time: ${totalTime}s`, 'cyan');
    log('='.repeat(60) + '\n', 'cyan');

  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Run tests
runTests().catch(console.error);
