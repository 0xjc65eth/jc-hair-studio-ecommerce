import { connectDB } from '@/lib/mongodb/connection';
import mongoose from 'mongoose';

// Tag Schema
const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
TagSchema.index({ name: 1 });
TagSchema.index({ slug: 1 });
TagSchema.index({ isActive: 1 });
TagSchema.index({ displayOrder: 1 });

// Model
const Tag = mongoose.models.Tag || mongoose.model('Tag', TagSchema);

export class MongoTagService {
  static async getTags(options: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    await connectDB();

    const {
      page = 1,
      limit = 50,
      search,
      isActive,
      sortBy = 'displayOrder',
      sortOrder = 'asc'
    } = options;

    const query: any = {};

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      Tag.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Tag.countDocuments(query)
    ]);

    return {
      tags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getTagById(id: string) {
    await connectDB();
    return await Tag.findById(id).lean();
  }

  static async getTagBySlug(slug: string) {
    await connectDB();
    return await Tag.findOne({ slug }).lean();
  }

  static async createTag(data: {
    name: string;
    slug: string;
    description?: string;
    color?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    await connectDB();

    const tag = new Tag({
      name: data.name.trim(),
      slug: data.slug.toLowerCase(),
      description: data.description?.trim() || '',
      color: data.color || '#3B82F6',
      displayOrder: data.displayOrder || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      productCount: 0
    });

    return await tag.save();
  }

  static async updateTag(id: string, data: {
    name?: string;
    description?: string;
    color?: string;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    await connectDB();

    const updateData: any = {
      updatedAt: new Date()
    };

    if (data.name) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.color) updateData.color = data.color;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return await Tag.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();
  }

  static async deleteTag(id: string) {
    await connectDB();

    const result = await Tag.findByIdAndDelete(id);
    return !!result;
  }

  static async getPopularTags(limit: number = 10) {
    await connectDB();

    return await Tag.find({ isActive: true })
      .sort({ productCount: -1 })
      .limit(limit)
      .lean();
  }

  static async incrementProductCount(tagId: string) {
    await connectDB();

    return await Tag.findByIdAndUpdate(
      tagId,
      { $inc: { productCount: 1 } },
      { new: true }
    );
  }

  static async decrementProductCount(tagId: string) {
    await connectDB();

    return await Tag.findByIdAndUpdate(
      tagId,
      { $inc: { productCount: -1 } },
      { new: true }
    );
  }

  static async updateProductCount(tagId: string, count: number) {
    await connectDB();

    return await Tag.findByIdAndUpdate(
      tagId,
      { productCount: Math.max(0, count) },
      { new: true }
    );
  }

  static async bulkUpdateDisplayOrder(updates: { id: string; displayOrder: number }[]) {
    await connectDB();

    const operations = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { displayOrder: update.displayOrder, updatedAt: new Date() }
      }
    }));

    return await Tag.bulkWrite(operations);
  }

  static async searchTags(query: string, limit: number = 10) {
    await connectDB();

    return await Tag.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
      .sort({ productCount: -1, name: 1 })
      .limit(limit)
      .select('name slug color')
      .lean();
  }
}