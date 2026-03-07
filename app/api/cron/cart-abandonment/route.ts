import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Cart } from '@/lib/mongodb/schemas/cart.schema';
import { sendCartAbandonmentEmail } from '@/lib/utils/sendgrid';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jchairstudios62.xyz';

// Verify cron secret to prevent unauthorized access
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // If no secret configured, allow in development
  if (!cronSecret) {
    return process.env.NODE_ENV !== 'production';
  }

  return authHeader === `Bearer ${cronSecret}`;
}

// Email sequences based on reminder count
const EMAIL_SEQUENCES = [
  {
    // First email: 1 hour after abandonment
    hoursAfterAbandonment: 1,
    reminderCount: 0,
    subject: 'Esqueceu algo no carrinho? Seus produtos estão esperando!',
    discount: 5,
    code: 'VOLTA5',
    urgency: 'low',
  },
  {
    // Second email: 24 hours after abandonment
    hoursAfterAbandonment: 24,
    reminderCount: 1,
    subject: 'Seus produtos favoritos ainda estão no carrinho - 10% OFF!',
    discount: 10,
    code: 'VOLTA10',
    urgency: 'medium',
  },
  {
    // Third email: 72 hours after abandonment
    hoursAfterAbandonment: 72,
    reminderCount: 2,
    subject: 'Ultima chance! 15% OFF no seu carrinho - expira hoje!',
    discount: 15,
    code: 'ULTIMO15',
    urgency: 'high',
  },
];

function generateAbandonmentHtml(
  cart: any,
  sequence: typeof EMAIL_SEQUENCES[0]
): string {
  const items = cart.items || [];
  const total = cart.total || cart.subtotal || 0;
  const discountedTotal = total * (1 - sequence.discount / 100);
  const savings = total - discountedTotal;

  const itemsHtml = items.map((item: any) => {
    const name = item.productInfo?.name || 'Produto';
    const image = item.productInfo?.image || '';
    const price = item.unitPrice || 0;
    const qty = item.quantity || 1;

    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">
          <div style="display: flex; align-items: center;">
            ${image ? `<img src="${image}" alt="${name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;">` : ''}
            <div>
              <p style="margin: 0; font-weight: 600; color: #1f2937;">${name}</p>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Qty: ${qty}</p>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #1f2937;">
          &euro;${(price * qty).toFixed(2)}
        </td>
      </tr>`;
  }).join('');

  const urgencyBanner = sequence.urgency === 'high'
    ? `<div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 20px;">
         <p style="margin: 0; color: #dc2626; font-weight: 700;">Seu carrinho expira em breve! Aproveite antes que seja tarde.</p>
       </div>`
    : sequence.urgency === 'medium'
    ? `<div style="background: #fffbeb; border: 2px solid #f59e0b; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 20px;">
         <p style="margin: 0; color: #d97706; font-weight: 600;">Oferta especial por tempo limitado!</p>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">JC Hair Studio's 62</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Produtos Capilares Brasileiros Premium</p>
    </div>

    <!-- Discount Banner -->
    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
      <p style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0;">${sequence.discount}% DE DESCONTO</p>
      <p style="color: #d1fae5; margin: 8px 0 0; font-size: 14px;">
        Use o codigo: <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 4px; font-family: monospace; font-weight: 700;">${sequence.code}</span>
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px;">

      ${urgencyBanner}

      <h2 style="color: #1f2937; margin: 0 0 8px; font-size: 22px;">Seus produtos estao esperando!</h2>
      <p style="color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
        Notamos que voce deixou alguns itens no carrinho. Que tal aproveitar um desconto especial para finalizar sua compra?
      </p>

      <!-- Cart Items -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 12px; text-align: left; color: #374151; font-size: 14px;">Produto</th>
            <th style="padding: 12px; text-align: right; color: #374151; font-size: 14px;">Preco</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Price Summary -->
      <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #6b7280;">Subtotal:</span>
          <span style="color: #9ca3af; text-decoration: line-through;">&euro;${total.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #10b981; font-weight: 600;">Desconto (${sequence.discount}%):</span>
          <span style="color: #10b981; font-weight: 600;">-&euro;${savings.toFixed(2)}</span>
        </div>
        <hr style="border: 1px solid #e5e7eb; margin: 12px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 700;">
          <span style="color: #1f2937;">Total:</span>
          <span style="color: #10b981;">&euro;${discountedTotal.toFixed(2)}</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${SITE_URL}/checkout?discount=${sequence.code}"
           style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block;">
          FINALIZAR COMPRA COM ${sequence.discount}% OFF
        </a>
      </div>

      <!-- Trust -->
      <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #1e40af; font-size: 13px;">
          Compra 100% Segura &bull; Entrega Rapida &bull; Garantia 30 dias &bull; +2.800 Clientes
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1f2937; padding: 24px; text-align: center;">
      <p style="color: #ffffff; margin: 0 0 4px; font-weight: 600;">JC Hair Studio's 62</p>
      <p style="color: #9ca3af; margin: 0 0 8px; font-size: 13px;">R. Gil Vicente, N5 &bull; Seixal, Portugal</p>
      <p style="color: #9ca3af; margin: 0; font-size: 12px;">
        <a href="${SITE_URL}" style="color: #93c5fd; text-decoration: none;">jchairstudios62.xyz</a>
        &bull; +351 928 375 226
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const results = {
      processed: 0,
      emailsSent: 0,
      errors: 0,
      details: [] as string[],
    };

    for (const sequence of EMAIL_SEQUENCES) {
      // Find carts that:
      // - Are active but inactive for the specified hours
      // - Have items
      // - Haven't received this reminder level yet
      const cutoffDate = new Date(Date.now() - sequence.hoursAfterAbandonment * 60 * 60 * 1000);
      const maxCutoffDate = new Date(Date.now() - (sequence.hoursAfterAbandonment + 24) * 60 * 60 * 1000);

      const abandonedCarts = await Cart.find({
        status: 'active',
        lastActivity: { $lt: cutoffDate, $gt: maxCutoffDate },
        itemCount: { $gt: 0 },
        reminderCount: sequence.reminderCount,
      }).limit(50);

      for (const cart of abandonedCarts) {
        results.processed++;

        // Need a user email to send to
        const userEmail = cart.userId
          ? await getUserEmail(cart.userId)
          : null;

        if (!userEmail) {
          results.details.push(`Cart ${cart._id}: no email available`);
          continue;
        }

        const html = generateAbandonmentHtml(cart, sequence);

        const emailResult = await sendCartAbandonmentEmail(
          userEmail,
          sequence.subject,
          html
        );

        if (emailResult.success) {
          results.emailsSent++;

          // Update cart
          cart.reminderCount = sequence.reminderCount + 1;
          cart.recoveryEmailSent = true;

          // Mark as abandoned on first reminder
          if (sequence.reminderCount === 0) {
            cart.status = 'abandoned';
            cart.abandonedAt = new Date();
          }

          await cart.save();
          results.details.push(`Cart ${cart._id}: email sent (reminder #${sequence.reminderCount + 1})`);
        } else {
          results.errors++;
          results.details.push(`Cart ${cart._id}: email failed - ${emailResult.error}`);
        }
      }
    }

    // Cleanup: expire very old abandoned carts (30+ days)
    const expiredCount = await Cart.updateMany(
      {
        status: 'abandoned',
        abandonedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      { $set: { status: 'expired' } }
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        ...results,
        expiredCarts: expiredCount.modifiedCount || 0,
      },
    });
  } catch (error) {
    console.error('Cart abandonment cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper to get user email from userId
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    // Try to find user in the database
    const { connectDB: ensureConnection } = await import('@/lib/mongodb/connection');
    await ensureConnection();

    const mongoose = (await import('mongoose')).default;
    const db = mongoose.connection.db;
    if (!db) return null;

    const user = await db.collection('users').findOne(
      { _id: userId as any },
      { projection: { email: 1 } }
    );

    return user?.email || null;
  } catch {
    return null;
  }
}
