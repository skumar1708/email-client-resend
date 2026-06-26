import { supabase } from './supabaseClient';
import { Email } from '../components/EmailList';

export async function fetchEmailsForFolder(address: string, folder: string): Promise<Email[]> {
  // Fetch emails for the selected address and folder from Supabase
  const { data, error } = await supabase
    .from('email_status')
    .select(`
      email_id,
      is_read,
      emails:email_id (
        id,
        from_email,
        to_emails,
        subject,
        body,
        html_body,
        sent_at
      )
    `)
    .eq('folder', folder);

  if (error) {
    console.error('Error fetching emails:', error);
    return [];
  }

  // Filter and map emails
  const emails = (data || [])
    .filter((row: any) =>
      row.emails.from_email === address || (row.emails.to_emails || []).includes(address)
    )
    .map((row: any) => ({
      id: row.emails.id,
      from: row.emails.from_email,
      subject: row.emails.subject,
      snippet: row.emails.body?.slice(0, 80) || '',
      date: row.emails.sent_at?.slice(0, 10) || '',
      unread: !row.is_read,
      body: row.emails.body || '',
      html_body: row.emails.html_body || '',
      to_emails: row.emails.to_emails || [],
    }));

  // Deduplicate by id
  const uniqueEmails = Object.values(
    emails.reduce((acc: Record<string, Email>, email) => {
      acc[email.id] = email;
      return acc;
    }, {})
  ) as Email[];

  return uniqueEmails.sort((a, b) => (a.date < b.date ? 1 : -1));
}
