/**
 * MongoDB Order Service
 * JC Hair Studio's 62's 62 E-commerce
 */

import { connectDB } from '../mongodb/connection';
import { Order, IOrder } from '../mongodb/schemas/order.schema';

export class MongoOrderService {
  /**
   * Create new order
   */
  static async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    await connectDB();

    const order = new Order(data);
    return order.save();
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id: string): Promise<IOrder | null> {
    await connectDB();

    return Order.findById(id).exec();
  }

  /**
   * Get orders by user ID
   */
  static async getOrdersByUserId(userId: string, limit: number = 10): Promise<IOrder[]> {
    await connectDB();

    return Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Update order
   */
  static async updateOrder(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    await connectDB();

    return Order.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    await connectDB();

    return Order.findByIdAndUpdate(
      id, 
      { 
        status,
        updatedAt: new Date()
      }, 
      { new: true }
    ).exec();
  }
}