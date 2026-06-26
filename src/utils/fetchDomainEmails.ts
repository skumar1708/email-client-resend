import { supabase } from './supabaseClient';

export async function fetchDomainEmails(domain: string): Promise<string[]> {
  // Get all unique email addresses (from and to_emails) for the domain
  const { data: fromData } = await supabase
    .from('emails')
    .select('from_email')
    .ilike('from_email', `%@${domain}`);

  const { data: toData } = await supabase
    .from('emails')
    .select('to_emails')
    .contains('to_emails', [`@${domain}`]);

  // Flatten and deduplicate
  const fromEmails = (fromData || []).map((row: any) => row.from_email);
  const toEmails = (toData || []).flatMap((row: any) => row.to_emails || []);
  const all = [...fromEmails, ...toEmails].filter(e => e && e.endsWith(`@${domain}`));
  return Array.from(new Set(all));
}
