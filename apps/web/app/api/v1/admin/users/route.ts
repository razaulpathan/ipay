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
    const users = await ds.getAllUsers();

    // Map safe user profiles
    const safeUsers = users.map((u) => ({
      id: u.id,
      userId: u.userId,
      phone: u.phone,
      balance: u.balance,
      totalDeposit: u.totalDeposit,
      totalWithdrawal: u.totalWithdrawal,
      isUpiBound: u.isUpiBound,
      status: u.status,
      failedSecondaryAttempts: u.failedSecondaryAttempts,
      isSecondaryLocked: u.isSecondaryLocked,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      success: true,
      users: safeUsers,
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
    const { userId, status, balanceAdjustment, unlockSecondary } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const ds = await getDataService();
    const user = await ds.findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updates: any = {};
    if (status && ['ACTIVE', 'FROZEN', 'BANNED'].includes(status)) {
      updates.status = status;
    }

    if (unlockSecondary) {
      updates.failedSecondaryAttempts = 0;
      updates.isSecondaryLocked = false;
    }

    if (balanceAdjustment !== undefined && !isNaN(Number(balanceAdjustment))) {
      const adj = Number(balanceAdjustment);
      updates.balance = Math.max(0, user.balance + adj);
      await ds.addBillRecord({
        userId: user.userId,
        type: adj >= 0 ? 'Admin_Credit' : 'Admin_Debit',
        amount: Math.abs(adj),
        isPositive: adj >= 0,
        balanceAfter: updates.balance,
        createdAt: new Date().toLocaleTimeString('en-GB') + ' ' + new Date().toLocaleDateString('en-GB'),
      });
    }

    const updatedUser = await ds.updateUser(userId, updates);

    await ds.addAuditLog({
      adminUsername: admin.username,
      action: 'UPDATE_USER',
      targetId: userId,
      details: JSON.stringify(updates),
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (err: any) {
    console.error('Admin update user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
