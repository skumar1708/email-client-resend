"use client";
import ProtectedRoute from '../../components/ProtectedRoute';
import MailSidebar from '../../components/MailSidebar';
import EmailList, { Email } from '../../components/EmailList';
import EmailDetail from '../../components/EmailDetail';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchEmailsForFolder } from '../../utils/fetchEmails';

export default function LabelsPage() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // For now, fetch all inbox emails; label filtering can be added later
    fetchEmailsForFolder(user.id, 'inbox').then(emails => {
      setEmails(emails);
      setLoading(false);
    });
  }, [user]);

  const selectedEmail = emails.find(e => e.id === selectedId) || null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <MailSidebar />
        <main className="flex-1 p-8 flex gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">Labels</h1>
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
