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
    const withdrawals = await ds.getWithdrawalOrders();

    return NextResponse.json({
      success: true,
      withdrawals,
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
    const { orderNumber, action, reason } = body; // action: 'APPROVE' or 'REJECT'

    if (!orderNumber || !action) {
      return NextResponse.json({ error: 'Order number and action required' }, { status: 400 });
    }

    const ds = await getDataService();
    const withdrawals = await ds.getWithdrawalOrders();
    const order = withdrawals.find((w) => w.orderNumber === orderNumber);

    if (!order) {
      return NextResponse.json({ error: 'Withdrawal order not found' }, { status: 404 });
    }

    if (action === 'REJECT') {
      // Refund balance to user
      const user = await ds.findUserById(order.userId);
      if (user) {
        const refundedBalance = user.balance + order.amount;
        const newPending = Math.max(0, (user.pendingWithdrawal || 0) - order.amount);
        await ds.updateUser(user.userId, {
          balance: refundedBalance,
          pendingWithdrawal: newPending,
        });

        await ds.addBillRecord({
          userId: user.userId,
          type: 'Withdrawal_Refund',
          amount: order.amount,
          isPositive: true,
          balanceAfter: refundedBalance,
          createdAt: new Date().toLocaleTimeString('en-GB') + ' ' + new Date().toLocaleDateString('en-GB'),
        });
      }
    } else if (action === 'APPROVE') {
      const user = await ds.findUserById(order.userId);
      if (user) {
        const newTotal = (user.totalWithdrawal || 0) + order.amount;
        const newPending = Math.max(0, (user.pendingWithdrawal || 0) - order.amount);
        await ds.updateUser(user.userId, {
          totalWithdrawal: newTotal,
          pendingWithdrawal: newPending,
        });
      }
    }

    await ds.addAuditLog({
      adminUsername: admin.username,
      action: `WITHDRAWAL_${action}`,
      targetId: orderNumber,
      details: reason || `Admin marked withdrawal as ${action}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal order marked as ${action === 'APPROVE' ? 'SUCCESS' : 'REJECTED'}`,
    });
  } catch (err: any) {
    console.error('Admin withdrawal review error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
