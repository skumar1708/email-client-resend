import React from 'react';
import type { Email } from './EmailList';
import { HiReply, HiOutlineTrash, HiOutlineDotsHorizontal } from 'react-icons/hi';

export default function EmailDetail({ email, onReply }: { email: Email | null; onReply?: () => void }) {
  if (!email) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select an email to view</div>;
  }
  return (
    <div className="flex-1 bg-white rounded-xl shadow p-8 ml-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-bold text-gray-900 mb-1">{email.subject}</div>
          <div className="text-xs text-gray-400">{email.date}</div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100" title="Reply" onClick={onReply}><HiReply className="w-5 h-5 text-blue-600" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100" title="Delete"><HiOutlineTrash className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100" title="More"><HiOutlineDotsHorizontal className="w-5 h-5 text-gray-500" /></button>
        </div>
      </div>
      <div className="mb-2 text-gray-700"><span className="font-semibold">From:</span> {email.from}</div>
      {email.to_emails && (
        <div className="mb-4 text-gray-700"><span className="font-semibold">To:</span> {Array.isArray(email.to_emails) ? email.to_emails.join(', ') : email.to_emails}</div>
      )}
      <div className="mb-6 text-gray-800 text-base">
        {email.html_body ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: email.html_body }} />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-base">{email.body}</pre>
        )}
      </div>
    </div>
  );
}
