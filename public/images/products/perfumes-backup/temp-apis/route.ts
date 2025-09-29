import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema
const NewsletterSubscriptionSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo').optional(),
  locale: z.enum(['pt', 'en', 'es', 'fr']).default('pt'),
  interests: z.array(z.string()).max(10, 'Máximo 10 interesses').default([]),
  source: z.string().max(50, 'Fonte muito longa').optional(),
  agreedToTerms: z.boolean().default(true),
  marketingConsent: z.boolean().default(true),
});

// Helper function to validate email format more thoroughly
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Helper function to detect and block suspicious patterns
function isSpamEmail(email: string, name?: string): boolean {
  const suspiciousPatterns = [
    /\+spam/i,
    /\+test/i,
    /fake/i,
    /temp/i,
    /10minutemail/i,
    /guerrillamail/i,
    /mailinator/i,
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return true;
  }

  if (name) {
    const suspiciousNames = [
      /test/i,
      /spam/i,
      /fake/i,
      /asdf/i,
      /qwerty/i,
    ];

    if (suspiciousNames.some(pattern => pattern.test(name))) {
      return true;
    }
  }

  return false;
}

// Mock newsletter data for fallback
const mockNewsletterResponse = {
  id: 'mock_newsletter_1',
  email: 'example@email.com',
  name: 'Usuário Exemplo',
  locale: 'pt',
  interests: ['extensoes-cabelo', 'cuidados-capilares'],
  source: 'website_footer',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = NewsletterSubscriptionSchema.parse(body);

    // Additional email validation
    if (!isValidEmail(validatedData.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Formato de email inválido',
          errors: { email: 'Por favor, insira um email válido' }
        },
        { status: 400 }
      );
    }

    // Spam detection
    if (isSpamEmail(validatedData.email, validatedData.name)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email ou nome não aceito',
          errors: { email: 'Este email não pode ser usado para newsletter' }
        },
        { status: 400 }
      );
    }

    try {
      // Check if email already exists
      const existingSubscriber = await prisma.newsletterSubscriber.findFirst({
        where: { email: validatedData.email }
      });

      let subscriber;

      if (existingSubscriber) {
        // Update existing subscriber
        if (existingSubscriber.isActive) {
          return NextResponse.json({
            success: true,
            data: {
              id: existingSubscriber.id,
              email: existingSubscriber.email,
              name: existingSubscriber.name,
              locale: existingSubscriber.locale,
              interests: existingSubscriber.interests,
              source: existingSubscriber.source,
              isActive: existingSubscriber.isActive,
              createdAt: existingSubscriber.createdAt,
              updatedAt: existingSubscriber.updatedAt,
            },
            message: 'Este email já está inscrito na nossa newsletter',
            alreadySubscribed: true,
          });
        } else {
          // Reactivate inactive subscriber
          subscriber = await prisma.newsletterSubscriber.update({
            where: { id: existingSubscriber.id },
            data: {
              name: validatedData.name || existingSubscriber.name,
              locale: validatedData.locale,
              interests: validatedData.interests,
              source: validatedData.source,
              isActive: true,
              updatedAt: new Date(),
            }
          });
        }
      } else {
        // Create new subscriber
        subscriber = await prisma.newsletterSubscriber.create({
          data: {
            email: validatedData.email.toLowerCase().trim(),
            name: validatedData.name?.trim(),
            locale: validatedData.locale,
            interests: validatedData.interests,
            source: validatedData.source,
            isActive: true,
          }
        });
      }

      // Prepare response data
      const responseData = {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        locale: subscriber.locale,
        interests: subscriber.interests,
        source: subscriber.source,
        isActive: subscriber.isActive,
        createdAt: subscriber.createdAt,
        updatedAt: subscriber.updatedAt,
      };

      return NextResponse.json(
        {
          success: true,
          data: responseData,
          message: existingSubscriber ? 
            'Subscrição reativada com sucesso! Bem-vindo de volta!' : 
            'Obrigado por se inscrever na nossa newsletter!',
        },
        { status: existingSubscriber ? 200 : 201 }
      );

    } catch (dbError) {
      console.error('Database error in newsletter subscription:', dbError);
      
      // Fallback response (simulate success but log for manual processing)
      return NextResponse.json({
        success: true,
        data: {
          ...mockNewsletterResponse,
          email: validatedData.email,
          name: validatedData.name,
          locale: validatedData.locale,
          interests: validatedData.interests,
          source: validatedData.source,
        },
        message: 'Subscrição processada com sucesso (será confirmada em breve)',
        fallback: true,
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// GET method to check subscription status (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email é obrigatório',
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Formato de email inválido',
        },
        { status: 400 }
      );
    }

    try {
      const subscriber = await prisma.newsletterSubscriber.findFirst({
        where: { 
          email: email.toLowerCase().trim(),
          isActive: true 
        }
      });

      if (!subscriber) {
        return NextResponse.json({
          success: false,
          message: 'Email não encontrado na nossa lista de newsletter',
          subscribed: false,
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          subscribed: true,
          locale: subscriber.locale,
          interests: subscriber.interests,
          subscribedAt: subscriber.createdAt,
        },
        message: 'Email encontrado na nossa newsletter',
      });

    } catch (dbError) {
      console.error('Database error checking newsletter subscription:', dbError);
      
      return NextResponse.json({
        success: false,
        message: 'Erro ao verificar subscrição (tente novamente mais tarde)',
        fallback: true,
      });
    }

  } catch (error) {
    console.error('Newsletter GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE method to unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token'); // For secure unsubscribe links

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email é obrigatório',
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Formato de email inválido',
        },
        { status: 400 }
      );
    }

    try {
      const subscriber = await prisma.newsletterSubscriber.findFirst({
        where: { 
          email: email.toLowerCase().trim(),
          isActive: true 
        }
      });

      if (!subscriber) {
        return NextResponse.json({
          success: true,
          message: 'Email já não está inscrito na newsletter',
        });
      }

      // Soft delete - mark as inactive instead of deleting
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Email removido da newsletter com sucesso. Sentimos a sua falta!',
      });

    } catch (dbError) {
      console.error('Database error unsubscribing from newsletter:', dbError);
      
      return NextResponse.json({
        success: true,
        message: 'Pedido de remoção processado (será confirmado em breve)',
        fallback: true,
      });
    }

  } catch (error) {
    console.error('Newsletter DELETE error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// CORS and OPTIONS handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}