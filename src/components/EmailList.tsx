import React from 'react';

// Placeholder email data type
export type Email = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  unread: boolean;
};

export default function EmailList({ emails, onSelect, selectedId }: { emails: Email[]; onSelect: (id: string) => void; selectedId: string | null }) {
  return (
    <div className="w-full max-w-xl divide-y divide-gray-200 bg-white rounded shadow">
      {emails.map(email => (
        <div
          key={email.id}
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
            selectedId === email.id ? 'bg-blue-100' : ''
          }`}
          onClick={() => onSelect(email.id)}
        >
          <div className="flex-1">
            <div className="flex justify-between">
              <span className={`font-semibold ${email.unread ? 'text-blue-700' : 'text-gray-700'}`}>{email.from}</span>
              <span className="text-xs text-gray-400">{email.date}</span>
            </div>
            <div className="flex justify-between">
              <span className={`block ${email.unread ? 'font-bold' : ''}`}>{email.subject}</span>
              {/* Add icons for star, attachment, etc. here */}
            </div>
            <span className="block text-gray-500 text-sm truncate">{email.snippet}</span>
          </div>
        </div>
      ))}
      {emails.length === 0 && (
        <div className="p-8 text-center text-gray-400">No emails found.</div>
      )}
    </div>
  );
}
