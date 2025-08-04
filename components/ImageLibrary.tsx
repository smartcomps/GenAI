import React from 'react';
import ImageLibraryCard from './ImageLibraryCard';
import DeckCard from './DeckCard';
import { Deck, LibraryItemData } from '../App';


interface ImageLibraryProps {
  items: LibraryItemData[];
  decks: Deck[];
  onViewDeck: (deck: Deck) => void;
  onViewImage: (item: LibraryItemData, context: LibraryItemData[]) => void;
}

const ImageLibrary: React.FC<ImageLibraryProps> = ({ items, decks, onViewDeck, onViewImage }) => {
  if (items.length === 0 && decks.length === 0) {
    return (
      <section aria-labelledby="library-heading" className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-slate-800/50 p-10 rounded-lg shadow-xl border border-slate-700">
          <h2 id="library-heading" className="text-2xl font-semibold text-slate-300 mb-3">My Library & Decks</h2>
          <p className="text-slate-400">Your generated masterpieces will appear here. Create a few and then organize them into a deck!</p>
          <svg className="w-16 h-16 mx-auto mt-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="library-heading" className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {decks.length > 0 && (
            <div className="mb-16">
                 <h2 id="decks-heading" className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 mb-8">
                    My Decks
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                   {decks.map(deck => (
                        <DeckCard key={deck.id} deck={deck} onViewDeck={() => onViewDeck(deck)} />
                    ))}
                </div>
            </div>
        )}

      {items.length > 0 && (
        <div>
            <h2 id="current-session-heading" className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-8">
                Current Session
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map(item => (
                <ImageLibraryCard key={item.id} item={item} onViewImage={() => onViewImage(item, items)} />
                ))}
            </div>
        </div>
      )}
    </section>
  );
};

export default ImageLibrary;