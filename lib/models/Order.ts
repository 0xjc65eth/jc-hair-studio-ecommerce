import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    brand: string;
    price: number;
    quantity: number;
    size: string;
    subtotal: number;
    image: string;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    taxes: number;
    total: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf?: string;
    type: 'retail' | 'professional';
  };
  shipping: {
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    method: 'correios_pac' | 'correios_sedex' | 'transportadora' | 'retirada';
    cost: number;
    trackingCode?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
  };
  payment: {
    method: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
    installments: number;
    transactionId?: string;
    paymentDate?: Date;
    dueDate?: Date; // Para boleto
    pixCode?: string; // Para PIX
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  notes?: string;
  timeline: Array<{
    status: string;
    date: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }
  }],
  totals: {
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    taxes: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    cpf: String,
    type: {
      type: String,
      enum: ['retail', 'professional'],
      default: 'retail'
    }
  },
  shipping: {
    address: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      complement: String,
      neighborhood: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true }
    },
    method: {
      type: String,
      enum: ['correios_pac', 'correios_sedex', 'transportadora', 'retirada'],
      required: true
    },
    cost: { type: Number, required: true, min: 0 },
    trackingCode: String,
    estimatedDelivery: Date,
    deliveredAt: Date
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'pix', 'boleto'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    installments: { type: Number, default: 1, min: 1, max: 12 },
    transactionId: String,
    paymentDate: Date,
    dueDate: Date,
    pixCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  notes: String,
  timeline: [{
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Índices
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'customer.email': 1 });

// Middleware para gerar número do pedido
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `JC${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Middleware para adicionar timeline
OrderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      date: new Date(),
      note: `Status alterado para ${this.status}`
    });
  }
  next();
});

// Métodos virtuais
OrderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

OrderSchema.virtual('canReturn').get(function() {
  return this.status === 'delivered' && 
    this.timeline.find(t => t.status === 'delivered')?.date && 
    Date.now() - new Date(this.timeline.find(t => t.status === 'delivered')!.date).getTime() <= 7 * 24 * 60 * 60 * 1000; // 7 dias
});

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);