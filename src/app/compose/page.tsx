"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import MailSidebar from '../../components/MailSidebar';
import { useAuth } from '../../contexts/AuthContext';

export default function ComposePage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('body', body);
    if (attachment) formData.append('attachment', attachment);
    if (user?.id) formData.append('userId', user.id);
    const res = await fetch('/api/send', {
      method: 'POST',
      body: formData,
    });
    setSending(false);
    if (res.ok) {
      setSuccess('Email sent!');
      setTimeout(() => router.push('/sent'), 1500);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to send email');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <MailSidebar />
        <main className="flex-1 p-8 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Compose Email</h1>
          <form onSubmit={handleSend} className="w-full max-w-xl bg-white rounded shadow p-8 flex flex-col gap-4">
            <input
              type="email"
              placeholder="To"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Message"
              value={body}
              onChange={e => setBody(e.target.value)}
              className="border p-2 rounded min-h-[120px]"
              required
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => setAttachment(e.target.files?.[0] || null)}
              className="border p-2 rounded"
              accept="*"
            />
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
