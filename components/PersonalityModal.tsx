

import React, { useEffect, useState } from 'react';
import { Personality } from '../App';

interface PersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prompt: string) => void;
  onAdd: (personality: Omit<Personality, 'id'>) => void;
  onUpdate: (personality: Personality) => void;
  onDelete: (id: string) => void;
  currentPrompt: string;
  personalities: Personality[];
  subscriptionTier: 'free' | 'pro';
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"></path>
  </svg>
);


const PersonalityForm = ({ initialData, onSave, onCancel, error, subscriptionTier }) => {
    const [name, setName] = useState('');
    const [promptText, setPromptText] = useState('');
    const [tier, setTier] = useState<'free' | 'pro'>('free');
    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPromptText(initialData.prompt);
            setTier(initialData.tier);
        } else {
            setName('');
            setPromptText('');
            setTier('free');
        }
    }, [initialData]);

    const handleSaveClick = () => {
        onSave({ name, prompt: promptText, tier });
    };

    return (
        <div className="flex flex-col gap-4 animate-fade-in">
           <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-200">{isEditing ? 'Edit Personality' : 'Create New Personality'}</h3>
            <button 
              onClick={onCancel}
              className="text-sm bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              &larr; Back to List
            </button>
          </div>
          <div>
            <label htmlFor="personalityName" className="block text-sm font-medium text-slate-300 mb-1">
              Personality Name
            </label>
            <input
              id="personalityName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grumpy Cat Poet"
              className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
            />
          </div>
          <div>
            <label htmlFor="personalityPrompt" className="block text-sm font-medium text-slate-300 mb-1">
              Personality Prompt
            </label>
            <textarea
              id="personalityPrompt"
              rows={5}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="You are a grumpy cat who writes short, melancholic poems about the red dot that always gets away..."
              className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 resize-y"
            />
          </div>
          {subscriptionTier === 'pro' && (
            <div>
                <label className="flex items-center gap-3 text-slate-300 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={tier === 'pro'}
                        onChange={e => setTier(e.target.checked ? 'pro' : 'free')}
                        className="h-5 w-5 rounded bg-slate-600 border-slate-500 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="flex items-center gap-1">Mark as Pro Personality <CrownIcon className="w-4 h-4 text-yellow-400"/></span>
                </label>
            </div>
          )}
          {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
          <button 
            onClick={handleSaveClick}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {isEditing ? 'Save Changes' : 'Save and Select Personality'}
          </button>
        </div>
    );
};

const PersonalityListView = ({ onAddNew, onEdit, onDelete, personalities, currentPrompt, onSelect, subscriptionTier }) => {
    return (
        <div className="animate-fade-in">
        <p className="text-slate-400 text-sm mb-4 -mt-2">
            Select a personality for the AI to use when generating image prompts for the "Inspire Me" feature.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
            <button
                onClick={onAddNew}
                className="p-4 text-left rounded-lg border-2 border-dashed border-slate-600 hover:border-purple-500/80 hover:bg-slate-700/80 transition-all duration-200 transform hover:scale-[1.02] flex flex-col items-center justify-center text-slate-400 hover:text-white"
            >
                <PlusIcon className="w-8 h-8 mb-2" />
                <h3 className="font-bold text-lg">Add New Personality</h3>
            </button>
            {personalities.map((p) => {
                const isPro = p.tier === 'pro';
                const isLocked = isPro && subscriptionTier === 'free';

                if (isLocked) {
                    return (
                        <div key={p.id} className="relative group">
                            <div
                                title="A Pro key is required to use this personality"
                                className="p-4 w-full h-full text-left rounded-lg border-2 bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 flex flex-col items-center justify-center text-center opacity-60 cursor-not-allowed"
                            >
                                <CrownIcon className="w-8 h-8 text-yellow-600 mb-2" />
                                <h3 className="font-bold text-lg text-slate-400">
                                    {p.name}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 font-semibold">Pro Key Required</p>
                            </div>
                        </div>
                    );
                }

                const isActive = currentPrompt === p.prompt;

                return (
                    <div key={p.id} className="relative group">
                    <button
                        title={p.prompt}
                        onClick={() => onSelect(p.prompt)}
                        className={`p-4 w-full h-full text-left rounded-lg border-2 transition-all duration-200 ${isActive 
                            ? 'bg-purple-900/40 border-purple-500 shadow-lg shadow-purple-900/20' 
                            : 'bg-slate-700/50 border-slate-600'}
                            transform hover:scale-[1.02] hover:border-purple-500/50`
                        }
                    >
                        <h3 className={`font-bold text-lg flex items-center gap-2 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                            {p.name}
                            {isPro && <CrownIcon className="w-4 h-4 text-yellow-400" />}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-3">{p.prompt}</p>
                    </button>
                    <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                            aria-label={`Edit ${p.name} personality`}
                            className="bg-slate-900/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-purple-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the "${p.name}" personality?`)) {
                                    onDelete(p.id);
                                }
                            }}
                            aria-label={`Delete ${p.name} personality`}
                            className="bg-slate-900/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                    </div>
                );
            })}
        </div>
        </div>
    );
};


const PersonalityModal: React.FC<PersonalityModalProps> = ({ isOpen, onClose, onSelect, onAdd, onUpdate, onDelete, currentPrompt, personalities, subscriptionTier }) => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingPersonality, setEditingPersonality] = useState<Personality | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Reset view state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setView('list');
      setEditingPersonality(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartEdit = (personality: Personality) => {
    setEditingPersonality(personality);
    setView('form');
  };

  const handleStartAdd = () => {
    setEditingPersonality(null);
    setView('form');
  };
  
  const handleCancelForm = () => {
    setView('list');
    setError(null);
  };

  const handleSaveForm = (data: { name: string; prompt: string; tier: 'free' | 'pro' }) => {
    if (!data.name.trim() || !data.prompt.trim()) {
      setError('Both name and prompt are required.');
      return;
    }
    setError(null);

    if (editingPersonality) {
      onUpdate({ ...editingPersonality, ...data });
    } else {
      onAdd(data);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="personality-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl p-6 sm:p-8 flex flex-col gap-4 relative"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className={`flex justify-between items-center ${view === 'form' ? 'hidden' : ''}`}>
          <h2 id="personality-modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Choose AI Personality
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {view === 'form' ? (
            <PersonalityForm
                initialData={editingPersonality}
                onSave={handleSaveForm}
                onCancel={handleCancelForm}
                error={error}
                subscriptionTier={subscriptionTier}
            />
        ) : (
            <PersonalityListView
                onAddNew={handleStartAdd}
                onEdit={handleStartEdit}
                onDelete={onDelete}
                personalities={personalities}
                currentPrompt={currentPrompt}
                onSelect={onSelect}
                subscriptionTier={subscriptionTier}
            />
        )}
      </div>
    </div>
  );
};

export default PersonalityModal;
