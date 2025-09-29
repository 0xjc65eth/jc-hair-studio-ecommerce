import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { sendEmail, generateOrderConfirmationEmail, generateSupportEmail } from '@/lib/utils/email';
import { sendContactEmail, sendOrderConfirmationEmail as sendOrderEmail, sendPaymentConfirmationEmail, sendShippingNotificationEmail, sendNewsletterEmail } from '@/lib/utils/sendgrid';

// Email test history storage (in-memory for this session)
const emailHistory: Array<{
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  status: 'sent' | 'failed' | 'simulated';
  error?: string;
  type: string;
  responseTime: number;
}> = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'config') {
      // Return email configuration status
      const config = {
        sendgrid: {
          configured: !!process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.'),
          apiKeyExists: !!process.env.SENDGRID_API_KEY,
          apiKeyFormat: process.env.SENDGRID_API_KEY ?
            (process.env.SENDGRID_API_KEY.startsWith('SG.') ? 'valid' : 'invalid') :
            'missing',
          testMode: process.env.SENDGRID_TEST_MODE === 'true',
          sandboxMode: process.env.SENDGRID_SANDBOX_MODE === 'true',
          forceSend: process.env.FORCE_SEND_EMAILS === 'true',
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          fromEmail: process.env.FROM_EMAIL,
          fromName: process.env.FROM_NAME,
          supportEmail: process.env.SUPPORT_EMAIL,
        },
        history: emailHistory.slice(-10), // Last 10 attempts
      };

      return NextResponse.json({
        success: true,
        config,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'history') {
      return NextResponse.json({
        success: true,
        history: emailHistory.slice(-50), // Last 50 attempts
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use ?action=config or ?action=history'
    }, { status: 400 });

  } catch (error) {
    console.error('Email debug GET error:', error);
    return NextResponse.json({
      error: 'Failed to get email debug info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, to, bypassProduction, testType = 'basic' } = body;

    if (action !== 'test') {
      return NextResponse.json({
        error: 'Invalid action. Use action: "test"'
      }, { status: 400 });
    }

    const startTime = Date.now();
    const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('🧪 Email test initiated:', {
      testId,
      to: to?.replace(/(.{3}).*(@.*)/, '$1***$2'),
      testType,
      bypassProduction
    });

    // Configure SendGrid for testing if needed
    if (bypassProduction && process.env.SENDGRID_API_KEY) {
      console.log('🔧 Configuring SendGrid for test mode...');

      // Temporarily set environment for testing - ESCOPO CORRIGIDO
      let originalEnv: string | undefined;
      let originalForce: string | undefined;
      let originalSandbox: string | undefined;

      try {
        // Store original values (avoiding NODE_ENV to prevent webpack issues)
        originalForce = process.env.FORCE_SEND_EMAILS;
        originalSandbox = process.env.SENDGRID_SANDBOX_MODE;

        if (bypassProduction) {
          process.env.FORCE_SEND_EMAILS = 'true';
          process.env.SENDGRID_SANDBOX_MODE = 'true';
        }
        let testResult;
        const testEmail = to || 'debug-test@example.com';

        switch (testType) {
          case 'contact':
            testResult = await sendContactEmail({
              name: 'Debug Test User',
              email: testEmail,
              subject: 'Debug Test - Contact Form',
              message: `This is a debug test message sent at ${new Date().toISOString()}.\n\nTest ID: ${testId}\nBypass Production: ${bypassProduction}`,
              phone: '+351 928375226',
              formType: 'contact'
            });
            break;

          case 'order':
            testResult = await sendOrderEmail({
              orderId: `TEST_${testId}`,
              customerName: 'Debug Test Customer',
              customerEmail: testEmail,
              total: 99.99,
              items: [
                {
                  name: 'Debug Test Product',
                  quantity: 1,
                  price: 99.99,
                  imageUrl: 'https://via.placeholder.com/150',
                  description: 'This is a test product for debugging purposes',
                  brand: 'Debug Brand',
                  category: 'Test Category'
                }
              ],
              paymentMethod: 'Test Payment',
              orderDate: new Date().toLocaleDateString('pt-PT')
            });
            break;

          case 'newsletter':
            testResult = await sendNewsletterEmail(testEmail, 'Debug Test User');
            break;

          case 'legacy':
            // Test the legacy email function
            const legacyEmailData = generateSupportEmail({
              customerName: 'Debug Test User',
              customerEmail: testEmail,
              subject: 'Debug Test - Legacy Email',
              message: `This is a debug test using the legacy email system.\n\nTest ID: ${testId}\nTimestamp: ${new Date().toISOString()}`,
              phone: '+351 928375226'
            });
            testResult = await sendEmail(legacyEmailData);
            break;

          default: // 'basic'
            // Direct SendGrid test
            if (!process.env.SENDGRID_API_KEY) {
              throw new Error('SendGrid API key not configured');
            }

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const basicTestEmail = {
              to: testEmail,
              from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
              subject: `🧪 Debug Test Email - ${testId}`,
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <title>Debug Test Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
                    <h1 style="color: white; margin: 0;">🧪 Debug Test Email</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 5px 0;">JC Hair Studio's 62 - Email System Test</p>
                  </div>

                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #374151; margin-top: 0;">✅ Email System Working!</h2>
                    <p style="color: #6b7280; line-height: 1.6;">
                      This is a test email to verify that the email system is functioning correctly.
                    </p>

                    <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                      <p><strong>Test ID:</strong> ${testId}</p>
                      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                      <p><strong>Test Type:</strong> Basic SendGrid Test</p>
                      <p><strong>Bypass Production:</strong> ${bypassProduction ? 'Yes' : 'No'}</p>
                      <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
                      <p><strong>Sandbox Mode:</strong> ${process.env.SENDGRID_SANDBOX_MODE === 'true' ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>

                  <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #166534;">
                      <strong>✅ Success:</strong> If you received this email, the email system is working correctly!
                    </p>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">
                      JC Hair Studio's 62 - Email Debug System<br>
                      Generated: ${new Date().toLocaleString('pt-PT')}
                    </p>
                  </div>
                </body>
                </html>
              `,
              text: `
                Debug Test Email - JC Hair Studio's 62

                Email System Working!

                Test ID: ${testId}
                Timestamp: ${new Date().toISOString()}
                Test Type: Basic SendGrid Test
                Bypass Production: ${bypassProduction ? 'Yes' : 'No'}
                Environment: ${process.env.NODE_ENV}
                Sandbox Mode: ${process.env.SENDGRID_SANDBOX_MODE === 'true' ? 'Enabled' : 'Disabled'}

                If you received this email, the email system is working correctly!

                JC Hair Studio's 62 - Email Debug System
                Generated: ${new Date().toLocaleString('pt-PT')}
              `,
              mail_settings: {
                sandbox_mode: {
                  enable: process.env.SENDGRID_SANDBOX_MODE === 'true' && !bypassProduction
                }
              }
            };

            await sgMail.send(basicTestEmail);
            testResult = true;
        }

        const responseTime = Date.now() - startTime;

        // Log test result
        const historyEntry = {
          id: testId,
          timestamp: new Date().toISOString(),
          to: testEmail,
          subject: `Debug Test - ${testType}`,
          status: testResult ? 'sent' as const : 'failed' as const,
          type: `debug-${testType}`,
          responseTime
        };

        emailHistory.push(historyEntry);

        // Keep only last 100 entries
        if (emailHistory.length > 100) {
          emailHistory.splice(0, emailHistory.length - 100);
        }

        console.log('✅ Email test completed successfully:', {
          testId,
          testType,
          responseTime,
          result: testResult
        });

        return NextResponse.json({
          success: true,
          testId,
          message: `Email test (${testType}) completed successfully`,
          details: {
            to: testEmail,
            testType,
            bypassProduction,
            responseTime,
            sandboxMode: process.env.SENDGRID_SANDBOX_MODE === 'true',
            timestamp: new Date().toISOString()
          }
        });

      } catch (sendError) {
        const responseTime = Date.now() - startTime;

        // Log failed test
        const historyEntry = {
          id: testId,
          timestamp: new Date().toISOString(),
          to: to || 'debug-test@example.com',
          subject: `Debug Test - ${testType} (FAILED)`,
          status: 'failed' as const,
          error: sendError instanceof Error ? sendError.message : 'Unknown error',
          type: `debug-${testType}`,
          responseTime
        };

        emailHistory.push(historyEntry);

        console.error('❌ Email test failed:', {
          testId,
          testType,
          error: sendError,
          responseTime
        });

        return NextResponse.json({
          success: false,
          testId,
          error: 'Email test failed',
          details: {
            message: sendError instanceof Error ? sendError.message : 'Unknown error',
            testType,
            bypassProduction,
            responseTime,
            timestamp: new Date().toISOString()
          }
        }, { status: 500 });

      } finally {
        // Restore original environment variables - WEBPACK SAFE
        // Note: Avoiding NODE_ENV restoration to prevent webpack issues
        if (originalForce) {
          process.env.FORCE_SEND_EMAILS = originalForce;
        }
        if (originalSandbox) {
          process.env.SENDGRID_SANDBOX_MODE = originalSandbox;
        }
      }
    } else {
      console.log('📧 [SIMULATION] Email test would be performed:', {
        testId,
        testType,
        configuredApi: !!process.env.SENDGRID_API_KEY,
        bypassProduction
      });

      const responseTime = Date.now() - startTime;

      // Log simulated test
      const historyEntry = {
        id: testId,
        timestamp: new Date().toISOString(),
        to: to || 'debug-test@example.com',
        subject: `Debug Test - ${testType} (SIMULATED)`,
        status: 'simulated' as const,
        type: `debug-${testType}-simulated`,
        responseTime
      };

      emailHistory.push(historyEntry);

      return NextResponse.json({
        success: true,
        testId,
        message: `Email test simulated (no SendGrid API key configured)`,
        details: {
          simulated: true,
          testType,
          bypassProduction,
          responseTime,
          reason: 'No SendGrid API key configured',
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Email debug POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Email test failed',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}