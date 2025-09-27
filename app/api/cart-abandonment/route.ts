import { NextRequest, NextResponse } from 'next/server';
import { sendCartAbandonmentEmail } from '@/lib/utils/sendgrid';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AbandonmentRequest {
  email: string;
  offer: {
    id: string;
    title: string;
    discount: number;
    code: string;
    expiresIn: number;
    description: string;
  };
  cartItems: CartItem[];
  total: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: AbandonmentRequest = await request.json();
    const { email, offer, cartItems, total } = data;

    // Validate input
    if (!email || !offer || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate abandonment recovery email HTML
    const emailHTML = generateAbandonmentEmail(email, offer, cartItems, total);

    // Send email using SendGrid
    const emailResult = await sendCartAbandonmentEmail(
      email,
      `${offer.icon} ${offer.title} - ${offer.discount}% OFF nos seus produtos favoritos!`,
      emailHTML
    );

    if (emailResult.success) {
      // Log abandonment event for analytics
      console.log('📧 Cart abandonment email sent:', {
        email: email.replace(/(.{3}).*(@.*)/, '$1***$2'),
        offerId: offer.id,
        discount: offer.discount,
        itemsCount: cartItems.length,
        total
      });

      return NextResponse.json({
        success: true,
        message: 'Abandonment recovery email sent successfully'
      });
    } else {
      console.error('❌ Failed to send abandonment email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Cart abandonment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateAbandonmentEmail(
  email: string,
  offer: any,
  cartItems: CartItem[],
  total: number
): string {
  const discountedTotal = total * (1 - offer.discount / 100);
  const savings = total - discountedTotal;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${offer.title} - ${offer.discount}% OFF</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                    ${offer.icon} ${offer.title}
                  </h1>
                  <p style="color: #fecaca; margin: 10px 0 0; font-size: 16px;">
                    ${offer.description}
                  </p>
                </td>
              </tr>

              <!-- Discount Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px 30px; text-align: center;">
                  <div style="color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 5px;">
                    ${offer.discount}% DE DESCONTO
                  </div>
                  <div style="color: #d1fae5; font-size: 14px; font-family: 'Courier New', monospace; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 6px; display: inline-block;">
                    Código: <strong>${offer.code}</strong>
                  </div>
                </td>
              </tr>

              <!-- Timer -->
              <tr>
                <td style="background: #fef3c7; padding: 15px 30px; text-align: center; border-left: 4px solid #f59e0b;">
                  <div style="color: #92400e; font-weight: 600; font-size: 14px;">
                    ⏰ OFERTA EXPIRA EM ${offer.expiresIn} MINUTOS
                  </div>
                </td>
              </tr>

              <!-- Cart Items -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 20px;">
                    Seus Produtos Favoritos:
                  </h2>

                  ${cartItems.map(item => `
                    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; align-items: center;">
                      ${item.image ? `
                        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
                      ` : `
                        <div style="width: 80px; height: 80px; background: #f3f4f6; border-radius: 6px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px;">
                          Produto
                        </div>
                      `}
                      <div style="flex: 1;">
                        <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 8px; font-weight: 600;">
                          ${item.name}
                        </h3>
                        <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
                          Quantidade: ${item.quantity}
                        </div>
                        <div style="color: #059669; font-weight: bold; font-size: 16px;">
                          €${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  `).join('')}

                  <!-- Price Summary -->
                  <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <span style="color: #6b7280;">Subtotal:</span>
                      <span style="text-decoration: line-through; color: #9ca3af;">€${total.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <span style="color: #10b981; font-weight: 600;">Desconto (${offer.discount}%):</span>
                      <span style="color: #10b981; font-weight: 600;">-€${savings.toFixed(2)}</span>
                    </div>
                    <hr style="border: 1px solid #e5e7eb; margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                      <span style="color: #1f2937;">Total com desconto:</span>
                      <span style="color: #10b981;">€${discountedTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/checkout?discount=${offer.code}"
                       style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      🛍️ FINALIZAR COMPRA COM ${offer.discount}% OFF
                    </a>
                  </div>

                  <!-- Trust Indicators -->
                  <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
                    <div style="color: #1e40af; font-weight: 600; margin-bottom: 10px;">
                      Por que escolher JC Hair Studio's 62?
                    </div>
                    <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                      <div style="margin: 5px; color: #1e40af; font-size: 12px;">
                        🔒 Compra 100% Segura
                      </div>
                      <div style="margin: 5px; color: #1e40af; font-size: 12px;">
                        🚚 Entrega Rápida
                      </div>
                      <div style="margin: 5px; color: #1e40af; font-size: 12px;">
                        ✅ Garantia 30 dias
                      </div>
                      <div style="margin: 5px; color: #1e40af; font-size: 12px;">
                        ⭐ +2.800 Clientes Satisfeitos
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: #1f2937; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
                  <div style="color: #ffffff; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                    JC Hair Studio's 62
                  </div>
                  <div style="color: #9ca3af; font-size: 14px; margin-bottom: 15px;">
                    Produtos Capilares Brasileiros Premium
                  </div>
                  <div style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
                    R. Gil Vicente, N°5 • Seixal, Portugal<br>
                    📞 +351 928 375 226 • 📧 juliocesarurss62@gmail.com<br>
                    <br>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #60a5fa; text-decoration: none;">
                      jchairstudios62.xyz
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}