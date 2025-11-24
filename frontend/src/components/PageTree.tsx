import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ChevronRight, ChevronDown, Trash2, GripVertical } from 'lucide-react';
import type { Page } from './DesignDocument';
import { PagePreview } from './PagePreview';

interface PageTreeProps {
  pages: Page[];
  setPages: (pages: Page[]) => void;
  selectedPage: string | null;
  setSelectedPage: (id: string | null) => void;
  level?: number;
}

interface PageItemProps {
  page: Page;
  onDelete: (id: string) => void;
  onMove: (dragId: string, dropId: string, position: 'before' | 'after' | 'inside') => void;
  selectedPage: string | null;
  setSelectedPage: (id: string | null) => void;
  level: number;
}

const ItemType = 'PAGE';

function PageItem({ page, onDelete, onMove, selectedPage, setSelectedPage, level }: PageItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: page.id, title: page.title },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { id: string }, monitor) => {
      if (item.id === page.id) return;
      
      // Drop the item inside this page (make it a child)
      onMove(item.id, page.id, 'inside');
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isSelected = selectedPage === page.id;

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      x: rect.right + 10,
      y: rect.top
    });
    // Delay preview to avoid flickering
    setTimeout(() => setShowPreview(true), 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
  };

  return (
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div
        ref={(node) => drag(drop(node))}
        className={`
          group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-all
          ${isSelected ? 'bg-purple-500/20 text-purple-200' : 'hover:bg-zinc-800/50'}
          ${isOver && canDrop ? 'ring-2 ring-purple-500/50' : ''}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setSelectedPage(page.id)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex items-center gap-1 flex-1 min-w-0"
          onClick={(e) => {
            if (page.children && page.children.length > 0) {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {page.children && page.children.length > 0 ? (
            isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
            )
          ) : (
            <div className="w-3.5" />
          )}
          <span className="text-sm flex-shrink-0">{page.icon}</span>
          <span className="text-sm truncate">{page.title}</span>
        </div>
        
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(page.id);
            }}
            className="p-1 rounded hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        )}
      </div>

      {/* Page Preview on Hover */}
      {showPreview && !isDragging && (
        <PagePreview page={page} position={previewPosition} />
      )}

      {page.children && page.children.length > 0 && isExpanded && (
        <div>
          {page.children.map((child) => (
            <PageItem
              key={child.id}
              page={child}
              onDelete={onDelete}
              onMove={onMove}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PageTree({ pages, setPages, selectedPage, setSelectedPage, level = 0 }: PageTreeProps) {
  const deletePage = (id: string) => {
    const removePageRecursive = (pages: Page[]): Page[] => {
      return pages
        .filter(page => page.id !== id)
        .map(page => ({
          ...page,
          children: page.children ? removePageRecursive(page.children) : undefined
        }));
    };
    setPages(removePageRecursive(pages));
  };

  const movePage = (dragId: string, dropId: string, position: 'before' | 'after' | 'inside') => {
    // Find and remove the dragged page
    let draggedPage: Page | null = null;
    
    const findAndRemove = (pages: Page[]): Page[] => {
      const result: Page[] = [];
      for (const page of pages) {
        if (page.id === dragId) {
          draggedPage = page;
        } else {
          result.push({
            ...page,
            children: page.children ? findAndRemove(page.children) : undefined
          });
        }
      }
      return result;
    };

    let newPages = findAndRemove(pages);
    if (!draggedPage) return;

    // Insert the dragged page at the new position
    const insertPage = (pages: Page[]): Page[] => {
      const result: Page[] = [];
      for (const page of pages) {
        if (page.id === dropId) {
          if (position === 'inside') {
            result.push({
              ...page,
              children: [...(page.children || []), draggedPage!]
            });
          } else if (position === 'before') {
            result.push(draggedPage!);
            result.push(page);
          } else {
            result.push(page);
            result.push(draggedPage!);
          }
        } else {
          result.push({
            ...page,
            children: page.children ? insertPage(page.children) : undefined
          });
        }
      }
      return result;
    };

    newPages = insertPage(newPages);
    setPages(newPages);
  };

  return (
    <div className="space-y-0.5">
      {pages.map((page) => (
        <PageItem
          key={page.id}
          page={page}
          onDelete={deletePage}
          onMove={movePage}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          level={level}
        />
      ))}
    </div>
  );
}