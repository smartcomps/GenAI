

import React from 'react';
import { Deck } from '../App';

interface DeckCardProps {
  deck: Deck;
  onViewDeck: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onViewDeck }) => {
  const previewImage = deck.items.length > 0 ? deck.items[0].imageUrl : null;

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer group animate-slide-up-fade-in"
      onClick={onViewDeck}
      aria-label={`View deck named ${deck.name}`}
    >
      {/* Back card 2 */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-700 rounded-lg transform -rotate-6 transition-transform duration-300 ease-in-out group-hover:-rotate-12 group-hover:scale-105 border-2 border-slate-600"></div>
      {/* Back card 1 */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-700 rounded-lg transform rotate-3 transition-transform duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-105 border-2 border-slate-600"></div>
      
      {/* Front card with image */}
      <div className="absolute top-0 left-0 w-full h-full bg-slate-800 rounded-lg overflow-hidden shadow-xl transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-y-4 border-2 border-slate-500/80 group-hover:border-purple-500">
        {previewImage ? (
          <img 
            src={previewImage} 
            alt={`Preview for ${deck.name}`} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800">
            <p className="text-slate-400 text-sm">Empty Deck</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="text-white font-bold text-lg drop-shadow-lg truncate">{deck.name}</h3>
            <p className="text-slate-300 text-sm drop-shadow-md">{deck.items.length} image{deck.items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;