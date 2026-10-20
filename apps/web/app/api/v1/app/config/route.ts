export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { APP_CONFIG } from '@ipay/shared';

export async function GET(req: NextRequest) {
  try {
    const ds = await getDataService();
    const config = ds.getAppConfig();

    const banners = [
      {
        id: 'banner_invite',
        title: '100+50 Reward',
        subtitle: 'Invite new users to finish 15 orders the same day Valid for 1 days; expires afterward',
        actionText: 'Invite Now',
        imageUrl: '/images/banner_invite_reward.jpg',
        route: 'RewardPromoModal',
      },
      {
        id: 'banner_notice',
        title: 'Important Notice',
        subtitle: 'You shall bear all losses arising from non-compliant operations',
        actionText: 'Go to Check',
        imageUrl: '/images/banner_important_notice.jpg',
        route: 'ImportantNoticeModal',
      },
      {
        id: 'banner_payment',
        title: 'Payment rewards',
        subtitle: 'Every successful purchase order will receive additional rewards and earn more.',
        actionText: 'Earn Now',
        imageUrl: '/images/banner_payment_rewards.jpg',
        route: 'Deposit',
      },
    ];

    return NextResponse.json({
      success: true,
      config: {
        ...APP_CONFIG,
        ...config,
      },
      banners,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
