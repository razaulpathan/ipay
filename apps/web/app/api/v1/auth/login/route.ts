export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { comparePassword, signUserToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({ error: 'Account or password error' }, { status: 400 });
    }

    const ds = await getDataService();
    // Normalize phone (strip +91 if provided)
    const cleanPhone = phone.replace(/^\+91/, '').trim();
    const user = await ds.findUserByPhone(cleanPhone);

    if (!user) {
      return NextResponse.json({ error: 'Account or password error' }, { status: 400 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Account or password error' }, { status: 400 });
    }

    if (user.status === 'BANNED' || user.status === 'FROZEN') {
      return NextResponse.json({ error: 'Account is frozen or locked. Contact customer service.' }, { status: 403 });
    }

    const token = signUserToken({
      userId: user.userId,
      phone: user.phone,
      role: 'USER',
    });

    const userProfile = {
      id: user.id,
      userId: user.userId,
      phone: user.phone,
      phoneMasked: `${user.phone.substring(0, 2)}*****${user.phone.substring(user.phone.length - 4)}`,
      balance: user.balance,
      totalEarnings: user.totalEarnings,
      totalBonus: user.totalBonus,
      totalDeposit: user.totalDeposit,
      totalWithdrawal: user.totalWithdrawal,
      todayDeposit: user.todayDeposit,
      todayWithdrawal: user.todayWithdrawal,
      todayEarnings: user.todayEarnings,
      todayBonus: user.todayBonus,
      teamCommission: user.teamCommission,
      performanceQuota: user.performanceQuota,
      performanceQuotaMax: user.performanceQuotaMax,
      pendingDeposit: user.pendingDeposit,
      lockingDeposit: user.lockingDeposit,
      pendingWithdrawal: user.pendingWithdrawal,
      lockingWithdrawal: user.lockingWithdrawal,
      isUpiBound: user.isUpiBound,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
