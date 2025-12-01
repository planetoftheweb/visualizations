import { useState } from 'react';
import { useVisualizationData } from '../hooks/useVisualizationData';

export default function PageManager() {
  const { data, addPage, updatePage, deletePage, setCurrentPage, currentPage } = useVisualizationData();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');

  const handleAddPage = () => {
    setIsAddingPage(true);
    setNewPageTitle('');
  };

  const handleSaveNewPage = () => {
    if (newPageTitle.trim()) {
      addPage(newPageTitle.trim());
      setIsAddingPage(false);
      setNewPageTitle('');
    }
  };

  const handleCancelNewPage = () => {
    setIsAddingPage(false);
    setNewPageTitle('');
  };

  const handleEditStart = (pageId: string, currentTitle: string) => {
    setEditingPageId(pageId);
    setEditTitle(currentTitle);
  };

  const handleEditSave = (pageId: string) => {
    if (editTitle.trim()) {
      updatePage(pageId, { title: editTitle.trim() });
    }
    setEditingPageId(null);
    setEditTitle('');
  };

  const handleDelete = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page? All video groups and visualizations will be lost.')) {
      deletePage(pageId);
    }
  };

  return (
    <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-100">Pages</h2>
        {!isAddingPage && (
          <button
            onClick={handleAddPage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            + New Page
          </button>
        )}
      </div>

      {isAddingPage && (
        <div className="mb-4 p-3 bg-neutral-900 rounded-lg border border-neutral-700">
          <input
            type="text"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="Enter page title"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-gray-100 mb-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveNewPage();
              if (e.key === 'Escape') handleCancelNewPage();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNewPage}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancelNewPage}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data.pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              currentPage?.id === page.id
                ? 'bg-blue-900/30 border-blue-600'
                : 'bg-neutral-900 border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            {editingPageId === page.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-3 py-1 bg-neutral-800 border border-neutral-600 rounded text-gray-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(page.id);
                    if (e.key === 'Escape') setEditingPageId(null);
                  }}
                />
                <button
                  onClick={() => handleEditSave(page.id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPageId(null)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage(page.id)}
                  className="flex-1 text-left px-3 py-2 text-gray-100 hover:text-white"
                >
                  <div className="font-medium">{page.title}</div>
                  <div className="text-xs text-gray-400">
                    {page.videoGroups.length} video group{page.videoGroups.length !== 1 ? 's' : ''}
                  </div>
                </button>
                <button
                  onClick={() => handleEditStart(page.id, page.title)}
                  className="px-3 py-1 text-gray-400 hover:text-gray-200"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="px-3 py-1 text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {data.pages.length === 0 && (
        <p className="text-gray-400 text-center py-8">No pages yet. Create your first page!</p>
      )}
    </div>
  );
}

