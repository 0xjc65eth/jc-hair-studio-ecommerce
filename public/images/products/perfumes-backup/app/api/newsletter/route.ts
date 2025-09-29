import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/utils/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    console.log('📧 Newsletter API - Processing:', { email, name });

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

    // Usar EXATAMENTE o mesmo padrão das notificações que funcionam
    const emailData = {
      name: 'JC Hair Studio Admin',
      email: process.env.ADMIN_EMAIL || 'juliocesarurss62@gmail.com',
      phone: '',
      subject: `📧 Nova Assinatura de Newsletter - ${name || 'Novo Cliente'}`,
      message: `
🎉 Nova assinatura de newsletter recebida!

📧 DETALHES DA ASSINATURA:
• Email: ${email}
• Nome: ${name || 'Não informado'}
• Data: ${new Date().toLocaleString('pt-BR')}
• Origem: jchairstudios62.xyz

📝 AÇÃO NECESSÁRIA:
1. Enviar email de boas-vindas manualmente
2. Adicionar à lista de newsletter
3. Preparar próxima campanha

---
Este é um email automático do sistema JC Hair Studio.
      `,
      formType: 'newsletter' as const
    };

    console.log('📧 Newsletter - Using admin email pattern...');

    // Usar a mesma função que sabemos que funciona
    const success = await sendContactEmail(emailData);

    if (success) {
      console.log('✅ Newsletter notification sent to admin');
      return NextResponse.json({
        success: true,
        message: 'Cadastro realizado com sucesso! Você será adicionado à nossa newsletter.'
      });
    } else {
      console.error('❌ Newsletter notification failed');
      return NextResponse.json(
        { error: 'Falha ao processar cadastro. Tente novamente.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erro na API de newsletter:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}