import { SellingPartnerAPI } from 'amazon-sp-api';
import { AMAZON_CONFIG } from './config';

interface AmazonCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
  role: string;
}

export class AmazonSPAPIClient {
  private client: SellingPartnerAPI | null = null;
  private credentials: AmazonCredentials | null = null;

  constructor() {
    this.initializeCredentials();
  }

  private initializeCredentials() {
    this.credentials = {
      clientId: process.env.AMAZON_CLIENT_ID || '',
      clientSecret: process.env.AMAZON_CLIENT_SECRET || '',
      refreshToken: process.env.AMAZON_REFRESH_TOKEN || '',
      accessKeyId: process.env.AMAZON_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY || '',
      sessionToken: process.env.AMAZON_SESSION_TOKEN,
      role: process.env.AMAZON_ROLE || ''
    };
  }

  private async initializeClient() {
    if (!this.credentials) {
      throw new Error('Amazon credentials not configured');
    }

    if (this.client) {
      return this.client;
    }

    try {
      this.client = new SellingPartnerAPI({
        region: AMAZON_CONFIG.region,
        credentials: {
          SELLING_PARTNER_APP_CLIENT_ID: this.credentials.clientId,
          SELLING_PARTNER_APP_CLIENT_SECRET: this.credentials.clientSecret,
          AWS_ACCESS_KEY_ID: this.credentials.accessKeyId,
          AWS_SECRET_ACCESS_KEY: this.credentials.secretAccessKey,
          AWS_SESSION_TOKEN: this.credentials.sessionToken
        },
        refresh_token: this.credentials.refreshToken,
        role_credentials: {
          role_arn: this.credentials.role
        },
        endpoints: {
          production: AMAZON_CONFIG.endpoints.production,
          sandbox: AMAZON_CONFIG.endpoints.sandbox
        }
      });

      return this.client;
    } catch (error) {
      console.error('Failed to initialize Amazon SP-API client:', error);
      throw error;
    }
  }

  // Test connection to Amazon SP-API
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.initializeClient();

      // Test with a simple API call to verify connection
      const result = await client.callAPI({
        operation: 'getMarketplaceParticipations',
        endpoint: 'sellers'
      });

      return result.statusCode === 200;
    } catch (error) {
      console.error('Amazon SP-API connection test failed:', error);
      return false;
    }
  }

  // Get marketplace participations
  async getMarketplaces() {
    try {
      const client = await this.initializeClient();

      const result = await client.callAPI({
        operation: 'getMarketplaceParticipations',
        endpoint: 'sellers'
      });

      return result.body;
    } catch (error) {
      console.error('Failed to get marketplaces:', error);
      throw error;
    }
  }

  // Submit feed (for bulk operations like inventory updates)
  async submitFeed(feedType: string, feedContent: string) {
    try {
      const client = await this.initializeClient();

      // Create feed document
      const createFeedDocResult = await client.callAPI({
        operation: 'createFeedDocument',
        endpoint: 'feeds',
        body: {
          contentType: 'text/tab-separated-values; charset=UTF-8'
        }
      });

      if (createFeedDocResult.statusCode !== 201) {
        throw new Error('Failed to create feed document');
      }

      const feedDocumentId = createFeedDocResult.body.feedDocumentId;
      const uploadURL = createFeedDocResult.body.url;

      // Upload feed content
      const uploadResult = await fetch(uploadURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/tab-separated-values; charset=UTF-8'
        },
        body: feedContent
      });

      if (!uploadResult.ok) {
        throw new Error('Failed to upload feed content');
      }

      // Submit feed
      const submitFeedResult = await client.callAPI({
        operation: 'createFeed',
        endpoint: 'feeds',
        body: {
          feedType: feedType,
          marketplaceIds: [AMAZON_CONFIG.defaultMarketplace],
          inputFeedDocumentId: feedDocumentId
        }
      });

      return submitFeedResult.body;
    } catch (error) {
      console.error('Failed to submit feed:', error);
      throw error;
    }
  }

  // Get orders
  async getOrders(startDate: string, endDate?: string) {
    try {
      const client = await this.initializeClient();

      const params: any = {
        MarketplaceIds: [AMAZON_CONFIG.defaultMarketplace],
        CreatedAfter: startDate
      };

      if (endDate) {
        params.CreatedBefore = endDate;
      }

      const result = await client.callAPI({
        operation: 'getOrders',
        endpoint: 'orders',
        query: params
      });

      return result.body;
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw error;
    }
  }

  // Get product listings
  async getListings(sellerId: string, marketplaceId?: string) {
    try {
      const client = await this.initializeClient();

      const result = await client.callAPI({
        operation: 'getListingsItem',
        endpoint: 'listings',
        path: {
          sellerId: sellerId,
          sku: '', // Will need to implement for specific SKUs
        },
        query: {
          marketplaceIds: [marketplaceId || AMAZON_CONFIG.defaultMarketplace]
        }
      });

      return result.body;
    } catch (error) {
      console.error('Failed to get listings:', error);
      throw error;
    }
  }

  // Update inventory
  async updateInventory(sku: string, quantity: number) {
    try {
      const client = await this.initializeClient();

      const result = await client.callAPI({
        operation: 'putListingsItem',
        endpoint: 'listings',
        path: {
          sellerId: process.env.AMAZON_SELLER_ID || '',
          sku: sku
        },
        query: {
          marketplaceIds: [AMAZON_CONFIG.defaultMarketplace]
        },
        body: {
          productType: 'BEAUTY',
          attributes: {
            fulfillment_availability: [
              {
                fulfillment_channel_code: 'MERCHANT',
                quantity: quantity
              }
            ]
          }
        }
      });

      return result.body;
    } catch (error) {
      console.error('Failed to update inventory:', error);
      throw error;
    }
  }
}

export const amazonClient = new AmazonSPAPIClient();