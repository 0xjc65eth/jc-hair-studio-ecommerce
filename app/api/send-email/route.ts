import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateOrderConfirmationEmail, generateSupportEmail, generateShippedEmail } from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Tipo de email e dados são obrigatórios' },
        { status: 400 }
      );
    }

    let emailData;

    switch (type) {
      case 'order-confirmation':
        if (!data.orderId || !data.customerName || !data.customerEmail || !data.items || !data.total) {
          return NextResponse.json(
            { error: 'Dados do pedido incompletos' },
            { status: 400 }
          );
        }
        emailData = generateOrderConfirmationEmail(data);
        break;

      case 'support-contact':
        if (!data.customerName || !data.customerEmail || !data.subject || !data.message) {
          return NextResponse.json(
            { error: 'Dados de contato incompletos: name, email, subject, message são obrigatórios' },
            { status: 400 }
          );
        }
        emailData = generateSupportEmail(data);
        break;

      case 'order-shipped':
        if (!data.orderId || !data.customerName || !data.customerEmail || !data.trackingCode || !data.carrier) {
          return NextResponse.json(
            { error: 'Dados de envio incompletos: orderId, customerName, customerEmail, trackingCode, carrier são obrigatórios' },
            { status: 400 }
          );
        }
        emailData = generateShippedEmail(data);
        break;

      case 'custom':
        if (!data.to || !data.subject || !data.html) {
          return NextResponse.json(
            { error: 'Email personalizado requer: to, subject, html' },
            { status: 400 }
          );
        }
        emailData = {
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo de email não suportado' },
          { status: 400 }
        );
    }

    const success = await sendEmail(emailData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Email enviado com sucesso'
      });
    } else {
      return NextResponse.json(
        { error: 'Falha ao enviar email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erro na API de envio de email:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}