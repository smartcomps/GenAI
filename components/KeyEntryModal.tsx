import React, { useState } from 'react';

interface KeyEntryModalProps {
  onKeySubmit: (key: string) => void;
  error: string | null;
}

const KeyEntryModal: React.FC<KeyEntryModalProps> = ({ onKeySubmit, error }) => {
  const [keyInput, setKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onKeySubmit(keyInput);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="key-entry-modal-title"
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md p-6 sm:p-8 flex flex-col gap-4 relative"
      >
        <h2 id="key-entry-modal-title" className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Enter Access Key
        </h2>
        <p className="text-slate-400 text-sm text-center -mt-2">
          Please enter your key to access the application and generate images.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="accessKey" className="sr-only">
              Access Key
            </label>
            <input
              id="accessKey"
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g., PRO-A1B2-C3D4-E5F6"
              className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 text-center font-mono tracking-wider"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center" role="alert">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!keyInput.trim()}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Unlock Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default KeyEntryModal;
