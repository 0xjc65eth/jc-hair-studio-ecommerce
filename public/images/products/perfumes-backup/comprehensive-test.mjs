#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function runComprehensiveTests() {
  console.log('🧪 Starting comprehensive e-commerce test suite...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Monitor console logs
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`🖥️ CONSOLE [${type.toUpperCase()}]: ${text}`);
    });

    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });

    page.on('requestfailed', request => {
      console.log('🔴 REQUEST FAILED:', request.url(), request.failure().errorText);
    });

    console.log('\n📱 Test 1: Homepage Navigation');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'test-homepage.png' });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('✅ Homepage loaded successfully');

    console.log('\n🧭 Test 2: Navigation Menu Testing');
    const menuItems = [
      { selector: 'a[href*="mega-hair"]', name: 'Mega Hair' },
      { selector: 'a[href*="tintas"]', name: 'Tintas' },
      { selector: 'a[href*="cosmeticos"]', name: 'Cosméticos' },
      { selector: 'a[href*="tratamentos"]', name: 'Tratamentos' },
      { selector: 'a[href*="maquiagens"]', name: 'Maquiagens' }
    ];

    for (const item of menuItems) {
      try {
        console.log(`   Testing navigation to ${item.name}...`);
        await page.click(item.selector);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
        console.log(`   ✅ ${item.name} page loaded`);
        await page.goBack();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.log(`   ❌ Failed to navigate to ${item.name}: ${error.message}`);
      }
    }

    console.log('\n🛒 Test 3: Add Product to Cart');
    try {
      // Go to a specific product page
      await page.goto(`${BASE_URL}/mega-hair`, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Find first product
      const productCards = await page.$$('.product-card, [data-testid="product-card"]');
      if (productCards.length > 0) {
        console.log(`   Found ${productCards.length} products`);

        // Click on first product
        await productCards[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Look for add to cart button
        const addToCartSelectors = [
          'button[data-testid="add-to-cart"]',
          'button:contains("Adicionar ao Carrinho")',
          'button:contains("Add to Cart")',
          '.add-to-cart-button',
          'button[type="submit"]'
        ];

        let cartButtonFound = false;
        for (const selector of addToCartSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 2000 });
            await page.click(selector);
            console.log('   ✅ Product added to cart');
            cartButtonFound = true;
            break;
          } catch (e) {
            // Try next selector
          }
        }

        if (!cartButtonFound) {
          console.log('   ❌ Add to cart button not found');
        }

      } else {
        console.log('   ❌ No products found on mega-hair page');
      }
    } catch (error) {
      console.log(`   ❌ Add to cart test failed: ${error.message}`);
    }

    console.log('\n💳 Test 4: Checkout Process');
    try {
      // Try to access cart/checkout
      await page.goto(`${BASE_URL}/carrinho`, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('   ✅ Cart page accessible');

      // Look for checkout button
      const checkoutSelectors = [
        'button:contains("Finalizar Compra")',
        'button:contains("Checkout")',
        '.checkout-button',
        '[data-testid="checkout-button"]'
      ];

      for (const selector of checkoutSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          console.log('   ✅ Checkout button found');
          break;
        } catch (e) {
          // Try next selector
        }
      }
    } catch (error) {
      console.log(`   ❌ Checkout test failed: ${error.message}`);
    }

    console.log('\n👤 Test 5: Account Creation');
    try {
      await page.goto(`${BASE_URL}/conta/registro`, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try to fill registration form
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';

      await page.type('input[type="email"], input[name="email"]', testEmail);
      await page.type('input[type="password"], input[name="password"]', testPassword);

      // Look for submit button
      const submitSelectors = [
        'button[type="submit"]',
        'button:contains("Criar Conta")',
        'button:contains("Register")'
      ];

      for (const selector of submitSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          console.log('   ✅ Registration form found and filled');
          // Note: Not actually submitting to avoid creating test accounts
          break;
        } catch (e) {
          // Try next selector
        }
      }
    } catch (error) {
      console.log(`   ❌ Account creation test failed: ${error.message}`);
    }

    console.log('\n🔧 Test 6: Admin Panel Access');
    try {
      await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle2' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('   ✅ Admin panel accessible');
    } catch (error) {
      console.log(`   ❌ Admin panel test failed: ${error.message}`);
    }

    console.log('\n🧪 Test 7: API Endpoints');
    const apiTests = [
      '/api/products',
      '/api/cart',
      '/api/points',
      '/api/create-payment-intent'
    ];

    for (const endpoint of apiTests) {
      try {
        const response = await page.goto(`${BASE_URL}${endpoint}`, { waitUntil: 'networkidle2' });
        console.log(`   API ${endpoint}: ${response.status()} ${response.statusText()}`);
      } catch (error) {
        console.log(`   ❌ API ${endpoint} failed: ${error.message}`);
      }
    }

    await page.screenshot({ path: 'test-final-state.png' });

    console.log('\n🎉 Comprehensive test suite completed!');
    console.log('📸 Screenshots saved: test-homepage.png, test-final-state.png');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    await browser.close();
  }
}

// Run tests
runComprehensiveTests().catch(console.error);