export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, purpose } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Generate 4-digit code (e.g., 3133 or random)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`[OTP] Generated verification code for ${phone} (${purpose || 'BINDING'}): ${code}`);

    // If external SMS provider configured in ENV (e.g. Twilio/Msg91), trigger here
    // Otherwise return success
    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      // Provide in response for development / automated testing convenience
      testCode: code,
    });
  } catch (err: any) {
    console.error('OTP error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
