import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { rateLimit } from '@/lib/utils/rate-limit';
import { z } from 'zod';

const CreateTrackingSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  carrier: z.string().min(1, 'Carrier is required'),
  trackingUrl: z.string().url().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

const UpdateTrackingSchema = z.object({
  status: z.enum(['LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'RETURNED']),
  location: z.string().optional(),
  description: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

interface TrackingEvent {
  id: string;
  timestamp: Date;
  status: string;
  location?: string;
  description: string;
  carrier?: string;
}

interface TrackingInfo {
  id: string;
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl?: string;
  currentStatus: string;
  currentLocation?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  events: TrackingEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for demo - replace with database
const trackingData: Map<string, TrackingInfo> = new Map();
let trackingIdCounter = 1;

// Demo carriers configuration
const carriers = {
  'CTT': {
    name: 'CTT - Correios de Portugal',
    trackingUrlTemplate: 'https://www.ctt.pt/feapl_2/app/open/objectSearch/objectSearch.jspx?objects={trackingNumber}',
    supportedServices: ['Standard', 'Express', 'Registered'],
  },
  'DHL': {
    name: 'DHL Express',
    trackingUrlTemplate: 'https://www.dhl.com/en/express/tracking.html?AWB={trackingNumber}',
    supportedServices: ['Express', 'Economy'],
  },
  'UPS': {
    name: 'UPS',
    trackingUrlTemplate: 'https://www.ups.com/track?tracknum={trackingNumber}',
    supportedServices: ['Standard', 'Express'],
  },
  'FEDEX': {
    name: 'FedEx',
    trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={trackingNumber}',
    supportedServices: ['Express', 'Economy'],
  },
};

/**
 * Order Tracking API
 *
 * GET /api/tracking - Get tracking info by order ID or tracking number
 * POST /api/tracking - Create new tracking entry
 * PUT /api/tracking/[id] - Update tracking status
 */

// Get tracking information
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'tracking-get',
      limit: 100,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const trackingNumber = searchParams.get('trackingNumber');
    const orderNumber = searchParams.get('orderNumber');

    if (!orderId && !trackingNumber && !orderNumber) {
      return NextResponse.json(
        { error: 'Order ID, tracking number, or order number is required' },
        { status: 400 }
      );
    }

    let trackingInfo: TrackingInfo | undefined;

    if (orderId) {
      trackingInfo = Array.from(trackingData.values()).find(t => t.orderId === orderId);
    } else if (trackingNumber) {
      trackingInfo = Array.from(trackingData.values()).find(t => t.trackingNumber === trackingNumber);
    } else if (orderNumber) {
      trackingInfo = Array.from(trackingData.values()).find(t => t.orderNumber === orderNumber);
    }

    if (!trackingInfo) {
      return NextResponse.json(
        { error: 'Tracking information not found' },
        { status: 404 }
      );
    }

    // For public tracking, we don't need authentication
    // But for admin operations, you might want to check permissions

    return NextResponse.json({
      success: true,
      data: trackingInfo,
      metadata: {
        timestamp: new Date().toISOString(),
        carrier: carriers[trackingInfo.carrier as keyof typeof carriers] || { name: trackingInfo.carrier },
      }
    });

  } catch (error) {
    console.error('Error getting tracking info:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve tracking information' },
      { status: 500 }
    );
  }
}

// Create new tracking entry (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const rateLimitResult = await rateLimit({
      request,
      identifier: 'tracking-create',
      limit: 20,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = CreateTrackingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid tracking data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { orderId, trackingNumber, carrier, trackingUrl, estimatedDelivery } = validationResult.data;

    // Check if tracking already exists for this order
    const existingTracking = Array.from(trackingData.values()).find(t => t.orderId === orderId);
    if (existingTracking) {
      return NextResponse.json(
        { error: 'Tracking already exists for this order' },
        { status: 409 }
      );
    }

    // Generate tracking URL if not provided
    let finalTrackingUrl = trackingUrl;
    if (!finalTrackingUrl && carriers[carrier as keyof typeof carriers]) {
      finalTrackingUrl = carriers[carrier as keyof typeof carriers].trackingUrlTemplate
        .replace('{trackingNumber}', trackingNumber);
    }

    // Create initial tracking event
    const initialEvent: TrackingEvent = {
      id: `event_${Date.now()}_1`,
      timestamp: new Date(),
      status: 'LABEL_CREATED',
      description: 'Shipping label created',
      carrier: carrier,
    };

    // Create new tracking entry
    const newTracking: TrackingInfo = {
      id: `track_${trackingIdCounter++}`,
      orderId,
      orderNumber: `ORDER-${orderId.slice(-8)}`, // TODO: Get actual order number
      trackingNumber,
      carrier,
      trackingUrl: finalTrackingUrl,
      currentStatus: 'LABEL_CREATED',
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      events: [initialEvent],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    trackingData.set(newTracking.id, newTracking);

    return NextResponse.json({
      success: true,
      message: 'Tracking created successfully',
      data: newTracking,
      metadata: {
        timestamp: new Date().toISOString(),
        createdBy: session.user?.id,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tracking:', error);
    return NextResponse.json(
      { error: 'Failed to create tracking' },
      { status: 500 }
    );
  }
}

// Update tracking status (admin only or webhook)
export async function PUT(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'tracking-update',
      limit: 50,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingId && !trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking ID or tracking number is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateTrackingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid update data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    let trackingInfo: TrackingInfo | undefined;

    if (trackingId) {
      trackingInfo = trackingData.get(trackingId);
    } else if (trackingNumber) {
      trackingInfo = Array.from(trackingData.values()).find(t => t.trackingNumber === trackingNumber);
    }

    if (!trackingInfo) {
      return NextResponse.json(
        { error: 'Tracking not found' },
        { status: 404 }
      );
    }

    const { status, location, description, estimatedDelivery } = validationResult.data;

    // Create new tracking event
    const newEvent: TrackingEvent = {
      id: `event_${Date.now()}_${trackingInfo.events.length + 1}`,
      timestamp: new Date(),
      status,
      location,
      description: description || getStatusDescription(status),
      carrier: trackingInfo.carrier,
    };

    // Update tracking info
    trackingInfo.currentStatus = status;
    trackingInfo.currentLocation = location;
    trackingInfo.updatedAt = new Date();

    if (estimatedDelivery) {
      trackingInfo.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (status === 'DELIVERED') {
      trackingInfo.actualDelivery = new Date();
    }

    // Add new event
    trackingInfo.events.push(newEvent);

    // Sort events by timestamp (newest first)
    trackingInfo.events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    trackingData.set(trackingInfo.id, trackingInfo);

    return NextResponse.json({
      success: true,
      message: 'Tracking updated successfully',
      data: trackingInfo,
      metadata: {
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error updating tracking:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking' },
      { status: 500 }
    );
  }
}

function getStatusDescription(status: string): string {
  const descriptions = {
    'LABEL_CREATED': 'Etiqueta de envio criada',
    'PICKED_UP': 'Encomenda recolhida pela transportadora',
    'IN_TRANSIT': 'Encomenda em trânsito',
    'OUT_FOR_DELIVERY': 'Encomenda em distribuição',
    'DELIVERED': 'Encomenda entregue',
    'EXCEPTION': 'Exceção no envio',
    'RETURNED': 'Encomenda devolvida',
  };

  return descriptions[status as keyof typeof descriptions] || status;
}

// GET method to retrieve carriers information
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      carriers: Object.entries(carriers).map(([code, info]) => ({
        code,
        name: info.name,
        supportedServices: info.supportedServices,
      })),
      statuses: [
        { code: 'LABEL_CREATED', name: 'Etiqueta Criada' },
        { code: 'PICKED_UP', name: 'Recolhido' },
        { code: 'IN_TRANSIT', name: 'Em Trânsito' },
        { code: 'OUT_FOR_DELIVERY', name: 'Em Distribuição' },
        { code: 'DELIVERED', name: 'Entregue' },
        { code: 'EXCEPTION', name: 'Exceção' },
        { code: 'RETURNED', name: 'Devolvido' },
      ],
    },
  });
}