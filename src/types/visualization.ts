// Core data types for the visualization system

export interface Book {
  label: string;
  tokens: number;
  color: string;
}

export interface Tier {
  provider: string;
  tier: string;
  short: string;
  tokens: number;
  color: string;
}

export interface CapacityBand {
  id: string;
  label: string;
  short: string;
}

export interface FitMatrixEntry {
  book: string;
  fits: boolean[];
}

export interface ChartSettings {
  axisMax: number;
  svgWidth: number;
  svgHeight: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ContextWindowConfig {
  books: Book[];
  extendedBooks: Book[];
  tiers: Tier[];
  capacityBands: CapacityBand[];
  fitMatrix: FitMatrixEntry[];
  chartSettings: ChartSettings;
  sections: {
    chart: boolean;
    free: boolean;
    books: boolean;
    capacity: boolean;
    matrix: boolean;
    presenter: boolean;
  };
  title?: string;
  description?: string;
}

export interface ContextSource {
  id: string;
  label: string;
  category: 'input' | 'meta' | 'session';
  description?: string;
  icon?: string;
}

export interface ContextSourcesConfig {
  title?: string;
  description?: string;
  sources: ContextSource[];
  showMemoryAsMeta?: boolean;
}

export interface TokenConceptConfig {
  title?: string;
  description?: string;
  exampleText?: string;
}

export interface ContextWindowConceptConfig {
  title?: string;
  description?: string;
}

export type VisualizationType = 'context-window' | 'context-sources' | 'token-concept' | 'context-window-concept' | 'comparison' | 'matrix' | 'custom';

export interface Visualization {
  id: string;
  type: VisualizationType;
  title: string;
  config: ContextWindowConfig | ContextSourcesConfig | Record<string, unknown>; // extensible for other types
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoGroup {
  id: string;
  title: string;
  description?: string;
  order: number;
  visualizations: Visualization[];
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  videoGroups: VideoGroup[];
}

export interface VisualizationData {
  pages: Page[];
  currentPageId: string | null;
}
