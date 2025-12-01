import { ContextSourcesConfig } from '../types/visualization';

export const defaultContextSourcesConfig: ContextSourcesConfig = {
  title: "Where memory fits in the full context-source picture",
  description: "When thinking about 'sources of context,' treat memory as a meta-source — not just what you feed the bot now, but what it retains for future use.",
  showMemoryAsMeta: true,
  sources: [
    {
      id: 'web',
      label: 'Web / live internet access',
      category: 'input',
      description: 'Real-time information from the internet',
      icon: '🌐'
    },
    {
      id: 'uploaded-files',
      label: 'User-uploaded files',
      category: 'input',
      description: 'Docs, PDFs, spreadsheets, images',
      icon: '📄'
    },
    {
      id: 'cloud-storage',
      label: 'Cloud-storage / document-platform links',
      category: 'input',
      description: 'Drive, Docs, Sheets, etc.',
      icon: '☁️'
    },
    {
      id: 'raw-text',
      label: 'Raw text pasted into chat',
      category: 'input',
      description: 'Direct text input',
      icon: '📝'
    },
    {
      id: 'multimodal',
      label: 'Multimodal inputs',
      category: 'input',
      description: 'Images, audio / voice, etc.',
      icon: '🎨'
    },
    {
      id: 'memory',
      label: 'Memory',
      category: 'meta',
      description: 'Persistent conversation history, user preferences, project data, multi-session recall',
      icon: '🧠'
    },
    {
      id: 'session-history',
      label: 'Session chat history',
      category: 'session',
      description: 'The immediate buffer/context window',
      icon: '💬'
    }
  ]
};


