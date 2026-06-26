import React from 'react';
import { HiOutlineMail } from 'react-icons/hi';

export default function TopBar() {
  return (
    <header className="w-full h-14 flex items-center justify-between px-6 bg-white border-b shadow-sm z-10">
      <div className="flex items-center gap-3">
        <HiOutlineMail className="h-8 w-8 text-blue-600" />
        <span className="text-xl font-bold text-blue-700 tracking-tight">ShulkPro Mail</span>
      </div>
      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search mail"
          className="w-full max-w-lg px-4 py-2 rounded-full border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for user/account dropdown */}
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">SP</div>
      </div>
    </header>
  );
}
