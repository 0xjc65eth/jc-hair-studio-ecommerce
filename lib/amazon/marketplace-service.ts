import { amazonClient } from './sp-api-client';
import { AmazonProductMapper } from './product-mapper';

interface UnifiedProduct {
  id: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  price?: number;
  preco_eur?: number;
  stock?: number;
  category?: string;
  shade?: string;
  size?: string;
  weight?: string;
}

export interface AmazonSyncResult {
  success: boolean;
  processed: number;
  errors: string[];
  feedId?: string;
}

export class AmazonMarketplaceService {
  async syncProducts(products: UnifiedProduct[]): Promise<AmazonSyncResult> {
    try {
      console.log(`Starting sync of ${products.length} products to Amazon...`);

      // Test connection first
      const connectionOk = await amazonClient.testConnection();
      if (!connectionOk) {
        return {
          success: false,
          processed: 0,
          errors: ['Failed to connect to Amazon SP-API']
        };
      }

      // Create product feed
      const productFeed = AmazonProductMapper.createProductFeed(products);

      // Submit product feed
      const feedResult = await amazonClient.submitFeed('POST_PRODUCT_DATA', productFeed);

      return {
        success: true,
        processed: products.length,
        errors: [],
        feedId: feedResult.feedId
      };

    } catch (error) {
      console.error('Amazon product sync failed:', error);
      return {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async syncInventory(products: UnifiedProduct[]): Promise<AmazonSyncResult> {
    try {
      console.log(`Starting inventory sync of ${products.length} products to Amazon...`);

      // Create inventory feed
      const inventoryFeed = AmazonProductMapper.createInventoryFeed(products);

      // Submit inventory feed
      const feedResult = await amazonClient.submitFeed('POST_INVENTORY_AVAILABILITY_DATA', inventoryFeed);

      return {
        success: true,
        processed: products.length,
        errors: [],
        feedId: feedResult.feedId
      };

    } catch (error) {
      console.error('Amazon inventory sync failed:', error);
      return {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async updateProductInventory(productId: string, quantity: number): Promise<boolean> {
    try {
      await amazonClient.updateInventory(productId, quantity);
      return true;
    } catch (error) {
      console.error(`Failed to update inventory for ${productId}:`, error);
      return false;
    }
  }

  async getAmazonOrders(startDate: string, endDate?: string) {
    try {
      const orders = await amazonClient.getOrders(startDate, endDate);
      return orders;
    } catch (error) {
      console.error('Failed to get Amazon orders:', error);
      throw error;
    }
  }

  async getMarketplaceStatus() {
    try {
      const marketplaces = await amazonClient.getMarketplaces();
      return {
        connected: true,
        marketplaces: marketplaces
      };
    } catch (error) {
      console.error('Failed to get marketplace status:', error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Validate product for Amazon requirements
  validateProductForAmazon(product: UnifiedProduct): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!product.name || product.name.length < 5) {
      errors.push('Product name must be at least 5 characters long');
    }

    if (!product.description || product.description.length < 20) {
      errors.push('Product description must be at least 20 characters long');
    }

    const price = product.price || product.preco_eur || 0;
    if (!price || price <= 0) {
      errors.push('Product must have a valid price greater than 0');
    }

    if (!product.images || product.images.length === 0) {
      errors.push('Product must have at least one image');
    }

    if (!product.category) {
      errors.push('Product must have a category');
    }

    // Amazon-specific validations
    if (product.name.length > 200) {
      errors.push('Product name cannot exceed 200 characters for Amazon');
    }

    if (product.description && product.description.length > 2000) {
      errors.push('Product description cannot exceed 2000 characters for Amazon');
    }

    // Beauty products specific requirements
    if (product.category?.includes('tinta') || product.category?.includes('perfume')) {
      if (!product.brand) {
        errors.push('Beauty products must have a brand specified');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Prepare products for Amazon sync by validating and filtering
  prepareProductsForSync(products: UnifiedProduct[]): {
    validProducts: UnifiedProduct[];
    invalidProducts: { product: UnifiedProduct; errors: string[] }[]
  } {
    const validProducts: UnifiedProduct[] = [];
    const invalidProducts: { product: UnifiedProduct; errors: string[] }[] = [];

    products.forEach(product => {
      const validation = this.validateProductForAmazon(product);
      if (validation.valid) {
        validProducts.push(product);
      } else {
        invalidProducts.push({
          product,
          errors: validation.errors
        });
      }
    });

    return { validProducts, invalidProducts };
  }
}

export const amazonMarketplaceService = new AmazonMarketplaceService();