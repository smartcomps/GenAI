import React, { useState, useEffect } from 'react';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deckName: string) => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose, onSave }) => {
  const [deckName, setDeckName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDeckName('');
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const handleSave = () => {
    if (!deckName.trim()) {
      setError('Deck name cannot be empty.');
      return;
    }
    onSave(deckName);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-deck-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md p-6 sm:p-8 flex flex-col gap-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
            <h2 id="create-deck-modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Create New Deck
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <p className="text-slate-400 text-sm -mt-2">
            Give your new deck a name. This will group all images from your current session.
        </p>

        <div>
            <label htmlFor="deckName" className="block text-sm font-medium text-slate-300 mb-1">
            Deck Name
            </label>
            <input
            id="deckName"
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Sci-Fi Landscapes"
            className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
            autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>

        <button 
            onClick={handleSave}
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60"
        >
            Create Deck
        </button>
      </div>
    </div>
  );
};

export default CreateDeckModal;