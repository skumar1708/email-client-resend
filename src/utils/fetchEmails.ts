import { supabase } from './supabaseClient';
import { Email } from '../components/EmailList';

export async function fetchEmailsForFolder(userId: string, folder: string): Promise<Email[]> {
  // Fetch emails for the user and folder from Supabase
  const { data, error } = await supabase
    .from('email_status')
    .select(`
      email_id,
      is_read,
      emails:email_id (
        id,
        from_email,
        subject,
        body,
        sent_at
      )
    `)
    .eq('user_id', userId)
    .eq('folder', folder);

  if (error) {
    console.error('Error fetching emails:', error);
    return [];
  }

  // Map to EmailList type and sort by date descending
  return (data || [])
    .map((row: any) => ({
      id: row.emails.id,
      from: row.emails.from_email,
      subject: row.emails.subject,
      snippet: row.emails.body?.slice(0, 80) || '',
      date: row.emails.sent_at?.slice(0, 10) || '',
      unread: !row.is_read,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
