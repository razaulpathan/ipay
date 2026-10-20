export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_QUOTA_PACKAGES } from '@ipay/shared';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      packages: DEFAULT_QUOTA_PACKAGES,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
