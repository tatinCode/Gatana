import { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

interface PanelContent {
  title: string;
  content: string;
  color: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
}

interface PanelBlockProps {
  content: PanelContent;
  onChange: (content: PanelContent) => void;
}

export function PanelBlock({ content, onChange }: PanelBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onChange(editedContent);
    setIsEditing(false);
  };

  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30',
    purple: 'bg-purple-500/10 border-purple-500/30',
    green: 'bg-green-500/10 border-green-500/30',
    yellow: 'bg-yellow-500/10 border-yellow-500/30',
    red: 'bg-red-500/10 border-red-500/30'
  };

  return (
    <div className={`${colorClasses[content.color]} border-l-4 rounded-lg overflow-hidden`}>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editedContent.title}
              onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Panel Title"
            />
            <textarea
              value={editedContent.content}
              onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
              className="w-full min-h-[100px] bg-zinc-800/50 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
              placeholder="Panel content"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Color:</span>
              {(['blue', 'purple', 'green', 'yellow', 'red'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setEditedContent({ ...editedContent, color })}
                  className={`w-6 h-6 rounded-full border-2 ${
                    editedContent.color === color ? 'ring-2 ring-white' : ''
                  } ${colorClasses[color]}`}
                />
              ))}
            </div>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-0 right-0 p-1.5 rounded hover:bg-zinc-700/50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <h3 className="text-lg mb-2 pr-8">{content.title}</h3>
            <p className="text-zinc-300">{content.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
