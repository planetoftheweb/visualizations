import { VisualizationData, ContextWindowConfig } from '../types/visualization';
import { defaultContextSourcesConfig } from './contextSourcesData';

// Default context window configuration (from current visualization)
export const defaultContextWindowConfig: ContextWindowConfig = {
  books: [
    { label: "The Raven", tokens: 3116, color: "bg-blue-400" },
    { label: "Dr Jekyll & Mr Hyde", tokens: 35856, color: "bg-blue-500" },
    { label: "War of the Worlds", tokens: 82785, color: "bg-blue-600" },
    { label: "Pride and Prejudice", tokens: 170177, color: "bg-blue-700" },
    { label: "Harry Potter (Series)", tokens: 1445560, color: "bg-blue-900" }
  ],
  extendedBooks: [
    { label: "The Raven", tokens: 3116, color: "bg-blue-400" },
    { label: "Dr Jekyll & Mr Hyde", tokens: 35856, color: "bg-blue-500" },
    { label: "War of the Worlds", tokens: 82785, color: "bg-blue-600" },
    { label: "Pride and Prejudice", tokens: 170177, color: "bg-blue-700" },
    { label: "Harry Potter (Series)", tokens: 1445560, color: "bg-blue-900" },
    { label: "The Hobbit", tokens: 120000, color: "bg-indigo-400" },
    { label: "Dune", tokens: 250000, color: "bg-indigo-500" },
    { label: "Lord of the Rings (Trilogy)", tokens: 630000, color: "bg-indigo-600" },
    { label: "Les Misérables", tokens: 700000, color: "bg-indigo-700" }
  ],
  tiers: [
    { provider: "ChatGPT", tier: "Free", short: "GPT-Free", tokens: 16000, color: "#16a34a" },
    { provider: "ChatGPT", tier: "Plus", short: "GPT-Plus", tokens: 32000, color: "#22c55e" },
    { provider: "ChatGPT", tier: "Pro", short: "GPT-Pro", tokens: 128000, color: "#15803d" },
    { provider: "Claude", tier: "Free", short: "Claude-Free", tokens: 200000, color: "#3b82f6" },
    { provider: "Claude", tier: "Pro", short: "Claude-Pro", tokens: 200000, color: "#1d4ed8" },
    { provider: "Gemini", tier: "Free", short: "Gemini-Free", tokens: 32000, color: "#f59e0b" },
    { provider: "Gemini", tier: "AI Pro", short: "Gemini-Pro", tokens: 1000000, color: "#d97706" },
    { provider: "Gemini", tier: "AI Ultra", short: "Gemini-Ultra", tokens: 1000000, color: "#fb923c" }
  ],
  capacityBands: [
    { id: "16k", label: "16k tier", short: "GPT-Free" },
    { id: "32k", label: "32k tier", short: "GPT-Plus" },
    { id: "128k", label: "128k tier", short: "GPT-Pro" },
    { id: "1M", label: "1M tier", short: "Gemini-Pro" }
  ],
  fitMatrix: [
    { book: "The Raven", fits: [true, true, true, true] },
    { book: "Jekyll and Hyde", fits: [false, true, true, true] },
    { book: "War of the Worlds", fits: [false, false, true, true] },
    { book: "Pride and Prejudice", fits: [false, false, false, true] },
    { book: "Harry Potter (Series)", fits: [false, false, false, false] }
  ],
  chartSettings: {
    axisMax: 1500000,
    svgWidth: 1000,
    svgHeight: 320,
    margin: { top: 40, right: 40, bottom: 60, left: 80 }
  },
  sections: {
    chart: true,
    free: true,
    books: true,
    capacity: true,
    matrix: true,
    presenter: true
  },
  title: "How many books fit in one prompt?",
  description: "Visualizing popular books against typical ChatGPT, Claude, and Gemini context limits"
};

export const createDefaultData = (): VisualizationData => {
  const now = new Date().toISOString();
  const pageId = `page-${Date.now()}`;
  const groupId = `group-${Date.now()}`;
  const baseTime = Date.now();

  // Create separate visualizations for each section
  const visualizations = [
    {
      id: `viz-${baseTime}-0`,
      type: 'token-concept' as const,
      title: "What are tokens?",
      config: {
        title: "What are tokens?",
        description: "An AI system breaks your inputs into small pieces called tokens and then uses patterns and relationships between those tokens to decide what to output next."
      },
      order: 0,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-0b`,
      type: 'context-window-concept' as const,
      title: "The Context Window",
      config: {
        title: "The Context Window",
        description: "A token is a word or part of a word, and every system has a limit on how many tokens it can work with at once. That limit is called the context window."
      },
      order: 1,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-1`,
      type: 'context-window' as const,
      title: "Interactive Chart - Books and Context Windows",
      config: {
        ...defaultContextWindowConfig,
        sections: {
          chart: true,
          free: false,
          books: false,
          capacity: false,
          matrix: false,
          presenter: false
        },
        title: "Books and context windows on the same scale",
        description: "Interactive zoomable chart showing books and context window limits"
      },
      order: 2,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-2`,
      type: 'context-window' as const,
      title: "Free Tier Behavior",
      config: {
        ...defaultContextWindowConfig,
        sections: {
          chart: false,
          free: true,
          books: false,
          capacity: false,
          matrix: false,
          presenter: false
        },
        title: "Free tier behavior",
        description: "How free chatbot tiers fall back to lighter models"
      },
      order: 3,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-3`,
      type: 'context-window' as const,
      title: "Book Size Comparison",
      config: {
        ...defaultContextWindowConfig,
        sections: {
          chart: false,
          free: false,
          books: true,
          capacity: false,
          matrix: false,
          presenter: false
        },
        title: "How big is each book vs Harry Potter?",
        description: "Visual comparison of book sizes"
      },
      order: 4,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-4`,
      type: 'context-window' as const,
      title: "Context Window Capacity",
      config: {
        ...defaultContextWindowConfig,
        sections: {
          chart: false,
          free: false,
          books: false,
          capacity: true,
          matrix: false,
          presenter: false
        },
        title: "Context window capacity snapshots",
        description: "Comparing different AI service tiers"
      },
      order: 5,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-5`,
      type: 'context-window' as const,
      title: "Fit Matrix - Which Books Fit?",
      config: {
        ...defaultContextWindowConfig,
        sections: {
          chart: false,
          free: false,
          books: false,
          capacity: false,
          matrix: true,
          presenter: false
        },
        title: "Which capacity tiers can fit each book?",
        description: "Matrix showing which books fit in different context window sizes"
      },
      order: 6,
      visible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: `viz-${baseTime}-6`,
      type: 'context-sources' as const,
      title: "Context Sources - Where Memory Fits",
      config: defaultContextSourcesConfig,
      order: 7,
      visible: true,
      createdAt: now,
      updatedAt: now
    }
  ];

  return {
    pages: [
      {
        id: pageId,
        title: "My First Page",
        createdAt: now,
        updatedAt: now,
        videoGroups: [
          {
            id: groupId,
            title: "Video 1: Introduction",
            description: "Introduction to context windows",
            order: 0,
            visualizations: visualizations,
            createdAt: now,
            updatedAt: now
          }
        ]
      }
    ],
    currentPageId: pageId
  };
};

