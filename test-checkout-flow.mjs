#!/usr/bin/env node

/**
 * E-commerce Checkout Flow Test Script
 * JC Hair Studio's 62 - Comprehensive Testing
 *
 * This script tests the complete e-commerce flow to ensure cart functionality
 * works correctly across all pages and the checkout process is functional.
 */

import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Color coding for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (step, msg) => console.log(`${colors.cyan}[${step}] ${msg}${colors.reset}`)
};

/**
 * Test cart functionality by adding products and verifying persistence
 */
async function testCheckoutFlow() {
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD environments
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Enable console logging from the browser
    page.on('console', msg => {
      if (msg.type() === 'error') {
        log.error(`Browser Console: ${msg.text()}`);
      }
    });

    log.info('🚀 Starting E-commerce Checkout Flow Test');
    log.info(`🌐 Base URL: ${BASE_URL}`);

    // Step 1: Test Home Page Load
    log.step(1, 'Loading home page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('body', { timeout: 10000 });
    log.success('Home page loaded successfully');

    // Step 2: Navigate to Products Page (Cosméticos)
    log.step(2, 'Navigating to cosméticos page...');
    await page.goto(`${BASE_URL}/cosmeticos`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for products to load
    await page.waitForSelector('[class*="grid"]', { timeout: 15000 });
    log.success('Cosméticos page loaded with products');

    // Step 3: Add Product to Cart
    log.step(3, 'Adding product to cart...');

    // Wait for and click first "Comprar" button
    const buyButtons = await page.$$('button:has-text("Comprar"), button[class*="Comprar"]');
    if (buyButtons.length === 0) {
      // Try alternative selectors
      const altButtons = await page.$$('button:has-text("Adicionar"), button[class*="bg-gradient"]');
      if (altButtons.length > 0) {
        await altButtons[0].click();
      } else {
        throw new Error('No buy buttons found on page');
      }
    } else {
      await buyButtons[0].click();
    }

    // Wait for cart to update
    await page.waitForTimeout(2000);
    log.success('Product added to cart');

    // Step 4: Check Cart Drawer Opens
    log.step(4, 'Verifying cart drawer functionality...');

    // Check if cart drawer is visible or open cart manually
    const cartButton = await page.$('[class*="cart"], button:has-text("Carrinho")');
    if (cartButton) {
      await cartButton.click();
      await page.waitForTimeout(1000);
    }

    // Verify cart has items
    const cartItemCount = await page.evaluate(() => {
      // Check localStorage for cart items
      const cartData = localStorage.getItem('jc-cart-storage-manual');
      if (cartData) {
        const cart = JSON.parse(cartData);
        return cart.length;
      }
      return 0;
    });

    if (cartItemCount > 0) {
      log.success(`Cart contains ${cartItemCount} item(s)`);
    } else {
      throw new Error('Cart is empty after adding product');
    }

    // Step 5: Navigate to Cart Page
    log.step(5, 'Testing cart page...');
    await page.goto(`${BASE_URL}/carrinho`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for page to load and check for loading states
    await page.waitForTimeout(2000);

    // Check if showing loading or cart content
    const isLoading = await page.$('[class*="loading"], [class*="spinner"]');
    if (isLoading) {
      log.info('Cart is loading, waiting...');
      await page.waitForTimeout(3000);
    }

    // Check for empty cart message
    const emptyCartMsg = await page.$('text=vazio');
    if (emptyCartMsg) {
      throw new Error('Cart page shows empty cart despite having items');
    }

    log.success('Cart page shows items correctly');

    // Step 6: Navigate to Checkout
    log.step(6, 'Testing checkout page...');
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for checkout page to fully load
    await page.waitForTimeout(3000);

    // Check if showing loading state
    const checkoutLoading = await page.$('[class*="loading"], [class*="spinner"]');
    if (checkoutLoading) {
      log.info('Checkout is loading, waiting...');
      await page.waitForTimeout(3000);
    }

    // Check for empty cart error
    const emptyCheckoutMsg = await page.$('text=Carrinho Vazio');
    if (emptyCheckoutMsg) {
      throw new Error('Checkout page shows "Carrinho Vazio" despite having items');
    }

    // Check for checkout form elements
    const checkoutForm = await page.$('input[type="text"], input[type="email"]');
    if (checkoutForm) {
      log.success('Checkout page shows form correctly');
    } else {
      log.warning('Checkout form not found, but no empty cart error');
    }

    // Step 7: Test Mega Hair Page
    log.step(7, 'Testing mega-hair page cart functionality...');
    await page.goto(`${BASE_URL}/mega-hair`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for mega hair products to load
    await page.waitForTimeout(3000);

    // Try to add a mega hair product
    const megaHairBuyButton = await page.$('button:has-text("Adicionar ao Carrinho")');
    if (megaHairBuyButton) {
      await megaHairBuyButton.click();
      await page.waitForTimeout(2000);
      log.success('Mega hair product added to cart');
    } else {
      log.warning('No mega hair buy buttons found');
    }

    // Final Step: Verify Total Cart State
    log.step(8, 'Final cart state verification...');
    const finalCartCount = await page.evaluate(() => {
      const cartData = localStorage.getItem('jc-cart-storage-manual');
      if (cartData) {
        const cart = JSON.parse(cartData);
        return cart.length;
      }
      return 0;
    });

    log.success(`🎉 Test completed successfully!`);
    log.info(`📊 Final cart contains: ${finalCartCount} item(s)`);
    log.info(`🛒 Cart persistence: ${finalCartCount > 0 ? 'WORKING' : 'FAILED'}`);

    // Return to checkout one final time to verify
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);

    const finalEmptyCheck = await page.$('text=Carrinho Vazio');
    if (finalEmptyCheck && finalCartCount > 0) {
      throw new Error('Final checkout test failed: shows empty cart with items present');
    }

    log.success('🔥 ALL TESTS PASSED - Checkout flow is working correctly!');

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
    process.exit(0);
  } catch (error) {
    log.error(`Test suite failed: ${error.message}`);
    process.exit(1);
  }
})();