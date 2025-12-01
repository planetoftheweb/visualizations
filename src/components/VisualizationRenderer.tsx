import { Visualization } from '../types/visualization';
import ContextWindowViz from './visualizations/ContextWindowViz';
import ContextSourcesViz from './visualizations/ContextSourcesViz';
import TokenConceptViz from './visualizations/TokenConceptViz';
import ContextWindowConceptViz from './visualizations/ContextWindowConceptViz';
import { ContextWindowConfig, ContextSourcesConfig, TokenConceptConfig, ContextWindowConceptConfig } from '../types/visualization';

interface VisualizationRendererProps {
  visualization: Visualization;
  onOverlayChange?: (isOverlay: boolean) => void;
}

export default function VisualizationRenderer({ visualization, onOverlayChange }: VisualizationRendererProps) {
  if (!visualization.visible) {
    return null;
  }

  switch (visualization.type) {
    case 'context-window':
      return <ContextWindowViz config={visualization.config as ContextWindowConfig} onOverlayChange={onOverlayChange} />;
    case 'context-sources':
      return <ContextSourcesViz config={visualization.config as ContextSourcesConfig} onOverlayChange={onOverlayChange} />;
    case 'token-concept':
      return <TokenConceptViz config={visualization.config as TokenConceptConfig} onOverlayChange={onOverlayChange} />;
    case 'context-window-concept':
      return <ContextWindowConceptViz config={visualization.config as ContextWindowConceptConfig} onOverlayChange={onOverlayChange} />;
    case 'comparison':
    case 'matrix':
    case 'custom':
      return (
        <div className="p-8 bg-neutral-800 rounded-lg border border-neutral-700">
          <p className="text-gray-400">Visualization type "{visualization.type}" not yet implemented</p>
        </div>
      );
    default:
      return (
        <div className="p-8 bg-neutral-800 rounded-lg border border-neutral-700">
          <p className="text-gray-400">Unknown visualization type</p>
        </div>
      );
  }
}

