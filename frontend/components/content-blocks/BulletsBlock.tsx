import { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

interface BulletsBlockProps {
  content: string[];
  onChange: (content: string[]) => void;
}

export function BulletsBlock({ content, onChange }: BulletsBlockProps) {
  const [items, setItems] = useState(content);

  const addItem = () => {
    const newItems = [...items, ''];
    setItems(newItems);
    onChange(newItems);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div className="p-3 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between">
        <span className="text-sm text-zinc-400">Bullet List</span>
        <button
          onClick={addItem}
          className="p-1.5 rounded hover:bg-zinc-700/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <GripVertical className="w-4 h-4 text-zinc-600 flex-shrink-0" />
            <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0" />
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 bg-zinc-800/30 border border-zinc-700/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="List item"
            />
            <button
              onClick={() => removeItem(index)}
              className="p-1.5 rounded hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
