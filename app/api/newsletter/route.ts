import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterEmail } from '@/lib/utils/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validação dos campos obrigatórios
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
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

    // Enviar email de boas-vindas via SendGrid
    const success = await sendNewsletterEmail(email.trim().toLowerCase(), name?.trim());

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Cadastro realizado com sucesso! Verifique seu email para confirmar a assinatura da newsletter.'
      });
    } else {
      return NextResponse.json(
        { error: 'Falha ao processar cadastro. Tente novamente.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erro na API de newsletter:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}