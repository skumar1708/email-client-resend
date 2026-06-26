"use client";
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    if (error) setError(error.message);
    else setMessage('Password reset email sent! Please check your inbox.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {message && <div className="text-green-600 mb-2">{message}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Send Reset Email</button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline">Back to login</a>
        </div>
      </form>
    </div>
  );
}
