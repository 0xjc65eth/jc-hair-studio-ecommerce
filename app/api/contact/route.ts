import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, ContactFormData } from '@/lib/utils/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, formType } = body;

    // Validação dos campos obrigatórios
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Nome, email, assunto e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Preparar dados para o SendGrid
    const contactData: ContactFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      subject: subject.trim(),
      message: message.trim(),
      formType: formType || 'contact'
    };

    // Enviar email via SendGrid
    const success = await sendContactEmail(contactData);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Mensagem enviada com sucesso! Você receberá uma confirmação por email em breve.'
      });
    } else {
      return NextResponse.json(
        { error: 'Falha ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erro na API de contato:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente ou entre em contato via WhatsApp.' },
      { status: 500 }
    );
  }
}