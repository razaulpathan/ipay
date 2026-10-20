export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';
import { APP_CONFIG } from '@/lib/shared';

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ds = await getDataService();
    const user = await ds.findUserById(userPayload.userId);
    const config = ds.getAppConfig();

    const emptyPeriod = {
      teamDeposit: 0,
      commission: 0,
      successOrder: 0,
      activeUser: 0,
      newUser: 0,
    };

    const teamData = {
      totalDeposit: 0,
      teamCommission: user?.teamCommission || 0,
      totalSuccessOrder: 0,
      totalUser: 0,
      periods: {
        today: { ...emptyPeriod },
        yesterday: { ...emptyPeriod },
        weekly: { ...emptyPeriod },
        monthly: { ...emptyPeriod },
      },
      shareLink: `https://share.ipaynow.net/?data=${user?.referralCode || 'dwkPTEzMzQyOSZjaGFuk'}`,
      reports: [
        { level: 'Level A', number: 0, proportion: '0.2%', earn: 0 },
        { level: 'Level B', number: 0, proportion: '0.05%', earn: 0 },
      ],
    };

    return NextResponse.json({
      success: true,
      teamData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
