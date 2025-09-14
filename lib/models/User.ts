import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  password: string;
  type: 'retail' | 'professional' | 'admin';
  addresses: Array<{
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }>;
  professional?: {
    cnpj: string;
    companyName: string;
    discount: number;
    verified: boolean;
    documents: string[];
  };
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    whatsapp: boolean;
  };
  loyalty: {
    points: number;
    tier: 'Bronze' | 'Prata' | 'Ouro';
    totalSpent: number;
  };
  wishlist: mongoose.Types.ObjectId[];
  cart: Array<{
    productId: mongoose.Types.ObjectId;
    size: string;
    quantity: number;
    addedAt: Date;
  }>;
  lastLogin: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  cpf: {
    type: String,
    unique: true,
    sparse: true, // Permite valores null/undefined únicos
    validate: {
      validator: function(v: string) {
        return !v || /^\d{11}$/.test(v);
      },
      message: 'CPF deve ter 11 dígitos'
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{10,11}$/.test(v);
      },
      message: 'Telefone deve ter 10 ou 11 dígitos'
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  type: {
    type: String,
    enum: ['retail', 'professional', 'admin'],
    default: 'retail'
  },
  addresses: [{
    id: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: String,
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { 
      type: String, 
      required: true,
      enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
    },
    zipCode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v: string) {
          return /^\d{8}$/.test(v);
        },
        message: 'CEP deve ter 8 dígitos'
      }
    },
    isDefault: { type: Boolean, default: false }
  }],
  professional: {
    cnpj: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^\d{14}$/.test(v);
        },
        message: 'CNPJ deve ter 14 dígitos'
      }
    },
    companyName: String,
    discount: { type: Number, default: 15, min: 0, max: 50 },
    verified: { type: Boolean, default: false },
    documents: [String]
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true }
  },
  loyalty: {
    points: { type: Number, default: 0, min: 0 },
    tier: {
      type: String,
      enum: ['Bronze', 'Prata', 'Ouro'],
      default: 'Bronze'
    },
    totalSpent: { type: Number, default: 0, min: 0 }
  },
  wishlist: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  cart: [{
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    size: { type: String, required: true },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1,
      default: 1
    },
    addedAt: { type: Date, default: Date.now }
  }],
  lastLogin: Date,
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Índices
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ cpf: 1 }, { unique: true, sparse: true });
UserSchema.index({ type: 1 });
UserSchema.index({ 'loyalty.tier': 1 });
UserSchema.index({ isActive: 1 });

// Middleware para atualizar tier baseado no total gasto
UserSchema.pre('save', function(next) {
  const totalSpent = this.loyalty.totalSpent;
  
  if (totalSpent >= 5000) {
    this.loyalty.tier = 'Ouro';
  } else if (totalSpent >= 1000) {
    this.loyalty.tier = 'Prata';
  } else {
    this.loyalty.tier = 'Bronze';
  }
  
  next();
});

// Métodos virtuais
UserSchema.virtual('isProfessional').get(function() {
  return this.type === 'professional' && this.professional?.verified;
});

UserSchema.virtual('discountRate').get(function() {
  if (this.type === 'professional' && this.professional?.verified) {
    return this.professional.discount;
  }
  return 0;
});

UserSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);