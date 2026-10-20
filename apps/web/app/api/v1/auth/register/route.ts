export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { hashPassword, signUserToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password, referralCode } = body;

    if (!phone || !password) {
      return NextResponse.json({ error: 'Please enter phone number and password' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/^\+91/, '').trim();
    const ds = await getDataService();
    const existing = await ds.findUserByPhone(cleanPhone);

    if (existing) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const secondaryPasswordHash = await hashPassword('2621'); // default secondary password
    const userId = Math.floor(100000 + Math.random() * 900000).toString();
    const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newUser = await ds.createUser({
      userId,
      phone: cleanPhone,
      passwordHash,
      secondaryPasswordHash,
      failedSecondaryAttempts: 0,
      isSecondaryLocked: false,
      balance: 10, // 10 INR initial welcome bonus
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
      referralCode: newReferralCode,
      invitedBy: referralCode || null,
      status: 'ACTIVE',
      createdAt: new Date(),
    });

    const token = signUserToken({
      userId: newUser.userId,
      phone: newUser.phone,
      role: 'USER',
    });

    const userProfile = {
      id: newUser.id,
      userId: newUser.userId,
      phone: newUser.phone,
      phoneMasked: `${newUser.phone.substring(0, 2)}*****${newUser.phone.substring(newUser.phone.length - 4)}`,
      balance: newUser.balance,
      totalEarnings: newUser.totalEarnings,
      totalBonus: newUser.totalBonus,
      totalDeposit: newUser.totalDeposit,
      totalWithdrawal: newUser.totalWithdrawal,
      todayDeposit: newUser.todayDeposit,
      todayWithdrawal: newUser.todayWithdrawal,
      todayEarnings: newUser.todayEarnings,
      todayBonus: newUser.todayBonus,
      teamCommission: newUser.teamCommission,
      performanceQuota: newUser.performanceQuota,
      performanceQuotaMax: newUser.performanceQuotaMax,
      pendingDeposit: newUser.pendingDeposit,
      lockingDeposit: newUser.lockingDeposit,
      pendingWithdrawal: newUser.pendingWithdrawal,
      lockingWithdrawal: newUser.lockingWithdrawal,
      isUpiBound: newUser.isUpiBound,
      referralCode: newUser.referralCode,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
