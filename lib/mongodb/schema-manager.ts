/**
 * Schema Index Manager
 * JC Hair Studio's 62 E-commerce
 *
 * Centralized schema index management to prevent duplicate warnings
 * and optimize index creation for Vercel serverless environment
 */

import mongoose from 'mongoose';

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Index management state
interface IndexState {
  created: Set<string>;
  pending: Set<string>;
  errors: Map<string, Error>;
}

const indexState: IndexState = {
  created: new Set(),
  pending: new Set(),
  errors: new Map(),
};

/**
 * Get safe model instance, handling potential duplicate registrations
 */
export function getSafeModel<T>(
  modelName: string,
  schema: mongoose.Schema<T>,
  collectionName?: string
): mongoose.Model<T> {
  try {
    // Try to get existing model first
    return mongoose.models[modelName] as mongoose.Model<T>;
  } catch (error) {
    // Model doesn't exist or there's an issue, create new one
    if (mongoose.models[modelName]) {
      delete mongoose.models[modelName];
    }
    return mongoose.model<T>(modelName, schema, collectionName);
  }
}

/**
 * Create index safely with deduplication
 */
export async function createIndexSafely(
  model: mongoose.Model<any>,
  indexSpec: any,
  options: mongoose.IndexOptions = {}
): Promise<boolean> {
  if (isBuild) {
    console.warn('Index creation skipped during build');
    return false;
  }

  const indexKey = `${model.modelName}-${JSON.stringify(indexSpec)}`;

  // Check if index already created or pending
  if (indexState.created.has(indexKey) || indexState.pending.has(indexKey)) {
    return true;
  }

  // Mark as pending
  indexState.pending.add(indexKey);

  try {
    // Default options for serverless
    const safeOptions: mongoose.IndexOptions = {
      background: true,
      ...options,
    };

    await model.createIndexes([{ key: indexSpec, ...safeOptions }]);

    // Mark as created
    indexState.created.add(indexKey);
    indexState.pending.delete(indexKey);

    if (!isProduction) {
      console.log(`✅ Index created for ${model.modelName}:`, indexSpec);
    }

    return true;
  } catch (error) {
    const err = error as Error;

    // Handle duplicate index errors gracefully
    if (err.message.includes('already exists') || err.message.includes('duplicate')) {
      indexState.created.add(indexKey);
      indexState.pending.delete(indexKey);
      return true;
    }

    // Store error for debugging
    indexState.errors.set(indexKey, err);
    indexState.pending.delete(indexKey);

    if (!isProduction) {
      console.warn(`⚠️ Index creation failed for ${model.modelName}:`, err.message);
    }

    return false;
  }
}

/**
 * Batch create indexes with error handling
 */
export async function createIndexesBatch(
  model: mongoose.Model<any>,
  indexes: Array<{ spec: any; options?: mongoose.IndexOptions }>
): Promise<number> {
  if (isBuild) {
    return 0;
  }

  let successCount = 0;

  for (const { spec, options } of indexes) {
    const success = await createIndexSafely(model, spec, options);
    if (success) successCount++;
  }

  return successCount;
}

/**
 * Configure schema for serverless environment
 */
export function configureSchemaForServerless<T>(
  schema: mongoose.Schema<T>,
  options: {
    disableAutoIndex?: boolean;
    suppressWarnings?: boolean;
  } = {}
): mongoose.Schema<T> {
  const {
    disableAutoIndex = isProduction || isVercel,
    suppressWarnings = true,
  } = options;

  // Disable automatic index creation in production/serverless
  if (disableAutoIndex) {
    schema.set('autoIndex', false);
  }

  // Suppress reserved keys warning
  if (suppressWarnings) {
    schema.set('suppressReservedKeysWarning', true);
  }

  // Optimize for serverless
  schema.set('bufferCommands', false);
  schema.set('bufferMaxEntries', 0);

  return schema;
}

/**
 * Initialize schema with proper index management
 */
export async function initializeSchemaIndexes<T>(
  model: mongoose.Model<T>,
  indexes: Array<{ spec: any; options?: mongoose.IndexOptions }>
): Promise<void> {
  if (isBuild) {
    return;
  }

  try {
    const successCount = await createIndexesBatch(model, indexes);

    if (!isProduction) {
      console.log(`📊 Initialized ${successCount}/${indexes.length} indexes for ${model.modelName}`);
    }
  } catch (error) {
    console.error(`❌ Failed to initialize indexes for ${model.modelName}:`, error);
  }
}

/**
 * Get index creation statistics
 */
export function getIndexStats(): {
  created: number;
  pending: number;
  errors: number;
  details: {
    created: string[];
    pending: string[];
    errors: Record<string, string>;
  };
} {
  return {
    created: indexState.created.size,
    pending: indexState.pending.size,
    errors: indexState.errors.size,
    details: {
      created: Array.from(indexState.created),
      pending: Array.from(indexState.pending),
      errors: Object.fromEntries(
        Array.from(indexState.errors.entries()).map(([key, error]) => [key, error.message])
      ),
    },
  };
}

/**
 * Clear index state (useful for testing)
 */
export function clearIndexState(): void {
  indexState.created.clear();
  indexState.pending.clear();
  indexState.errors.clear();
}

/**
 * Ensure indexes exist for a model
 */
export async function ensureIndexes(model: mongoose.Model<any>): Promise<void> {
  if (isBuild) {
    return;
  }

  try {
    await model.syncIndexes();

    if (!isProduction) {
      console.log(`🔄 Synced indexes for ${model.modelName}`);
    }
  } catch (error) {
    console.warn(`⚠️ Failed to sync indexes for ${model.modelName}:`, error);
  }
}

export default {
  getSafeModel,
  createIndexSafely,
  createIndexesBatch,
  configureSchemaForServerless,
  initializeSchemaIndexes,
  getIndexStats,
  clearIndexState,
  ensureIndexes,
};