import { useEffect, useState } from "react";

interface TokenConceptConfig {
  title?: string;
  description?: string;
  exampleText?: string;
}

interface TokenConceptVizProps {
  config: TokenConceptConfig;
  onOverlayChange?: (isOverlay: boolean) => void;
}

export default function TokenConceptViz({ config, onOverlayChange }: TokenConceptVizProps) {
  const {
    title = "What are tokens?",
    description = "An AI system breaks your inputs into small pieces called tokens and then uses patterns and relationships between those tokens to decide what to output next."
  } = config;

  const [overlaySection, setOverlaySection] = useState<boolean>(false);
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Notify parent when overlay state changes
  useEffect(() => {
    if (onOverlayChange) {
      onOverlayChange(overlaySection);
    }
  }, [overlaySection, onOverlayChange]);

  // Escape key exits overlay
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverlaySection(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Single longer example showing both whole words and subwords
  const exampleText = "The AI system is extraordinarily helpful for understanding complex tokenization patterns.";
  const tokens = [
    { text: "The", isSubword: false },
    { text: "AI", isSubword: false },
    { text: "system", isSubword: false },
    { text: "is", isSubword: false },
    { text: "extra", isSubword: true },
    { text: "ordina", isSubword: true },
    { text: "rily", isSubword: true },
    { text: "helpful", isSubword: false },
    { text: "for", isSubword: false },
    { text: "under", isSubword: true },
    { text: "standing", isSubword: true },
    { text: "complex", isSubword: false },
    { text: "token", isSubword: true },
    { text: "ization", isSubword: true },
    { text: "patterns", isSubword: false },
    { text: ".", isSubword: false }
  ];

  // Auto-animate through tokens
  useEffect(() => {
    if (isAnimating) {
      let index = 0;
      const interval = setInterval(() => {
        setActiveTokenIndex(index);
        index++;
        if (index >= tokens.length) {
          index = 0;
        }
      }, 400);
      return () => clearInterval(interval);
    } else {
      setActiveTokenIndex(null);
    }
  }, [isAnimating, tokens.length]);

  const sectionBaseClasses =
    "group p-8 rounded-2xl shadow bg-neutral-800 border border-neutral-700 relative";

  const overlayClasses =
    "fixed inset-0 z-50 m-0 rounded-none border-none bg-neutral-900 overflow-auto p-8";

  const renderFocusButton = () => (
    <button
      type="button"
      onClick={() => setOverlaySection(!overlaySection)}
      className="absolute top-3 right-3 w-10 h-10 rounded border border-neutral-600 bg-neutral-900/90 hover:bg-neutral-800 text-gray-200 hover:text-white flex items-center justify-center text-2xl font-semibold shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 focus:opacity-100 p-0 z-10"
      aria-label={overlaySection ? "Exit focus view" : "Focus this section"}
    >
      <span aria-hidden="true">{overlaySection ? "✕" : "⤢"}</span>
    </button>
  );

  const tokenColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 
    'bg-green-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-red-500'
  ];

  const renderContent = () => (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      {/* Main explanation */}
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Important note about tokens */}
      <div className="bg-purple-900/20 border border-purple-600/30 rounded-xl p-5">
        <p className="text-purple-200 text-center">
          <span className="font-semibold">Important:</span> A token is not always a complete word. 
          Longer or uncommon words often get split into <span className="text-purple-300 font-semibold">multiple tokens</span> (subwords).
        </p>
      </div>

      {/* Token visualization */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">See how text becomes tokens</h3>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isAnimating 
                ? 'bg-purple-600 text-white' 
                : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
            }`}
          >
            {isAnimating ? '⏸ Pause' : '▶ Animate'}
          </button>
        </div>
        
        {/* Original text */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Original text</p>
          <p className="text-lg text-gray-100 font-mono bg-neutral-800 p-4 rounded-lg leading-relaxed">
            "{exampleText}"
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-sm mb-1">Tokenization</span>
            <span className="text-2xl">↓</span>
          </div>
        </div>

        {/* Tokens */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Tokens ({tokens.length} total)
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                <span className="text-gray-500">whole word</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-gray-500">partial word</span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token, index) => (
              <div
                key={index}
                onMouseEnter={() => !isAnimating && setActiveTokenIndex(index)}
                onMouseLeave={() => !isAnimating && setActiveTokenIndex(null)}
                className={`px-3 py-2 rounded-lg font-mono text-sm transition-all duration-200 cursor-default ${
                  activeTokenIndex === index
                    ? `${tokenColors[index % tokenColors.length]} text-white scale-110 shadow-lg`
                    : token.isSubword 
                      ? 'bg-orange-900/40 text-orange-200 border border-orange-600/50 hover:bg-orange-900/60'
                      : 'bg-neutral-700 text-gray-200 hover:bg-neutral-600'
                }`}
              >
                {token.text}
                {token.isSubword && <span className="ml-1 text-xs opacity-60">⚬</span>}
                <span className="ml-2 text-xs opacity-60">#{index + 1}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-orange-300/70 mt-3">
            ⚬ = partial word (subword token) — these pieces combine to form the original word
          </p>
        </div>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-gray-100 mb-1">~75</div>
          <div className="text-sm text-gray-400">words per 100 tokens</div>
        </div>
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 text-center">
          <div className="text-3xl mb-2">📄</div>
          <div className="text-2xl font-bold text-gray-100 mb-1">~4</div>
          <div className="text-sm text-gray-400">characters per token (avg)</div>
        </div>
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-700 text-center">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-gray-100 mb-1">~750</div>
          <div className="text-sm text-gray-400">words per page</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Hubot+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');`}
      </style>
      
      {/* Normal view */}
      <div
        className={overlaySection ? "hidden" : "w-full bg-neutral-900 text-gray-100"}
        style={{
          fontFamily: '"Hubot Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
      >
        <section className={sectionBaseClasses}>
          {renderFocusButton()}
          <h2 className="text-2xl font-semibold mb-2 drop-shadow">
            {title}
          </h2>
          {renderContent()}
        </section>
      </div>

      {/* Overlay view */}
      {overlaySection && (
        <div
          className={overlayClasses}
          style={{
            fontFamily: '"Hubot Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
          }}
        >
          {renderFocusButton()}
          <h2 className="text-3xl font-semibold mb-6 text-center drop-shadow text-gray-100">
            {title}
          </h2>
          {renderContent()}
        </div>
      )}
    </>
  );
}

