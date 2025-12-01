# Visualization Builder

A tool for creating and organizing visualizations for video courses. Build interactive, zoomable visualizations and organize them by page and video.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Features

- **Multi-page organization**: Create separate pages for different courses
- **Video groups**: Organize visualizations by video within each page
- **Drag & drop reordering**: Easily reorder visualizations
- **Zoom/focus mode**: Click the ⤢ button to focus on any visualization
- **Export/Import**: Save your work as JSON files
- **Auto-save**: All changes automatically saved to browser storage

## Usage

### Creating Content

1. **Create a Page**: Click "+ New Page" in Manage mode
2. **Add Video Groups**: Click "+ New Group" within a page
3. **Add Visualizations**: Click "+ Context Window" or "+ Context Sources" in a group
4. **Reorder**: Drag visualizations up/down to reorder
5. **Preview**: Switch to Preview mode to see all visualizations

### View Modes

- **Manage**: Create and organize your content
- **Preview**: View all visualizations as they'll appear

### Zoom/Focus

- Hover over any visualization to see the ⤢ button
- Click to zoom that visualization to fullscreen
- Press Escape or click ✕ to exit

### Data Management

- **Export**: Download your data as JSON for backup
- **Import**: Load previously exported data
- **Reset**: Restore default data (⚠️ deletes current data)

## Visualization Types

### Context Window
Interactive chart showing books vs AI context window limits. Includes:
- Zoomable/panable chart
- Free tier behavior table
- Book size comparisons
- Capacity snapshots
- Fit matrix
- Presenter cheat sheet

### Context Sources
Grid display of all context sources showing:
- Web access
- File uploads
- Cloud storage links
- Text input
- Multimodal inputs
- Memory (highlighted as meta-source)
- Session history

## Project Structure

```
src/
  ├── components/          # React components
  ├── hooks/              # Custom React hooks
  ├── types/              # TypeScript definitions
  ├── data/               # Default data templates
  └── main.tsx            # Entry point
```

## Development

Built with:
- **Vite 5** - Fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **D3.js** - Data visualization
- **Tailwind CSS** - Styling

## Deployment

Configured for GitHub Pages:
1. Update `base` in `vite.config.ts` to match your repo name
2. Run `npm run deploy`
3. Enable GitHub Pages in repo settings (gh-pages branch)

## Data Storage

- **Primary**: Browser localStorage (automatic)
- **Backup**: JSON export/import
- **Key**: `visualization-data` in localStorage

## Tips

- Export regularly for backup
- Use pages to organize by course
- Use video groups to organize by lesson
- Duplicate visualizations to reuse them
- Drag to reorder within groups

## License

MIT
