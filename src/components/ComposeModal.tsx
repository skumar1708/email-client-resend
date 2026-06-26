import { useState, useRef, useEffect } from 'react';
import { HiX, HiPaperClip } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const shulkproAddresses = [
  'no-reply@shulkpro.in',
  'shravan@shulkpro.in',
  'info@shulkpro.in',
  'support@shulkpro.in',
];

export default function ComposeModal({ open, onClose, to: toProp = '', subject: subjectProp = '', body: bodyProp = '', replyMode = false }: {
  open: boolean;
  onClose: () => void;
  to?: string;
  subject?: string;
  body?: string;
  replyMode?: boolean;
}) {
  const [to, setTo] = useState(toProp);
  const [subject, setSubject] = useState(subjectProp);
  const [body, setBody] = useState(bodyProp);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(shulkproAddresses[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      setTo(toProp);
      setSubject(subjectProp);
      setBody(bodyProp);
    }
  }, [open, toProp, subjectProp, bodyProp]);

  if (!open) return null;

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
    // Optionally, use selectedAddress as the sender (from) if needed
    const res = await fetch('/api/send', {
      method: 'POST',
      body: formData,
    });
    setSending(false);
    if (res.ok) {
      setSuccess('Email sent!');
      setTimeout(() => {
        setTo(''); setSubject(''); setBody(''); setAttachment(null); setSuccess('');
        onClose();
      }, 1200);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to send email');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-40 max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-fade-in">
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <span className="font-semibold text-gray-800">{replyMode ? 'Reply' : 'New Message'}</span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><HiX className="w-6 h-6 text-gray-500" /></button>
      </div>
      <form onSubmit={handleSend} className="flex flex-col gap-3 px-6 py-4">
        <input
          type="email"
          placeholder="To"
          value={to}
          onChange={e => setTo(e.target.value)}
          className="border-b border-gray-200 focus:outline-none focus:border-blue-400 p-2 text-sm"
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="border-b border-gray-200 focus:outline-none focus:border-blue-400 p-2 text-sm"
          required
        />
        <textarea
          placeholder="Message"
          value={body}
          onChange={e => setBody(e.target.value)}
          className="border border-gray-200 rounded-lg p-2 min-h-[120px] focus:outline-none focus:border-blue-400 text-sm"
          required
        />
        <div className="flex items-center gap-2 mt-2">
          <label className="flex items-center cursor-pointer">
            <HiPaperClip className="w-5 h-5 text-gray-500 mr-1" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={e => setAttachment(e.target.files?.[0] || null)}
              className="hidden"
              accept="*"
            />
            <span className="text-xs text-gray-600">Attach</span>
          </label>
          {attachment && <span className="text-xs text-blue-700 ml-2">{attachment.name}</span>}
        </div>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        {success && <div className="text-green-600 text-xs mt-1">{success}</div>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 disabled:opacity-50"
            disabled={sending}
          >
            {sending ? 'Sending...' : replyMode ? 'Send Reply' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
