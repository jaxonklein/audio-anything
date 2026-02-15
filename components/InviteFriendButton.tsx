"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function InviteFriendButton() {
  const { isSignedIn } = useUser();
  const [inviteUrl, setInviteUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSignedIn) return null;

  const handleGenerateInvite = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-invite', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to generate invite');

      const data = await response.json();
      setInviteUrl(data.url);
      setShowModal(true);
    } catch (error) {
      console.error('Error generating invite:', error);
      alert('Failed to generate invite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    alert('Invite link copied to clipboard!');
  };

  return (
    <>
      <button
        onClick={handleGenerateInvite}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Get Invite Link'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Invite Link
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share this link with one friend to give them access to the beta. It can only be used once.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 break-all text-sm font-mono">
              {inviteUrl}
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
