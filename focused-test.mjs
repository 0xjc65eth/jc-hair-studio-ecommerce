#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function testAPIs() {
  console.log('🧪 Testing critical API endpoints...\n');

  const tests = [
    {
      name: 'Homepage',
      url: `${BASE_URL}/`,
      method: 'GET'
    },
    {
      name: 'Products API',
      url: `${BASE_URL}/api/products/popular`,
      method: 'GET'
    },
    {
      name: 'Auth Session',
      url: `${BASE_URL}/api/auth/session`,
      method: 'GET'
    },
    {
      name: 'Points API',
      url: `${BASE_URL}/api/points`,
      method: 'GET'
    },
    {
      name: 'Stripe Payment Intent',
      url: `${BASE_URL}/api/create-payment-intent`,
      method: 'POST',
      body: JSON.stringify({
        amount: 100,
        currency: 'eur'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    },
    {
      name: 'Admin Panel',
      url: `${BASE_URL}/admin`,
      method: 'GET'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🔍 Testing ${test.name}...`);

      const options = {
        method: test.method,
        headers: test.headers || {},
      };

      if (test.body) {
        options.body = test.body;
      }

      const response = await fetch(test.url, options);
      const status = response.status;
      const statusText = response.statusText;

      if (status >= 200 && status < 300) {
        console.log(`   ✅ ${test.name}: ${status} ${statusText}`);
      } else if (status >= 300 && status < 400) {
        console.log(`   🔄 ${test.name}: ${status} ${statusText} (redirect)`);
      } else if (status >= 400 && status < 500) {
        console.log(`   ⚠️  ${test.name}: ${status} ${statusText} (client error)`);
      } else {
        console.log(`   ❌ ${test.name}: ${status} ${statusText} (server error)`);
      }

      // Try to get response body for some endpoints
      if (test.name === 'Products API' || test.name === 'Points API') {
        try {
          const data = await response.json();
          console.log(`   📊 Response type: ${typeof data}, length: ${Array.isArray(data) ? data.length : 'N/A'}`);
        } catch (e) {
          console.log(`   📊 Response body: ${await response.text().slice(0, 100)}...`);
        }
      }

    } catch (error) {
      console.log(`   ❌ ${test.name} FAILED: ${error.message}`);
    }
  }

  console.log('\n🎉 API testing completed!');
}

async function testCartWorkflow() {
  console.log('\n🛒 Testing cart workflow...');

  // Test cart endpoints
  const cartTests = [
    `${BASE_URL}/api/cart`,
    `${BASE_URL}/carrinho`,
    `${BASE_URL}/checkout`
  ];

  for (const url of cartTests) {
    try {
      const response = await fetch(url);
      console.log(`   🛒 ${url}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   ❌ ${url} FAILED: ${error.message}`);
    }
  }
}

async function testEmailNotifications() {
  console.log('\n📧 Testing email notification system...');

  try {
    // Test email API endpoint if it exists
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test notification',
        text: 'Test email from API'
      })
    });

    console.log(`   📧 Email API: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`   📧 Email API test: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  await testAPIs();
  await testCartWorkflow();
  await testEmailNotifications();
}

runAllTests().catch(console.error);