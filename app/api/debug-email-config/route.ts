import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'NOT_SET',
    FROM_EMAIL: process.env.FROM_EMAIL || 'NOT_SET',
    FROM_NAME: process.env.FROM_NAME || 'NOT_SET',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'SET (hidden)' : 'NOT_SET',
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'NOT_SET',

    // Show which email would be used
    emailWillBeSentTo: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    emailWillBeSentFrom: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
  };

  return NextResponse.json(config);
}
