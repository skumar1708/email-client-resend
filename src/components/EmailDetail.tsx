import React from 'react';
import type { Email } from './EmailList';

// Placeholder for selected email detail
export default function EmailDetail({ email }: { email: Email | null }) {
  if (!email) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select an email to view</div>;
  }
  return (
    <div className="flex-1 bg-white rounded shadow p-6 ml-6">
      <div className="mb-2 text-xs text-gray-400">{email.date}</div>
      <div className="mb-2 text-lg font-bold">{email.subject}</div>
      <div className="mb-4 text-gray-700">From: {email.from}</div>
      <div className="mb-6 text-gray-600">{email.snippet}</div>
      {/* Add reply, forward, delete, etc. actions here */}
    </div>
  );
}
