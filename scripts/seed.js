const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipay';

async function seedDatabase() {
  console.log('[Seed] Connecting to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to database');

    const db = mongoose.connection.db;

    // Hash passwords
    const userPassHash = await bcrypt.hash('King2141', 10);
    const secondaryHash = await bcrypt.hash('2621', 10);
    const adminPassHash = await bcrypt.hash('Admin@iPay2026!#', 10);

    // 1. Seed Users
    const usersCol = db.collection('users');
    await usersCol.deleteMany({ phone: '9794678059' });
    await usersCol.insertOne({
      userId: '113429',
      phone: '9794678059',
      passwordHash: userPassHash,
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
      updatedAt: new Date(),
    });
    console.log('[Seed] User 9794678059 (ID: 113429) seeded.');

    // 2. Seed Admin Users
    const adminsCol = db.collection('adminusers');
    await adminsCol.deleteMany({ username: 'admin' });
    await adminsCol.insertOne({
      username: 'admin',
      passwordHash: adminPassHash,
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date(),
    });
    console.log('[Seed] Master Admin "admin" seeded.');

    // 3. Seed Bill Records
    const billsCol = db.collection('billrecords');
    await billsCol.deleteMany({ userId: '113429' });
    await billsCol.insertOne({
      userId: '113429',
      type: 'Bonus_Join telegram',
      amount: 10,
      isPositive: true,
      balanceAfter: 10,
      createdAt: new Date('2026-10-19T23:13:58Z'),
    });
    console.log('[Seed] Sample Telegram reward bill record seeded.');

    // 4. Seed Chat Messages
    const chatCol = db.collection('chatmessages');
    await chatCol.deleteMany({ userId: '113429' });
    await chatCol.insertMany([
      {
        userId: '113429',
        sender: 'SYSTEM',
        text: `Event Reward Settings:\nJoin Telegram channel: 15 Rupees\nContact customer service: 15 Rupees\nLink PhonePe UPI: 10 Rupees\nLink MobiKwik or other UPI: 25 Rupees\nComplete first payment-on-behalf transaction: 30 Rupees\nTotal rewards: 95 Rupees\nProfit per completed order: 4% of the order amount\nSummary:\nUpon completing a first payment-on-behalf transaction of 100 Rupees, the actual withdrawable amount is 202 Rupees.`,
        status: 'READ',
        createdAt: new Date('2026-10-19T23:12:27Z'),
      },
      {
        userId: '113429',
        sender: 'USER',
        text: 'Hello',
        status: 'READ',
        createdAt: new Date('2026-10-19T23:14:56Z'),
      },
      {
        userId: '113429',
        sender: 'USER',
        text: 'I want to colab with you i will launch my own platform like you but I need orders',
        status: 'READ',
        createdAt: new Date('2026-10-19T23:15:22Z'),
      },
      {
        userId: '113429',
        sender: 'AGENT',
        text: 'What does it mean, and how would the cooperation work?',
        status: 'READ',
        createdAt: new Date('2026-10-20T07:06:44Z'),
      },
    ]);
    console.log('[Seed] Customer service chat history seeded.');

    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed] Seeding error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
