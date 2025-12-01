import { useState, useEffect, useCallback } from 'react';
import { VisualizationData, Page, VideoGroup, Visualization } from '../types/visualization';
import { createDefaultData } from '../data/defaultData';

const STORAGE_KEY = 'visualization-data';

export const useVisualizationData = () => {
  const [data, setData] = useState<VisualizationData>(() => {
    // Load from localStorage or create default
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return createDefaultData();
      }
    }
    return createDefaultData();
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Page management
  const addPage = useCallback((title: string) => {
    const now = new Date().toISOString();
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title,
      createdAt: now,
      updatedAt: now,
      videoGroups: []
    };
    setData(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
      currentPageId: newPage.id
    }));
    return newPage.id;
  }, []);

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? { ...page, ...updates, updatedAt: new Date().toISOString() }
          : page
      )
    }));
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setData(prev => {
      const newPages = prev.pages.filter(p => p.id !== pageId);
      return {
        ...prev,
        pages: newPages,
        currentPageId: newPages.length > 0 ? newPages[0].id : null
      };
    });
  }, []);

  const setCurrentPage = useCallback((pageId: string) => {
    setData(prev => ({ ...prev, currentPageId: pageId }));
  }, []);

  // Video group management
  const addVideoGroup = useCallback((pageId: string, title: string, description?: string) => {
    const now = new Date().toISOString();
    const newGroup: VideoGroup = {
      id: `group-${Date.now()}`,
      title,
      description,
      order: 0,
      visualizations: [],
      createdAt: now,
      updatedAt: now
    };
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: [...page.videoGroups, newGroup],
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
    return newGroup.id;
  }, []);

  const updateVideoGroup = useCallback((
    pageId: string,
    groupId: string,
    updates: Partial<VideoGroup>
  ) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: page.videoGroups.map(group =>
                group.id === groupId
                  ? { ...group, ...updates, updatedAt: new Date().toISOString() }
                  : group
              ),
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
  }, []);

  const deleteVideoGroup = useCallback((pageId: string, groupId: string) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: page.videoGroups.filter(g => g.id !== groupId),
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
  }, []);

  // Visualization management
  const addVisualization = useCallback((
    pageId: string,
    groupId: string,
    visualization: Omit<Visualization, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const now = new Date().toISOString();
    const newViz: Visualization = {
      ...visualization,
      id: `viz-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: page.videoGroups.map(group =>
                group.id === groupId
                  ? {
                      ...group,
                      visualizations: [...group.visualizations, newViz],
                      updatedAt: new Date().toISOString()
                    }
                  : group
              ),
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
    return newViz.id;
  }, []);

  const updateVisualization = useCallback((
    pageId: string,
    groupId: string,
    vizId: string,
    updates: Partial<Visualization>
  ) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: page.videoGroups.map(group =>
                group.id === groupId
                  ? {
                      ...group,
                      visualizations: group.visualizations.map(viz =>
                        viz.id === vizId
                          ? { ...viz, ...updates, updatedAt: new Date().toISOString() }
                          : viz
                      ),
                      updatedAt: new Date().toISOString()
                    }
                  : group
              ),
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
  }, []);

  const deleteVisualization = useCallback((
    pageId: string,
    groupId: string,
    vizId: string
  ) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: page.videoGroups.map(group =>
                group.id === groupId
                  ? {
                      ...group,
                      visualizations: group.visualizations.filter(v => v.id !== vizId),
                      updatedAt: new Date().toISOString()
                    }
                  : group
              ),
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
  }, []);

  const duplicateVisualization = useCallback((
    pageId: string,
    groupId: string,
    vizId: string
  ) => {
    const page = data.pages.find(p => p.id === pageId);
    const group = page?.videoGroups.find(g => g.id === groupId);
    const viz = group?.visualizations.find(v => v.id === vizId);
    
    if (viz && group) {
      const now = new Date().toISOString();
      const newViz: Visualization = {
        ...viz,
        id: `viz-${Date.now()}`,
        title: `${viz.title} (Copy)`,
        order: group.visualizations.length,
        createdAt: now,
        updatedAt: now
      };
      setData(prev => ({
        ...prev,
        pages: prev.pages.map(p =>
          p.id === pageId
            ? {
                ...p,
                videoGroups: p.videoGroups.map(g =>
                  g.id === groupId
                    ? {
                        ...g,
                        visualizations: [...g.visualizations, newViz],
                        updatedAt: now
                      }
                    : g
                ),
                updatedAt: now
              }
            : p
        )
      }));
    }
  }, [data]);

  const reorderVisualizations = useCallback((
    pageId: string,
    groupId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    setData(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === pageId
          ? {
              ...page,
              videoGroups: page.videoGroups.map(group =>
                group.id === groupId
                  ? {
                      ...group,
                      visualizations: (() => {
                        const newViz = [...group.visualizations];
                        const [removed] = newViz.splice(fromIndex, 1);
                        newViz.splice(toIndex, 0, removed);
                        // Update order values
                        return newViz.map((viz, idx) => ({
                          ...viz,
                          order: idx,
                          updatedAt: new Date().toISOString()
                        }));
                      })(),
                      updatedAt: new Date().toISOString()
                    }
                  : group
              ),
              updatedAt: new Date().toISOString()
            }
          : page
      )
    }));
  }, []);

  // Export/Import
  const exportData = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visualizations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonData: VisualizationData) => {
    setData(jsonData);
  }, []);

  const resetData = useCallback(() => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      const defaultData = createDefaultData();
      setData(defaultData);
    }
  }, []);

  const currentPage = data.pages.find(p => p.id === data.currentPageId);

  return {
    data,
    currentPage,
    // Page operations
    addPage,
    updatePage,
    deletePage,
    setCurrentPage,
    // Video group operations
    addVideoGroup,
    updateVideoGroup,
    deleteVideoGroup,
    // Visualization operations
    addVisualization,
    updateVisualization,
    deleteVisualization,
    duplicateVisualization,
    reorderVisualizations,
    // Import/Export
    exportData,
    importData,
    resetData
  };
};

