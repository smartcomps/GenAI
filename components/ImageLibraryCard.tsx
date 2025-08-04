import React from 'react';
import { downloadImage } from '../services/downloadService';
import { LibraryItemData } from '../App';

interface ImageLibraryCardProps {
  item: LibraryItemData;
  onViewImage: () => void;
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const ImageLibraryCard: React.FC<ImageLibraryCardProps> = ({ item, onViewImage }) => {

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item.imageUrl) return;

    const sanitizedPrompt = item.promptText.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `ai-masterpiece_${sanitizedPrompt}.png`;

    downloadImage(item.imageUrl, filename);
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700/80 flex flex-col transition-all duration-300 hover:shadow-purple-500/30 hover:border-purple-500/50">
      <div 
        className="relative aspect-square w-full overflow-hidden group cursor-pointer"
        onClick={onViewImage}
        role="button"
        aria-label={`View image with prompt: ${item.promptText}`}
      >
        <img 
          src={item.imageUrl} 
          alt={item.promptText.length > 100 ? item.promptText.substring(0, 97) + "..." : item.promptText} 
          className="w-full h-full object-cover pulse-on-hover" 
          loading="lazy"
        />
        <button
            onClick={handleDownload}
            aria-label="Download image"
            className="absolute bottom-2 right-2 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-purple-500 focus-visible:opacity-100 rounded-md"
        >
            <DownloadIcon className="w-6 h-6 drop-shadow-md filter hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xs text-slate-400 font-semibold mb-1">Prompt:</h3>
        <p 
          className="text-sm text-slate-200 flex-grow max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700 pr-1 break-words"
          title={item.promptText} // Show full prompt on hover
        >
          {item.promptText}
        </p>
      </div>
    </div>
  );
};

export default ImageLibraryCard;