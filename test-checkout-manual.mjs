#!/usr/bin/env node

/**
 * Manual Checkout Flow Test
 * JC Hair Studio's 62 - Simple Test Script
 *
 * This script performs a basic test of the checkout functionality
 * focusing on localStorage persistence and page loading
 */

import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Color coding for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`)
};

/**
 * Test the complete checkout flow manually
 */
async function testCheckoutFlow() {
  const browser = await puppeteer.launch({
    headless: false, // Keep visible for debugging
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Enable console logging from the browser
    page.on('console', msg => {
      if (msg.type() === 'error') {
        log.error(`Browser Console: ${msg.text()}`);
      } else if (msg.text().includes('🛒') || msg.text().includes('CHECKOUT')) {
        log.info(`Debug: ${msg.text()}`);
      }
    });

    log.info('🚀 Starting Manual Checkout Flow Test');
    log.info(`🌐 Base URL: ${BASE_URL}`);

    // Step 1: Load cosméticos page and add a product
    log.info('📄 Loading cosméticos page...');
    await page.goto(`${BASE_URL}/cosmeticos`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Add a product to cart by clicking first "Comprar" button
    log.info('🛒 Adding product to cart...');
    try {
      // Wait for products to load first
      await page.waitForSelector('button', { timeout: 10000 });

      // Find gradient buttons (Comprar buttons have gradient styling)
      const gradientButtons = await page.$$('button[class*="bg-gradient-to-r"]');

      if (gradientButtons.length > 0) {
        // Click the first gradient button (should be a Comprar button)
        await gradientButtons[0].click();
        log.success(`Product added to cart via gradient button (found ${gradientButtons.length} buttons)`);
      } else {
        throw new Error('No gradient buttons (Comprar buttons) found');
      }

      // Wait for cart operation to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (e) {
      log.error(`Failed to add product: ${e.message}`);
      throw e;
    }

    // Step 3: Check localStorage for cart data
    const cartData = await page.evaluate(() => {
      const stored = localStorage.getItem('jc-cart-storage-manual');
      return stored ? JSON.parse(stored) : null;
    });

    if (cartData && cartData.length > 0) {
      log.success(`📦 Cart contains ${cartData.length} item(s) in localStorage`);
      log.info(`📝 Cart items: ${cartData.map(item => item.product.name).join(', ')}`);
    } else {
      log.error('❌ No items found in cart localStorage');
      throw new Error('Cart is empty after adding product');
    }

    // Step 4: Navigate to checkout page
    log.info('🏁 Testing checkout page...');
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Give time for initialization

    // Step 5: Check if checkout shows "Carrinho Vazio" error
    const emptyCartError = await page.$('text=Carrinho Vazio');
    if (emptyCartError) {
      log.error('❌ CHECKOUT ERROR: Page shows "Carrinho Vazio" despite items in localStorage');
      throw new Error('Checkout shows empty cart with items present');
    } else {
      log.success('✅ Checkout page does NOT show "Carrinho Vazio" error');
    }

    // Step 6: Check if checkout form is visible
    const checkoutForm = await page.$('input[type="text"], input[type="email"]');
    if (checkoutForm) {
      log.success('📋 Checkout form is visible - cart loaded correctly');
    } else {
      log.warning('⚠️ Checkout form not found');
    }

    // Step 7: Final verification
    const finalCartCheck = await page.evaluate(() => {
      const stored = localStorage.getItem('jc-cart-storage-manual');
      return stored ? JSON.parse(stored).length : 0;
    });

    log.success(`🎉 TEST COMPLETED SUCCESSFULLY!`);
    log.info(`📊 Final Results:`);
    log.info(`   - Cart items in localStorage: ${finalCartCheck}`);
    log.info(`   - Checkout page loaded without "Carrinho Vazio" error`);
    log.info(`   - Race condition fix appears to be working ✅`);

    // Keep browser open for 10 seconds to observe
    log.info('🔍 Keeping browser open for 10 seconds for observation...');
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
(async () => {
  try {
    await testCheckoutFlow();
    log.success('🔥 ALL TESTS PASSED - Checkout race condition has been resolved!');
    process.exit(0);
  } catch (error) {
    log.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
})();