import mongoose, { Schema, Document, Model } from 'mongoose';

// User Schema
export interface IUser extends Document {
  userId: string; // "113429"
  phone: string; // "9794678059"
  passwordHash: string;
  secondaryPasswordHash: string;
  failedSecondaryAttempts: number;
  isSecondaryLocked: boolean;
  balance: number;
  totalEarnings: number;
  totalBonus: number;
  totalDeposit: number;
  totalWithdrawal: number;
  todayDeposit: number;
  todayWithdrawal: number;
  todayEarnings: number;
  todayBonus: number;
  teamCommission: number;
  performanceQuota: number;
  performanceQuotaMax: number;
  pendingDeposit: number;
  lockingDeposit: number;
  pendingWithdrawal: number;
  lockingWithdrawal: number;
  isUpiBound: boolean;
  referralCode: string;
  invitedBy?: string;
  status: 'ACTIVE' | 'FROZEN' | 'BANNED';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    secondaryPasswordHash: { type: String, required: true },
    failedSecondaryAttempts: { type: Number, default: 0 },
    isSecondaryLocked: { type: Boolean, default: false },
    balance: { type: Number, default: 10 },
    totalEarnings: { type: Number, default: 0 },
    totalBonus: { type: Number, default: 10 },
    totalDeposit: { type: Number, default: 0 },
    totalWithdrawal: { type: Number, default: 0 },
    todayDeposit: { type: Number, default: 0 },
    todayWithdrawal: { type: Number, default: 0 },
    todayEarnings: { type: Number, default: 0 },
    todayBonus: { type: Number, default: 0 },
    teamCommission: { type: Number, default: 0 },
    performanceQuota: { type: Number, default: 0 },
    performanceQuotaMax: { type: Number, default: 300 },
    pendingDeposit: { type: Number, default: 0 },
    lockingDeposit: { type: Number, default: 0 },
    pendingWithdrawal: { type: Number, default: 0 },
    lockingWithdrawal: { type: Number, default: 0 },
    isUpiBound: { type: Boolean, default: false },
    referralCode: { type: String, required: true, unique: true },
    invitedBy: { type: String, default: null },
    status: { type: String, enum: ['ACTIVE', 'FROZEN', 'BANNED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

// Admin User Schema
export interface IAdminUser extends Document {
  username: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'SUPPORT_AGENT' | 'FINANCE_OPERATOR';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'SUPPORT_AGENT', 'FINANCE_OPERATOR'], default: 'SUPER_ADMIN' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Wallet Binding Schema
export interface IWalletBinding extends Document {
  userId: string;
  provider: string;
  providerName: string;
  method: string;
  phoneNumber: string;
  accountIdentifier?: string;
  status: 'ACTIVE' | 'PENDING' | 'FAILED';
  createdAt: Date;
}

const WalletBindingSchema = new Schema<IWalletBinding>(
  {
    userId: { type: String, required: true, index: true },
    provider: { type: String, required: true },
    providerName: { type: String, required: true },
    method: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    accountIdentifier: { type: String },
    status: { type: String, enum: ['ACTIVE', 'PENDING', 'FAILED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

// Deposit Order Schema
export interface IDepositOrder extends Document {
  orderNumber: string;
  userId: string;
  type: 'INR' | 'USDT';
  amount: number;
  amountInr: number;
  packageId?: string;
  usdtRatio?: number;
  txidOrHash?: string;
  proofImageUrl?: string;
  walletAddress?: string;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'REJECTED';
  adminNotes?: string;
  createdAt: Date;
  completedAt?: Date;
}

const DepositOrderSchema = new Schema<IDepositOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['INR', 'USDT'], required: true },
    amount: { type: Number, required: true },
    amountInr: { type: Number, required: true },
    packageId: { type: String },
    usdtRatio: { type: Number, default: 109 },
    txidOrHash: { type: String },
    proofImageUrl: { type: String },
    walletAddress: { type: String },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'CANCELLED', 'REJECTED'], default: 'PENDING' },
    adminNotes: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Withdrawal Order Schema
export interface IWithdrawalOrder extends Document {
  orderNumber: string;
  userId: string;
  amount: number;
  upiId?: string;
  walletProvider?: string;
  status: 'PENDING' | 'SUCCESS' | 'CANCELLED' | 'REJECTED';
  failureReason?: string;
  createdAt: Date;
}

const WithdrawalOrderSchema = new Schema<IWithdrawalOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    upiId: { type: String },
    walletProvider: { type: String },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'CANCELLED', 'REJECTED'], default: 'PENDING' },
    failureReason: { type: String },
  },
  { timestamps: true }
);

// Bill Record Schema
export interface IBillRecord extends Document {
  userId: string;
  type: string;
  amount: number;
  isPositive: boolean;
  balanceAfter: number;
  createdAt: Date;
}

const BillRecordSchema = new Schema<IBillRecord>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    isPositive: { type: Boolean, required: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true }
);

// Chat Message Schema
export interface IChatMessage extends Document {
  userId: string;
  sender: 'USER' | 'AGENT' | 'SYSTEM';
  text: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['USER', 'AGENT', 'SYSTEM'], required: true },
    text: { type: String, required: true },
    status: { type: String, enum: ['SENT', 'DELIVERED', 'READ'], default: 'SENT' },
  },
  { timestamps: true }
);

// Audit Log Schema
export interface IAuditLog extends Document {
  adminUsername: string;
  action: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    adminUsername: { type: String, required: true, index: true },
    action: { type: String, required: true },
    targetId: { type: String },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

// Safe export helper for Next.js hot-reloading
export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export const AdminUserModel: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export const WalletBindingModel: Model<IWalletBinding> =
  mongoose.models.WalletBinding || mongoose.model<IWalletBinding>('WalletBinding', WalletBindingSchema);

export const DepositOrderModel: Model<IDepositOrder> =
  mongoose.models.DepositOrder || mongoose.model<IDepositOrder>('DepositOrder', DepositOrderSchema);

export const WithdrawalOrderModel: Model<IWithdrawalOrder> =
  mongoose.models.WithdrawalOrder || mongoose.model<IWithdrawalOrder>('WithdrawalOrder', WithdrawalOrderSchema);

export const BillRecordModel: Model<IBillRecord> =
  mongoose.models.BillRecord || mongoose.model<IBillRecord>('BillRecord', BillRecordSchema);

export const ChatMessageModel: Model<IChatMessage> =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export const AuditLogModel: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
