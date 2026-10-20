import bcrypt from 'bcryptjs';
import { connectToDatabase } from './db';
import {
  UserModel,
  AdminUserModel,
  WalletBindingModel,
  DepositOrderModel,
  WithdrawalOrderModel,
  BillRecordModel,
  ChatMessageModel,
  AuditLogModel,
} from './models/schema';
import {
  DEFAULT_QUOTA_PACKAGES,
  APP_CONFIG,
  DEFAULT_WALLET_PROVIDERS,
} from '@ipay/shared';

// In-Memory state for zero-config local runs / instant CI testing
class InMemoryStore {
  users: any[] = [];
  admins: any[] = [];
  wallets: any[] = [];
  deposits: any[] = [];
  withdrawals: any[] = [];
  bills: any[] = [];
  messages: any[] = [];
  auditLogs: any[] = [];
  appConfig: any = { ...APP_CONFIG };
  quotaPackages: any[] = [...DEFAULT_QUOTA_PACKAGES];

  private initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // Hash passwords
    const passwordHash = await bcrypt.hash('King2141', 10);
    const secondaryHash = await bcrypt.hash('2621', 10);
    const adminPassHash = await bcrypt.hash('Admin@iPay2026!#', 10);

    // Initial Test User matching the video recording
    this.users.push({
      id: 'usr_1',
      userId: '113429',
      phone: '9794678059',
      passwordHash,
      secondaryPasswordHash: secondaryHash,
      failedSecondaryAttempts: 0,
      isSecondaryLocked: false,
      balance: 10,
      totalEarnings: 0,
      totalBonus: 10,
      totalDeposit: 0,
      totalWithdrawal: 0,
      todayDeposit: 0,
      todayWithdrawal: 0,
      todayEarnings: 0,
      todayBonus: 0,
      teamCommission: 0,
      performanceQuota: 0,
      performanceQuotaMax: 300,
      pendingDeposit: 0,
      lockingDeposit: 0,
      pendingWithdrawal: 0,
      lockingWithdrawal: 0,
      isUpiBound: false,
      referralCode: 'dwkPTEzMzQyOSZjaGFuk',
      status: 'ACTIVE',
      createdAt: new Date('2026-10-19T10:00:00Z'),
    });

    // Master Admin User
    this.admins.push({
      id: 'adm_1',
      username: 'admin',
      passwordHash: adminPassHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date(),
    });

    // Sample Bill Record from the recording
    this.bills.push({
      id: 'bill_1',
      userId: '113429',
      type: 'Bonus_Join telegram',
      amount: 10,
      isPositive: true,
      balanceAfter: 10,
      createdAt: '23:13:58 19/10/2026',
    });

    // Sample Chat History matching the recording
    this.messages.push(
      {
        id: 'msg_1',
        userId: '113429',
        sender: 'SYSTEM',
        text: `Event Reward Settings:
Join Telegram channel: 15 Rupees
Contact customer service: 15 Rupees
Link PhonePe UPI: 10 Rupees
Link MobiKwik or other UPI: 25 Rupees
Complete first payment-on-behalf transaction: 30 Rupees
Total rewards: 95 Rupees
Profit per completed order: 4% of the order amount
Summary:
Upon completing a first payment-on-behalf transaction of 100 Rupees, the actual withdrawable amount is 202 Rupees.`,
        status: 'READ',
        timestamp: '11:12:27 PM',
        dateStr: '19/10/2026',
      },
      {
        id: 'msg_2',
        userId: '113429',
        sender: 'USER',
        text: 'Hello',
        status: 'READ',
        timestamp: '11:14:56 PM',
        dateStr: '19/10/2026',
      },
      {
        id: 'msg_3',
        userId: '113429',
        sender: 'USER',
        text: 'I want to colab with you i will launch my own platform like you but I need orders',
        status: 'READ',
        timestamp: '11:15:22 PM',
        dateStr: '19/10/2026',
      },
      {
        id: 'msg_4',
        userId: '113429',
        sender: 'AGENT',
        text: 'What does it mean, and how would the cooperation work?',
        status: 'READ',
        timestamp: '7:06:44 AM',
        dateStr: '20/10/2026',
      }
    );
  }
}

declare global {
  // eslint-disable-next-line no-var
  var ipayMemoryStore: InMemoryStore | undefined;
}

if (!global.ipayMemoryStore) {
  global.ipayMemoryStore = new InMemoryStore();
}

export const memoryStore = global.ipayMemoryStore;

export async function getDataService() {
  await memoryStore.init();
  const mongooseConn = await connectToDatabase().catch(() => null);

  return {
    isMongo: !!mongooseConn,

    // USER OPERATIONS
    async findUserByPhone(phone: string) {
      if (mongooseConn) {
        const u = await UserModel.findOne({ phone }).lean();
        if (u) return { ...u, id: u._id.toString() };
      }
      return memoryStore.users.find((u) => u.phone === phone) || null;
    },

    async findUserById(userId: string) {
      if (mongooseConn) {
        const u = await UserModel.findOne({ userId }).lean();
        if (u) return { ...u, id: u._id.toString() };
      }
      return memoryStore.users.find((u) => u.userId === userId) || null;
    },

    async createUser(data: any) {
      if (mongooseConn) {
        const doc = await UserModel.create(data);
        return { ...doc.toObject(), id: doc._id.toString() };
      }
      const newUser = { id: `usr_${Date.now()}`, ...data };
      memoryStore.users.push(newUser);
      return newUser;
    },

    async updateUser(userId: string, updates: any) {
      if (mongooseConn) {
        const doc = await UserModel.findOneAndUpdate({ userId }, { $set: updates }, { new: true }).lean();
        if (doc) return { ...doc, id: doc._id.toString() };
      }
      const idx = memoryStore.users.findIndex((u) => u.userId === userId);
      if (idx !== -1) {
        memoryStore.users[idx] = { ...memoryStore.users[idx], ...updates };
        return memoryStore.users[idx];
      }
      return null;
    },

    async getAllUsers() {
      if (mongooseConn) {
        const users = await UserModel.find().sort({ createdAt: -1 }).lean();
        return users.map((u) => ({ ...u, id: u._id.toString() }));
      }
      return [...memoryStore.users];
    },

    // WALLET OPERATIONS
    async getWalletsByUserId(userId: string) {
      if (mongooseConn) {
        const w = await WalletBindingModel.find({ userId }).lean();
        return w.map((x) => ({ ...x, id: x._id.toString() }));
      }
      return memoryStore.wallets.filter((w) => w.userId === userId);
    },

    async addWalletBinding(data: any) {
      if (mongooseConn) {
        const doc = await WalletBindingModel.create(data);
        return { ...doc.toObject(), id: doc._id.toString() };
      }
      const binding = { id: `wb_${Date.now()}`, ...data, createdAt: new Date() };
      memoryStore.wallets.push(binding);
      return binding;
    },

    async getAllWallets() {
      if (mongooseConn) {
        const w = await WalletBindingModel.find().sort({ createdAt: -1 }).lean();
        return w.map((x) => ({ ...x, id: x._id.toString() }));
      }
      return [...memoryStore.wallets];
    },

    // DEPOSIT OPERATIONS
    async createDepositOrder(data: any) {
      if (mongooseConn) {
        const doc = await DepositOrderModel.create(data);
        return { ...doc.toObject(), id: doc._id.toString() };
      }
      const order = { id: `dep_${Date.now()}`, ...data, createdAt: new Date() };
      memoryStore.deposits.push(order);
      return order;
    },

    async getDepositOrders(userId?: string) {
      if (mongooseConn) {
        const q = userId ? { userId } : {};
        const d = await DepositOrderModel.find(q).sort({ createdAt: -1 }).lean();
        return d.map((x) => ({ ...x, id: x._id.toString() }));
      }
      if (userId) return memoryStore.deposits.filter((d) => d.userId === userId);
      return [...memoryStore.deposits];
    },

    async updateDepositStatus(orderNumber: string, status: string, notes?: string) {
      if (mongooseConn) {
        const doc = await DepositOrderModel.findOneAndUpdate(
          { orderNumber },
          { $set: { status, adminNotes: notes, completedAt: status === 'SUCCESS' ? new Date() : undefined } },
          { new: true }
        ).lean();
        return doc;
      }
      const idx = memoryStore.deposits.findIndex((d) => d.orderNumber === orderNumber);
      if (idx !== -1) {
        memoryStore.deposits[idx].status = status;
        if (notes) memoryStore.deposits[idx].adminNotes = notes;
        if (status === 'SUCCESS') memoryStore.deposits[idx].completedAt = new Date();
        return memoryStore.deposits[idx];
      }
      return null;
    },

    // WITHDRAWAL OPERATIONS
    async createWithdrawalOrder(data: any) {
      if (mongooseConn) {
        const doc = await WithdrawalOrderModel.create(data);
        return { ...doc.toObject(), id: doc._id.toString() };
      }
      const order = { id: `wd_${Date.now()}`, ...data, createdAt: new Date() };
      memoryStore.withdrawals.push(order);
      return order;
    },

    async getWithdrawalOrders(userId?: string) {
      if (mongooseConn) {
        const q = userId ? { userId } : {};
        const w = await WithdrawalOrderModel.find(q).sort({ createdAt: -1 }).lean();
        return w.map((x) => ({ ...x, id: x._id.toString() }));
      }
      if (userId) return memoryStore.withdrawals.filter((w) => w.userId === userId);
      return [...memoryStore.withdrawals];
    },

    // BILLS & TRANSACTIONS
    async getBillsByUserId(userId: string) {
      if (mongooseConn) {
        const b = await BillRecordModel.find({ userId }).sort({ createdAt: -1 }).lean();
        return b.map((x) => ({ ...x, id: x._id.toString() }));
      }
      return memoryStore.bills.filter((b) => b.userId === userId);
    },

    async addBillRecord(data: any) {
      if (mongooseConn) {
        const doc = await BillRecordModel.create(data);
        return { ...doc.toObject(), id: doc._id.toString() };
      }
      const record = { id: `bill_${Date.now()}`, ...data };
      memoryStore.bills.unshift(record);
      return record;
    },

    // CHAT MESSAGES
    async getChatMessages(userId: string) {
      if (mongooseConn) {
        const m = await ChatMessageModel.find({ userId }).sort({ createdAt: 1 }).lean();
        return m.map((x) => ({ ...x, id: x._id.toString() }));
      }
      return memoryStore.messages.filter((m) => m.userId === userId);
    },

    async addChatMessage(data: any) {
      if (mongooseConn) {
        const doc = await ChatMessageModel.create(data);
        return { ...doc.toObject(), id: doc._id.toString() };
      }
      const msg = { id: `msg_${Date.now()}`, ...data, createdAt: new Date() };
      memoryStore.messages.push(msg);
      return msg;
    },

    // ADMIN AUTH & AUDIT
    async findAdminByUsername(username: string) {
      if (mongooseConn) {
        const a = await AdminUserModel.findOne({ username }).lean();
        if (a) return { ...a, id: a._id.toString() };
      }
      return memoryStore.admins.find((a) => a.username === username) || null;
    },

    async addAuditLog(data: any) {
      if (mongooseConn) {
        await AuditLogModel.create(data);
      } else {
        memoryStore.auditLogs.unshift({ id: `audit_${Date.now()}`, ...data, createdAt: new Date() });
      }
    },

    async getAuditLogs() {
      if (mongooseConn) {
        const logs = await AuditLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
        return logs.map((l) => ({ ...l, id: l._id.toString() }));
      }
      return [...memoryStore.auditLogs];
    },

    // APP CONFIG
    getAppConfig() {
      return memoryStore.appConfig;
    },

    updateAppConfig(updates: any) {
      memoryStore.appConfig = { ...memoryStore.appConfig, ...updates };
      return memoryStore.appConfig;
    },
  };
}
