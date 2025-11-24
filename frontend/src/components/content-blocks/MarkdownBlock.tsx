import { useState } from 'react';
import { Edit2, Eye } from 'lucide-react';

interface MarkdownBlockProps {
  content: string;
  onChange: (content: string) => void;
}

export function MarkdownBlock({ content, onChange }: MarkdownBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onChange(editedContent);
    setIsEditing(false);
  };

  // Simple markdown rendering
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl mt-4 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl mt-4 mb-2">{line.slice(2)}</h1>;
      }
      // Bold
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
          </p>
        );
      }
      // Italic
      if (line.includes('*')) {
        const parts = line.split('*');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => i % 2 === 1 ? <em key={i}>{part}</em> : part)}
          </p>
        );
      }
      // Regular text
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div className="p-3 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between">
        <span className="text-sm text-zinc-400">Markdown</span>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-1.5 rounded hover:bg-zinc-700/50 transition-colors"
        >
          {isEditing ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={handleSave}
            className="w-full min-h-[200px] bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y font-mono text-sm"
          />
        ) : (
          <div className="prose prose-invert max-w-none">
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </div>
  );
}
