export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';
import { DEFAULT_QUOTA_PACKAGES } from '@/lib/shared';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { packageId, amount } = body;

    const pkg = DEFAULT_QUOTA_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package selected' }, { status: 400 });
    }

    const buyAmount = Number(amount) || pkg.minAmount;
    if (buyAmount < pkg.minAmount || buyAmount > pkg.maxAmount) {
      return NextResponse.json(
        { error: `Amount must be between ${pkg.minAmount} and ${pkg.maxAmount} INR` },
        { status: 400 }
      );
    }

    const ds = await getDataService();
    const user = await ds.findUserById(userPayload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orderNumber = `INR${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

    const order = await ds.createDepositOrder({
      orderNumber,
      userId: user.userId,
      type: 'INR',
      amount: buyAmount,
      amountInr: buyAmount,
      packageId: pkg.id,
      status: 'PENDING',
    });

    return NextResponse.json({
      success: true,
      message: 'Deposit order created successfully',
      order,
    });
  } catch (err: any) {
    console.error('INR buy error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
