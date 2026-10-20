export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest, comparePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { secondaryPassword } = body;

    if (!secondaryPassword) {
      return NextResponse.json({ error: 'Please enter verify password' }, { status: 400 });
    }

    const ds = await getDataService();
    const user = await ds.findUserById(userPayload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isSecondaryLocked) {
      return NextResponse.json(
        { error: 'Secondary password operations are locked due to repeated errors. Contact customer service.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(secondaryPassword, user.secondaryPasswordHash);
    if (!isMatch) {
      const attempts = (user.failedSecondaryAttempts || 0) + 1;
      const remaining = Math.max(0, 3 - attempts);
      const isLocked = remaining === 0;

      await ds.updateUser(user.userId, {
        failedSecondaryAttempts: attempts,
        isSecondaryLocked: isLocked,
      });

      return NextResponse.json(
        {
          error: `Wrong secondary password. ${remaining} attempt(s) remaining. Repeated errors lock operations.`,
          remainingAttempts: remaining,
        },
        { status: 400 }
      );
    }

    // Reset failed attempts on success
    await ds.updateUser(user.userId, { failedSecondaryAttempts: 0 });

    return NextResponse.json({
      success: true,
      message: 'Password verified successfully',
    });
  } catch (err: any) {
    console.error('Verify secondary error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
