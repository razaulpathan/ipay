export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';

export async function GET(req: NextRequest) {
  try {
    const ds = await getDataService();
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'iPay Backend API',
      database: ds.isMongo ? 'MongoDB Atlas (Connected)' : 'In-Memory Store (Zero-Config Active)',
      version: '1.0.32',
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'degraded', error: err.message }, { status: 500 });
  }
}
