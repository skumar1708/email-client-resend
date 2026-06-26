import React from 'react';

// Updated email data type
export type Email = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  unread: boolean;
  body?: string;
  html_body?: string;
  to_emails?: string[];
};

function getInitials(email: string) {
  const name = email.split('@')[0];
  return name
    .split(/[._-]/)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function EmailList({ emails, onSelect, selectedId }: { emails: Email[]; onSelect: (id: string) => void; selectedId: string | null }) {
  return (
    <div className="w-full max-w-xl divide-y divide-gray-200 bg-white rounded-xl shadow overflow-hidden">
      {emails.map(email => (
        <div
          key={email.id}
          className={`flex items-center px-4 py-3 cursor-pointer transition-colors group ${
            selectedId === email.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelect(email.id)}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 mr-4">
            {getInitials(email.from)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className={`truncate font-semibold ${email.unread ? 'text-blue-700' : 'text-gray-700'} ${email.unread ? 'font-bold' : ''}`}>{email.from}</span>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{email.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`block truncate ${email.unread ? 'font-bold' : ''}`}>{email.subject}</span>
            </div>
            <span className="block text-gray-500 text-sm truncate">{email.snippet}</span>
          </div>
          {email.unread && <span className="ml-4 w-2 h-2 rounded-full bg-blue-500" title="Unread" />}
        </div>
      ))}
      {emails.length === 0 && (
        <div className="p-8 text-center text-gray-400">No emails found.</div>
      )}
    </div>
  );
}
