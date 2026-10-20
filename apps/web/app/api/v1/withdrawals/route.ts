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
    const withdrawals = await ds.getWithdrawalOrders(userPayload.userId);

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    // Exact check: if UPI is not bound, return abnormal warning
    if (!user.isUpiBound) {
      return NextResponse.json(
        {
          error: 'ABNORMAL_ORDER',
          message:
            '1. This order is abnormal.\n\n2. Please verify your UPI status and contact customer service promptly.\n\n⚠️ Note:\nFailure to respond in a timely manner will result in automatic order failure. Funds will not be credited, and any losses incurred shall be borne by yourself.',
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { amount, upiId } = body;
    const amountNum = Number(amount);

    if (!amountNum || amountNum <= 0) {
      return NextResponse.json({ error: 'Please enter a valid withdrawal amount' }, { status: 400 });
    }

    if (amountNum > user.balance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    const orderNumber = `WD${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const order = await ds.createWithdrawalOrder({
      orderNumber,
      userId: user.userId,
      amount: amountNum,
      upiId: upiId || user.phone,
      status: 'PENDING',
    });

    // Deduct balance and update pending withdrawal
    await ds.updateUser(user.userId, {
      balance: user.balance - amountNum,
      pendingWithdrawal: (user.pendingWithdrawal || 0) + amountNum,
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted',
      order,
    });
  } catch (err: any) {
    console.error('Withdrawal error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
