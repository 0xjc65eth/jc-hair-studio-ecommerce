// User service for JC Hair Studio's 62's 62 E-commerce
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../auth/jwt';

// Lazy initialization of Prisma client
let prisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  userType: 'RETAIL' | 'PROFESSIONAL';
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  newsletter: boolean;
  marketing: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  addresses: UserAddress[];
  stats: UserStats;
}

export interface UserAddress {
  id: string;
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lifetimeValue: number;
  wishlistItems: number;
  reviewsCount: number;
  averageRating: number;
  loyaltyPoints: number;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  newsletter?: boolean;
  marketing?: boolean;
  userType?: 'RETAIL' | 'PROFESSIONAL';
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateAddressData {
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export class UserService {
  /**
   * Get user profile with full details
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await getPrismaClient().user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          where: { isActive: true },
          orderBy: { isDefault: 'desc' }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    // Get user statistics
    const stats = await this.getUserStats(userId);

    // Determine user type based on business logic
    let userType: 'RETAIL' | 'PROFESSIONAL' = 'RETAIL';
    if (stats.totalOrders >= 10 || stats.totalSpent >= 500) {
      userType = 'PROFESSIONAL';
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      name: user.name || undefined,
      phone: user.phone || undefined,
      avatar: user.avatar || undefined,
      userType,
      role: user.role,
      isVerified: user.isVerified,
      newsletter: user.newsletter,
      marketing: user.marketing,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt || undefined,
      addresses: user.addresses.map(addr => ({
        id: addr.id,
        type: addr.type,
        firstName: addr.firstName,
        lastName: addr.lastName,
        company: addr.company || undefined,
        street1: addr.street1,
        street2: addr.street2 || undefined,
        city: addr.city,
        state: addr.state || undefined,
        postalCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone || undefined,
        isDefault: addr.isDefault,
        isActive: addr.isActive
      })),
      stats
    };
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfile> {
    const updateData: any = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.newsletter !== undefined) updateData.newsletter = data.newsletter;
    if (data.marketing !== undefined) updateData.marketing = data.marketing;

    // Update name if firstName or lastName changed
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const user = await getPrismaClient().user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true }
      });

      const firstName = data.firstName ?? user?.firstName ?? '';
      const lastName = data.lastName ?? user?.lastName ?? '';
      updateData.name = `${firstName} ${lastName}`.trim() || null;
    }

    await getPrismaClient().user.update({
      where: { id: userId },
      data: updateData
    });

    // Return updated profile
    const updatedProfile = await this.getUserProfile(userId);
    if (!updatedProfile) {
      throw new Error('Failed to retrieve updated profile');
    }

    return updatedProfile;
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, data: ChangePasswordData): Promise<void> {
    const user = await getPrismaClient().user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user || !user.password) {
      throw new Error('User not found or password not set');
    }

    // Verify current password
    const isValidPassword = await comparePassword(data.currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(data.newPassword);

    // Update password
    await getPrismaClient().user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  /**
   * Get user addresses
   */
  static async getUserAddresses(userId: string): Promise<UserAddress[]> {
    const addresses = await getPrismaClient().address.findMany({
      where: { 
        userId,
        isActive: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return addresses.map(addr => ({
      id: addr.id,
      type: addr.type,
      firstName: addr.firstName,
      lastName: addr.lastName,
      company: addr.company || undefined,
      street1: addr.street1,
      street2: addr.street2 || undefined,
      city: addr.city,
      state: addr.state || undefined,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || undefined,
      isDefault: addr.isDefault,
      isActive: addr.isActive
    }));
  }

  /**
   * Create new address
   */
  static async createAddress(userId: string, data: CreateAddressData): Promise<UserAddress> {
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      await getPrismaClient().address.updateMany({
        where: { 
          userId,
          isActive: true
        },
        data: { isDefault: false }
      });
    }

    const address = await getPrismaClient().address.create({
      data: {
        userId,
        type: data.type,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        street1: data.street1,
        street2: data.street2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault || false,
        isActive: true
      }
    });

    return {
      id: address.id,
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || undefined,
      street1: address.street1,
      street2: address.street2 || undefined,
      city: address.city,
      state: address.state || undefined,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || undefined,
      isDefault: address.isDefault,
      isActive: address.isActive
    };
  }

  /**
   * Update address
   */
  static async updateAddress(
    userId: string, 
    addressId: string, 
    data: Partial<CreateAddressData>
  ): Promise<UserAddress> {
    // Verify address belongs to user
    const existingAddress = await getPrismaClient().address.findFirst({
      where: { id: addressId, userId, isActive: true }
    });

    if (!existingAddress) {
      throw new Error('Address not found');
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await getPrismaClient().address.updateMany({
        where: { 
          userId,
          id: { not: addressId },
          isActive: true
        },
        data: { isDefault: false }
      });
    }

    const address = await getPrismaClient().address.update({
      where: { id: addressId },
      data: {
        ...data,
        isActive: true
      }
    });

    return {
      id: address.id,
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || undefined,
      street1: address.street1,
      street2: address.street2 || undefined,
      city: address.city,
      state: address.state || undefined,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || undefined,
      isDefault: address.isDefault,
      isActive: address.isActive
    };
  }

  /**
   * Delete address (soft delete)
   */
  static async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await getPrismaClient().address.findFirst({
      where: { id: addressId, userId, isActive: true }
    });

    if (!address) {
      throw new Error('Address not found');
    }

    await getPrismaClient().address.update({
      where: { id: addressId },
      data: { isActive: false }
    });

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const nextAddress = await getPrismaClient().address.findFirst({
        where: { 
          userId,
          id: { not: addressId },
          isActive: true
        },
        orderBy: { createdAt: 'asc' }
      });

      if (nextAddress) {
        await getPrismaClient().address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
      }
    }
  }

  /**
   * Get user order history
   */
  static async getUserOrderHistory(
    userId: string, 
    page = 1, 
    limit = 10
  ): Promise<{
    orders: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const offset = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      getPrismaClient().order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: {
                    where: { isMain: true },
                    take: 1,
                    select: { url: true }
                  }
                }
              }
            }
          },
          shippingAddress: true
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      getPrismaClient().order.count({
        where: { userId }
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        total: order.total,
        itemCount: order.items.length,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        trackingNumber: order.trackingNumber,
        shippingAddress: order.shippingAddress,
        items: order.items.map(item => ({
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
          image: item.product.images[0]?.url,
          productSlug: item.product.slug
        }))
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get user wishlist
   */
  static async getUserWishlist(userId: string): Promise<any[]> {
    const wishlistItems = await getPrismaClient().wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isMain: true },
              take: 1
            },
            reviews: {
              select: { rating: true }
            },
            _count: {
              select: { reviews: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return wishlistItems.map(item => {
      const avgRating = item.product.reviews.length > 0
        ? item.product.reviews.reduce((sum, r) => sum + r.rating, 0) / item.product.reviews.length
        : 0;

      return {
        id: item.id,
        addedAt: item.createdAt,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          comparePrice: item.product.comparePrice,
          image: item.product.images[0]?.url,
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: item.product._count.reviews,
          inStock: item.product.quantity > 0
        }
      };
    });
  }

  /**
   * Get user statistics
   */
  private static async getUserStats(userId: string): Promise<UserStats> {
    const [orderStats, wishlistCount, reviewStats] = await Promise.all([
      getPrismaClient().order.aggregate({
        where: { 
          userId,
          status: { in: ['DELIVERED', 'CONFIRMED'] }
        },
        _count: true,
        _sum: { total: true },
        _avg: { total: true }
      }),
      getPrismaClient().wishlistItem.count({
        where: { userId }
      }),
      getPrismaClient().review.aggregate({
        where: { userId },
        _count: true,
        _avg: { rating: true }
      })
    ]);

    return {
      totalOrders: orderStats._count,
      totalSpent: Number(orderStats._sum.total || 0),
      averageOrderValue: Number(orderStats._avg.total || 0),
      lifetimeValue: Number(orderStats._sum.total || 0),
      wishlistItems: wishlistCount,
      reviewsCount: reviewStats._count,
      averageRating: Number(reviewStats._avg.rating || 0),
      loyaltyPoints: Math.floor(Number(orderStats._sum.total || 0) * 0.1) // 10% of total spent as points
    };
  }

  /**
   * Deactivate user account
   */
  static async deactivateAccount(userId: string): Promise<void> {
    await getPrismaClient().user.update({
      where: { id: userId },
      data: { isActive: false }
    });
  }

  /**
   * Delete user account (GDPR compliance)
   */
  static async deleteAccount(userId: string): Promise<void> {
    // This is a hard delete for GDPR compliance
    // In production, you might want to anonymize data instead
    
    // Delete related data
    await getPrismaClient().$transaction([
      getPrismaClient().wishlistItem.deleteMany({ where: { userId } }),
      getPrismaClient().cartItem.deleteMany({ where: { userId } }),
      getPrismaClient().review.deleteMany({ where: { userId } }),
      getPrismaClient().address.deleteMany({ where: { userId } }),
      // Orders are kept for legal/accounting purposes but anonymized
      getPrismaClient().order.updateMany({ 
        where: { userId }, 
        data: { 
          userId: null,
          email: 'deleted-user@example.com'
        }
      }),
      getPrismaClient().user.delete({ where: { id: userId } })
    ]);
  }
}