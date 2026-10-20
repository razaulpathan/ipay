export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { newPassword, confirmNewPassword, otp } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // In production, verify OTP code; in test/demo, accept 4-digit code e.g. 1234 or generated OTP
    if (!otp) {
      return NextResponse.json({ error: 'Please enter verification OTP' }, { status: 400 });
    }

    const ds = await getDataService();
    const passwordHash = await hashPassword(newPassword);
    await ds.updateUser(userPayload.userId, { passwordHash });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err: any) {
    console.error('Password change error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
