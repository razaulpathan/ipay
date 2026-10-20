export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { oldSecondaryPassword, newSecondaryPassword, confirmSecondaryPassword } = body;

    if (!newSecondaryPassword || newSecondaryPassword.length < 4) {
      return NextResponse.json({ error: 'Secondary password must be at least 4 digits' }, { status: 400 });
    }

    if (newSecondaryPassword !== confirmSecondaryPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const ds = await getDataService();
    const user = await ds.findUserById(userPayload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (oldSecondaryPassword) {
      const isMatch = await comparePassword(oldSecondaryPassword, user.secondaryPasswordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current secondary password is incorrect' }, { status: 400 });
      }
    }

    const secondaryPasswordHash = await hashPassword(newSecondaryPassword);
    await ds.updateUser(userPayload.userId, {
      secondaryPasswordHash,
      failedSecondaryAttempts: 0,
      isSecondaryLocked: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Secondary password updated successfully',
    });
  } catch (err: any) {
    console.error('Secondary password update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
