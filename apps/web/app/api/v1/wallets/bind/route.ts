export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';
import { DEFAULT_WALLET_PROVIDERS } from '@ipay/shared';

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider, method, phoneNumber, otp } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Please choose a wallet provider' }, { status: 400 });
    }

    const providerConfig = DEFAULT_WALLET_PROVIDERS.find((p) => p.id === provider);
    if (!providerConfig) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    // Exact validation from recording: if provider has methods and none selected
    if (providerConfig.availableMethods.length > 0 && (!method || !providerConfig.availableMethods.includes(method))) {
      return NextResponse.json({ error: 'Please choose how to add.' }, { status: 400 });
    }

    const phoneToUse = phoneNumber || userPayload.phone;

    // Check if user submitted test OTP
    // In recording, OTP 3133 gave:
    // "Error occurred, please try again. Detail: kyc not completed: status=NOT_ACTIVATED"
    // We allow testing both the error response and successful binding
    if (otp === '3133') {
      return NextResponse.json(
        {
          error: 'Error occurred, please try again. Detail: kyc not completed: status=NOT_ACTIVATED',
        },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json({ error: 'Please enter OTP' }, { status: 400 });
    }

    const ds = await getDataService();
    const binding = await ds.addWalletBinding({
      userId: userPayload.userId,
      provider: providerConfig.id,
      providerName: providerConfig.name,
      method: method || 'APP',
      phoneNumber: phoneToUse,
      status: 'ACTIVE',
    });

    // Update user UPI bound status
    await ds.updateUser(userPayload.userId, { isUpiBound: true });

    // Also record reward if first time binding
    await ds.addBillRecord({
      userId: userPayload.userId,
      type: 'Bonus_Bind UPI',
      amount: 1,
      isPositive: true,
      balanceAfter: 11,
      createdAt: new Date().toLocaleTimeString('en-GB') + ' ' + new Date().toLocaleDateString('en-GB'),
    });

    return NextResponse.json({
      success: true,
      message: 'Wallet bound successfully',
      binding,
    });
  } catch (err: any) {
    console.error('Wallet bind error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
