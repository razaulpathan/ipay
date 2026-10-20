export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ds = await getDataService();
    const user = await ds.findUserById(userPayload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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
      user: userProfile,
    });
  } catch (err: any) {
    console.error('Me error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
