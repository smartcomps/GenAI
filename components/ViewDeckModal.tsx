import React, { useEffect } from 'react';
import { Deck, LibraryItemData } from '../App';
import ImageLibraryCard from './ImageLibraryCard';

interface ViewDeckModalProps {
  deck: Deck;
  onClose: () => void;
  onViewImage: (item: LibraryItemData, context: LibraryItemData[]) => void;
}

const ViewDeckModal: React.FC<ViewDeckModalProps> = ({ deck, onClose, onViewImage }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-deck-modal-title"
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[90vh] p-6 sm:p-8 flex flex-col gap-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center flex-shrink-0">
          <h2 id="view-deck-modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 truncate pr-4">
            Deck: {deck.name}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors flex-shrink-0" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto -mr-4 pr-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
          {deck.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {deck.items.map(item => (
                <ImageLibraryCard key={item.id} item={item} onViewImage={() => onViewImage(item, deck.items)}/>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400">This deck is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDeckModal;