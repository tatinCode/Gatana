import type { Page } from './DesignDocument';

interface PagePreviewProps {
  page: Page;
  position: { x: number; y: number };
}

export function PagePreview({ page, position }: PagePreviewProps) {
  const renderContentPreview = () => {
    if (!page.content || page.content.length === 0) {
      return <p className="text-sm text-zinc-500 italic">No content yet</p>;
    }

    return (
      <div className="space-y-2">
        {page.content.slice(0, 3).map((block) => (
          <div key={block.id} className="text-sm text-zinc-300">
            {block.type === 'markdown' && (
              <div className="line-clamp-2">{block.content.split('\n')[0]}</div>
            )}
            {block.type === 'panel' && (
              <div className="px-2 py-1 bg-zinc-800/50 rounded text-xs">
                📦 {block.content.title}
              </div>
            )}
            {block.type === 'bullets' && (
              <div className="text-xs text-zinc-400">• {block.content.length} items</div>
            )}
            {block.type === 'table' && (
              <div className="text-xs text-zinc-400">
                📊 Table ({block.content.headers?.length || 0} columns)
              </div>
            )}
            {block.type === 'whiteboard' && (
              <div className="text-xs text-zinc-400">🎨 Whiteboard</div>
            )}
          </div>
        ))}
        {page.content.length > 3 && (
          <p className="text-xs text-zinc-500">+{page.content.length - 3} more blocks</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed z-50 w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-4 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800">
        <span className="text-2xl">{page.icon}</span>
        <h3 className="tracking-tight">{page.title}</h3>
      </div>
      {renderContentPreview()}
      {page.children && page.children.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
          {page.children.length} child page{page.children.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
