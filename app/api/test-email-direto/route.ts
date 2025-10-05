import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET() {
  try {
    // Clean env vars
    const cleanEnv = (value: string | undefined): string | undefined => {
      return value?.trim().replace(/[\n\r]/g, '');
    };

    const SENDGRID_API_KEY = cleanEnv(process.env.SENDGRID_API_KEY);
    const SUPPORT_EMAIL = cleanEnv(process.env.SUPPORT_EMAIL);
    const FROM_EMAIL = cleanEnv(process.env.FROM_EMAIL);
    const FROM_NAME = cleanEnv(process.env.FROM_NAME);

    if (!SENDGRID_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not configured'
      }, { status: 500 });
    }

    if (!SUPPORT_EMAIL) {
      return NextResponse.json({
        success: false,
        error: 'SUPPORT_EMAIL not configured'
      }, { status: 500 });
    }

    // Configure SendGrid
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      to: SUPPORT_EMAIL,
      from: `${FROM_NAME || 'JC Hair Studio\'s 62'} <${FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: '🧪 Teste DIRETO SendGrid - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4caf50;">🧪 Teste Direto do SendGrid</h2>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
          <p><strong>Para:</strong> ${SUPPORT_EMAIL}</p>
          <p><strong>De:</strong> ${FROM_EMAIL}</p>
          <p>Este email foi enviado DIRETAMENTE via SendGrid API, sem passar pelo webhook.</p>
          <p>Se você recebeu este email, o SendGrid está funcionando!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Endpoint: /api/test-email-direto<br>
            Timestamp: ${Date.now()}
          </p>
        </div>
      `,
      text: `Teste direto SendGrid - ${new Date().toISOString()}`,
      mail_settings: {
        sandbox_mode: {
          enable: false, // ALWAYS send real emails for testing
        },
      },
    };

    console.log('📧 Sending direct email via SendGrid...', {
      to: SUPPORT_EMAIL,
      from: msg.from,
      subject: msg.subject
    });

    // Send email and get full response
    const response = await sgMail.send(msg);

    console.log('✅ SendGrid response:', JSON.stringify(response, null, 2));

    // Return detailed response
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via SendGrid',
      sendgridResponse: {
        statusCode: response[0]?.statusCode,
        headers: response[0]?.headers,
        body: response[0]?.body
      },
      emailDetails: {
        to: SUPPORT_EMAIL,
        from: msg.from,
        subject: msg.subject,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ SendGrid error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: {
        message: error.message,
        code: error.code,
        response: error.response?.body,
        statusCode: error.response?.statusCode
      }
    }, { status: 500 });
  }
}
