/**
 * Invoice Schema - MongoDB with Zod validation
 * JC Hair Studio's 62 E-commerce
 * Sistema completo de Nota Fiscal/Invoice com padrão europeu
 */

import { Schema, model, models, Document } from 'mongoose';
import { z } from 'zod';
import { getSafeModel, configureSchemaForServerless, initializeSchemaIndexes } from '../schema-manager';

// Zod validation schemas
export const InvoiceItemZodSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
  unitPrice: z.number().min(0, 'Preço unitário deve ser positivo'),
  total: z.number().min(0, 'Total deve ser positivo'),
  taxRate: z.number().min(0).max(1).default(0.21), // IVA 21%
  taxAmount: z.number().min(0).default(0),
  category: z.string().optional(),
  sku: z.string().optional(),
});

export const InvoiceAddressZodSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  street: z.string().min(1, 'Endereço obrigatório'),
  city: z.string().min(1, 'Cidade obrigatória'),
  state: z.string().optional(),
  zipCode: z.string().min(1, 'Código postal obrigatório'),
  country: z.string().min(1, 'País obrigatório'),
  taxId: z.string().optional(),
});

export const InvoiceZodSchema = z.object({
  // Identificação
  invoiceNumber: z.string().min(1, 'Número da invoice obrigatório'),
  orderId: z.string().min(1, 'ID do pedido obrigatório'),
  orderNumber: z.string().min(1, 'Número do pedido obrigatório'),

  // Datas
  issueDate: z.date().default(() => new Date()),
  dueDate: z.date(),

  // Cliente
  customerName: z.string().min(1, 'Nome do cliente obrigatório'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().optional(),
  customerTaxId: z.string().optional(), // NIF/CPF/CNPJ

  // Endereços
  billingAddress: InvoiceAddressZodSchema,
  shippingAddress: InvoiceAddressZodSchema.optional(),

  // Items da invoice
  items: z.array(InvoiceItemZodSchema).min(1, 'Pelo menos um item obrigatório'),

  // Valores
  subtotal: z.number().min(0, 'Subtotal deve ser positivo'),
  taxAmount: z.number().min(0, 'Valor do imposto deve ser positivo'),
  discount: z.number().min(0).default(0),
  shipping: z.number().min(0).default(0),
  total: z.number().min(0, 'Total deve ser positivo'),
  currency: z.string().default('EUR'),

  // Pagamento
  paymentMethod: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'partial', 'overdue', 'cancelled']).default('pending'),
  paymentDate: z.date().optional(),

  // Notas e observações
  notes: z.string().max(1000).optional(),
  internalNotes: z.string().max(1000).optional(),

  // Status da invoice
  status: z.enum(['draft', 'issued', 'sent', 'paid', 'cancelled', 'void']).default('draft'),

  // PDF
  pdfUrl: z.string().url().optional(),
  pdfGenerated: z.boolean().default(false),

  // Dados da empresa (snapshot no momento da emissão)
  companyData: z.object({
    name: z.string(),
    address: z.string(),
    taxId: z.string(),
    phone: z.string(),
    email: z.string().email(),
    website: z.string().url().optional(),
  }),

  // Auditoria
  sentAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  cancelReason: z.string().optional(),
});

// TypeScript interfaces
export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
  taxAmount: number;
  category?: string;
  sku?: string;
}

export interface IInvoiceAddress {
  name: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  taxId?: string;
}

export interface ICompanyData {
  name: string;
  address: string;
  taxId: string;
  phone: string;
  email: string;
  website?: string;
}

export interface IInvoice extends Document {
  // Identificação
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;

  // Datas
  issueDate: Date;
  dueDate: Date;

  // Cliente
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerTaxId?: string;

  // Endereços
  billingAddress: IInvoiceAddress;
  shippingAddress?: IInvoiceAddress;

  // Items
  items: IInvoiceItem[];

  // Valores
  subtotal: number;
  taxAmount: number;
  discount: number;
  shipping: number;
  total: number;
  currency: string;

  // Pagamento
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paymentDate?: Date;

  // Notas
  notes?: string;
  internalNotes?: string;

  // Status
  status: 'draft' | 'issued' | 'sent' | 'paid' | 'cancelled' | 'void';

  // PDF
  pdfUrl?: string;
  pdfGenerated: boolean;

  // Dados da empresa
  companyData: ICompanyData;

  // Auditoria
  sentAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  generateInvoiceNumber(): string;
  calculateTotals(): void;
  markAsPaid(paymentDate?: Date): void;
  markAsSent(): void;
  cancel(reason: string): void;
  canBeCancelled(): boolean;
  isOverdue(): boolean;
}

// MongoDB Schemas
const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0.21, min: 0, max: 1 },
  taxAmount: { type: Number, default: 0, min: 0 },
  category: { type: String },
  sku: { type: String },
});

const InvoiceAddressSchema = new Schema<IInvoiceAddress>({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  taxId: { type: String },
});

const CompanyDataSchema = new Schema<ICompanyData>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  taxId: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
});

const InvoiceSchema = new Schema<IInvoice>({
  // Identificação
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    index: true,
    uppercase: true
  },
  orderId: {
    type: String,
    required: true,
    index: true
  },
  orderNumber: {
    type: String,
    required: true,
    index: true
  },

  // Datas
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  dueDate: {
    type: Date,
    required: true,
    index: true
  },

  // Cliente
  customerName: { type: String, required: true },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  customerPhone: { type: String },
  customerTaxId: { type: String, index: true },

  // Endereços
  billingAddress: {
    type: InvoiceAddressSchema,
    required: true
  },
  shippingAddress: InvoiceAddressSchema,

  // Items
  items: [InvoiceItemSchema],

  // Valores
  subtotal: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  shipping: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
  currency: {
    type: String,
    default: 'EUR',
    uppercase: true,
    enum: ['EUR', 'BRL', 'USD', 'GBP']
  },

  // Pagamento
  paymentMethod: { type: String },
  paymentStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'paid', 'partial', 'overdue', 'cancelled'],
    index: true
  },
  paymentDate: { type: Date, index: true },

  // Notas
  notes: { type: String, maxlength: 1000 },
  internalNotes: { type: String, maxlength: 1000 },

  // Status
  status: {
    type: String,
    default: 'draft',
    enum: ['draft', 'issued', 'sent', 'paid', 'cancelled', 'void'],
    index: true
  },

  // PDF
  pdfUrl: { type: String },
  pdfGenerated: { type: Boolean, default: false, index: true },

  // Dados da empresa
  companyData: {
    type: CompanyDataSchema,
    required: true
  },

  // Auditoria
  sentAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
}, {
  timestamps: true,
  collection: 'invoices'
});

// Configure schema for serverless environment
configureSchemaForServerless(InvoiceSchema);

// Define indexes
const invoiceIndexes = [
  { spec: { invoiceNumber: 1 }, options: { unique: true, sparse: true, background: true } },
  { spec: { orderId: 1 }, options: { background: true } },
  { spec: { orderNumber: 1 }, options: { background: true } },
  { spec: { customerEmail: 1 }, options: { background: true } },
  { spec: { status: 1 }, options: { background: true } },
  { spec: { paymentStatus: 1 }, options: { background: true } },
  { spec: { issueDate: -1 }, options: { background: true } },
  { spec: { dueDate: 1 }, options: { background: true } },
  { spec: { customerEmail: 1, issueDate: -1 }, options: { background: true } },
  { spec: { status: 1, paymentStatus: 1 }, options: { background: true } },
  { spec: { 'companyData.taxId': 1, issueDate: -1 }, options: { background: true } },
];

// Virtual properties
InvoiceSchema.virtual('isOverdue').get(function() {
  return this.paymentStatus !== 'paid' && this.dueDate < new Date();
});

InvoiceSchema.virtual('daysSinceIssue').get(function() {
  return Math.floor((Date.now() - this.issueDate.getTime()) / (1000 * 60 * 60 * 24));
});

InvoiceSchema.virtual('daysUntilDue').get(function() {
  return Math.floor((this.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are included in JSON
InvoiceSchema.set('toJSON', { virtuals: true });
InvoiceSchema.set('toObject', { virtuals: true });

// Instance methods
InvoiceSchema.methods.generateInvoiceNumber = function(): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  const invoiceNumber = `INV-${year}${month}-${timestamp}-${random}`;
  this.invoiceNumber = invoiceNumber;
  return invoiceNumber;
};

InvoiceSchema.methods.calculateTotals = function(): void {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => {
    item.total = item.quantity * item.unitPrice;
    item.taxAmount = item.total * item.taxRate;
    return sum + item.total;
  }, 0);

  // Calculate total tax
  this.taxAmount = this.items.reduce((sum, item) => sum + item.taxAmount, 0);

  // Calculate final total
  this.total = this.subtotal + this.taxAmount + this.shipping - this.discount;
};

InvoiceSchema.methods.markAsPaid = function(paymentDate?: Date): void {
  this.paymentStatus = 'paid';
  this.status = 'paid';
  this.paymentDate = paymentDate || new Date();
};

InvoiceSchema.methods.markAsSent = function(): void {
  if (this.status === 'draft') {
    this.status = 'issued';
  }
  this.status = 'sent';
  this.sentAt = new Date();
};

InvoiceSchema.methods.cancel = function(reason: string): void {
  if (!this.canBeCancelled()) {
    throw new Error('Invoice cannot be cancelled');
  }

  this.status = 'cancelled';
  this.paymentStatus = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelReason = reason;
};

InvoiceSchema.methods.canBeCancelled = function(): boolean {
  return this.status !== 'paid' && this.status !== 'cancelled' && this.status !== 'void';
};

InvoiceSchema.methods.isOverdue = function(): boolean {
  return this.paymentStatus !== 'paid' && this.dueDate < new Date();
};

// Pre-save middleware
InvoiceSchema.pre('save', function(next) {
  if (this.isNew && !this.invoiceNumber) {
    this.generateInvoiceNumber();
  }

  // Recalculate totals if items have changed
  if (this.isModified('items') || this.isModified('shipping') || this.isModified('discount')) {
    this.calculateTotals();
  }

  // Auto-update status based on payment
  if (this.isModified('paymentStatus') && this.paymentStatus === 'paid' && this.status !== 'paid') {
    this.status = 'paid';
  }

  // Check for overdue
  if (this.paymentStatus === 'pending' && this.dueDate < new Date()) {
    this.paymentStatus = 'overdue';
  }

  next();
});

// Static methods
InvoiceSchema.statics.findByInvoiceNumber = function(invoiceNumber: string) {
  return this.findOne({ invoiceNumber: invoiceNumber.toUpperCase() });
};

InvoiceSchema.statics.findByOrderId = function(orderId: string) {
  return this.findOne({ orderId });
};

InvoiceSchema.statics.findByCustomerEmail = function(email: string) {
  return this.find({ customerEmail: email.toLowerCase() }).sort({ issueDate: -1 });
};

InvoiceSchema.statics.findOverdue = function() {
  return this.find({
    paymentStatus: { $in: ['pending', 'partial'] },
    dueDate: { $lt: new Date() }
  }).sort({ dueDate: 1 });
};

InvoiceSchema.statics.findPending = function() {
  return this.find({ paymentStatus: 'pending' }).sort({ dueDate: 1 });
};

InvoiceSchema.statics.getRevenueStats = function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        issueDate: { $gte: startDate, $lte: endDate },
        status: { $in: ['paid', 'sent', 'issued'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalInvoices: { $sum: 1 },
        averageInvoiceValue: { $avg: '$total' },
        paidRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] }
        },
        pendingRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$total', 0] }
        }
      }
    }
  ]);
};

// Create and export the model
export const Invoice = getSafeModel<IInvoice>('Invoice', InvoiceSchema, 'invoices');

// Initialize indexes asynchronously
if (typeof window === 'undefined' && process.env.NEXT_PHASE !== 'phase-production-build') {
  initializeSchemaIndexes(Invoice, invoiceIndexes).catch(console.error);
}

export default Invoice;
