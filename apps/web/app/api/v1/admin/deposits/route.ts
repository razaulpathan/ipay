export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ds = await getDataService();
    const deposits = await ds.getDepositOrders();

    return NextResponse.json({
      success: true,
      deposits,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderNumber, action, adminNotes } = body; // action: 'APPROVE' or 'REJECT'

    if (!orderNumber || !action) {
      return NextResponse.json({ error: 'Order number and action required' }, { status: 400 });
    }

    const ds = await getDataService();
    const orders = await ds.getDepositOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);

    if (!order) {
      return NextResponse.json({ error: 'Deposit order not found' }, { status: 404 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Order is not in pending status' }, { status: 400 });
    }

    const newStatus = action === 'APPROVE' ? 'SUCCESS' : 'REJECTED';
    const updated = await ds.updateDepositStatus(orderNumber, newStatus, adminNotes);

    if (action === 'APPROVE') {
      const user = await ds.findUserById(order.userId);
      if (user) {
        const creditedAmount = order.amountInr;
        const newBalance = user.balance + creditedAmount;
        const newTotalDeposit = (user.totalDeposit || 0) + creditedAmount;

        await ds.updateUser(user.userId, {
          balance: newBalance,
          totalDeposit: newTotalDeposit,
        });

        await ds.addBillRecord({
          userId: user.userId,
          type: `Deposit_${order.type}`,
          amount: creditedAmount,
          isPositive: true,
          balanceAfter: newBalance,
          createdAt: new Date().toLocaleTimeString('en-GB') + ' ' + new Date().toLocaleDateString('en-GB'),
        });
      }
    }

    await ds.addAuditLog({
      adminUsername: admin.username,
      action: `DEPOSIT_${action}`,
      targetId: orderNumber,
      details: `Admin ${admin.username} marked order ${orderNumber} as ${newStatus}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: `Deposit order marked as ${newStatus}`,
      order: updated,
    });
  } catch (err: any) {
    console.error('Admin deposit review error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
