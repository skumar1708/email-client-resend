import { NextRequest, NextResponse } from 'next/server';
import { syncAllResendEmails } from '../../../server/syncResendEmails';

export async function POST(req: NextRequest) {
  try {
    const result = await syncAllResendEmails();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Sync failed' }, { status: 500 });
  }
}
