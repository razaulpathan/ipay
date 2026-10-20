export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    const ds = await getDataService();
    const user = userPayload ? await ds.findUserById(userPayload.userId) : null;

    const isUpiBound = user?.isUpiBound || false;

    const tasks = [
      {
        id: 'task_upi_phonepe',
        title: 'Bind UPI Task (1 INR)',
        rewardAmount: 1,
        subtitle: 'Bind Phonepe UPI',
        buttonText: isUpiBound ? 'Completed' : 'Go To Bind',
        icon: 'phonepe',
        isHot: true,
        status: isUpiBound ? 'COMPLETED' : 'AVAILABLE',
        category: 'UPI',
      },
      {
        id: 'task_telegram',
        title: 'Join Telegram (10 INR)',
        rewardAmount: 10,
        subtitle: 'Subscribe to our telegram channel',
        buttonText: 'Completed',
        icon: 'telegram',
        status: 'COMPLETED', // Already completed in recording
        category: 'TELEGRAM',
      },
      {
        id: 'task_payment',
        title: 'Payment Task (30 INR)',
        rewardAmount: 30,
        subtitle: 'Complete a payment and make a purchase',
        buttonText: 'Participate Now',
        icon: 'payment',
        status: 'AVAILABLE',
        category: 'PAYMENT',
      },
      {
        id: 'task_service',
        title: 'Contact Service (15 INR)',
        rewardAmount: 15,
        subtitle: 'Send a message to customer service',
        buttonText: 'Send Now',
        icon: 'service',
        status: 'AVAILABLE',
        category: 'SERVICE',
      },
      {
        id: 'task_upi_other',
        title: 'Bind UPI Task (25 INR)',
        rewardAmount: 25,
        subtitle: 'Bind Freecharge/Mobikwik or other UPI',
        buttonText: 'Go To Bind',
        icon: 'wallet',
        status: 'AVAILABLE',
        category: 'UPI',
      },
    ];

    const rewardProgress = {
      currentReward: 0,
      countdownSeconds: 51228, // 14:13:48 countdown
      quota: user?.balance || 0,
      milestones: [
        { target: '4K', coins: 10 },
        { target: '10K', coins: 20 },
        { target: '30K', coins: 30 },
        { target: '50K', coins: 50 },
        { target: '100K', coins: 80 },
        { target: '200K', coins: 100 },
      ],
    };

    return NextResponse.json({
      success: true,
      tasks,
      rewardProgress,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
