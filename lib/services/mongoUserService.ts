/**
 * MongoDB User Service
 * JC Hair Studio's 62 E-commerce
 */

import { connectDB } from '../mongodb/connection';
import { User, IUser } from '../mongodb/schemas/user.schema';

export class MongoUserService {
  /**
   * Create new user
   */
  static async createUser(data: Partial<IUser>): Promise<IUser> {
    await connectDB();

    const user = new User(data);
    return user.save();
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<IUser | null> {
    await connectDB();

    return User.findById(id).exec();
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    await connectDB();

    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await connectDB();

    return User.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<boolean> {
    await connectDB();

    const result = await User.findByIdAndDelete(id).exec();
    return !!result;
  }
}