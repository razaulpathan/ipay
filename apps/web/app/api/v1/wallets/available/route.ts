export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_WALLET_PROVIDERS } from '@/lib/shared';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      providers: DEFAULT_WALLET_PROVIDERS,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
