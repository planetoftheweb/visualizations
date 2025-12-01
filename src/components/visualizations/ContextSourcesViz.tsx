import { useEffect, useState } from "react";
import { ContextSourcesConfig } from "../../types/visualization";

interface ContextSourcesVizProps {
  config: ContextSourcesConfig;
  onOverlayChange?: (isOverlay: boolean) => void;
}

export default function ContextSourcesViz({ config, onOverlayChange }: ContextSourcesVizProps) {
  const {
    title = "Where memory fits in the full context-source picture",
    description = "When thinking about 'sources of context,' treat memory as a meta-source — not just what you feed the bot now, but what it retains for future use.",
    sources
  } = config;

  // Use all sources in a single list, sorted to show memory first if it exists
  const sortedSources = [...sources].sort((a, b) => {
    // Put memory first if it exists
    if (a.id === 'memory') return -1;
    if (b.id === 'memory') return 1;
    return 0;
  });

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

  const renderFocusButton = () => {
    return (
      <button
        type="button"
        onClick={() => setOverlaySection(!overlaySection)}
        className="absolute top-3 right-3 w-10 h-10 rounded border border-neutral-600 bg-neutral-900/90 hover:bg-neutral-800 text-gray-200 hover:text-white flex items-center justify-center text-2xl font-semibold shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 focus:opacity-100 p-0 z-10"
        aria-label={overlaySection ? "Exit focus view" : "Focus this section"}
      >
        <span aria-hidden="true">{overlaySection ? "✕" : "⤢"}</span>
      </button>
    );
  };

  const renderContent = () => (
    <div className="max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSources.map((source) => (
            <div
              key={source.id}
              className="rounded-lg p-4 border transition-all duration-200 cursor-default bg-neutral-800 border-neutral-700 hover:border-purple-500 hover:bg-purple-900/20 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                {source.icon && (
                  <span className="text-4xl transition-transform duration-200">
                    {source.icon}
                  </span>
                )}
                <div className="flex-1 leading-tight">
                  <h3 className="font-semibold text-base mb-0.5 text-gray-100">
                    {source.label}
                  </h3>
                  {source.description && (
                    <p className="text-xs leading-snug text-gray-400">
                      {source.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Hubot+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');`}
      </style>
      
      {/* Normal view - hidden when overlay is active */}
      <div
        className={overlaySection ? "hidden" : "w-full bg-neutral-900 text-gray-100"}
        style={{
          fontFamily:
            '"Hubot Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
      >
        <section className={sectionBaseClasses}>
          {renderFocusButton()}
          <h2 className="text-2xl font-semibold mb-2 drop-shadow">
            {title}
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            {description}
          </p>
          {renderContent()}
        </section>
      </div>

      {/* Overlay view - shown when overlay is active */}
      {overlaySection && (
        <div
          className={overlayClasses}
          style={{
            fontFamily:
              '"Hubot Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
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

