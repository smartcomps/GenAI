


import React from 'react';

interface CardProps {
  isFlipped: boolean;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  aspectRatio: string;
}

const Card: React.FC<CardProps> = ({ isFlipped, frontContent, backContent, aspectRatio }) => {
  const aspectClass = `aspect-[${aspectRatio.replace(':', '/')}]`;
  
  return (
    // Perspective is applied to the direct parent of the transforming element.
    // Tailwind CDN supports arbitrary properties like [perspective:1200px].
    <div className="[perspective:1200px] w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] group">
      <div
        className={`relative w-full ${aspectClass} preserve-3d transition-all duration-700 ease-in-out rounded-xl
                    ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl overflow-hidden border-2 border-slate-700/50">
          {frontContent}
        </div>
        {/* Back Face */}
        {/* The back face itself is also rotated 180 degrees so its content faces outward when the card is flipped */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-2xl overflow-hidden border-2 border-slate-700/50">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default Card;
