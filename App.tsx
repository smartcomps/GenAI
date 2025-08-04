
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Card from './components/Card';
import LoadingSpinner from './components/LoadingSpinner';
import ImageLibrary from './components/ImageLibrary';
import { generatePrompt, generateImage } from './services/geminiService';
import { downloadImage } from './services/downloadService';
import PersonalityModal from './components/PersonalityModal';
import CreateDeckModal from './components/CreateDeckModal';
import ViewDeckModal from './components/ViewDeckModal';
import ImageViewerModal from './components/ImageViewerModal';
import SubscriptionModal from './components/SubscriptionModal';
import KeyEntryModal from './components/KeyEntryModal';
import { validateKey, KeyData } from './services/keyService';


export interface LibraryItemData {
  id: string;
  imageUrl: string;
  promptText: string;
}

export interface Personality {
  id:string;
  name: string;
  prompt: string;
  tier: 'free' | 'pro';
}

export interface Deck {
    id: string;
    name: string;
    items: LibraryItemData[];
}

export interface Model {
  id: string;
  name: string;
  tier: 'free' | 'pro';
}

const AVAILABLE_TEXT_MODELS: Model[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tier: 'free' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', tier: 'pro' },
];
const AVAILABLE_IMAGE_MODELS: Model[] = [
    { id: 'imagen-3.0-generate-002', name: 'Imagen 3', tier: 'free' },
    { id: 'imagen-4.0-generate-preview-06-06', name: 'Imagen 4', tier: 'pro' },
    { id: 'imagen-4.0-ultra-generate-preview-06-06', name: 'Imagen 4 Ultra', tier: 'pro' },
];

const ASPECT_RATIOS = [
    { id: '1:1', name: 'Square (1:1)' },
    { id: '16:9', name: 'Widescreen (16:9)' },
    { id: '9:16', name: 'Portrait (9:16)' },
    { id: '4:3', name: 'Landscape (4:3)' },
    { id: '3:4', name: 'Upright (3:4)' },
];

const initialPersonalities: Personality[] = [
  { 
    id: 'p1',
    name: 'Philosophical Artist', 
    prompt: 'You are a philosophy artist that takes into consideration earth, space to imagine various impressive type of art.',
    tier: 'free',
  },
  { 
    id: 'p2',
    name: 'Sci-Fi Dreamer', 
    prompt: 'You are a sci-fi author and concept artist, dreaming up futuristic cities, alien worlds, and advanced technology. Focus on originality and a sense of wonder.',
    tier: 'free',
  },
  { 
    id: 'p3',
    name: 'Fantasy Illustrator', 
    prompt: 'You are a fantasy illustrator for epic novels. Generate prompts for mythical creatures, enchanted landscapes, and heroic characters. Your style is rich and detailed.',
    tier: 'pro',
  },
  { 
    id: 'p4',
    name: 'Surrealist Painter', 
    prompt: 'You are a surrealist painter who blends dreams and reality. Create bizarre, thought-provoking prompts that challenge perception and logic, in the style of Dali or Magritte.',
    tier: 'pro',
  },
  { 
    id: 'p5',
    name: 'Minimalist Designer', 
    prompt: 'You are a minimalist designer focused on clean lines, simple shapes, and a limited color palette. Generate prompts that are elegant, abstract, and convey a single powerful idea.',
    tier: 'free',
  }
];


const BricksIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H8V8H4V4Z" />
      <path d="M10 4H14V8H10V4Z" />
      <path d="M16 4H20V8H16V4Z" />
      <path d="M4 10H8V14H4V10Z" />
      <path d="M10 10H14V14H10V10Z" />
      <path d="M16 10H20V14H16V10Z" />
      <path d="M4 16H8V20H4V16Z" />
      <path d="M10 16H14V20H10V16Z" />
      <path d="M16 16H20V20H16V16Z" />
    </svg>
);

const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"></path>
  </svg>
);


const DeckIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 5H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H8V7h12v12z" />
        <path d="M4 17H2V5c0-1.1.9-2 2-2h12v2H4v12z" />
    </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const App: React.FC = () => {
  // Core App State
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [promptText, setPromptText] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-generation State
  const [isPreparingNext, setIsPreparingNext] = useState<boolean>(false);
  const [nextPromptText, setNextPromptText] = useState<string | null>(null);
  const [nextImageUrl, setNextImageUrl] = useState<string | null>(null);
  const [isNextReady, setIsNextReady] = useState<boolean>(false);
  const [nextError, setNextError] = useState<string | null>(null);
  
  // Input and Control State
  const [customPromptInput, setCustomPromptInput] = useState<string>('');
  const [generatingSource, setGeneratingSource] = useState<'custom' | 'random' | null>(null);
  
  // Data State
  const [libraryItems, setLibraryItems] = useState<LibraryItemData[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>(initialPersonalities);
  
  // Modal and View State
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState<boolean>(false);
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  const [viewingDeck, setViewingDeck] = useState<Deck | null>(null);
  const [viewingImage, setViewingImage] = useState<LibraryItemData | null>(null);
  const [viewingContext, setViewingContext] = useState<LibraryItemData[] | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  // Model and Config State
  const [personalityPrompt, setPersonalityPrompt] = useState<string>(personalities[0].prompt);
  const [textModel, setTextModel] = useState<string>(AVAILABLE_TEXT_MODELS[0].id);
  const [imageModel, setImageModel] = useState<string>(AVAILABLE_IMAGE_MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  // Authentication and Usage State
  const [activeKeyData, setActiveKeyData] = useState<KeyData | null>(null);
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(true);
  const [keyError, setKeyError] = useState<string | null>(null);

  const subscriptionTier = activeKeyData?.isPro ? 'pro' : 'free';
  const hasNoUsesLeft = remainingUses !== null && remainingUses <= 0;


  // Check for stored key on initial load
  useEffect(() => {
    const storedKey = localStorage.getItem('accessKey');
    const storedUses = localStorage.getItem('remainingUses');

    if (storedKey && storedUses) {
        const keyData = validateKey(storedKey);
        if (keyData) {
            setActiveKeyData(keyData);
            setRemainingUses(parseInt(storedUses, 10));
            setIsKeyModalOpen(false);
        } else {
            // Invalid key found in storage, clear it and prompt for a new one
            localStorage.removeItem('accessKey');
            localStorage.removeItem('remainingUses');
            setIsKeyModalOpen(true);
        }
    } else {
        setIsKeyModalOpen(true);
    }
  }, []);

  // Effect to handle model/personality downgrades if tier changes
  useEffect(() => {
    if (!activeKeyData) return;

    if (subscriptionTier === 'free') {
      const currentTextModelMeta = AVAILABLE_TEXT_MODELS.find(m => m.id === textModel);
      if (currentTextModelMeta?.tier === 'pro') {
        setTextModel(AVAILABLE_TEXT_MODELS.find(m => m.tier === 'free')!.id);
      }

      const currentImageModelMeta = AVAILABLE_IMAGE_MODELS.find(m => m.id === imageModel);
      if (currentImageModelMeta?.tier === 'pro') {
        setImageModel(AVAILABLE_IMAGE_MODELS.find(m => m.tier === 'free')!.id);
      }

      const currentPersonality = personalities.find(p => p.prompt === personalityPrompt);
      if (currentPersonality?.tier === 'pro') {
        const firstFreePersonality = personalities.find(p => p.tier === 'free');
        if (firstFreePersonality) {
          setPersonalityPrompt(firstFreePersonality.prompt);
        } else {
          setPersonalityPrompt('');
        }
      }
    }
  }, [subscriptionTier, textModel, imageModel, personalityPrompt, personalities, activeKeyData]);


  const addCurrentToLibrary = useCallback((currentImgUrl: string, currentPrompt: string) => {
    setLibraryItems(prevItems => [
      { id: `lib-item-${Date.now()}`, imageUrl: currentImgUrl, promptText: currentPrompt },
      ...prevItems
    ]);
  }, []);

  const prepareNextImage = useCallback(async () => {
    if (isPreparingNext || hasNoUsesLeft) return;
    setIsPreparingNext(true);
    setNextError(null);
    setIsNextReady(false);
    try {
      const newPrompt = await generatePrompt(personalityPrompt, textModel);
      const newImageUrl = await generateImage(newPrompt, imageModel, aspectRatio);
      setNextPromptText(newPrompt);
      setNextImageUrl(newImageUrl);
      setIsNextReady(true);
    } catch (err) {
      console.error("Failed to prepare next image:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while preparing the next image.";
      setNextError(errorMessage);
      setIsNextReady(false);
    } finally {
      setIsPreparingNext(false);
    }
  }, [isPreparingNext, personalityPrompt, textModel, imageModel, aspectRatio, hasNoUsesLeft]);

  const executeImageGeneration = useCallback(async (promptToUse: string) => {
    if (isLoading) return;
    if (hasNoUsesLeft) {
        setError("You have no image generations left. Please use a different key.");
        if(!isFlipped) setIsFlipped(true);
        return;
    }

    setIsLoading(true);
    setError(null);
    setNextError(null);

    if (!isFlipped) {
      setIsFlipped(true);
    }

    try {
      setPromptText(promptToUse); // Set prompt text for display during loading
      const newImageUrl = await generateImage(promptToUse, imageModel, aspectRatio);
      
      // On success, decrement uses
      const newRemainingUses = (remainingUses ?? 1) - 1;
      setRemainingUses(newRemainingUses);
      localStorage.setItem('remainingUses', newRemainingUses.toString());
      
      setImageUrl(newImageUrl);
      addCurrentToLibrary(newImageUrl, promptToUse);
      await prepareNextImage();

    } catch (err) {
      console.error("Image generation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during image generation.";
      setError(errorMessage);
      setImageUrl(null); // Clear image on error
    } finally {
      setIsLoading(false);
      setGeneratingSource(null); // Reset which button was clicked
    }
  }, [isLoading, isFlipped, prepareNextImage, addCurrentToLibrary, imageModel, aspectRatio, remainingUses, hasNoUsesLeft]);

  const handleGenerateWithCustomPrompt = useCallback(async () => {
    if (!customPromptInput.trim()) {
      setError("Please enter a prompt in the text box.");
      if(!isFlipped) setIsFlipped(true);
      return;
    }
    if (error === "Please enter a prompt in the text box.") setError(null);
    setGeneratingSource('custom');
    await executeImageGeneration(customPromptInput);
  }, [customPromptInput, executeImageGeneration, error, isFlipped]);

  const handleGenerateWithRandomPrompt = useCallback(async () => {
    if (isLoading) return;
    
    setGeneratingSource('random');
    setIsLoading(true); 
    setError(null); 

    if (!isFlipped) setIsFlipped(true);

    try {
      const newRandomPrompt = await generatePrompt(personalityPrompt, textModel);
      setCustomPromptInput(newRandomPrompt);
      await executeImageGeneration(newRandomPrompt);
    } catch (err) {
      console.error("Failed to generate random prompt or subsequent image:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating a random prompt.";
      setError(errorMessage);
      setIsLoading(false); 
      setGeneratingSource(null);
    }
  }, [isLoading, isFlipped, executeImageGeneration, personalityPrompt, textModel]);

  const handleRevealNextImage = useCallback(async () => {
    if (!isNextReady || isLoading || !nextImageUrl || !nextPromptText) return;

    setIsLoading(true);
    setError(null);
    setIsFlipped(false);

    setTimeout(() => {
      setPromptText(nextPromptText);
      setImageUrl(nextImageUrl);
      addCurrentToLibrary(nextImageUrl, nextPromptText);
      setCustomPromptInput(nextPromptText);

      setNextPromptText(null);
      setNextImageUrl(null);
      setIsNextReady(false);
      setNextError(null);

      setIsFlipped(true);

      setTimeout(() => {
        setIsLoading(false);
        prepareNextImage();
      }, 700);
    }, 400);
  }, [isLoading, isNextReady, nextImageUrl, nextPromptText, prepareNextImage, addCurrentToLibrary]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    downloadImage(imageUrl, 'ai-masterpiece.png');
  }, [imageUrl]);

  const handleAddPersonality = (newPersonalityData: Omit<Personality, 'id'>) => {
    const newPersonality: Personality = { ...newPersonalityData, id: `p-${Date.now()}` };
    setPersonalities(prev => [...prev, newPersonality]);
    if (newPersonality.tier === 'free' || subscriptionTier === 'pro') {
      setPersonalityPrompt(newPersonality.prompt);
    }
    setIsPersonalityModalOpen(false);
  };

  const handleUpdatePersonality = (updatedPersonality: Personality) => {
    setPersonalities(prev => {
        const oldPersonality = prev.find(p => p.id === updatedPersonality.id);
        if (oldPersonality && personalityPrompt === oldPersonality.prompt) {
            setPersonalityPrompt(updatedPersonality.prompt);
        }
        return prev.map(p => p.id === updatedPersonality.id ? updatedPersonality : p);
    });
    setIsPersonalityModalOpen(false);
  };

  const handleDeletePersonality = (personalityIdToDelete: string) => {
    const personalityToDelete = personalities.find(p => p.id === personalityIdToDelete);
    if (!personalityToDelete) return;

    const remainingPersonalities = personalities.filter(p => p.id !== personalityIdToDelete);

    if (personalityToDelete.prompt === personalityPrompt) {
        const firstFree = remainingPersonalities.find(p => p.tier === 'free') || remainingPersonalities[0];
        if (firstFree) {
            setPersonalityPrompt(firstFree.prompt);
        } else {
            setPersonalityPrompt(''); 
        }
    }
    setPersonalities(remainingPersonalities);
  };

  const handleSelectPersonality = (prompt: string) => {
      setPersonalityPrompt(prompt);
      setIsPersonalityModalOpen(false);
  };

  const handleCreateDeck = (name: string) => {
    if (!name.trim() || libraryItems.length === 0) return;
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      name: name,
      items: [...libraryItems],
    };
    setDecks(prevDecks => [newDeck, ...prevDecks]);
    setLibraryItems([]);
    setIsCreateDeckModalOpen(false);
  };

  const handleViewImage = (item: LibraryItemData, context: LibraryItemData[]) => {
    setViewingImage(item);
    setViewingContext(context);
  };

  const handleNavigateViewer = (direction: 'prev' | 'next') => {
    if (!viewingImage || !viewingContext) return;
    const currentIndex = viewingContext.findIndex(item => item.id === viewingImage.id);
    if (currentIndex === -1) return;
    let nextIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex >= 0 && nextIndex < viewingContext.length) {
      setViewingImage(viewingContext[nextIndex]);
    }
  };

  const handleKeySubmit = (key: string) => {
    const keyData = validateKey(key);
    if (keyData) {
        setActiveKeyData(keyData);
        const storedKey = localStorage.getItem('accessKey');
        const storedUses = localStorage.getItem('remainingUses');
        if(storedKey === keyData.id && storedUses !== null) {
            setRemainingUses(parseInt(storedUses, 10));
        } else {
            setRemainingUses(keyData.uses);
            localStorage.setItem('remainingUses', keyData.uses.toString());
        }
        localStorage.setItem('accessKey', keyData.id);
        setIsKeyModalOpen(false);
        setKeyError(null);
    } else {
        setKeyError('Invalid key. Please check your key and try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessKey');
    localStorage.removeItem('remainingUses');
    setActiveKeyData(null);
    setRemainingUses(null);
    setIsFlipped(false);
    setImageUrl(null);
    setPromptText('');
    setLibraryItems([]);
    setDecks([]);
    setIsKeyModalOpen(true);
  };


  const frontContent = (
    <div className="bg-slate-800 w-full h-full flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">Artistic AI Vision</h1>
      <p className="text-slate-300 mb-8 max-w-sm">
        Use the controls below to generate your unique AI masterpiece or let us inspire you!
      </p>
      {error && !isFlipped && error !== "Please enter a prompt in the text box." && (
        <div className="mt-6 p-4 bg-red-900 bg-opacity-70 text-red-200 border border-red-700 rounded-md w-full max-w-md shadow-lg" role="alert">
          <p className="font-bold text-lg mb-1">Oops! An error occurred:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );

  const backContent = (
    <div className="bg-slate-800 w-full h-full flex flex-col items-center justify-center p-4 text-center">
      {isLoading && !imageUrl && isFlipped ? (
         <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner size="large" color="border-indigo-400" />
          <p className="mt-4 text-slate-300 text-lg">
            {generatingSource === 'custom' ? 'Crafting Your Vision...' : 
             generatingSource === 'random' ? 'Summoning Inspiration...' : 
             'Conjuring Brilliance...'}
          </p>
        </div>
      ) : imageUrl && !error ? (
        <>
          <div className="relative group w-full h-full rounded-lg overflow-hidden shadow-lg mb-3 border border-slate-700">
            <img src={imageUrl} alt={promptText || 'Generated AI Image'} className="w-full h-full object-contain pulse-on-hover" />
            {imageUrl && !isLoading && (
              <button
                onClick={handleDownload}
                aria-label="Download generated image"
                className="absolute bottom-2 right-2 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-purple-500 focus-visible:opacity-100 rounded-md"
              >
                <DownloadIcon className="w-6 h-6 drop-shadow-md filter hover:scale-110 transition-transform duration-200" />
              </button>
            )}
          </div>
          <div className="bg-slate-900 p-3 rounded-md w-full mb-2 shadow">
            <h3 className="text-sm text-slate-400 font-semibold mb-1 text-left">Current Masterpiece Prompt:</h3>
            <p className="text-xs sm:text-sm text-slate-200 h-12 sm:h-14 overflow-y-auto text-left break-words pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">{promptText}</p>
          </div>
          
          <div className="w-full my-2 py-2 border-t border-b border-slate-700/70 min-h-[84px] flex flex-col items-center justify-center">
            {isPreparingNext ? (
              <div className="flex items-center justify-center text-slate-400">
                <LoadingSpinner size="small" color="border-slate-400" />
                <span className="ml-2 text-sm">Preparing Next Masterpiece...</span>
              </div>
            ) : nextError ? (
              <div className="text-center">
                <p className="text-red-400 text-xs sm:text-sm mb-1">Error preparing next: {nextError.length > 100 ? nextError.substring(0,97) + "..." : nextError}</p>
                <button
                  onClick={prepareNextImage}
                  disabled={isPreparingNext || hasNoUsesLeft}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md text-sm transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  Retry Preparing Next
                </button>
              </div>
            ) : isNextReady && nextImageUrl ? (
                <div className="text-center animate-fade-in px-2">
                    <p className="text-teal-300 font-semibold animate-pulse">✨ Next masterpiece is ready! ✨</p>
                    <p className="text-slate-400 text-sm mt-1">Use the reveal button to see it.</p>
                </div>
            ) : hasNoUsesLeft ? (
               <div className="text-orange-400 text-sm py-2 text-center">
                No uses left to prepare next image.
              </div>
            ) : (
              <div className="text-slate-500 text-xs sm:text-sm py-2 text-center">
                Next masterpiece is being summoned...
              </div>
            )}
          </div>
        </>
      ) : error && isFlipped ? (
         <div className="flex flex-col items-center justify-center h-full p-4">
           <p className="text-red-400 text-lg font-semibold mb-2">Generation Failed</p>
           <p className="text-red-300 mb-4 text-sm px-2 text-center">{error}</p>
           <button
            onClick={() => { setIsFlipped(false); setError(null);}}
            className="mt-4 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75"
          >
            Return to Front
          </button>
         </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-slate-400">Use controls below to generate art.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {isKeyModalOpen ? (
        <KeyEntryModal onKeySubmit={handleKeySubmit} error={keyError} />
      ) : (
      <>
        <main className="flex-grow flex flex-col items-center justify-center p-4 relative">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
             <div className="bg-slate-800/50 text-slate-300 font-semibold text-sm px-4 py-2 rounded-full hidden sm:block">
                Uses Left: <span className={hasNoUsesLeft ? 'text-red-400' : 'text-white'}>{remainingUses ?? 'N/A'}</span>
            </div>
            <button
                onClick={() => setIsInfoModalOpen(true)}
                className="text-slate-400 hover:text-yellow-400 transition-colors p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="View Subscription Info"
            >
              <CrownIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsPersonalityModalOpen(true)}
              className="text-slate-400 hover:text-white transition-colors p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Set AI Personality"
            >
              <BricksIcon />
            </button>
            <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-3 rounded-full bg-slate-800/50 hover:bg-slate-700/70 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Log Out"
                title="Log Out & Change Key"
            >
                <LogoutIcon className="w-6 h-6"/>
            </button>
          </div>

          <Card isFlipped={isFlipped} frontContent={frontContent} backContent={backContent} aspectRatio={aspectRatio} />
          
          <div className="mt-6 w-full max-w-md px-4 sm:max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                      <label htmlFor="textModelSelect" className="block text-sm font-medium text-slate-400 mb-1">
                          Prompt Model
                      </label>
                      <select 
                          id="textModelSelect"
                          value={textModel}
                          onChange={(e) => setTextModel(e.target.value)}
                          disabled={isLoading}
                          className="w-full p-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-800"
                      >
                          {AVAILABLE_TEXT_MODELS.map(model => (
                              <option 
                                key={model.id} 
                                value={model.id} 
                                disabled={model.tier === 'pro' && subscriptionTier === 'free'}
                                title={model.tier === 'pro' && subscriptionTier === 'free' ? 'Upgrade to Pro to use this model' : ''}
                              >
                                {model.name} {model.tier === 'pro' ? '👑' : ''}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="imageModelSelect" className="block text-sm font-medium text-slate-400 mb-1">
                          Image Model
                      </label>
                      <select 
                          id="imageModelSelect"
                          value={imageModel}
                          onChange={(e) => setImageModel(e.target.value)}
                          disabled={isLoading}
                          className="w-full p-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:bg-slate-800"
                      >
                          {AVAILABLE_IMAGE_MODELS.map(model => (
                              <option 
                                key={model.id} 
                                value={model.id} 
                                disabled={model.tier === 'pro' && subscriptionTier === 'free'}
                                title={model.tier === 'pro' && subscriptionTier === 'free' ? 'Upgrade to Pro to use this model' : ''}
                              >
                                {model.name} {model.tier === 'pro' ? '👑' : ''}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="aspectRatioSelect" className="block text-sm font-medium text-slate-400 mb-1">
                          Aspect Ratio
                      </label>
                      <select 
                          id="aspectRatioSelect"
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value)}
                          disabled={isLoading}
                          className="w-full p-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70"
                      >
                          {ASPECT_RATIOS.map(ratio => (
                              <option key={ratio.id} value={ratio.id}>{ratio.name}</option>
                          ))}
                      </select>
                  </div>
              </div>
          </div>

          <div className="mt-6 w-full max-w-md px-4 sm:max-w-lg" role="form" aria-labelledby="generation-controls-heading">
            <h2 id="generation-controls-heading" className="sr-only">Image Generation Controls</h2>
            <div className="mb-4">
              <label htmlFor="customPrompt" className="block text-sm font-medium text-slate-300 mb-1">
                Your Creative Prompt
              </label>
              <textarea
                id="customPrompt"
                rows={3}
                className="w-full p-3 bg-slate-700 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400 resize-y disabled:opacity-70"
                placeholder="e.g., A steampunk city floating in a giant hourglass..."
                value={customPromptInput}
                onChange={(e) => setCustomPromptInput(e.target.value)}
                aria-label="Custom prompt input for AI image generation"
                disabled={isLoading || hasNoUsesLeft}
              />
              {error === "Please enter a prompt in the text box." && (
                <p className="text-red-400 text-sm mt-1" role="alert">{error}</p>
              )}
            </div>

            <button
              onClick={handleGenerateWithCustomPrompt}
              disabled={isLoading || !customPromptInput.trim() || hasNoUsesLeft}
              className="w-full mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              aria-live="polite"
              aria-busy={isLoading && generatingSource === 'custom'}
            >
              {isLoading && generatingSource === 'custom' ? (
                <>
                  <LoadingSpinner size="small" color="border-white"/>
                  <span className="ml-3">Generating Your Vision...</span>
                </>
              ) : hasNoUsesLeft ? (
                "🚫 No Uses Left"
              ) : (
                "🎨 Generate with My Prompt"
              )}
            </button>

            <button
              onClick={handleGenerateWithRandomPrompt}
              disabled={isLoading || hasNoUsesLeft}
              className="w-3/4 mx-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center text-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
              aria-live="polite"
              aria-busy={isLoading && generatingSource === 'random'}
            >
              {isLoading && generatingSource === 'random' ? (
                <>
                  <LoadingSpinner size="small" color="border-white"/>
                  <span className="ml-3">Inspiring You...</span>
                </>
              ) : hasNoUsesLeft ? (
                "🚫 No Uses Left"
              ) : (
                "🔮 Inspire Me (Random Prompt)"
              )}
            </button>
          </div>
        </main>
        
        {isFlipped && isNextReady && nextImageUrl && (
          <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 animate-slide-up-fade-in">
              <button
                  onClick={handleRevealNextImage}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center text-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
                >
                  {isLoading && !generatingSource ? (
                    <>
                      <LoadingSpinner size="small" color="border-white" />
                      <span className="ml-2">Revealing...</span>
                    </>
                  ) : "✨ Reveal Next Art" }
                </button>
          </div>
      )}

        <ImageLibrary items={libraryItems} decks={decks} onViewDeck={setViewingDeck} onViewImage={handleViewImage} />
        
        <SubscriptionModal 
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            currentTier={subscriptionTier}
        />

        <PersonalityModal
          isOpen={isPersonalityModalOpen}
          onClose={() => setIsPersonalityModalOpen(false)}
          onSelect={handleSelectPersonality}
          onAdd={handleAddPersonality}
          onUpdate={handleUpdatePersonality}
          onDelete={handleDeletePersonality}
          currentPrompt={personalityPrompt}
          personalities={personalities}
          subscriptionTier={subscriptionTier}
        />
        
        {libraryItems.length > 0 && (
            <button
              onClick={() => setIsCreateDeckModalOpen(true)}
              className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              aria-label="Create a new deck from current images"
              title="Create New Deck"
            >
                <DeckIcon className="w-7 h-7" />
            </button>
        )}

        <CreateDeckModal
          isOpen={isCreateDeckModalOpen}
          onClose={() => setIsCreateDeckModalOpen(false)}
          onSave={handleCreateDeck}
        />

        {viewingDeck && (
            <ViewDeckModal
                deck={viewingDeck}
                onClose={() => setViewingDeck(null)}
                onViewImage={handleViewImage}
            />
        )}

        <ImageViewerModal 
          item={viewingImage}
          context={viewingContext}
          onClose={() => { setViewingImage(null); setViewingContext(null); }}
          onNavigate={handleNavigateViewer}
        />
      </>
      )}

      <footer className="w-full text-center py-6 mt-auto border-t border-slate-700/50 bg-slate-900/30">
        <p className="text-slate-500 text-xs sm:text-sm">
          Powered by Google Gemini & Imagen APIs.
          Crafted with React & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
};

export default App;
