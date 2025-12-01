import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function Infographic() {
  // Core examples
  const books = [
    { label: "The Raven", tokens: 3116, color: "bg-blue-400" },
    { label: "Dr Jekyll & Mr Hyde", tokens: 35856, color: "bg-blue-500" },
    { label: "War of the Worlds", tokens: 82785, color: "bg-blue-600" },
    { label: "Pride and Prejudice", tokens: 170177, color: "bg-blue-700" },
    { label: "Harry Potter (Series)", tokens: 1445560, color: "bg-blue-900" }
  ];

  // Extended set to fill the gap
  const extendedBooks = [
    ...books,
    { label: "The Hobbit", tokens: 120000, color: "bg-indigo-400" },
    { label: "Dune", tokens: 250000, color: "bg-indigo-500" },
    { label: "Lord of the Rings (Trilogy)", tokens: 630000, color: "bg-indigo-600" },
    { label: "Les Misérables", tokens: 700000, color: "bg-indigo-700" }
  ];

  // Chatbot context windows (chat product, not raw model limits)
  const tiers = [
    { provider: "ChatGPT", tier: "Free", short: "GPT-Free", tokens: 16000, color: "#16a34a" },
    { provider: "ChatGPT", tier: "Plus", short: "GPT-Plus", tokens: 32000, color: "#22c55e" },
    { provider: "ChatGPT", tier: "Pro", short: "GPT-Pro", tokens: 128000, color: "#15803d" },

    { provider: "Claude", tier: "Free", short: "Claude-Free", tokens: 200000, color: "#3b82f6" },
    { provider: "Claude", tier: "Pro", short: "Claude-Pro", tokens: 200000, color: "#1d4ed8" },

    { provider: "Gemini", tier: "Free", short: "Gemini-Free", tokens: 32000, color: "#f59e0b" },
    { provider: "Gemini", tier: "AI Pro", short: "Gemini-Pro", tokens: 1000000, color: "#d97706" },
    { provider: "Gemini", tier: "AI Ultra", short: "Gemini-Ultra", tokens: 1000000, color: "#fb923c" }
  ];

  const capacityBands = [
    { id: "16k", label: "16k tier", short: "GPT-Free" },
    { id: "32k", label: "32k tier", short: "GPT-Plus" },
    { id: "128k", label: "128k tier", short: "GPT-Pro" },
    { id: "1M", label: "1M tier", short: "Gemini-Pro" }
  ];

  const fitMatrix = [
    { book: "The Raven", fits: [true, true, true, true] },
    { book: "Jekyll and Hyde", fits: [false, true, true, true] },
    { book: "War of the Worlds", fits: [false, false, true, true] },
    { book: "Pride and Prejudice", fits: [false, false, false, true] },
    { book: "Harry Potter (Series)", fits: [false, false, false, false] }
  ];

  const axisMax = 1500000;
  const svgWidth = 1000;
  const svgHeight = 320;
  const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  const x = d3.scaleLinear().domain([0, axisMax]).range([0, innerWidth]);

  const ticks = [0, 250000, 500000, 750000, 1000000, 1250000, 1500000];

  // Simple label lane calculation to limit collisions
  const labeledBooks = (() => {
    const approxCharWidth = 6;
    const minGap = 4;
    const laneLastX: number[] = [];

    return extendedBooks
      .slice()
      .sort((a, b) => a.tokens - b.tokens)
      .map((book) => {
        const clamped = Math.min(book.tokens, axisMax);
        const xPos = x(clamped);
        const labelWidth = book.label.length * approxCharWidth;
        let laneIndex = 0;

        while (laneIndex < laneLastX.length && xPos < laneLastX[laneIndex] + labelWidth + minGap) {
          laneIndex += 1;
        }

        if (laneIndex === laneLastX.length) laneLastX.push(xPos);
        laneLastX[laneIndex] = xPos;

        return { ...book, xPos, laneIndex };
      });
  })();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const dragDirectionRef = useRef<"horizontal" | "vertical" | null>(null);
  const lastPointRef = useRef<[number, number] | null>(null);
  const lockedTransformRef = useRef(d3.zoomIdentity);
  const transformRef = useRef(d3.zoomIdentity);

  type OverlayId = "chart" | "free" | "books" | "capacity" | "matrix" | "presenter" | null;
  const [overlaySection, setOverlaySection] = useState<OverlayId>(null);

  // Sync transform ref with state
  useEffect(() => {
    transformRef.current = transform;
    lockedTransformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 6])
      .translateExtent([
        [0, 0],
        [svgWidth, svgHeight]
      ])
      .on("start", (event) => {
        // Reset drag direction when starting a new drag
        dragDirectionRef.current = null;
        lastPointRef.current = [event.sourceEvent.clientX, event.sourceEvent.clientY];
        lockedTransformRef.current = transformRef.current;
      })
      .on("zoom", (event) => {
        const currentTransform = event.transform;
        
        // Determine drag direction on first significant movement
        if (dragDirectionRef.current === null && lastPointRef.current) {
          const dx = Math.abs(event.sourceEvent.clientX - lastPointRef.current[0]);
          const dy = Math.abs(event.sourceEvent.clientY - lastPointRef.current[1]);
          
          // If movement is significant, lock to the primary direction
          if (dx > 5 || dy > 5) {
            dragDirectionRef.current = dx > dy ? "horizontal" : "vertical";
          }
        }
        
        // Apply constraint based on detected direction
        let constrainedTransform = currentTransform;
        if (dragDirectionRef.current === "horizontal") {
          // Only allow horizontal translation, keep vertical locked
          constrainedTransform = d3.zoomIdentity
            .translate(currentTransform.x, lockedTransformRef.current.y)
            .scale(currentTransform.k);
        } else if (dragDirectionRef.current === "vertical") {
          // Only allow vertical translation, keep horizontal locked
          constrainedTransform = d3.zoomIdentity
            .translate(lockedTransformRef.current.x, currentTransform.y)
            .scale(currentTransform.k);
        }
        
        setTransform(constrainedTransform);
      })
      .on("end", () => {
        // Reset on drag end
        dragDirectionRef.current = null;
        lastPointRef.current = null;
      });

    svg.call(zoomBehavior as any);

    return () => {
      svg.on("zoom", null);
      svg.on("start", null);
      svg.on("end", null);
    };
  }, []);

  // Escape key exits overlay
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverlaySection(null);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tickLabel = (t: number) => {
    if (t === 0) return "0";
    if (t === 1000000) return "1M";
    if (t >= 1000000) return `${t / 1000000}M`;
    return `${t / 1000}k`;
  };

  const breakpoints = [
    { tokens: 16000, label: "16k tokens", plans: ["GPT-Free"] },
    { tokens: 32000, label: "32k tokens", plans: ["GPT-Plus", "Gemini-Free"] },
    { tokens: 128000, label: "128k tokens", plans: ["GPT-Pro"] },
    { tokens: 200000, label: "200k tokens", plans: ["Claude-Free", "Claude-Pro"] },
    { tokens: 1000000, label: "1M tokens", plans: ["Gemini-Pro", "Gemini-Ultra"] }
  ];

  const svgTextShadow = {
    textShadow: "0 1px 2px rgba(0,0,0,0.9)"
  } as const;

  const sectionBaseClasses =
    "group p-8 rounded-2xl shadow bg-neutral-800 border border-neutral-700 relative";

  const overlayClasses =
    "fixed inset-0 z-40 m-0 rounded-none border-none bg-neutral-900 overflow-auto";

  const makeSectionClass = (id: OverlayId) => {
    const isOverlay = overlaySection === id;
    const isHidden = overlaySection !== null && overlaySection !== id;
    return [
      sectionBaseClasses,
      isOverlay ? overlayClasses : "",
      isHidden ? "hidden" : ""
    ]
      .filter(Boolean)
      .join(" ");
  };

  const renderFocusButton = (id: OverlayId) => {
    const isOverlay = overlaySection === id;
    return (
      <button
        type="button"
        onClick={() => setOverlaySection(isOverlay ? null : id)}
        className="absolute top-3 right-3 w-10 h-10 rounded border border-neutral-600 bg-neutral-900/90 hover:bg-neutral-800 text-gray-200 hover:text-white flex items-center justify-center text-2xl font-semibold shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100 focus:opacity-100 p-0"
        aria-label={isOverlay ? "Exit focus view" : "Focus this section"}
      >
        <span aria-hidden="true">{isOverlay ? "✕" : "⤢"}</span>
      </button>
    );
  };

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Hubot+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');`}
      </style>
      <div
        className="w-full min-h-screen bg-neutral-900 text-gray-100 p-10 flex flex-col gap-12"
        style={{
          fontFamily:
            '"Hubot Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}
      >
        {/* TITLE */}
        <header className={overlaySection ? "hidden" : "text-center"}>
          <p className="uppercase tracking-widest text-sm text-gray-400 mb-1">
            ChatGPT context windows
          </p>
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
            How many books fit in one prompt?
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto drop-shadow">
            Visualizing popular books against typical ChatGPT, Claude, and Gemini context limits so
            you can explain
            <span className="font-semibold"> 16k / 32k / 128k / 1M tokens </span>
            with concrete stories instead of abstract numbers.
          </p>
        </header>

        {/* SECTION 1: STRIP CHART */}
        <section className={makeSectionClass("chart")}>
          {renderFocusButton("chart")}
          <h2 className="text-3xl font-semibold mb-3 text-center drop-shadow">
            Books and context windows on the same scale
          </h2>
          <p className="text-base text-gray-300 mb-2 text-center">
            Scroll to zoom. Click and drag to pan.
          </p>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Each dot is a book's approximate token length. Vertical lines show common context
            limits across tools.
          </p>

          <div className="w-full overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              width="100%"
              height="auto"
              className="cursor-grab active:cursor-grabbing min-h-[320px]"
              role="img"
              preserveAspectRatio="xMidYMid meet"
            >
              <g transform={`translate(${margin.left},${margin.top})`}>
                <g transform={transform.toString()}>
                  {/* Axis line */}
                  <line
                    x1={0}
                    x2={innerWidth}
                    y1={innerHeight}
                    y2={innerHeight}
                    stroke="#4b5563"
                    strokeWidth={1}
                  />

                  {/* Ticks */}
                  {ticks.map((t) => (
                    <g key={t} transform={`translate(${x(t)},0)`}>
                      <line
                        y1={innerHeight}
                        y2={innerHeight + 6}
                        stroke="#4b5563"
                        strokeWidth={1}
                      />
                      <text
                        y={innerHeight + 20}
                        textAnchor="middle"
                        className="text-[10px] fill-gray-200"
                        style={svgTextShadow}
                      >
                        {tickLabel(t)}
                      </text>
                    </g>
                  ))}

                  {/* Context window lines */}
                  {tiers.map((tier) => {
                    const xPos = x(tier.tokens);
                    return (
                      <g key={`${tier.provider}-${tier.tier}`}>
                        <line
                          x1={xPos}
                          x2={xPos}
                          y1={innerHeight - 70}
                          y2={innerHeight}
                          stroke={tier.color}
                          strokeWidth={2}
                          strokeDasharray="4,4"
                        />
                      </g>
                    );
                  })}

                  {/* Book dots */}
                  {labeledBooks.map((book) => {
                    const { label, xPos, laneIndex } = book as any;
                    const yPos = innerHeight - 40 - laneIndex * 18;

                    return (
                      <g key={label} transform={`translate(${xPos},${yPos})`}>
                        <circle r={5} fill="#60a5fa" opacity={0.95} />
                        <text
                          x={xPos > innerWidth * 0.7 ? -8 : 8}
                          y={-4}
                          textAnchor={xPos > innerWidth * 0.7 ? "end" : "start"}
                          className="text-[10px] fill-gray-100"
                          style={svgTextShadow}
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis label */}
                  <text
                    x={innerWidth / 2}
                    y={innerHeight + 36}
                    textAnchor="middle"
                    className="text-[11px] fill-gray-300"
                    style={svgTextShadow}
                  >
                    Approximate total tokens (book length)
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Key context breakpoints */}
          <div className="mt-6 bg-neutral-900 rounded-lg px-6 py-4 shadow-sm border border-neutral-700">
            <p className="text-sm uppercase tracking-wide text-gray-400 mb-4 font-semibold">
              Key context breakpoints
            </p>
            <div className="space-y-3">
              {breakpoints.map(({ tokens, label, plans }) => {
                const primaryTier =
                  tiers.find((t) => t.tokens === tokens) || tiers.find((t) => t.short === plans[0]);
                const color = primaryTier ? primaryTier.color : "#9ca3af";

                return (
                  <div
                    key={label}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-3 w-12 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-gray-100 text-sm">{label}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {plans.map((shortCode) => {
                        const tier = tiers.find((t) => t.short === shortCode);
                        if (!tier) return null;

                        return (
                          <span
                            key={shortCode}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-gray-200"
                          >
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: tier.color }}
                            />
                            <span>
                              {tier.provider} {tier.tier}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400 text-center">
            Rough rule of thumb: 100 tokens is about 75 words. Exact values vary by encoding.
          </p>
        </section>

        {/* SECTION: FREE TIER BEHAVIOR */}
        <section className={makeSectionClass("free")}>
          {renderFocusButton("free")}
          <h2 className="text-3xl font-semibold mb-4 text-center drop-shadow">
            Free tier behavior
          </h2>
          <p className="text-base text-gray-300 mb-4 text-center max-w-2xl mx-auto">
            Free chatbot tiers can fall back to lighter models after heavy usage or high demand.
            This view summarizes the parts that are publicly documented.
          </p>

          {/* Color legend for free tiers */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 shadow-sm text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#16a34a" }}
              />
              <span className="font-semibold text-gray-100">ChatGPT Free</span>
              <span className="uppercase tracking-wide text-xs text-gray-400">gpt-4o-mini</span>
            </span>
            <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 shadow-sm text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#3b82f6" }}
              />
              <span className="font-semibold text-gray-100">Claude Free</span>
              <span className="uppercase tracking-wide text-xs text-gray-400">Sonnet Free</span>
            </span>
            <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 shadow-sm text-sm">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#f59e0b" }}
              />
              <span className="font-semibold text-gray-100">Gemini Free</span>
              <span className="uppercase tracking-wide text-xs text-gray-400">Flash</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-xl px-6 py-5 shadow-lg border border-neutral-700 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px] text-sm lg:text-base">
              <thead>
                <tr className="bg-neutral-800/80 text-gray-200 border-b-2 border-neutral-700">
                  <th className="py-3 pr-4 font-semibold text-sm lg:text-base">Platform</th>
                  <th className="py-3 pr-4 font-semibold text-sm lg:text-base">Primary free model</th>
                  <th className="py-3 pr-4 font-semibold text-sm lg:text-base">Fallback model</th>
                  <th className="py-3 pr-4 font-semibold text-sm lg:text-base">Behavior notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-800/80 hover:bg-neutral-800/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-2 rounded-full"
                        style={{ backgroundColor: "#16a34a" }}
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-gray-100 font-semibold text-sm lg:text-base">ChatGPT Free</span>
                        <span className="text-xs text-gray-400">ChatGPT app</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-200 align-top text-sm lg:text-base">gpt-4o-mini</td>
                  <td className="py-3 pr-4 text-gray-200 align-top text-sm lg:text-base">gpt-mini</td>
                  <td className="py-3 pr-4 text-gray-400 align-top text-sm lg:text-base">
                    OpenAI notes that usage may fall back to lighter models, but the number of
                    prompts and exact thresholds are not published.
                  </td>
                </tr>
                <tr className="border-b border-neutral-800/80 hover:bg-neutral-800/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-2 rounded-full"
                        style={{ backgroundColor: "#3b82f6" }}
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-gray-100 font-semibold text-sm lg:text-base">Claude Free</span>
                        <span className="text-xs text-gray-400">Claude web</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-200 align-top text-sm lg:text-base">Claude Sonnet Free</td>
                  <td className="py-3 pr-4 text-gray-200 align-top text-sm lg:text-base">Claude Haiku</td>
                  <td className="py-3 pr-4 text-gray-400 align-top text-sm lg:text-base">
                    Anthropic states that sessions can downgrade during high demand, but does not
                    specify request counts or limits.
                  </td>
                </tr>
                <tr className="hover:bg-neutral-800/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-2 rounded-full"
                        style={{ backgroundColor: "#f59e0b" }}
                      />
                      <div className="flex flex-col leading-tight">
                        <span className="text-gray-100 font-semibold text-sm lg:text-base">Gemini Free</span>
                        <span className="text-xs text-gray-400">Gemini app</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-200 align-top text-sm lg:text-base">Gemini Flash</td>
                  <td className="py-3 pr-4 text-gray-200 align-top text-sm lg:text-base">Flash Lite</td>
                  <td className="py-3 pr-4 text-gray-400 align-top text-sm lg:text-base">
                    Google indicates that usage may switch to lighter models, but does not document
                    when or how many prompts trigger it.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 2: BOOK SIZE VS HARRY POTTER */}
        <section className={makeSectionClass("books")}>
          {renderFocusButton("books")}
          <div className="p-10 lg:p-12 rounded-2xl shadow bg-neutral-800 border border-neutral-700">
            <h2 className="text-3xl font-semibold mb-6 text-center drop-shadow">
              How big is each book vs Harry Potter?
            </h2>
            <div className="space-y-5 mb-6">
              {books.map(({ label, tokens, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm lg:text-base mb-2">
                    <span className="font-medium text-gray-100">{label}</span>
                    <span className="text-gray-300 text-sm">
                      {tokens.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="w-full bg-neutral-700 h-5 lg:h-6 rounded-full overflow-hidden">
                    <div
                      className={`${color} h-5 lg:h-6`}
                      style={{ width: `${Math.min((tokens / 1445560) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 text-right">
              Harry Potter (entire series) is 100 percent.
            </p>
          </div>
        </section>

        {/* SECTION 3: CONTEXT WINDOW CAPACITY SNAPSHOTS */}
        <section className={makeSectionClass("capacity")}>
          {renderFocusButton("capacity")}
          <div className="p-10 lg:p-12 rounded-2xl shadow bg-neutral-800 border border-neutral-700">
            <h2 className="text-3xl font-semibold mb-6 text-center drop-shadow">
              Context window capacity snapshots
            </h2>
            <div className="space-y-5">
              {tiers.map(({ provider, tier, tokens, color }) => (
                <div key={`${provider}-${tier}`}>
                  <div className="flex justify-between text-sm lg:text-base mb-2">
                    <span className="font-medium text-gray-100 flex items-center gap-3">
                      <span
                        className="inline-block h-3 w-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {provider} {tier}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {tokens.toLocaleString()} tokens
                    </span>
                  </div>
                  <div className="w-full bg-neutral-700 h-5 lg:h-6 rounded-full overflow-hidden">
                    <div
                      className="h-5 lg:h-6"
                      style={{
                        width: `${Math.min((tokens / 1000000) * 100, 100)}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: FIT MATRIX TABLE */}
        <section className={makeSectionClass("matrix")}>
          {renderFocusButton("matrix")}
          <h2 className="text-3xl font-semibold mb-8 text-center drop-shadow">
            Which capacity tiers can fit each book in a single pass?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-base lg:text-lg">
              <thead>
                <tr className="border-b-2 border-neutral-700 text-gray-200">
                  <th className="py-4 pr-6 text-lg font-semibold">Book</th>
                  {capacityBands.map(({ id, label, short }) => {
                    const tier = tiers.find((t) => t.short === short);
                    const color = tier ? tier.color : "#9ca3af";
                    return (
                      <th key={id} className="py-4 text-center px-3">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm font-medium text-gray-100">{label}</span>
                          <span
                            className="h-2 w-10 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs text-gray-400">{short}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {fitMatrix.map(({ book, fits }) => (
                  <tr
                    key={book}
                    className="border-b border-neutral-700 last:border-0 hover:bg-neutral-800/60 transition-colors"
                  >
                    <td className="py-4 pr-6 font-semibold whitespace-nowrap text-gray-100 text-base">
                      {book}
                    </td>
                    {fits.map((ok, index) => {
                      const band = capacityBands[index];
                      const tier = tiers.find((t) => t.short === band.short);
                      const color = tier ? tier.color : "#9ca3af";
                      return (
                        <td
                          key={band.id}
                          className="py-4 text-center text-base"
                          style={
                            ok
                              ? {
                                  background: `linear-gradient(to right, ${color}22, transparent)`
                                }
                              : undefined
                          }
                        >
                          <span className="inline-flex items-center justify-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: ok ? color : "#4b5563" }}
                            />
                            <span className="text-lg">{ok ? "✔️" : "✖️"}</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 5: PRESENTER STORY CARDS */}
        <section className={makeSectionClass("presenter")}>
          {renderFocusButton("presenter")}
          <h2 className="text-3xl font-semibold mb-8 text-center drop-shadow">
            Presenter cheat sheet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base lg:text-lg">
            <div className="p-8 lg:p-10 bg-neutral-900 rounded-xl shadow border border-neutral-700">
              <h3 className="font-bold mb-3 text-xl flex items-center gap-3">
                <span
                  className="inline-block h-3 w-10 rounded-full"
                  style={{ backgroundColor: tiers.find((t) => t.short === "GPT-Free")?.color }}
                />
                Free tier (16k)
              </h3>
              <p className="mb-2 text-gray-200">
                <span className="font-semibold">Analogy:</span> a short story workspace.
              </p>
              <p className="text-gray-300">
                Good for <span className="font-semibold">The Raven</span>, chapters, emails, and
                small code files. Anything novel sized quickly overflows.
              </p>
            </div>

            <div className="p-8 lg:p-10 bg-neutral-900 rounded-xl shadow border border-neutral-700">
              <h3 className="font-bold mb-3 text-xl flex items-center gap-3">
                <span
                  className="inline-block h-3 w-10 rounded-full"
                  style={{ backgroundColor: tiers.find((t) => t.short === "GPT-Plus")?.color }}
                />
                Plus (32k)
              </h3>
              <p className="mb-2 text-gray-200">
                <span className="font-semibold">Analogy:</span> several short docs or a long
                report.
              </p>
              <p className="text-gray-300">
                You can analyze multiple sections at once, but full novels like
                <span className="font-semibold"> Jekyll and Hyde</span> still need chunking or
                summarization.
              </p>
            </div>

            <div className="p-8 lg:p-10 bg-neutral-900 rounded-xl shadow border border-neutral-700">
              <h3 className="font-bold mb-3 text-xl flex items-center gap-3">
                <span
                  className="inline-block h-3 w-10 rounded-full"
                  style={{ backgroundColor: tiers.find((t) => t.short === "GPT-Pro")?.color }}
                />
                Pro (128k)
              </h3>
              <p className="mb-2 text-gray-200">
                <span className="font-semibold">Analogy:</span> a whole novel plus notes.
              </p>
              <p className="text-gray-300">
                Easily fits <span className="font-semibold">War of the Worlds</span> and similar
                books with room for instructions, examples, or extra docs.
              </p>
            </div>

            <div className="p-8 lg:p-10 bg-neutral-900 rounded-xl shadow border border-neutral-700">
              <h3 className="font-bold mb-3 text-xl flex items-center gap-3">
                <span
                  className="inline-block h-3 w-10 rounded-full"
                  style={{ backgroundColor: tiers.find((t) => t.short === "Gemini-Pro")?.color }}
                />
                One million token tier
              </h3>
              <p className="mb-2 text-gray-200">
                <span className="font-semibold">Analogy:</span> a small bookshelf.
              </p>
              <p className="text-gray-300">
                Can hold long classics like
                <span className="font-semibold"> Pride and Prejudice</span> plus related notes.
                Entire series like
                <span className="font-semibold"> Harry Potter</span> still exceed the limit.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

