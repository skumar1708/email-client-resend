"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import MailSidebar from '../../components/MailSidebar';
import EmailList, { Email } from '../../components/EmailList';
import EmailDetail from '../../components/EmailDetail';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchEmailsForFolder } from '../../utils/fetchEmails';
import { fetchDomainEmails } from '../../utils/fetchDomainEmails';

export default function LabelsPage() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  // Fetch all domain addresses on mount
  useEffect(() => {
    fetchDomainEmails('shulkpro.in').then(addrs => {
      setAddresses(addrs);
      if (addrs.length > 0) setSelectedAddress(addrs[0]);
    });
  }, []);

  // Fetch emails for selected address (using inbox for now)
  const fetchAndSetEmails = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    const emails = await fetchEmailsForFolder(selectedAddress, 'inbox');
    setEmails(emails);
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetEmails();
  }, [selectedAddress]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetch('/api/sync-resend-emails', { method: 'POST' });
    await fetchAndSetEmails();
    setLoading(false);
  };

  const selectedEmail = emails.find(e => e.id === selectedId) || null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <MailSidebar selectedAddress={selectedAddress} onAddressChange={setSelectedAddress} />
        <main className="flex-1 p-8 flex gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Labels</h1>
              <button
                onClick={handleRefresh}
                className="ml-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold shadow hover:bg-blue-200 transition-colors disabled:opacity-50"
                disabled={loading}
                title="Refresh from Resend"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : (
              <EmailList onSelect={setSelectedId} selectedId={selectedId} emails={emails} />
            )}
          </div>
          <EmailDetail email={selectedEmail} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
