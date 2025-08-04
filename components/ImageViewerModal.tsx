import React, { useEffect } from 'react';
import { downloadImage } from '../services/downloadService';
import { LibraryItemData } from '../App';

interface ImageViewerModalProps {
  item: LibraryItemData | null;
  context: LibraryItemData[] | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ChevronLeftIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);


const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ item, context, onClose, onNavigate }) => {
  useEffect(() => {
    if (!item || !context) {
        document.body.style.overflow = '';
        return;
    };

    document.body.style.overflow = 'hidden';

    const currentIndex = context.findIndex(ctxItem => ctxItem.id === item.id);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < context.length - 1;

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        } else if (event.key === 'ArrowLeft' && canGoPrev) {
            onNavigate('prev');
        } else if (event.key === 'ArrowRight' && canGoNext) {
            onNavigate('next');
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, context, onClose, onNavigate]);

  if (!item || !context) return null;

  const handleDownload = () => {
    const sanitizedPrompt = item.promptText.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `ai-masterpiece_${sanitizedPrompt}.png`;
    downloadImage(item.imageUrl, filename);
  };

  const currentIndex = context.findIndex(ctxItem => ctxItem.id === item.id);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < context.length - 1;


  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-viewer-prompt"
    >
      <div 
        className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-4xl h-full max-h-[90vh] p-4 sm:p-6 flex flex-col gap-4 relative animate-zoom-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-3 left-4 text-white bg-black/30 px-2 py-1 rounded-md text-sm font-mono z-10">
          {currentIndex + 1} / {context.length}
        </div>
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors z-10" 
          aria-label="Close image viewer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="relative flex-grow w-full h-auto min-h-0 flex items-center justify-center">
             {canGoPrev && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
                    className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/80"
                    aria-label="Previous image"
                >
                    <ChevronLeftIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
            )}

            <img 
                key={item.id}
                src={item.imageUrl} 
                alt={item.promptText}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg animate-image-fade-in"
            />

            {canGoNext && (
                <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
                    className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/80"
                    aria-label="Next image"
                >
                    <ChevronRightIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
            )}
        </div>

        <div className="flex-shrink-0 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="flex-grow min-w-0">
                    <h3 id="image-viewer-prompt-heading" className="text-sm text-slate-400 font-semibold mb-1">
                        Prompt
                    </h3>
                    <p 
                        id="image-viewer-prompt"
                        className="text-base text-slate-200 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700 pr-2 break-words"
                    >
                        {item.promptText}
                    </p>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md shadow-md text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;