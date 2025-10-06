import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { IOrder } from '@/lib/models/Order';

/**
 * Sistema de Geração de Etiquetas de Envio
 * Gera etiquetas profissionais em PDF com código de barras e QR Code
 */

export interface ShippingLabelData {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  service: string;
  estimatedDelivery: Date;

  // Remetente (Loja)
  sender: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };

  // Destinatário (Cliente)
  recipient: {
    name: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };

  // Pacote
  package: {
    weight: number;
    length: number;
    width: number;
    height: number;
    itemsCount: number;
  };

  // Informações adicionais
  options?: {
    insurance?: boolean;
    signature?: boolean;
    priority?: boolean;
  };
}

/**
 * Gera etiqueta de envio em PDF formato A6 (10x15cm)
 */
export async function generateShippingLabelPDF(
  labelData: ShippingLabelData
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Criar documento PDF em formato 10x15cm (288x432 pontos a 72 DPI)
      const doc = new PDFDocument({
        size: [288, 432],
        margins: { top: 10, bottom: 10, left: 10, right: 10 }
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Gerar QR Code com dados de rastreamento
      const qrCodeData = JSON.stringify({
        orderId: labelData.orderId,
        trackingNumber: labelData.trackingNumber,
        carrier: labelData.carrier
      });
      const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
        width: 80,
        margin: 0
      });

      // CABEÇALHO - Logo e Informações da Loja
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('JC HAIR STUDIO\'S 62', 10, 10, { width: 268, align: 'center' });

      doc.fontSize(8)
         .font('Helvetica')
         .text('Professional Hair Care Products', 10, 28, { width: 268, align: 'center' });

      // Linha divisória
      doc.moveTo(10, 40).lineTo(278, 40).stroke();

      // TRANSPORTADORA E SERVIÇO
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(labelData.carrier.toUpperCase(), 10, 48);

      doc.fontSize(9)
         .font('Helvetica')
         .text(labelData.service, 10, 63);

      // QR CODE (canto superior direito)
      if (qrCodeImage) {
        // Converter data URL para buffer
        const base64Data = qrCodeImage.split(',')[1];
        const qrBuffer = Buffer.from(base64Data, 'base64');
        doc.image(qrBuffer, 200, 45, { width: 70, height: 70 });
      }

      // NÚMERO DE RASTREAMENTO (destaque)
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('RASTREAMENTO:', 10, 88);

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(labelData.trackingNumber, 10, 103);

      // Código de barras simulado (linhas verticais)
      const barcodeY = 120;
      doc.fontSize(6)
         .font('Helvetica')
         .text(labelData.trackingNumber, 10, barcodeY - 8);

      // Desenhar barras verticais simulando código de barras
      for (let i = 0; i < 40; i++) {
        const x = 10 + (i * 6);
        const height = (i % 3 === 0) ? 20 : 15;
        doc.rect(x, barcodeY, i % 2 === 0 ? 3 : 2, height).fill('black');
      }

      // Linha divisória
      doc.moveTo(10, 150).lineTo(278, 150).stroke();

      // REMETENTE (FROM)
      doc.fontSize(8)
         .font('Helvetica-Bold')
         .text('DE (FROM):', 10, 158);

      doc.fontSize(9)
         .font('Helvetica')
         .text(labelData.sender.name, 10, 171);

      doc.fontSize(8)
         .text(`${labelData.sender.street}`, 10, 183);

      doc.text(`${labelData.sender.zipCode} ${labelData.sender.city}, ${labelData.sender.state}`, 10, 194);

      doc.text(`${labelData.sender.country} | Tel: ${labelData.sender.phone}`, 10, 205);

      // Linha divisória
      doc.moveTo(10, 220).lineTo(278, 220).stroke();

      // DESTINATÁRIO (TO) - DESTAQUE
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('PARA (TO):', 10, 228);

      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text(`${labelData.recipient.name}`, 10, 243);

      doc.fontSize(10)
         .font('Helvetica')
         .text(`${labelData.recipient.street}, ${labelData.recipient.number}`, 10, 260);

      if (labelData.recipient.complement) {
        doc.fontSize(9)
           .text(labelData.recipient.complement, 10, 274);
      }

      const recipientLineY = labelData.recipient.complement ? 287 : 274;

      doc.fontSize(9)
         .text(labelData.recipient.neighborhood, 10, recipientLineY);

      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text(`${labelData.recipient.zipCode}`, 10, recipientLineY + 13);

      doc.fontSize(10)
         .font('Helvetica')
         .text(`${labelData.recipient.city} - ${labelData.recipient.state}`, 90, recipientLineY + 13);

      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(`${labelData.recipient.country}`, 10, recipientLineY + 28);

      if (labelData.recipient.phone) {
        doc.fontSize(8)
           .font('Helvetica')
           .text(`Tel: ${labelData.recipient.phone}`, 10, recipientLineY + 42);
      }

      // INFORMAÇÕES DO PACOTE
      const packageInfoY = 375;
      doc.fontSize(7)
         .font('Helvetica')
         .text(`Pedido: ${labelData.orderId}`, 10, packageInfoY);

      doc.text(`Peso: ${labelData.package.weight}kg | ${labelData.package.itemsCount} itens`, 10, packageInfoY + 10);

      doc.text(`Dim: ${labelData.package.length}x${labelData.package.width}x${labelData.package.height}cm`, 10, packageInfoY + 20);

      // Previsão de entrega
      const deliveryDate = labelData.estimatedDelivery.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      doc.fontSize(8)
         .font('Helvetica-Bold')
         .text(`Previsão de Entrega: ${deliveryDate}`, 10, packageInfoY + 32);

      // OPÇÕES ESPECIAIS (badges)
      if (labelData.options) {
        let badgeX = 10;
        const badgeY = packageInfoY + 45;

        if (labelData.options.insurance) {
          doc.rect(badgeX, badgeY, 50, 12)
             .fillAndStroke('#FFA500', '#000000');
          doc.fontSize(7)
             .font('Helvetica-Bold')
             .fillColor('white')
             .text('SEGURO', badgeX + 2, badgeY + 3);
          badgeX += 55;
        }

        if (labelData.options.signature) {
          doc.rect(badgeX, badgeY, 60, 12)
             .fillAndStroke('#0066CC', '#000000');
          doc.fontSize(7)
             .font('Helvetica-Bold')
             .fillColor('white')
             .text('ASSINATURA', badgeX + 2, badgeY + 3);
          badgeX += 65;
        }

        if (labelData.options.priority) {
          doc.rect(badgeX, badgeY, 55, 12)
             .fillAndStroke('#CC0000', '#000000');
          doc.fontSize(7)
             .font('Helvetica-Bold')
             .fillColor('white')
             .text('EXPRESSO', badgeX + 2, badgeY + 3);
        }
      }

      // Rodapé
      doc.fontSize(6)
         .font('Helvetica')
         .fillColor('black')
         .text('Manter em local seco. Não amassar. Frágil.', 10, 415, {
           width: 268,
           align: 'center'
         });

      // Finalizar PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Calcula dimensões do pacote baseado nos produtos
 */
export function calculatePackageDimensions(products: any[]): {
  weight: number;
  length: number;
  width: number;
  height: number;
} {
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

  // Estimativa de peso por tipo de produto (em kg)
  const estimatedWeight = products.reduce((sum, product) => {
    const category = product.category?.toLowerCase() || '';
    let weightPerItem = 0.25; // peso padrão

    if (category.includes('shampoo') || category.includes('conditioner')) {
      weightPerItem = 0.35;
    } else if (category.includes('mask') || category.includes('treatment')) {
      weightPerItem = 0.30;
    } else if (category.includes('oil') || category.includes('serum')) {
      weightPerItem = 0.15;
    } else if (category.includes('spray')) {
      weightPerItem = 0.20;
    }

    return sum + (product.quantity * weightPerItem);
  }, 0);

  // Dimensões base (cm)
  let length = 25;
  let width = 18;
  let height = 12;

  // Ajustar dimensões baseado na quantidade
  if (totalItems > 5) {
    length = 35;
    width = 25;
    height = 18;
  } else if (totalItems > 3) {
    length = 30;
    width = 20;
    height = 15;
  } else if (totalItems === 1) {
    length = 20;
    width = 15;
    height = 8;
  }

  return {
    weight: Math.max(estimatedWeight, 0.5), // Mínimo 500g
    length,
    width,
    height
  };
}

/**
 * Gera número de rastreamento único
 */
export function generateTrackingNumber(carrier: string, orderId: string): string {
  const timestamp = Date.now().toString();
  const orderPart = orderId.slice(-4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  switch (carrier.toLowerCase()) {
    case 'ctt':
      return `RR${timestamp.slice(-8)}${orderPart}PT`;
    case 'correios':
    case 'pac':
    case 'sedex':
      return `BR${timestamp.slice(-8)}${orderPart}BR`;
    case 'dpd':
      return `DPD${timestamp.slice(-9)}${random}`;
    case 'ups':
      return `1Z${random}${timestamp.slice(-8)}`;
    case 'dhl':
      return `DHL${timestamp.slice(-10)}`;
    case 'fedex':
      return `FX${timestamp.slice(-10)}${random}`;
    default:
      return `JC62${timestamp.slice(-8)}${orderPart}`;
  }
}

/**
 * Cria dados da etiqueta a partir de um pedido
 */
export function createLabelDataFromOrder(
  order: IOrder,
  carrier: string,
  trackingNumber: string,
  service: string,
  estimatedDelivery: Date,
  options?: {
    insurance?: boolean;
    signature?: boolean;
    priority?: boolean;
  }
): ShippingLabelData {
  const packageDimensions = calculatePackageDimensions(order.products);

  return {
    orderId: order.orderId,
    trackingNumber,
    carrier,
    service,
    estimatedDelivery,

    sender: {
      name: 'JC Hair Studio\'s 62',
      street: 'Rua da Loja, 123',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1000-001',
      country: 'PT',
      phone: '+351 21 XXX XXXX'
    },

    recipient: {
      name: `${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}`,
      street: order.deliveryAddress.street,
      number: order.deliveryAddress.number,
      complement: order.deliveryAddress.complement,
      neighborhood: order.deliveryAddress.neighborhood,
      city: order.deliveryAddress.city,
      state: order.deliveryAddress.state,
      zipCode: order.deliveryAddress.zipCode,
      country: order.deliveryAddress.country,
      phone: order.deliveryAddress.phone || order.customer.phone
    },

    package: {
      weight: packageDimensions.weight,
      length: packageDimensions.length,
      width: packageDimensions.width,
      height: packageDimensions.height,
      itemsCount: order.products.reduce((sum, p) => sum + p.quantity, 0)
    },

    options
  };
}

/**
 * Retorna URL de rastreamento para a transportadora
 */
export function getTrackingUrl(carrier: string, trackingNumber: string): string {
  const carrierLower = carrier.toLowerCase();

  const trackingUrls: Record<string, string> = {
    ctt: `https://www.ctt.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?objects=${trackingNumber}`,
    correios: `https://www2.correios.com.br/sistemas/rastreamento/resultado.cfm?objetos=${trackingNumber}`,
    pac: `https://www2.correios.com.br/sistemas/rastreamento/resultado.cfm?objetos=${trackingNumber}`,
    sedex: `https://www2.correios.com.br/sistemas/rastreamento/resultado.cfm?objetos=${trackingNumber}`,
    dpd: `https://www.dpd.com/pt/mydpd/my-parcels/track?parcelNumber=${trackingNumber}`,
    ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    dhl: `https://www.dhl.com/pt-pt/home/tracking.html?tracking-id=${trackingNumber}`,
    fedex: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`
  };

  return trackingUrls[carrierLower] || `https://track.aftership.com/${trackingNumber}`;
}

/**
 * Calcula data estimada de entrega baseado na transportadora
 */
export function calculateEstimatedDelivery(
  carrier: string,
  destinationCountry: string,
  priority: boolean = false
): Date {
  const deliveryDate = new Date();
  let businessDays = 3; // padrão

  const isInternational = destinationCountry !== 'PT' && destinationCountry !== 'BR';

  if (priority) {
    businessDays = isInternational ? 2 : 1;
  } else {
    switch (carrier.toLowerCase()) {
      case 'ctt':
        businessDays = isInternational ? 5 : 2;
        break;
      case 'correios':
      case 'pac':
        businessDays = isInternational ? 15 : 7;
        break;
      case 'sedex':
        businessDays = isInternational ? 10 : 3;
        break;
      case 'dpd':
        businessDays = isInternational ? 4 : 2;
        break;
      case 'ups':
        businessDays = isInternational ? 3 : 2;
        break;
      case 'dhl':
        businessDays = isInternational ? 2 : 1;
        break;
      case 'fedex':
        businessDays = isInternational ? 2 : 1;
        break;
      default:
        businessDays = 5;
    }
  }

  deliveryDate.setDate(deliveryDate.getDate() + businessDays);
  return deliveryDate;
}
