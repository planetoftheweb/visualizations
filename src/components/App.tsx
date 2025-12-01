import { useState } from 'react';
import { useVisualizationData } from '../hooks/useVisualizationData';
import PageManager from './PageManager';
import VideoGroupManager from './VideoGroupManager';
import VisualizationRenderer from './VisualizationRenderer';

type ViewMode = 'manage' | 'preview';

export default function App() {
  const { currentPage, exportData, importData, resetData } = useVisualizationData();
  const [viewMode, setViewMode] = useState<ViewMode>('manage');
  const [activeOverlayVizId, setActiveOverlayVizId] = useState<string | null>(null);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            importData(data);
            alert('Data imported successfully!');
          } catch (error) {
            alert('Error importing data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      {/* Header - Fixed at top, hidden when overlay is active */}
      {!activeOverlayVizId && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-800 border-b border-neutral-700 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">Visualization Builder</h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('manage')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'manage'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                  }`}
                >
                  Manage
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportData}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Import
                </button>
                <button
                  onClick={resetData}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={activeOverlayVizId ? "" : "max-w-7xl mx-auto p-6 pt-24"}>
        {viewMode === 'manage' ? (
          <div className="space-y-6">
            <PageManager />
            {currentPage && <VideoGroupManager />}
          </div>
        ) : (
          <div className="space-y-12">
            {currentPage ? (
              currentPage.videoGroups.map((group) => (
                <div key={group.id} className="space-y-8">
                  {/* Hide group header when overlay is active */}
                  {!activeOverlayVizId && (
                    <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
                      <h2 className="text-3xl font-bold mb-2">{group.title}</h2>
                      {group.description && (
                        <p className="text-gray-400">{group.description}</p>
                      )}
                    </div>
                  )}
                  {group.visualizations.map((viz) => (
                    <div 
                      key={viz.id}
                      className={activeOverlayVizId && activeOverlayVizId !== viz.id ? "hidden" : ""}
                    >
                      <VisualizationRenderer 
                        visualization={viz} 
                        onOverlayChange={(isOverlay) => setActiveOverlayVizId(isOverlay ? viz.id : null)}
                      />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-12 text-center">
                <p className="text-gray-400 text-lg">
                  No page selected. Please create or select a page in Manage mode.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

