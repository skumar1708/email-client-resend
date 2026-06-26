import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../utils/supabaseAdmin';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.RESEND_DOMAIN ? `no-reply@${process.env.RESEND_DOMAIN}` : 'no-reply@example.com';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const body = formData.get('body') as string;
    const attachment = formData.get('attachment') as File | null;
    // Optionally, get userId from session/cookie if available
    const userId = formData.get('userId') as string | undefined;

    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let attachments = [];
    if (attachment) {
      const arrayBuffer = await attachment.arrayBuffer();
      attachments.push({
        filename: attachment.name,
        content: Buffer.from(arrayBuffer),
      });
    }

    const emailData: any = {
      from: fromAddress,
      to,
      subject,
      html: `<div>${body.replace(/\n/g, '<br/>')}</div>`
    };
    if (attachments.length > 0) {
      emailData.attachments = attachments;
    }

    const data = await resend.emails.send(emailData);
    if (data.error) {
      return NextResponse.json({ error: data.error.message || 'Failed to send email' }, { status: 500 });
    }

    // Save sent email to Supabase
    const { data: emailRow, error: emailError } = await supabaseAdmin
      .from('emails')
      .insert({
        from_email: fromAddress,
        to_emails: [to],
        subject,
        body,
        sent_at: new Date().toISOString(),
        is_draft: false,
      })
      .select()
      .single();

    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 500 });
    }

    // Insert into email_status for the sender (in Sent folder)
    if (userId && emailRow?.id) {
      await supabaseAdmin.from('email_status').insert({
        email_id: emailRow.id,
        user_id: userId,
        folder: 'sent',
        is_read: true,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
