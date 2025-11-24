import { useDrag } from 'react-dnd';
import { AlertCircle, Clock, User, Link2, Trash2 } from 'lucide-react';
import type { Task } from './ProjectBoard';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const ItemType = 'TASK';

export function TaskCard({ task, onTaskClick, onDelete }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-blue-400 bg-blue-500/10';
    }
  };

  return (
    <div
      ref={(node) => (drag as any)(node)}
      className={`
        group bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-3 cursor-pointer
        hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
      onClick={() => onTaskClick(task)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm flex-1">{task.title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="w-3 h-3 text-red-400" />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-md ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.linkedArtifacts.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-300 flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            {task.linkedArtifacts.length}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assignee.split(' ')[0]}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  );
}
