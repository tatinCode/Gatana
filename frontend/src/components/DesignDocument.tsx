import { useState } from 'react';
import { PageTree } from './PageTree';
import { PageEditor } from './PageEditor';
import { Plus, FileText } from 'lucide-react';

export interface PageContent {
  id: string;
  type: 'markdown' | 'panel' | 'bullets' | 'table' | 'whiteboard';
  content: any;
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  children?: Page[];
  content?: PageContent[];
}

const initialPages: Page[] = [
  {
    id: '1',
    title: 'Game Core',
    icon: '🎯',
    children: [],
    content: [
      {
        id: 'c1',
        type: 'markdown',
        content: '# Core Gameplay Loop\n\nDefine the main gameplay mechanics and player experience.'
      }
    ]
  },
  {
    id: '2',
    title: 'Features',
    icon: '⚡',
    children: [],
    content: []
  },
  {
    id: '3',
    title: 'Level Design',
    icon: '🗺️',
    children: [],
    content: []
  },
  {
    id: '4',
    title: 'Narrative & World Building',
    icon: '📖',
    children: [],
    content: []
  },
  {
    id: '5',
    title: 'Characters',
    icon: '👤',
    children: [],
    content: []
  },
  {
    id: '6',
    title: 'Set Dressing',
    icon: '🎨',
    children: [],
    content: []
  },
  {
    id: '7',
    title: 'UI/UX Design',
    icon: '💎',
    children: [],
    content: []
  },
  {
    id: '8',
    title: 'Music & SFX',
    icon: '🎵',
    children: [],
    content: []
  },
  {
    id: '9',
    title: 'Engineering',
    icon: '⚙️',
    children: [],
    content: []
  },
  {
    id: '10',
    title: 'Technical Specs',
    icon: '📋',
    children: [],
    content: []
  },
  {
    id: '11',
    title: 'Business & Marketing',
    icon: '📊',
    children: [],
    content: []
  }
];

interface DesignDocumentProps {
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
  onPageClick: () => void;
}

export function DesignDocument({ selectedPageId, setSelectedPageId, onPageClick }: DesignDocumentProps) {
  const [pages, setPages] = useState<Page[]>(initialPages);

  const handleAddPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'New Page',
      icon: '📄',
      children: [],
      content: []
    };
    setPages([...pages, newPage]);
  };

  const findPageById = (pages: Page[], id: string): Page | null => {
    for (const page of pages) {
      if (page.id === id) return page;
      if (page.children) {
        const found = findPageById(page.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updatePage = (updatedPage: Page) => {
    const updateRecursive = (pages: Page[]): Page[] => {
      return pages.map(page => {
        if (page.id === updatedPage.id) {
          return updatedPage;
        }
        if (page.children) {
          return { ...page, children: updateRecursive(page.children) };
        }
        return page;
      });
    };
    setPages(updateRecursive(pages));
  };

  const currentPage = selectedPageId ? findPageById(pages, selectedPageId) : null;

  return (
    <>
      <div className="w-80 border-r border-zinc-800 bg-gradient-to-br from-purple-950/20 to-zinc-900/40 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <h2 className="tracking-tight">Design Document</h2>
            </div>
            <button
              onClick={handleAddPage}
              className="p-1.5 rounded-md hover:bg-purple-500/20 transition-colors"
            >
              <Plus className="w-4 h-4 text-purple-400" />
            </button>
          </div>
          <div className="text-xs text-zinc-500 bg-zinc-800/30 px-2 py-1 rounded">
            Table of Contents
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto p-2">
          <PageTree
            pages={pages}
            setPages={setPages}
            selectedPage={selectedPageId}
            setSelectedPage={(id) => {
              setSelectedPageId(id);
              onPageClick();
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/50">
          <button
            onClick={handleAddPage}
            className="w-full px-3 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-sm text-purple-300 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Page
          </button>
        </div>
      </div>

      {/* Page Editor - Full Width */}
      {currentPage && (
        <PageEditor page={currentPage} onUpdatePage={updatePage} />
      )}
    </>
  );
}