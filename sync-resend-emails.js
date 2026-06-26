import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function upsertEmailToSupabase(email, folder = 'sent') {
  const to_emails = Array.isArray(email.to) ? email.to : [email.to];
  const cc_emails = Array.isArray(email.cc) ? email.cc : (email.cc ? [email.cc] : []);
  const bcc_emails = Array.isArray(email.bcc) ? email.bcc : (email.bcc ? [email.bcc] : []);

  const { error: emailError } = await supabase
    .from('emails')
    .upsert({
      id: email.id,
      from_email: email.from,
      to_emails,
      cc_emails,
      bcc_emails,
      subject: email.subject,
      body: email.text || '',
      html_body: email.html || '',
      sent_at: email.created_at || email.sent_at,
      is_draft: false,
    });

  if (emailError) {
    console.error(`Error inserting email ${email.id}:`, emailError.message);
    return;
  }

  await supabase.from('email_status').upsert({
    email_id: email.id,
    user_id: null,
    folder,
    is_read: folder === 'sent',
  });

  console.log(`Synced (${folder}) email: ${email.subject} (${email.id})`);
}

export async function syncSentEmails() {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await resend.emails.list({ page, limit: 50 });
    if (error) {
      console.error('Error fetching sent emails:', error);
      break;
    }
    if (!data || !data.data || data.data.length === 0) {
      hasMore = false;
      break;
    }
    for (const emailMeta of data.data) {
      const { data: fullEmail, error: getError } = await resend.emails.get(emailMeta.id);
      if (getError) {
        console.error(`Error fetching sent email ${emailMeta.id}:`, getError.message);
        continue;
      }
      await upsertEmailToSupabase(fullEmail, 'sent');
    }
    hasMore = data.data.length === 50;
    page++;
  }
  console.log('Sent emails sync complete.');
}

export async function syncReceivedEmails() {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await resend.emails.receiving.list({ page, limit: 50 });
    if (error) {
      console.error('Error fetching received emails:', error);
      break;
    }
    if (!data || !data.data || data.data.length === 0) {
      hasMore = false;
      break;
    }
    for (const emailMeta of data.data) {
      const { data: fullEmail, error: getError } = await resend.emails.receiving.get(emailMeta.id);
      if (getError) {
        console.error(`Error fetching received email ${emailMeta.id}:`, getError.message);
        continue;
      }
      await upsertEmailToSupabase(fullEmail, 'inbox');
    }
    hasMore = data.data.length === 50;
    page++;
  }
  console.log('Received emails sync complete.');
}

// Run both if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await syncSentEmails();
    await syncReceivedEmails();
  })();
}
