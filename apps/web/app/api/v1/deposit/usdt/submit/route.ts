export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderNumber, txidOrHash, proofUrl } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    if (!txidOrHash || txidOrHash.trim().length === 0) {
      return NextResponse.json({ error: '*Please enter Txid or Hash(Must)' }, { status: 400 });
    }

    const ds = await getDataService();
    const updated = await ds.updateDepositStatus(orderNumber, 'PENDING', `Submitted Hash: ${txidOrHash.trim()}`);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Deposit proof submitted. Please wait 3-5 minutes for verification.',
      order: updated,
    });
  } catch (err: any) {
    console.error('USDT submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
