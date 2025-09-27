/**
 * Admin Authentication API
 * JC Hair Studio's 62 E-commerce
 *
 * Provides secure admin authentication with environment variable validation
 * SECURITY: Password verification moved to server-side for enhanced security
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/auth
 * Authenticate admin user with environment-based password validation
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validation: Check if password provided
    if (!password) {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      );
    }

    // Get admin password from environment variables
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('❌ ADMIN_PASSWORD não configurado nas variáveis de ambiente');
      return NextResponse.json(
        { error: 'Configuração de autenticação inválida' },
        { status: 500 }
      );
    }

    // Verify password
    if (password === adminPassword) {
      // Generate session data
      const sessionData = {
        authenticated: true,
        timestamp: Date.now(),
        expiresIn: parseInt(process.env.ADMIN_SESSION_TIMEOUT || '3600000'), // 1 hora default
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      };

      console.log('✅ Admin autenticado com sucesso:', {
        timestamp: new Date().toISOString(),
        ip: sessionData.ip,
        userAgent: sessionData.userAgent.substring(0, 50) + '...'
      });

      return NextResponse.json({
        success: true,
        message: 'Autenticação realizada com sucesso',
        sessionData: {
          authenticated: true,
          expiresIn: sessionData.expiresIn
        }
      });
    } else {
      // Security: Log failed authentication attempts
      console.warn('⚠️ Tentativa de acesso admin falhada:', {
        timestamp: new Date().toISOString(),
        ip: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('❌ Erro na autenticação admin:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/auth
 * Check authentication status (for session validation)
 */
export async function GET() {
  return NextResponse.json({
    message: 'Admin Authentication API - Use POST para autenticar',
    endpoints: {
      'POST /api/admin/auth': 'Autenticar com senha',
      'Header': 'Content-Type: application/json',
      'Body': '{ "password": "sua_senha" }'
    }
  });
}