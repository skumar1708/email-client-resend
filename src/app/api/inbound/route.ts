import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../utils/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Resend inbound webhook payload structure
    // See: https://resend.com/docs/inbound-emails/webhooks
    const {
      from,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
      attachments,
      headers,
      date,
      messageId,
      inReplyTo,
    } = body;

    // Insert email into emails table
    const { data: emailRow, error: emailError } = await supabaseAdmin
      .from('emails')
      .insert({
        from_email: from,
        to_emails: Array.isArray(to) ? to : [to],
        cc_emails: cc ? (Array.isArray(cc) ? cc : [cc]) : [],
        bcc_emails: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [],
        subject,
        body: text,
        html_body: html,
        sent_at: date || new Date().toISOString(),
        in_reply_to: inReplyTo || null,
      })
      .select()
      .single();

    if (emailError) {
      return NextResponse.json({ error: emailError.message }, { status: 500 });
    }

    // Insert into email_status for each recipient (inbox)
    if (emailRow?.id && Array.isArray(to)) {
      const statusRows = to.map((recipient: string) => ({
        email_id: emailRow.id,
        // You may want to map recipient email to user_id if you have users for each
        user_id: null, // Set to null or look up user by email
        folder: 'inbox',
        is_read: false,
      }));
      await supabaseAdmin.from('email_status').insert(statusRows);
    }

    // TODO: Save attachments to Supabase Storage and link in attachments table

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
