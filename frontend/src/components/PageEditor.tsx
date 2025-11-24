import { useState } from 'react';
import type { Page, PageContent } from './DesignDocument';
import { Plus, Type, Square, List, Table2, Pen, Trash2 } from 'lucide-react';
import { MarkdownBlock } from './content-blocks/MarkdownBlock';
import { PanelBlock } from './content-blocks/PanelBlock';
import { BulletsBlock } from './content-blocks/BulletsBlock';
import { TableBlock } from './content-blocks/TableBlock';
import { WhiteboardBlock } from './content-blocks/WhiteboardBlock';

interface PageEditorProps {
  page: Page;
  onUpdatePage: (page: Page) => void;
}

export function PageEditor({ page, onUpdatePage }: PageEditorProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(page.title);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleTitleSave = () => {
    onUpdatePage({ ...page, title: editedTitle });
    setIsEditingTitle(false);
  };

  const addContentBlock = (type: PageContent['type']) => {
    const newBlock: PageContent = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    };
    onUpdatePage({
      ...page,
      content: [...(page.content || []), newBlock]
    });
    setShowAddMenu(false);
  };

  const getDefaultContent = (type: PageContent['type']) => {
    switch (type) {
      case 'markdown':
        return '# Heading\n\nStart writing...';
      case 'panel':
        return { title: 'Panel Title', content: 'Panel content', color: 'blue' };
      case 'bullets':
        return ['Item 1', 'Item 2', 'Item 3'];
      case 'table':
        return {
          headers: ['Column 1', 'Column 2', 'Column 3'],
          rows: [
            ['Data 1', 'Data 2', 'Data 3'],
            ['Data 4', 'Data 5', 'Data 6']
          ]
        };
      case 'whiteboard':
        return { elements: [] };
    }
  };

  const updateContentBlock = (blockId: string, newContent: any) => {
    onUpdatePage({
      ...page,
      content: (page.content || []).map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    });
  };

  const deleteContentBlock = (blockId: string) => {
    onUpdatePage({
      ...page,
      content: (page.content || []).filter(block => block.id !== blockId)
    });
  };

  const contentBlocks = [
    { type: 'markdown' as const, label: 'Markdown', icon: Type },
    { type: 'panel' as const, label: 'Panel', icon: Square },
    { type: 'bullets' as const, label: 'Bullets', icon: List },
    { type: 'table' as const, label: 'Table', icon: Table2 },
    { type: 'whiteboard' as const, label: 'Whiteboard', icon: Pen }
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-zinc-900/50 to-black flex flex-col">
      {/* Page Header */}
      <div className="border-b border-zinc-800 bg-black/20 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{page.icon}</span>
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSave();
                if (e.key === 'Escape') {
                  setEditedTitle(page.title);
                  setIsEditingTitle(false);
                }
              }}
              className="flex-1 bg-zinc-800/50 border border-purple-500/50 rounded-lg px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl tracking-tight cursor-pointer hover:text-purple-300 transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {page.title}
            </h1>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {(page.content || []).map((block) => (
            <div key={block.id} className="group relative">
              <button
                onClick={() => deleteContentBlock(block.id)}
                className="absolute -right-2 -top-2 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>

              {block.type === 'markdown' && (
                <MarkdownBlock
                  content={block.content}
                  onChange={(content) => updateContentBlock(block.id, content)}
                />
              )}
              {block.type === 'panel' && (
                <PanelBlock
                  content={block.content}
                  onChange={(content) => updateContentBlock(block.id, content)}
                />
              )}
              {block.type === 'bullets' && (
                <BulletsBlock
                  content={block.content}
                  onChange={(content) => updateContentBlock(block.id, content)}
                />
              )}
              {block.type === 'table' && (
                <TableBlock
                  content={block.content}
                  onChange={(content) => updateContentBlock(block.id, content)}
                />
              )}
              {block.type === 'whiteboard' && (
                <WhiteboardBlock
                  content={block.content}
                  onChange={(content) => updateContentBlock(block.id, content)}
                />
              )}
            </div>
          ))}

          {/* Add Content Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-zinc-700 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-zinc-500 hover:text-purple-400 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Content Block
            </button>

            {showAddMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden z-20">
                {contentBlocks.map((block) => {
                  const Icon = block.icon;
                  return (
                    <button
                      key={block.type}
                      onClick={() => addContentBlock(block.type)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Icon className="w-5 h-5 text-purple-400" />
                      <span>{block.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
