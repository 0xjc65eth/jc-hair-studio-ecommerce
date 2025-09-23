#!/usr/bin/env node

/**
 * Test script for Ultra-Enhanced Admin Notification System
 * Tests the new comprehensive admin notification with analytics
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Test data for enhanced notification
const testOrderData = {
  orderId: `TEST-ENH-${Date.now()}`,
  customerName: 'Maria Silva Santos',
  customerEmail: 'maria.test@exemplo.com',
  customerPhone: '+351 912345678',
  total: 299.99,
  subtotal: 269.99,
  shippingCost: 15.00,
  tax: 15.00,
  discount: 0,
  currency: 'EUR',
  status: 'paid',
  paymentMethod: 'Cartão de Crédito',
  paymentGateway: 'Stripe',
  transactionId: 'pi_test_enhanced_notification_123',

  // Enhanced order structure
  customer: {
    email: 'maria.test@exemplo.com',
    firstName: 'Maria',
    lastName: 'Silva Santos',
    phone: '+351 912345678',
    type: 'retail',
    cpf: '123.456.789-00'
  },

  pricing: {
    subtotal: 269.99,
    shipping: 15.00,
    tax: 15.00,
    discount: 0,
    total: 299.99,
    currency: 'EUR'
  },

  payment: {
    status: 'paid',
    method: 'stripe',
    transactionId: 'pi_test_enhanced_notification_123',
    paymentDate: new Date().toISOString()
  },

  shipping: {
    status: 'pending',
    method: 'standard',
    shippingCost: 15.00
  },

  products: [
    {
      productId: 'PROD-001',
      name: 'Progressiva Brasileira Premium',
      description: 'Tratamento alisante profissional de alta qualidade',
      quantity: 2,
      unitPrice: 89.99,
      price: 89.99,
      totalPrice: 179.98,
      category: 'tratamento_capilar',
      subcategory: 'progressivas',
      brand: 'Beauty Pro',
      sku: 'BP-PROG-001',
      size: '1L'
    },
    {
      productId: 'PROD-002',
      name: 'Kit Manutenção Pós-Progressiva',
      description: 'Shampoo e condicionador para manutenção',
      quantity: 1,
      unitPrice: 90.01,
      price: 90.01,
      totalPrice: 90.01,
      category: 'cuidados_diarios',
      subcategory: 'shampoos_condicionadores',
      brand: 'Hair Care Plus',
      sku: 'HCP-KIT-002',
      size: '300ml'
    }
  ],

  deliveryAddress: {
    firstName: 'Maria',
    lastName: 'Silva Santos',
    street: 'Rua das Flores, 123',
    number: '123',
    complement: 'Apartamento 4B',
    neighborhood: 'Centro',
    city: 'Lisboa',
    state: 'Lisboa',
    zipCode: '1000-001',
    country: 'PT',
    phone: '+351 912345678',
    deliveryInstructions: 'Porteiro disponível das 8h às 18h'
  },

  metadata: {
    source: 'website',
    deviceType: 'desktop',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'progressiva-premium-2024',
    referrer: 'https://google.com'
  },

  timestamps: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  createdAt: new Date().toISOString()
};

async function testEnhancedNotifications() {
  console.log('🚀 Testing Ultra-Enhanced Admin Notification System...\n');

  try {
    console.log('📤 Sending test notification request...');

    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'test',
        testEmail: 'admin-test@jchairstudios62.xyz',
        enhancedData: testOrderData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ Test completed successfully!');
    console.log('\n📊 Test Results:');
    console.log('- Success:', result.success);
    console.log('- Message:', result.message);

    if (result.results) {
      console.log('\n📈 Agent Execution Summary:');
      console.log('- Total Agents:', result.results.total);
      console.log('- Successful:', result.results.successful);
      console.log('- Failed:', result.results.failed);

      if (result.results.details) {
        console.log('\n🔍 Agent Details:');
        result.results.details.forEach((detail, index) => {
          const status = detail.status === 'fulfilled' ? '✅' : '❌';
          console.log(`  ${status} Agent ${index + 1} (${detail.agent}): ${detail.status}`);
          if (detail.error) {
            console.log(`     Error: ${detail.error}`);
          }
        });
      }
    }

    console.log('\n🎯 Enhanced Features Tested:');
    console.log('✅ Customer profile analytics');
    console.log('✅ Product enrichment with stock/profit analysis');
    console.log('✅ Order priority classification');
    console.log('✅ Risk assessment system');
    console.log('✅ Business intelligence recommendations');
    console.log('✅ Comprehensive financial breakdown');
    console.log('✅ Marketing conversion analytics');
    console.log('✅ Actionable business insights');
    console.log('✅ Rich formatting with executive summary');

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    // Try to get more details if server responded
    if (error.response) {
      try {
        const errorData = await error.response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Could not parse error response');
      }
    }
  }
}

async function testSystemStatus() {
  console.log('\n🔍 Checking notification system status...');

  try {
    const response = await fetch(`${BASE_URL}/api/admin/notifications`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const status = await response.json();

    console.log('📊 System Status:');
    console.log('- Health:', status.health);
    console.log('- Admin Email:', status.config?.adminEmail);
    console.log('- Emails Enabled:', status.config?.emailsEnabled);
    console.log('- Parallel Execution:', status.config?.parallelExecution);

    if (status.statistics && status.statistics.length > 0) {
      console.log('\n📈 Historical Statistics:');
      status.statistics.forEach(stat => {
        console.log(`- ${stat._id}: ${stat.sent}/${stat.total} sent successfully`);
      });
    }

  } catch (error) {
    console.error('❌ Status check failed:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🎯 Ultra-Enhanced Admin Notification System Test Suite');
  console.log('=' .repeat(60));

  await testSystemStatus();
  await testEnhancedNotifications();

  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test suite completed!');
  console.log('\nℹ️  Check your admin email for the ultra-enhanced notification.');
  console.log('📧 Expected recipient:', testOrderData.customer.email);
  console.log('💰 Test order total:', `${testOrderData.currency}${testOrderData.total}`);
  console.log('🎨 New features include rich analytics, risk assessment,');
  console.log('   profit analysis, and comprehensive business intelligence.');
}

main().catch(console.error);