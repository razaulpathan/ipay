export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handles proof upload simulation / base64 storage
    // Returns a permanent URL or mock receipt URL
    const proofUrl = `/uploads/proof_${Date.now()}_${userPayload.userId}.jpg`;

    return NextResponse.json({
      success: true,
      message: 'Upload success',
      proofUrl,
    });
  } catch (err: any) {
    console.error('Proof upload error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
