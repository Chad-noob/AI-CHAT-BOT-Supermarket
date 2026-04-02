import { useState, useEffect } from 'react';
import { useVoiceAssistant } from './hooks/useVoiceAssistant.js';
import { products } from './utils/products.js';
import { ProductCard } from './components/ProductCard.jsx';
import { CategoryFilter } from './components/CategoryFilter.jsx';
import { VoiceButton } from './components/VoiceButton.jsx';
import { LanguageToggle } from './components/LanguageToggle.jsx';
import { LoadingAnimation } from './components/LoadingAnimation.jsx';
import { GreetingAnimation } from './components/GreetingAnimation.jsx';
import { WelcomeTransition } from './components/WelcomeTransition.jsx';
import { VoiceAssistantUI } from './components/VoiceAssistantUI.jsx';
import './index.css';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showGreeting, setShowGreeting] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFullAssistant, setShowFullAssistant] = useState(false);

  useEffect(() => {
    console.log("App state:", { showGreeting, showWelcome, showFullAssistant });
  }, [showGreeting, showWelcome, showFullAssistant]);

  const {
    transcript,
    response,
    language,
    error,
    isApiConfigured,
    processing,
    listening,
    toggleListening,
    setExplicitLanguage
  } = useVoiceAssistant(selectedLanguage);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    setExplicitLanguage(lang);
  };

  const handleGreetingComplete = () => {
    console.log("Greeting complete, showing welcome");
    setShowGreeting(false);
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    console.log("Welcome complete, showing full assistant");
    setShowWelcome(false);
    setShowFullAssistant(true);
  };

  // Logic to find a matching product from the AI response string
  const getProductFromResult = () => {
    if (!response) return null;
    const lowerResponse = response.toLowerCase();
    const found = products.find(p => lowerResponse.includes(p.name.toLowerCase()));
    if (found) {
      return <ProductCard key={found.id} product={found} />;
    }
    return null;
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-200 flex flex-col md:flex-row overflow-hidden relative">

      {/* Greeting Animation - After Loading */}
      {showGreeting && (
        <GreetingAnimation onComplete={handleGreetingComplete} />
      )}

      {/* Welcome Transition - After Greeting */}
      {showWelcome && !showGreeting && (
        <WelcomeTransition onComplete={handleWelcomeComplete} />
      )}

      {/* Full-Screen Premium Voice Assistant Mode */}{showFullAssistant && !showWelcome && !showGreeting && (
        <VoiceAssistantUI 
          transcript={transcript}
          response={response}
          language={language}
          processing={processing}
          listening={listening}
          toggleListening={toggleListening}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          foundProduct={getProductFromResult()}
        />
      )}


      {/* Top Bar (Mobile-only branding + Language + Cart) */}
      <div className="md:absolute md:top-0 md:right-0 md:left-[300px] h-20 px-6 flex items-center justify-between md:justify-end z-20 border-b border-white/5 md:border-none">
        {/* Mobile Branding */}
        <div className="md:hidden flex items-center gap-2">
          <div>
            <h1 className="text-lg flex tracking-wide font-medium text-emerald-400">AisleMart</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 hidden md:flex">
          <LanguageToggle
            currentLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />

          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

          <div className="flex items-center gap-3 bg-[#13161f] border border-[#212530] px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300">Always Listening</span>
          </div>
        </div>
      </div>

      {/* API Key Warning */}
      {!isApiConfigured && (
        <div className="absolute top-0 left-0 right-0 bg-rose-500/20 text-rose-300 text-sm py-2 px-4 text-center z-50 border-b border-rose-500/30">
          API Key Required: Please add VITE_GROQ_API_KEY or VITE_OPENROUTER_API_KEY to your .env file
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 right-4 bg-rose-500/90 text-white text-sm py-3 px-5 rounded-lg shadow-lg z-[60] flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>
      )}

      {/* Legacy Sidebar - Hidden during all animation/full-screen states */}
      <aside className={`${showFullAssistant || showGreeting || showWelcome ? 'hidden' : 'w-full md:w-[300px] block'} bg-[#0E1117] border-r border-white/5 flex flex-col pt-6 md:h-screen`}>

        {/* Brand */}
        <div className="px-6 mb-10 hidden md:flex items-start gap-3">
          <div>
            <h1 className="text-xl tracking-wide font-medium text-emerald-400 leading-none mb-1">AisleMart</h1>
            <p className="text-[#8b9bb4] text-xs">Voice Information Assistant</p>
          </div>
        </div>

        {/* Mobile Language & Cart (Visible only on small screens) */}
        <div className="px-4 mb-6 md:hidden flex flex-col gap-4">
          <LanguageToggle
            currentLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
          <div className="flex items-center gap-2 bg-[#13161f] border border-[#212530] px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-gray-400">Listening</span>
          </div>
        </div>

        {/* Assistant Core */}
        <div className="flex-1 flex flex-col items-center justify-start mt-4 md:mt-12 px-6">
          <VoiceButton
            onClick={toggleListening}
            isListening={listening}
            isProcessing={processing}
            disabled={!isApiConfigured}
          />

          {/* Transcript / Response Display */}
          <div className="mt-12 w-full max-w-xs mx-auto text-center md:text-left transition-all duration-500">
            {transcript || response ? (
              <div className="bg-[#151923] border border-[#212530] p-4 rounded-2xl shadow-lg relative h-48 overflow-y-auto hide-scrollbar">

                {transcript && (
                  <div className="mb-4">
                    <p className="text-xs text-emerald-400/70 mb-1 font-medium">You said:</p>
                    <p className="text-sm text-gray-200 leading-relaxed">"{transcript}"</p>
                  </div>
                )}

                {response && (
                  <div className="animate-fade-in">
                    <p className="text-xs text-blue-400/70 mb-1 font-medium">Assistant ({language}):</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{response}</p>
                  </div>
                )}

                {!transcript && !response && processing && (
                  <div className="text-center text-gray-400 text-sm h-full flex items-center justify-center">
                    <span>Your response is on the way...</span>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                  Welcome to AisleMart! I'm your voice assistant. Ask me anything about our products!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="hidden md:block p-6 border-t border-white/5 text-[10px] text-gray-600 font-mono text-center">
          AisleMart v2.0 • Powered by AI • Ready
        </div>
      </aside>

      {/* Main Content - Hidden during all animation/full-screen states */}
      <main className={`${showFullAssistant || showGreeting || showWelcome ? 'hidden' : 'flex-1'} h-screen overflow-y-auto px-4 md:px-8 pt-6 md:pt-24 pb-20 scroll-smooth`}>

        <div className="max-w-6xl mx-auto">

          <div className="mb-6 flex items-center gap-2">

            <h2 className="text-2xl font-semibold text-white tracking-tight">Product Catalog</h2>
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;

