import { useEffect, useState } from "react";

interface ContextWindowConceptConfig {
  title?: string;
  description?: string;
}

interface ContextWindowConceptVizProps {
  config: ContextWindowConceptConfig;
  onOverlayChange?: (isOverlay: boolean) => void;
}

export default function ContextWindowConceptViz({ config, onOverlayChange }: ContextWindowConceptVizProps) {
  const {
    title = "The Context Window",
    description = "A token is a word or part of a word, and every system has a limit on how many tokens it can work with at once. That limit is called the context window."
  } = config;

  const [overlaySection, setOverlaySection] = useState<boolean>(false);

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

  const renderContent = () => (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Main explanation */}
      <p className="text-lg text-gray-300 leading-relaxed">
        {description}
      </p>
      
      {/* Visual representation of context window */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">How the context window works</h3>
        <div className="relative">
          <div className="flex items-center gap-1 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-10 rounded-sm transition-all ${
                  i < 30 
                    ? 'bg-purple-500/80' 
                    : 'bg-neutral-700'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm text-gray-500">
            <span>Start of conversation</span>
            <span className="text-purple-400 font-medium">← Context window limit →</span>
            <span>Overflow (forgotten)</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          When your conversation exceeds the context window, the AI can no longer "see" the oldest parts. 
          This is why very long conversations may lose earlier context.
        </p>
      </div>

      {/* Context window sizes */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Common context window sizes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '16K', tokens: '16,000', desc: 'Free tier', color: 'bg-green-500', pages: '~20 pages' },
            { label: '32K', tokens: '32,000', desc: 'Plus tier', color: 'bg-blue-500', pages: '~40 pages' },
            { label: '128K', tokens: '128,000', desc: 'Pro tier', color: 'bg-purple-500', pages: '~160 pages' },
            { label: '1M', tokens: '1,000,000', desc: 'Ultra tier', color: 'bg-orange-500', pages: '~1,250 pages' },
          ].map(({ label, tokens, desc, color, pages }) => (
            <div key={label} className="bg-neutral-800 rounded-lg p-4 text-center hover:bg-neutral-750 transition-colors">
              <div className={`w-4 h-4 rounded-full ${color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-gray-100">{label}</div>
              <div className="text-xs text-gray-500 mb-2">{tokens} tokens</div>
              <div className="text-sm text-gray-400">{pages}</div>
              <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
          ))}
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
          <div className="text-2xl font-bold text-gray-100 mb-1">~800</div>
          <div className="text-sm text-gray-400">tokens per page</div>
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
          <h2 className="text-2xl font-semibold mb-4 drop-shadow">
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


