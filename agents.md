# Visualization Builder - Agent Documentation

This document provides detailed information for AI agents working on this codebase.

## Project Overview

This is a visualization builder tool designed for creating and organizing visualizations for video courses. It allows users to:
- Create multiple pages for organizing courses
- Group visualizations by video within each page
- Create, duplicate, and reorder visualizations
- Preview visualizations with zoom/focus functionality
- Export/import data as JSON

## Architecture

### Data Structure

The application uses a hierarchical data structure:

```
VisualizationData
  └── pages: Page[]
      └── videoGroups: VideoGroup[]
          └── visualizations: Visualization[]
```

**Key Types:**
- `Page`: Top-level container for organizing course content
- `VideoGroup`: Groups visualizations for a specific video
- `Visualization`: Individual visualization with type-specific configuration
- `ContextWindowConfig`: Configuration for context window visualizations
- `ContextSourcesConfig`: Configuration for context sources visualizations

### Storage

- **Primary**: localStorage (automatic persistence)
- **Backup**: JSON export/import functionality
- **Key**: `'visualization-data'` in localStorage

### File Structure

```
src/
  ├── types/
  │   └── visualization.ts          # TypeScript type definitions
  ├── data/
  │   ├── defaultData.ts            # Default context window data
  │   └── contextSourcesData.ts     # Context sources data
  ├── hooks/
  │   └── useVisualizationData.ts   # Main data management hook
  ├── components/
  │   ├── App.tsx                    # Main app with view modes
  │   ├── PageManager.tsx            # Page CRUD operations
  │   ├── VideoGroupManager.tsx      # Video group CRUD + visualization list
  │   ├── VisualizationRenderer.tsx  # Routes to correct viz component
  │   └── visualizations/
  │       ├── ContextWindowViz.tsx   # Context window visualization
  │       └── ContextSourcesViz.tsx  # Context sources visualization
  └── main.tsx                       # Entry point
```

## Key Components

### useVisualizationData Hook

Central data management hook providing:
- CRUD operations for pages, video groups, and visualizations
- Automatic localStorage persistence
- Export/import functionality
- Reordering support

**Important Functions:**
- `addPage(title)`: Creates a new page
- `addVideoGroup(pageId, title, description?)`: Adds a group to a page
- `addVisualization(pageId, groupId, visualization)`: Adds a visualization
- `reorderVisualizations(pageId, groupId, fromIndex, toIndex)`: Reorders visualizations
- `duplicateVisualization(pageId, groupId, vizId)`: Clones a visualization

### Visualization Types

Currently supported:
1. **`context-window`**: Interactive D3.js chart showing books vs context window limits
   - Config: `ContextWindowConfig`
   - Sections: chart, free, books, capacity, matrix, presenter
   - Features: zoomable/panable chart, focus buttons

2. **`context-sources`**: Grid display of context sources
   - Config: `ContextSourcesConfig`
   - Shows all sources in unified grid
   - Memory highlighted as meta-source

### View Modes

1. **Manage Mode**: Create/edit pages, groups, and visualizations
2. **Preview Mode**: View all visualizations organized by groups

### Overlay/Focus System

- Each visualization can be zoomed to fullscreen
- When zoomed, navigation and other visualizations are hidden
- Tracked via `activeOverlayVizId` in App component
- Escape key or X button exits zoom

## Adding New Visualization Types

1. **Define Config Type** in `src/types/visualization.ts`:
```typescript
export interface MyVizConfig {
  title?: string;
  description?: string;
  // ... your config properties
}
```

2. **Add to VisualizationType**:
```typescript
export type VisualizationType = 'context-window' | 'context-sources' | 'my-viz' | ...
```

3. **Create Component** in `src/components/visualizations/MyViz.tsx`:
```typescript
interface MyVizProps {
  config: MyVizConfig;
  onOverlayChange?: (isOverlay: boolean) => void;
}
```

4. **Add to VisualizationRenderer**:
```typescript
case 'my-viz':
  return <MyViz config={visualization.config as MyVizConfig} onOverlayChange={onOverlayChange} />;
```

5. **Add Default Data** in `src/data/` if needed

6. **Update VideoGroupManager** to include button for new type

## Data Flow

1. **Initialization**: `useVisualizationData` loads from localStorage or creates default data
2. **Updates**: All mutations update state → trigger localStorage save via useEffect
3. **Rendering**: App → VideoGroupManager → VisualizationRenderer → Type-specific component
4. **Overlay**: Component calls `onOverlayChange(true)` → App hides other visualizations

## Key Patterns

### Drag and Drop
- Uses HTML5 drag and drop API
- `draggedIndex` tracks what's being dragged
- `dragOverIndex` tracks drop target
- `reorderVisualizations` updates order values

### Focus/Overlay
- Each visualization manages its own overlay state
- Calls `onOverlayChange` callback with visualization ID
- App component tracks `activeOverlayVizId` and hides others

### Styling
- Tailwind CSS throughout
- Dark theme: `bg-neutral-900`, `bg-neutral-800`, etc.
- Consistent spacing: `gap-6`, `p-8`, etc.
- Responsive: `md:`, `lg:` breakpoints

## Common Tasks

### Adding a New Section to ContextWindowViz
1. Add section flag to `ContextWindowConfig.sections`
2. Add conditional rendering in `ContextWindowViz.tsx`
3. Update default data if needed

### Modifying Default Data
- Edit `src/data/defaultData.ts` for context window defaults
- Edit `src/data/contextSourcesData.ts` for context sources defaults
- Changes only affect new data (existing localStorage data unchanged)

### Changing Storage
- Currently uses localStorage
- To switch to API: modify `useVisualizationData.ts`
- Export/import functions already support JSON

## Dependencies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite 5**: Build tool and dev server
- **D3.js 7**: Data visualization (for context window chart)
- **Tailwind CSS 3**: Styling

## Build & Deploy

- **Dev**: `npm run dev` (port 5173)
- **Build**: `npm run build` (outputs to `docs/`)
- **Preview**: `npm run preview` (preview production build)
- **Deploy**: Commit `docs/` folder to main branch, configure GitHub Pages to serve from `/docs`

## Important Notes

- All data persists in localStorage automatically
- Export regularly for backup
- Reset function restores default data (destructive)
- Visualization order is managed via `order` property
- Each entity has `id`, `createdAt`, `updatedAt` timestamps

## Future Enhancements

Potential areas for extension:
- Visualization configuration editor UI
- More visualization types
- Template library
- Collaboration features
- Version history
- Custom color themes
- Advanced drag-and-drop (between groups)


