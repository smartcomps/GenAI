
import React, { useEffect } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: 'free' | 'pro';
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, currentTier }) => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl p-6 sm:p-8 flex flex-col gap-4 relative animate-zoom-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 id="subscription-modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
            Key Information
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-slate-400 text-sm -mt-2">
            Your current key provides access to the: <span className={`font-bold ${currentTier === 'pro' ? 'text-yellow-400' : 'text-slate-300'}`}>{currentTier === 'pro' ? 'Pro Plan ✨' : 'Free Plan'}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Free Plan Card */}
            <div className={`bg-slate-700/50 border rounded-lg p-6 flex flex-col transition-all ${currentTier === 'free' ? 'border-teal-500 ring-4 ring-teal-500/20' : 'border-slate-600'}`}>
                <h3 className="text-xl font-bold text-slate-200 mb-4">Free Plan</h3>
                <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-3"><CheckIcon className="w-5 h-5 text-teal-400" /> Standard AI Models</li>
                    <li className="flex items-center gap-3"><CheckIcon className="w-5 h-5 text-teal-400" /> Full Image Library Access</li>
                    <li className="flex items-center gap-3"><CheckIcon className="w-5 h-5 text-teal-400" /> Deck Creation</li>
                </ul>
            </div>
            {/* Pro Plan Card */}
            <div className={`bg-purple-900/20 border-2 rounded-lg p-6 flex flex-col transition-all ${currentTier === 'pro' ? 'border-purple-500 ring-4 ring-purple-500/20' : 'border-slate-600'}`}>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">Pro Plan</h3>
                <ul className="space-y-3 text-slate-300">
                    <li className="flex items-center gap-3"><StarIcon className="w-5 h-5 text-yellow-400" /> All Free features, plus:</li>
                    <li className="flex items-center gap-3"><StarIcon className="w-5 h-5 text-yellow-400" /> Premium Models (Pro & Ultra)</li>
                    <li className="flex items-center gap-3"><StarIcon className="w-5 h-5 text-yellow-400" /> Highest Quality Generation</li>
                    <li className="flex items-center gap-3"><StarIcon className="w-5 h-5 text-yellow-400" /> Priority Feature Access</li>
                </ul>
            </div>
        </div>
        
        <div className="mt-6 text-center">
            {currentTier === 'free' ? (
                 <p className="text-lg text-slate-300">Your key provides access to the Free Plan features.</p>
            ): (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-lg text-yellow-300 font-semibold">Your key has unlocked Pro features! 👑</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
