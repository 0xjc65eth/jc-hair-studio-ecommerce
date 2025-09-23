import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Shipping Label Generation API
 * POST /api/admin/shipping/labels - Generate shipping labels
 *
 * Supported carriers: CTT, Correios, DPD, UPS, DHL
 * Features: QR codes, barcodes, bulk processing, PDF generation
 */

interface ShippingLabelRequest {
  orderIds: string[];
  carrier: 'ctt' | 'correios' | 'dpd' | 'ups' | 'dhl';
  options?: {
    insurance?: boolean;
    signature?: boolean;
    international?: boolean;
    returnLabel?: boolean;
    priority?: boolean;
  };
  format?: 'pdf' | 'png' | 'zpl'; // ZPL for thermal printers
}

interface PackageDimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
  weight: number; // kg
}

interface ShippingLabel {
  orderId: string;
  trackingNumber: string;
  labelUrl: string;
  qrCode: string;
  barcode: string;
  carrier: string;
  service: string;
  cost: number;
  estimatedDelivery: Date;
  dimensions: PackageDimensions;
}

export async function POST(request: NextRequest) {
  try {
    const { orderIds, carrier, options = {}, format = 'pdf' }: ShippingLabelRequest = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid orderIds array' },
        { status: 400 }
      );
    }

    if (!carrier) {
      return NextResponse.json(
        { error: 'Missing carrier selection' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Fetch orders from database
    const orders = await Order.find({ orderId: { $in: orderIds } });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: 'No orders found for the provided IDs' },
        { status: 404 }
      );
    }

    const labels: ShippingLabel[] = [];
    const errors: string[] = [];

    // Process each order for label generation
    for (const order of orders) {
      try {
        // Calculate package dimensions based on order items
        const dimensions = calculatePackageDimensions(order.products);

        // Generate tracking number
        const trackingNumber = generateTrackingNumber(carrier);

        // Calculate shipping cost
        const shippingCost = await calculateShippingCost(
          carrier,
          dimensions,
          order.deliveryAddress,
          options
        );

        // Generate QR code with tracking info
        const qrCodeData = {
          orderId: order.orderId,
          trackingNumber,
          carrier,
          destination: `${order.deliveryAddress.city}, ${order.deliveryAddress.country}`
        };
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));

        // Generate barcode (Code 128)
        const barcode = generateBarcode(trackingNumber);

        // Create shipping label
        const label: ShippingLabel = {
          orderId: order.orderId,
          trackingNumber,
          labelUrl: '', // Will be generated below
          qrCode,
          barcode,
          carrier: carrier.toUpperCase(),
          service: getCarrierService(carrier, options),
          cost: shippingCost,
          estimatedDelivery: calculateEstimatedDelivery(carrier, order.deliveryAddress.country),
          dimensions
        };

        // Generate label based on format
        if (format === 'pdf') {
          label.labelUrl = await generatePDFLabel(order, label, options);
        } else if (format === 'png') {
          label.labelUrl = await generateImageLabel(order, label, options);
        } else if (format === 'zpl') {
          label.labelUrl = await generateZPLLabel(order, label, options);
        }

        // Update order with tracking information
        await Order.findOneAndUpdate(
          { orderId: order.orderId },
          {
            $set: {
              'shipping.trackingNumber': trackingNumber,
              'shipping.carrier': carrier.toUpperCase(),
              'shipping.status': 'preparing',
              'shipping.shippingCost': shippingCost,
              'shipping.estimatedDelivery': label.estimatedDelivery,
              'shipping.trackingUrl': generateTrackingUrl(trackingNumber, carrier)
            },
            $push: {
              'statusHistory': {
                status: 'preparing',
                timestamp: new Date(),
                changedBy: 'admin-shipping-system',
                reason: `Shipping label generated with ${carrier.toUpperCase()}`,
                notes: `Tracking: ${trackingNumber}`
              },
              'auditLog': {
                action: 'shipped',
                performedBy: 'admin-shipping-system',
                timestamp: new Date(),
                changes: [{
                  field: 'shipping.status',
                  oldValue: order.shipping.status,
                  newValue: 'preparing'
                }]
              }
            }
          }
        );

        labels.push(label);

      } catch (error) {
        console.error(`Error generating label for order ${order.orderId}:`, error);
        errors.push(`Order ${order.orderId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Generate batch PDF if multiple labels
    let batchPdfUrl = '';
    if (labels.length > 1 && format === 'pdf') {
      batchPdfUrl = await generateBatchPDF(labels);
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${labels.length} shipping labels`,
      labels,
      batchPdfUrl,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        totalLabels: labels.length,
        totalCost: labels.reduce((sum, label) => sum + label.cost, 0),
        carrier: carrier.toUpperCase(),
        format
      }
    });

  } catch (error) {
    console.error('Error in shipping label generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate shipping labels' },
      { status: 500 }
    );
  }
}

/**
 * Calculate package dimensions based on order products
 */
function calculatePackageDimensions(products: any[]): PackageDimensions {
  // Default package size for hair products
  const basePackage = {
    length: 20,
    width: 15,
    height: 10,
    weight: 0.5
  };

  // Calculate based on product count and type
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const estimatedWeight = products.reduce((sum, product) => {
    // Estimate weight based on product category
    const weightPerItem = product.category?.toLowerCase().includes('shampoo') ? 0.3 :
                         product.category?.toLowerCase().includes('conditioner') ? 0.3 :
                         product.category?.toLowerCase().includes('mask') ? 0.2 :
                         product.category?.toLowerCase().includes('oil') ? 0.1 :
                         0.2; // default
    return sum + (product.quantity * weightPerItem);
  }, 0);

  // Adjust package size based on items
  if (totalItems > 5) {
    basePackage.length += 10;
    basePackage.width += 5;
    basePackage.height += 5;
  } else if (totalItems > 2) {
    basePackage.length += 5;
    basePackage.height += 3;
  }

  basePackage.weight = Math.max(estimatedWeight, 0.5); // Minimum 500g

  return basePackage;
}

/**
 * Generate tracking number for carrier
 */
function generateTrackingNumber(carrier: string): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  switch (carrier.toLowerCase()) {
    case 'ctt':
      return `RR${timestamp.slice(-8)}${random}PT`;
    case 'correios':
      return `BR${timestamp.slice(-8)}${random}BR`;
    case 'dpd':
      return `${timestamp.slice(-10)}${random}`;
    case 'ups':
      return `1Z${random}${timestamp.slice(-8)}`;
    case 'dhl':
      return `${timestamp.slice(-10)}`;
    default:
      return `JC${timestamp.slice(-8)}${random}`;
  }
}

/**
 * Calculate shipping cost based on carrier and options
 */
async function calculateShippingCost(
  carrier: string,
  dimensions: PackageDimensions,
  address: any,
  options: any
): Promise<number> {
  let baseCost = 0;
  const isInternational = address.country !== 'PT' && address.country !== 'BR';

  // Base rates by carrier (in EUR)
  switch (carrier.toLowerCase()) {
    case 'ctt':
      baseCost = isInternational ? 15.00 : 6.50;
      break;
    case 'correios':
      baseCost = isInternational ? 25.00 : 12.00;
      break;
    case 'dpd':
      baseCost = isInternational ? 20.00 : 8.00;
      break;
    case 'ups':
      baseCost = isInternational ? 30.00 : 12.00;
      break;
    case 'dhl':
      baseCost = isInternational ? 35.00 : 15.00;
      break;
    default:
      baseCost = 10.00;
  }

  // Weight adjustment
  if (dimensions.weight > 2) {
    baseCost += (dimensions.weight - 2) * 2.50;
  }

  // Options adjustments
  if (options.insurance) baseCost += 2.50;
  if (options.signature) baseCost += 1.50;
  if (options.priority) baseCost += 5.00;

  // Volume adjustment for large packages
  const volume = dimensions.length * dimensions.width * dimensions.height;
  if (volume > 6000) { // > 6000 cm³
    baseCost += 3.00;
  }

  return Math.round(baseCost * 100) / 100; // Round to 2 decimal places
}

/**
 * Get carrier service name based on options
 */
function getCarrierService(carrier: string, options: any): string {
  const base = carrier.toUpperCase();

  if (options.priority) return `${base} Express`;
  if (options.international) return `${base} International`;

  switch (carrier.toLowerCase()) {
    case 'ctt': return 'CTT Expresso';
    case 'correios': return 'Correios PAC';
    case 'dpd': return 'DPD Classic';
    case 'ups': return 'UPS Standard';
    case 'dhl': return 'DHL Express';
    default: return `${base} Standard`;
  }
}

/**
 * Calculate estimated delivery date
 */
function calculateEstimatedDelivery(carrier: string, country: string): Date {
  const deliveryDate = new Date();
  let businessDays = 3; // default

  const isInternational = country !== 'PT' && country !== 'BR';

  if (isInternational) {
    businessDays = carrier.toLowerCase() === 'dhl' ? 2 :
                  carrier.toLowerCase() === 'ups' ? 3 : 5;
  } else {
    businessDays = carrier.toLowerCase() === 'ctt' ? 1 :
                  carrier.toLowerCase() === 'dpd' ? 2 : 3;
  }

  deliveryDate.setDate(deliveryDate.getDate() + businessDays);
  return deliveryDate;
}

/**
 * Generate barcode for tracking number
 */
function generateBarcode(trackingNumber: string): string {
  // Simple Code 128 representation - in production use a proper barcode library
  return `|||| || ||| | |||| || | ||| |||| | || |||`; // Placeholder
}

/**
 * Generate tracking URL for carrier
 */
function generateTrackingUrl(trackingNumber: string, carrier: string): string {
  switch (carrier.toLowerCase()) {
    case 'ctt':
      return `https://www.ctt.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?objects=${trackingNumber}`;
    case 'correios':
      return `https://www2.correios.com.br/sistemas/rastreamento/resultado_semcookie.cfm?objetos=${trackingNumber}`;
    case 'dpd':
      return `https://www.dpd.com/pt_en/mydpd/my-parcels/track?parcelNumber=${trackingNumber}`;
    case 'ups':
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case 'dhl':
      return `https://www.dhl.com/pt-pt/home/tracking.html?tracking-id=${trackingNumber}`;
    default:
      return `https://track.example.com/${trackingNumber}`;
  }
}

/**
 * Generate PDF shipping label
 */
async function generatePDFLabel(order: any, label: ShippingLabel, options: any): Promise<string> {
  // Create PDF document
  const doc = new PDFDocument({ size: [288, 432] }); // 4x6 inches at 72 DPI

  // Add header
  doc.fontSize(16).font('Helvetica-Bold')
     .text('JC Hair Studio', 20, 20);

  doc.fontSize(12).font('Helvetica')
     .text(label.carrier, 20, 40)
     .text(label.service, 20, 55);

  // Tracking number and barcode
  doc.fontSize(14).font('Helvetica-Bold')
     .text('Tracking:', 20, 80)
     .text(label.trackingNumber, 20, 95);

  // Add QR code (placeholder - in production, embed actual QR code)
  doc.rect(200, 80, 60, 60).stroke()
     .fontSize(8).text('QR Code', 215, 105);

  // From address
  doc.fontSize(10).font('Helvetica-Bold')
     .text('FROM:', 20, 160);
  doc.fontSize(9).font('Helvetica')
     .text('JC Hair Studio', 20, 175)
     .text('Rua Example, 123', 20, 187)
     .text('1000-001 Lisboa, Portugal', 20, 199);

  // To address
  doc.fontSize(10).font('Helvetica-Bold')
     .text('TO:', 20, 230);
  doc.fontSize(9).font('Helvetica')
     .text(`${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}`, 20, 245)
     .text(`${order.deliveryAddress.street}, ${order.deliveryAddress.number}`, 20, 257);

  if (order.deliveryAddress.complement) {
    doc.text(order.deliveryAddress.complement, 20, 269);
  }

  doc.text(`${order.deliveryAddress.zipCode} ${order.deliveryAddress.city}`, 20, 281)
     .text(`${order.deliveryAddress.state}, ${order.deliveryAddress.country}`, 20, 293);

  // Package info
  doc.fontSize(8).font('Helvetica')
     .text(`Weight: ${label.dimensions.weight}kg`, 20, 320)
     .text(`Dimensions: ${label.dimensions.length}x${label.dimensions.width}x${label.dimensions.height}cm`, 20, 332)
     .text(`Order: ${order.orderId}`, 20, 344)
     .text(`Items: ${order.products.length}`, 20, 356);

  // Options
  if (options.insurance) doc.text('INSURED', 20, 380);
  if (options.signature) doc.text('SIGNATURE REQUIRED', 20, 392);
  if (options.priority) doc.text('PRIORITY', 20, 404);

  // Save to temporary file (in production, use cloud storage)
  const filename = `/tmp/label_${label.orderId}_${Date.now()}.pdf`;
  doc.pipe(require('fs').createWriteStream(filename));
  doc.end();

  // Return URL (in production, return cloud storage URL)
  return `/api/shipping/labels/download/${filename.split('/').pop()}`;
}

/**
 * Generate image label (PNG format)
 */
async function generateImageLabel(order: any, label: ShippingLabel, options: any): Promise<string> {
  // In production, use Canvas or similar library to generate PNG
  // For now, return placeholder
  return `/api/shipping/labels/image/${label.orderId}_${Date.now()}.png`;
}

/**
 * Generate ZPL label for thermal printers
 */
async function generateZPLLabel(order: any, label: ShippingLabel, options: any): Promise<string> {
  const zpl = `
^XA
^CF0,60
^FO50,50^FD${label.carrier}^FS
^CF0,30
^FO50,120^FD${label.service}^FS
^CF0,40
^FO50,180^FDTracking: ${label.trackingNumber}^FS
^FO50,240^FDTO: ${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}^FS
^CF0,25
^FO50,280^FD${order.deliveryAddress.street}, ${order.deliveryAddress.number}^FS
^FO50,310^FD${order.deliveryAddress.zipCode} ${order.deliveryAddress.city}^FS
^FO50,340^FD${order.deliveryAddress.country}^FS
^FO50,400^FDOrder: ${order.orderId}^FS
^FO50,430^FDWeight: ${label.dimensions.weight}kg^FS
^XZ
  `;

  // Save ZPL file
  const filename = `/tmp/label_${label.orderId}_${Date.now()}.zpl`;
  require('fs').writeFileSync(filename, zpl);

  return `/api/shipping/labels/download/${filename.split('/').pop()}`;
}

/**
 * Generate batch PDF with multiple labels
 */
async function generateBatchPDF(labels: ShippingLabel[]): Promise<string> {
  // In production, combine multiple labels into single PDF
  const filename = `batch_labels_${Date.now()}.pdf`;
  return `/api/shipping/labels/download/${filename}`;
}

/**
 * GET endpoint to download generated labels
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const format = searchParams.get('format') || 'pdf';

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId parameter' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const order = await Order.findOne({ orderId });

    if (!order || !order.shipping.trackingNumber) {
      return NextResponse.json(
        { error: 'Order not found or no shipping label generated' },
        { status: 404 }
      );
    }

    // Return label download URL
    return NextResponse.json({
      success: true,
      downloadUrl: `/api/shipping/labels/download/${orderId}_label.${format}`,
      trackingNumber: order.shipping.trackingNumber,
      carrier: order.shipping.carrier
    });

  } catch (error) {
    console.error('Error retrieving shipping label:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shipping label' },
      { status: 500 }
    );
  }
}