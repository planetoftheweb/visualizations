# Visualization Builder - Usage Guide

## Overview

This tool helps you create and organize visualizations for your video courses. You can:
- Create multiple pages
- Organize visualizations into video groups
- Preview your visualizations
- Export/import your data

## Getting Started

1. **Start the dev server**: `npm run dev`
2. The app opens with a default page containing one video group with a sample visualization

## Managing Your Visualizations

### Pages
- **Create a Page**: Click "+ New Page" button
- **Select a Page**: Click on a page name to make it active
- **Edit a Page**: Click the ✏️ icon next to a page name
- **Delete a Page**: Click the 🗑️ icon (warning: this deletes all video groups and visualizations in the page)

### Video Groups
- **Create a Group**: Click "+ New Group" button (only works when a page is selected)
- **Edit a Group**: Click the ✏️ icon next to a group
- **Delete a Group**: Click the 🗑️ icon (warning: this deletes all visualizations in the group)

### Visualizations
- **Add Visualization**: Click "+ Add Visualization" in a video group
- **Duplicate**: Click the 📋 icon to copy a visualization
- **Delete**: Click the 🗑️ icon to remove a visualization

## View Modes

### Manage Mode
- Create and organize pages, groups, and visualizations
- Edit titles and descriptions
- Add/remove visualizations

### Preview Mode
- View all visualizations in the current page
- Organized by video groups
- Full interactive visualizations with zoom/pan

## Data Management

### Export
- Click "Export" to download your data as a JSON file
- Save this file to backup your work or share with others

### Import
- Click "Import" to load a previously exported JSON file
- This will replace your current data (make sure to export first if needed)

### Reset
- Click "Reset" to restore default data
- **Warning**: This deletes all your current data

## Data Storage

- All data is automatically saved to browser localStorage
- Data persists between sessions
- Export regularly for backup

## Tips

1. **Organize by Course**: Create one page per course
2. **Group by Video**: Create video groups for each video in your course
3. **Reuse Visualizations**: Duplicate visualizations to reuse them across videos
4. **Export Regularly**: Export your data as a backup before making major changes

## Next Steps

Future enhancements could include:
- Editing visualization configurations
- Customizing colors and data
- Adding new visualization types
- Drag-and-drop reordering
- Template library


