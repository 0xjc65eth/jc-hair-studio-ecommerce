import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { rateLimit } from '@/lib/utils/rate-limit';
import { InventoryService } from '@/lib/services/inventoryService';
import { z } from 'zod';

const SyncRequestSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  syncType: z.enum(['FULL', 'INCREMENTAL', 'STOCK_ONLY', 'PRICES_ONLY']),
  products: z.array(z.object({
    supplierSku: z.string(),
    internalSku: z.string().optional(),
    productId: z.string().optional(),
    stock: z.number().int().min(0),
    price: z.number().min(0).optional(),
    lastUpdated: z.string().datetime(),
  })).optional(),
  forceSync: z.boolean().default(false),
});

const CreateSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  code: z.string().min(1, 'Supplier code is required'),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
  }),
  apiConfig: z.object({
    endpoint: z.string().url().optional(),
    apiKey: z.string().optional(),
    syncMethod: z.enum(['API', 'CSV', 'XML', 'MANUAL']),
    syncFrequency: z.enum(['REALTIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MANUAL']),
  }),
  isActive: z.boolean().default(true),
});

interface Supplier {
  id: string;
  name: string;
  code: string;
  contactInfo: {
    email: string;
    phone?: string;
    website?: string;
  };
  apiConfig: {
    endpoint?: string;
    apiKey?: string;
    syncMethod: 'API' | 'CSV' | 'XML' | 'MANUAL';
    syncFrequency: 'REALTIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MANUAL';
  };
  isActive: boolean;
  lastSyncAt?: Date;
  totalProducts: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SyncResult {
  success: boolean;
  supplierId: string;
  syncType: string;
  summary: {
    totalProcessed: number;
    successfulUpdates: number;
    failedUpdates: number;
    skippedItems: number;
    newProducts: number;
    updatedPrices: number;
    updatedStock: number;
  };
  errors: Array<{
    item: string;
    error: string;
  }>;
  duration: number;
  timestamp: Date;
}

// In-memory storage for demo - replace with database
const suppliers: Map<string, Supplier> = new Map();
const syncHistory: Array<SyncResult> = [];

// Initialize demo suppliers
const initializeDemoSuppliers = () => {
  if (suppliers.size === 0) {
    const demoSuppliers: Supplier[] = [
      {
        id: 'supplier_001',
        name: 'L\'Oréal Portugal',
        code: 'LOREAL_PT',
        contactInfo: {
          email: 'orders@loreal.pt',
          phone: '+351 21 123 4567',
          website: 'https://www.loreal.pt'
        },
        apiConfig: {
          endpoint: 'https://api.loreal.pt/v1/products',
          syncMethod: 'API',
          syncFrequency: 'DAILY'
        },
        isActive: true,
        totalProducts: 324,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        lastSyncAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 'supplier_002',
        name: 'Wella Distribuidora',
        code: 'WELLA_DIST',
        contactInfo: {
          email: 'vendas@wella.pt',
          phone: '+351 22 987 6543'
        },
        apiConfig: {
          syncMethod: 'CSV',
          syncFrequency: 'WEEKLY'
        },
        isActive: true,
        totalProducts: 198,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        lastSyncAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: 'supplier_003',
        name: 'Beauty Color Cosmetics',
        code: 'BEAUTY_COLOR',
        contactInfo: {
          email: 'info@beautycolor.com.br',
          website: 'https://beautycolor.com.br'
        },
        apiConfig: {
          syncMethod: 'MANUAL',
          syncFrequency: 'MANUAL'
        },
        isActive: true,
        totalProducts: 87,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      }
    ];

    demoSuppliers.forEach(supplier => {
      suppliers.set(supplier.id, supplier);
    });
  }
};

/**
 * Supplier Synchronization API
 *
 * GET /api/suppliers/sync - Get sync status and history
 * POST /api/suppliers/sync - Trigger manual sync
 * PUT /api/suppliers/sync - Update sync configuration
 */

// Get sync status and history
export async function GET(request: NextRequest) {
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
      identifier: 'suppliers-sync-get',
      limit: 50,
      window: 60000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    initializeDemoSuppliers();

    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (supplierId) {
      const supplier = suppliers.get(supplierId);
      if (!supplier) {
        return NextResponse.json(
          { error: 'Supplier not found' },
          { status: 404 }
        );
      }

      const supplierSyncHistory = syncHistory
        .filter(sync => sync.supplierId === supplierId)
        .slice(0, limit);

      return NextResponse.json({
        success: true,
        data: {
          supplier,
          syncHistory: supplierSyncHistory,
          nextScheduledSync: calculateNextSync(supplier),
        }
      });
    }

    // Return all suppliers with their sync status
    const suppliersWithStatus = Array.from(suppliers.values()).map(supplier => ({
      ...supplier,
      nextScheduledSync: calculateNextSync(supplier),
      recentSyncs: syncHistory
        .filter(sync => sync.supplierId === supplier.id)
        .slice(0, 3)
    }));

    return NextResponse.json({
      success: true,
      data: {
        suppliers: suppliersWithStatus,
        recentSyncHistory: syncHistory.slice(0, 10),
        totalSuppliers: suppliers.size,
        activeSuppliers: Array.from(suppliers.values()).filter(s => s.isActive).length,
      }
    });

  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}

// Trigger manual sync
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
      identifier: 'suppliers-sync-trigger',
      limit: 5,
      window: 300000, // 5 minutes - strict limit for sync operations
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many sync requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validationResult = SyncRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid sync request',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { supplierId, syncType, products, forceSync } = validationResult.data;

    initializeDemoSuppliers();

    const supplier = suppliers.get(supplierId);
    if (!supplier) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    if (!supplier.isActive) {
      return NextResponse.json(
        { error: 'Supplier is not active' },
        { status: 400 }
      );
    }

    // Check if sync is already running (in real implementation)
    const recentSync = syncHistory.find(sync =>
      sync.supplierId === supplierId &&
      Date.now() - sync.timestamp.getTime() < 5 * 60 * 1000 // 5 minutes
    );

    if (recentSync && !forceSync) {
      return NextResponse.json(
        { error: 'Sync already running or completed recently. Use forceSync=true to override.' },
        { status: 409 }
      );
    }

    // Perform the sync
    const syncResult = await performSync(supplier, syncType, products);

    // Update supplier last sync time
    supplier.lastSyncAt = new Date();
    suppliers.set(supplierId, supplier);

    // Add to sync history
    syncHistory.unshift(syncResult);

    // Keep only last 100 sync records
    if (syncHistory.length > 100) {
      syncHistory.length = 100;
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
      data: syncResult,
      metadata: {
        timestamp: new Date().toISOString(),
        triggeredBy: session.user?.id,
      }
    });

  } catch (error) {
    console.error('Error triggering sync:', error);
    return NextResponse.json(
      { error: 'Failed to trigger sync' },
      { status: 500 }
    );
  }
}

// Create or update supplier
export async function PUT(request: NextRequest) {
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
      identifier: 'suppliers-update',
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
    const supplierId = searchParams.get('id');

    const body = await request.json();
    const validationResult = CreateSupplierSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid supplier data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const supplierData = validationResult.data;

    initializeDemoSuppliers();

    if (supplierId) {
      // Update existing supplier
      const existingSupplier = suppliers.get(supplierId);
      if (!existingSupplier) {
        return NextResponse.json(
          { error: 'Supplier not found' },
          { status: 404 }
        );
      }

      const updatedSupplier: Supplier = {
        ...existingSupplier,
        ...supplierData,
        updatedAt: new Date(),
      };

      suppliers.set(supplierId, updatedSupplier);

      return NextResponse.json({
        success: true,
        message: 'Supplier updated successfully',
        data: updatedSupplier,
      });
    } else {
      // Create new supplier
      const newSupplier: Supplier = {
        id: `supplier_${Date.now()}`,
        ...supplierData,
        totalProducts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      suppliers.set(newSupplier.id, newSupplier);

      return NextResponse.json({
        success: true,
        message: 'Supplier created successfully',
        data: newSupplier,
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error managing supplier:', error);
    return NextResponse.json(
      { error: 'Failed to manage supplier' },
      { status: 500 }
    );
  }
}

async function performSync(
  supplier: Supplier,
  syncType: string,
  products?: Array<any>
): Promise<SyncResult> {
  const startTime = Date.now();

  // Mock sync implementation
  const result: SyncResult = {
    success: true,
    supplierId: supplier.id,
    syncType,
    summary: {
      totalProcessed: 0,
      successfulUpdates: 0,
      failedUpdates: 0,
      skippedItems: 0,
      newProducts: 0,
      updatedPrices: 0,
      updatedStock: 0,
    },
    errors: [],
    duration: 0,
    timestamp: new Date(),
  };

  try {
    // Simulate API call or file processing
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

    if (products && products.length > 0) {
      // Process provided products
      result.summary.totalProcessed = products.length;

      for (const product of products) {
        try {
          // Mock update operations
          if (product.stock !== undefined) {
            // Update stock via InventoryService
            // await InventoryService.addStock(product.productId, product.stock, undefined, `Sync from ${supplier.name}`);
            result.summary.updatedStock++;
          }

          if (product.price !== undefined) {
            // Update price
            result.summary.updatedPrices++;
          }

          result.summary.successfulUpdates++;
        } catch (error) {
          result.errors.push({
            item: product.supplierSku,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          result.summary.failedUpdates++;
        }
      }
    } else {
      // Full sync simulation
      const mockProductCount = supplier.totalProducts;
      result.summary.totalProcessed = mockProductCount;
      result.summary.successfulUpdates = Math.floor(mockProductCount * 0.95);
      result.summary.failedUpdates = mockProductCount - result.summary.successfulUpdates;
      result.summary.updatedStock = Math.floor(mockProductCount * 0.7);
      result.summary.updatedPrices = Math.floor(mockProductCount * 0.3);
      result.summary.newProducts = Math.floor(mockProductCount * 0.05);

      // Add some mock errors
      if (result.summary.failedUpdates > 0) {
        result.errors.push({
          item: 'MOCK_SKU_001',
          error: 'Product not found in local catalog'
        });
      }
    }

    result.duration = Date.now() - startTime;
    result.success = result.summary.failedUpdates < result.summary.totalProcessed * 0.1; // Success if < 10% failed

  } catch (error) {
    result.success = false;
    result.errors.push({
      item: 'SYNC_PROCESS',
      error: error instanceof Error ? error.message : 'Sync process failed'
    });
    result.duration = Date.now() - startTime;
  }

  return result;
}

function calculateNextSync(supplier: Supplier): Date | null {
  if (!supplier.isActive || supplier.apiConfig.syncFrequency === 'MANUAL') {
    return null;
  }

  const lastSync = supplier.lastSyncAt || supplier.createdAt;
  const now = new Date();

  switch (supplier.apiConfig.syncFrequency) {
    case 'REALTIME':
      return now; // Always ready for next sync
    case 'HOURLY':
      return new Date(lastSync.getTime() + 60 * 60 * 1000);
    case 'DAILY':
      return new Date(lastSync.getTime() + 24 * 60 * 60 * 1000);
    case 'WEEKLY':
      return new Date(lastSync.getTime() + 7 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}