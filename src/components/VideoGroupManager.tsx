import { useState } from 'react';
import React from 'react';
import { useVisualizationData } from '../hooks/useVisualizationData';

export default function VideoGroupManager() {
  const { currentPage, addVideoGroup, updateVideoGroup, deleteVideoGroup } = useVisualizationData();
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (!currentPage) {
    return (
      <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
        <p className="text-gray-400">Please select a page first</p>
      </div>
    );
  }

  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const handleAddGroup = () => {
    setIsAddingGroup(true);
    setNewGroupTitle('');
    setNewGroupDescription('');
  };

  const handleSaveNewGroup = () => {
    if (newGroupTitle.trim()) {
      addVideoGroup(currentPage.id, newGroupTitle.trim(), newGroupDescription.trim() || undefined);
      setIsAddingGroup(false);
      setNewGroupTitle('');
      setNewGroupDescription('');
    }
  };

  const handleCancelNewGroup = () => {
    setIsAddingGroup(false);
    setNewGroupTitle('');
    setNewGroupDescription('');
  };

  const handleEditStart = (groupId: string, currentTitle: string, currentDescription?: string) => {
    setEditingGroupId(groupId);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription || '');
  };

  const handleEditSave = (groupId: string) => {
    if (editTitle.trim()) {
      updateVideoGroup(currentPage.id, groupId, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined
      });
    }
    setEditingGroupId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleDelete = (groupId: string) => {
    if (confirm('Are you sure you want to delete this video group? All visualizations will be lost.')) {
      deleteVideoGroup(currentPage.id, groupId);
    }
  };

  return (
    <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-100">
          Video Groups - {currentPage.title}
        </h2>
        {!isAddingGroup && (
          <button
            onClick={handleAddGroup}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            + New Group
          </button>
        )}
      </div>

      {isAddingGroup && (
        <div className="mb-4 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
          <input
            type="text"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            placeholder="Enter video group title"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-gray-100 mb-2"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveNewGroup();
              }
              if (e.key === 'Escape') handleCancelNewGroup();
            }}
          />
          <textarea
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-gray-100 mb-2"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNewGroup}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancelNewGroup}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {currentPage.videoGroups.map((group) => (
          <div
            key={group.id}
            className="bg-neutral-900 rounded-lg border border-neutral-700 p-4"
          >
            {editingGroupId === group.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Group title"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-gray-100"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-gray-100"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSave(group.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingGroupId(null)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100">{group.title}</h3>
                    {group.description && (
                      <p className="text-sm text-gray-400 mt-1">{group.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {group.visualizations.length} visualization{group.visualizations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(group.id, group.title, group.description)}
                      className="px-2 py-1 text-gray-400 hover:text-gray-200 text-sm"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="px-2 py-1 text-red-400 hover:text-red-300 text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <VideoGroupVisualizations groupId={group.id} />
              </>
            )}
          </div>
        ))}
      </div>

      {currentPage.videoGroups.length === 0 && (
        <p className="text-gray-400 text-center py-8">No video groups yet. Create your first group!</p>
      )}
    </div>
  );
}

function VideoGroupVisualizations({ groupId }: { groupId: string }) {
  const { currentPage, deleteVisualization, duplicateVisualization, reorderVisualizations } = useVisualizationData();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!currentPage) return null;

  const group = currentPage.videoGroups.find(g => g.id === groupId);
  if (!group) return null;

  // Sort visualizations by order
  const sortedVisualizations = [...group.visualizations].sort((a, b) => a.order - b.order);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    reorderVisualizations(currentPage.id, groupId, draggedIndex, dropIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="mt-4 space-y-2">
      {sortedVisualizations.length === 0 ? (
        <div className="p-4 bg-neutral-800 rounded border border-neutral-700 text-center text-gray-400 text-sm">
          No visualizations in this group.
        </div>
      ) : (
        sortedVisualizations.map((viz, index) => (
          <div
            key={viz.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between p-3 bg-neutral-800 rounded border border-neutral-700 transition-all ${
              draggedIndex === index
                ? 'opacity-50 cursor-grabbing'
                : dragOverIndex === index
                ? 'border-blue-500 bg-blue-900/20 scale-105'
                : 'hover:bg-neutral-750 cursor-grab'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-gray-500 text-lg cursor-grab active:cursor-grabbing">
                ⋮⋮
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100">{viz.title}</div>
                <div className="text-xs text-gray-400 mt-1">{viz.type}</div>
                {!viz.visible && (
                  <div className="text-xs text-yellow-400 mt-1">Hidden</div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => duplicateVisualization(currentPage.id, groupId, viz.id)}
                className="px-2 py-1 text-gray-400 hover:text-gray-200 text-xs"
                title="Duplicate"
              >
                📋
              </button>
              <button
                onClick={() => deleteVisualization(currentPage.id, groupId, viz.id)}
                className="px-2 py-1 text-red-400 hover:text-red-300 text-xs"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

