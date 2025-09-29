import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { rateLimit } from '@/lib/utils/rate-limit';
import { z } from 'zod';

const CreateNotificationSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  email: z.string().email('Valid email is required'),
  threshold: z.number().int().min(1).optional().default(1),
  notifyWhenAvailable: z.boolean().default(true),
});

const UpdateNotificationSchema = z.object({
  isActive: z.boolean().optional(),
  threshold: z.number().int().min(1).optional(),
});

interface StockNotification {
  id: string;
  productId: string;
  variantId?: string;
  email: string;
  threshold: number;
  isActive: boolean;
  notifyWhenAvailable: boolean;
  lastNotifiedAt?: Date;
  notificationCount: number;
  createdAt: Date;
  updatedAt: Date;
  productName?: string;
  variantName?: string;
  currentStock?: number;
}

// In-memory storage for demo - replace with database
const notifications: Map<string, StockNotification> = new Map();
let notificationIdCounter = 1;

/**
 * Stock Notifications API
 *
 * GET /api/notifications/stock - Get user's stock notifications
 * POST /api/notifications/stock - Create new stock notification
 * PUT /api/notifications/stock/[id] - Update notification
 * DELETE /api/notifications/stock/[id] - Remove notification
 */

// Get user's stock notifications
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'stock-notifications-get',
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
    const email = searchParams.get('email');
    const productId = searchParams.get('productId');
    const isActive = searchParams.get('active');

    // Filter notifications
    let userNotifications = Array.from(notifications.values());

    if (email) {
      userNotifications = userNotifications.filter(n => n.email === email);
    }

    if (productId) {
      userNotifications = userNotifications.filter(n => n.productId === productId);
    }

    if (isActive !== null) {
      userNotifications = userNotifications.filter(n =>
        n.isActive === (isActive === 'true')
      );
    }

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json({
      success: true,
      data: userNotifications,
      metadata: {
        total: userNotifications.length,
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error getting stock notifications:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notifications' },
      { status: 500 }
    );
  }
}

// Create new stock notification
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'stock-notifications-create',
      limit: 10,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many notification requests' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = CreateNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid notification data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { productId, variantId, email, threshold, notifyWhenAvailable } = validationResult.data;

    // Check if notification already exists for this product/variant/email combination
    const existingNotification = Array.from(notifications.values()).find(n =>
      n.productId === productId &&
      n.variantId === variantId &&
      n.email === email &&
      n.isActive
    );

    if (existingNotification) {
      return NextResponse.json(
        { error: 'Notification already exists for this product and email' },
        { status: 409 }
      );
    }

    // TODO: Validate that product exists and get current stock
    // For now, we'll assume the product exists

    // Create new notification
    const newNotification: StockNotification = {
      id: `notif_${notificationIdCounter++}`,
      productId,
      variantId,
      email,
      threshold,
      isActive: true,
      notifyWhenAvailable,
      notificationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      // TODO: Fetch these from product service
      productName: `Product ${productId}`,
      variantName: variantId ? `Variant ${variantId}` : undefined,
      currentStock: 0, // TODO: Get from inventory service
    };

    notifications.set(newNotification.id, newNotification);

    return NextResponse.json({
      success: true,
      message: 'Stock notification created successfully',
      data: newNotification,
      metadata: {
        timestamp: new Date().toISOString(),
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating stock notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// Update notification
export async function PUT(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'stock-notifications-update',
      limit: 20,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid update data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const notification = notifications.get(notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Update notification
    const updateData = validationResult.data;
    if (updateData.isActive !== undefined) {
      notification.isActive = updateData.isActive;
    }
    if (updateData.threshold !== undefined) {
      notification.threshold = updateData.threshold;
    }
    notification.updatedAt = new Date();

    notifications.set(notificationId, notification);

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully',
      data: notification,
      metadata: {
        timestamp: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error('Error updating stock notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit({
      request,
      identifier: 'stock-notifications-delete',
      limit: 20,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notification = notifications.get(notificationId);

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Remove notification
    notifications.delete(notificationId);

    return NextResponse.json({
      success: true,
      message: 'Notification removed successfully',
      metadata: {
        timestamp: new Date().toISOString(),
        removedId: notificationId,
      }
    });

  } catch (error) {
    console.error('Error deleting stock notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to send stock notifications
 * This would typically be called by a background job or when stock levels change
 */
export async function triggerStockNotifications(productId: string, variantId?: string, newStock: number = 0) {
  try {
    // Find all active notifications for this product/variant
    const relevantNotifications = Array.from(notifications.values()).filter(n =>
      n.isActive &&
      n.productId === productId &&
      n.variantId === variantId &&
      (
        (n.notifyWhenAvailable && newStock > 0) ||
        (newStock >= n.threshold)
      )
    );

    for (const notification of relevantNotifications) {
      // Check if we should send notification (avoid spam)
      const timeSinceLastNotification = notification.lastNotifiedAt ?
        Date.now() - notification.lastNotifiedAt.getTime() : Infinity;

      // Don't send notifications more than once per hour
      if (timeSinceLastNotification < 60 * 60 * 1000) {
        continue;
      }

      // TODO: Send actual email notification here
      console.log(`Sending stock notification to ${notification.email} for product ${productId}`);

      // Update notification
      notification.lastNotifiedAt = new Date();
      notification.notificationCount++;
      notification.updatedAt = new Date();
      notifications.set(notification.id, notification);

      // If this was a "notify when available" notification and stock is now available,
      // we can deactivate it (user will need to create a new one if they want more notifications)
      if (notification.notifyWhenAvailable && newStock > 0) {
        notification.isActive = false;
      }
    }

    return {
      success: true,
      notificationsSent: relevantNotifications.length
    };

  } catch (error) {
    console.error('Error triggering stock notifications:', error);
    return {
      success: false,
      error: 'Failed to send notifications'
    };
  }
}