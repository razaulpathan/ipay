export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/shared';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amountUsdt, withdrawalAddress } = body;

    const amountNum = Number(amountUsdt);
    if (!amountNum || amountNum < 10) {
      return NextResponse.json(
        { error: 'The recharge amount cannot be less than 10 USDT' },
        { status: 400 }
      );
    }

    if (!withdrawalAddress || withdrawalAddress.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter the withdrawal wallet address.' },
        { status: 400 }
      );
    }

    const ds = await getDataService();
    const config = ds.getAppConfig();
    const ratio = config.usdtRatio || 109;
    const amountInr = amountNum * ratio;
    const orderNumber = `USDT${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const order = await ds.createDepositOrder({
      orderNumber,
      userId: userPayload.userId,
      type: 'USDT',
      amount: amountNum,
      amountInr,
      usdtRatio: ratio,
      walletAddress: withdrawalAddress.trim(),
      status: 'PENDING',
    });

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        amountUsdt: amountNum,
        amountInr,
        usdtRatio: ratio,
        depositAddress: config.trc20DepositAddress || APP_CONFIG.trc20DepositAddress,
        network: 'Tron(TRC20)',
        expiresInSeconds: 3600, // 60 minutes countdown
      },
    });
  } catch (err: any) {
    console.error('USDT initiate error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
