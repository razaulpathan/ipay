export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDataService } from '@/lib/dataService';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    const userId = userPayload ? userPayload.userId : '113429';

    const ds = await getDataService();
    const messages = await ds.getChatMessages(userId);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    const userId = userPayload ? userPayload.userId : '113429';

    const body = await req.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const ds = await getDataService();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    // Add user's message
    const userMsg = await ds.addChatMessage({
      userId,
      sender: 'USER',
      text: text.trim(),
      status: 'SENT',
      timestamp: timeStr,
      dateStr,
    });

    // Automated smart assistant response if needed
    setTimeout(async () => {
      try {
        await ds.addChatMessage({
          userId,
          sender: 'AGENT',
          text: 'Thank you for reaching out to 24/7 Customer Service. An agent is reviewing your query.',
          status: 'SENT',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
          dateStr,
        });
      } catch (e) {}
    }, 1500);

    return NextResponse.json({
      success: true,
      message: userMsg,
    });
  } catch (err: any) {
    console.error('Support message error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
