import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY?.trim().replace(/[\n\r]/g, '');
    const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL?.trim().replace(/[\n\r]/g, '');

    if (!SENDGRID_API_KEY) {
      return NextResponse.json({ success: false, error: 'No SENDGRID_API_KEY' }, { status: 500 });
    }

    sgMail.setApiKey(SENDGRID_API_KEY);

    // FORCE usar email verificado
    const VERIFIED_SENDER = 'juliocesarurss65@gmail.com';

    const msg = {
      to: SUPPORT_EMAIL || 'juliocesarurss65@gmail.com',
      from: VERIFIED_SENDER, // Sender VERIFICADO no SendGrid
      subject: '✅ TESTE COM SENDER VERIFICADO - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4caf50;">✅ Email com Sender VERIFICADO</h2>
          <p><strong>From:</strong> ${VERIFIED_SENDER} (VERIFIED no SendGrid)</p>
          <p><strong>To:</strong> ${SUPPORT_EMAIL || 'juliocesarurss65@gmail.com'}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-PT')}</p>
          <hr>
          <p>Se você recebeu este email, significa que o SendGrid está enviando corretamente quando usamos um sender VERIFICADO!</p>
          <p style="color: #666;">Timestamp: ${Date.now()}</p>
        </div>
      `,
      mail_settings: {
        sandbox_mode: { enable: false }
      }
    };

    console.log('📧 Sending with VERIFIED sender:', VERIFIED_SENDER);

    const response = await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: 'Email sent with VERIFIED sender!',
      details: {
        from: VERIFIED_SENDER,
        to: msg.to,
        statusCode: response[0]?.statusCode,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('SendGrid error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.body
    }, { status: 500 });
  }
}
