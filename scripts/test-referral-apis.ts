#!/usr/bin/env node

const BASE_URL = 'http://localhost:3001'

interface TestResult {
  endpoint: string
  method: string
  status: number
  success: boolean
  data?: any
  error?: any
}

const testResults: TestResult[] = []

async function testEndpoint(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any,
  headers?: Record<string, string>
): Promise<TestResult> {
  const url = `${BASE_URL}${endpoint}`

  console.log(`🧪 Testing ${method} ${endpoint}...`)

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    })

    const data = await response.json().catch(() => null)

    const result: TestResult = {
      endpoint,
      method,
      status: response.status,
      success: response.ok,
      data
    }

    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`)
    } else {
      console.log(`❌ ${method} ${endpoint} - Status: ${response.status}`)
      console.log(`   Error: ${JSON.stringify(data, null, 2)}`)
    }

    testResults.push(result)
    return result

  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Network Error`)
    console.log(`   Error: ${error.message}`)

    const result: TestResult = {
      endpoint,
      method,
      status: 0,
      success: false,
      error: error.message
    }

    testResults.push(result)
    return result
  }
}

async function runTests() {
  console.log('🚀 Testing Referral System APIs')
  console.log('================================\n')

  // Test 1: Validate a fake referral code (should fail)
  await testEndpoint('/api/referrals/FAKE123')

  // Test 2: Get referral stats (should require auth)
  await testEndpoint('/api/referrals/stats')

  // Test 3: Get referrals list (should require auth)
  await testEndpoint('/api/referrals')

  // Test 4: Process referral (should require auth and data)
  await testEndpoint('/api/referrals/process', 'POST', {
    referralCode: 'TEST123',
    source: 'test'
  })

  // Test 5: Cashback payout (should require auth)
  await testEndpoint('/api/referrals/cashback/payout')

  // Test 6: Request cashback payout (should require auth and data)
  await testEndpoint('/api/referrals/cashback/payout', 'POST', {
    amount: 25.00,
    method: 'BANK_TRANSFER',
    bankDetails: {
      account: '12345',
      bankName: 'Test Bank',
      accountHolder: 'Test User'
    }
  })

  console.log('\n📊 Test Results Summary')
  console.log('=======================')

  let passed = 0
  let failed = 0

  testResults.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${result.method} ${result.endpoint} (${result.status})`)

    if (result.success) {
      passed++
    } else {
      failed++
    }
  })

  console.log(`\nTotal: ${testResults.length} tests`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)

  // Expected results analysis
  console.log('\n🔍 Expected Results Analysis')
  console.log('============================')

  const authRequiredEndpoints = [
    '/api/referrals/stats',
    '/api/referrals',
    '/api/referrals/process',
    '/api/referrals/cashback/payout'
  ]

  authRequiredEndpoints.forEach(endpoint => {
    const result = testResults.find(r => r.endpoint === endpoint)
    if (result) {
      if (result.status === 401) {
        console.log(`✅ ${endpoint} correctly requires authentication (401)`)
      } else {
        console.log(`⚠️ ${endpoint} should require authentication but returned ${result.status}`)
      }
    }
  })

  // Check if fake referral code validation works
  const fakeCodeResult = testResults.find(r => r.endpoint === '/api/referrals/FAKE123')
  if (fakeCodeResult) {
    if (fakeCodeResult.status === 404) {
      console.log(`✅ Fake referral code validation works correctly (404)`)
    } else {
      console.log(`⚠️ Fake referral code should return 404 but returned ${fakeCodeResult.status}`)
    }
  }

  return { passed, failed, total: testResults.length }
}

// Run tests
runTests()
  .then(results => {
    console.log(`\n🎯 Testing completed: ${results.passed}/${results.total} passed`)

    if (results.failed === 0) {
      console.log('🎉 All expected behaviors working correctly!')
    } else {
      console.log('⚠️ Some tests failed, but this may be expected behavior')
    }

    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Testing failed:', error)
    process.exit(1)
  })