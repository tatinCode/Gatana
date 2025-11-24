import { useState } from 'react';
import { X, Link2, Calendar, User, AlertCircle, Plus } from 'lucide-react';
import type { Task } from './ProjectBoard';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const availableArtifacts = [
  'Game Core',
  'Features',
  'Level Design',
  'Narrative & World Building',
  'Characters',
  'Set Dressing',
  'UI/UX Design',
  'Music & SFX',
  'Engineering',
  'Technical Specs',
  'Business & Marketing'
];

const assignees = ['Alex Chen', 'Jordan Park', 'Sam Rivera', 'Riley Morgan', 'Casey Taylor'];

export function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [availableAssignees, setAvailableAssignees] = useState<string[]>(assignees);
  const [showAddAssignee, setShowAddAssignee] = useState(false);
  const [newAssigneeName, setNewAssigneeName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask);
  };

  const toggleArtifact = (artifact: string) => {
    const newArtifacts = editedTask.linkedArtifacts.includes(artifact)
      ? editedTask.linkedArtifacts.filter(a => a !== artifact)
      : [...editedTask.linkedArtifacts, artifact];
    setEditedTask({ ...editedTask, linkedArtifacts: newArtifacts });
  };

  const handleAddAssignee = () => {
    if (newAssigneeName.trim() && !availableAssignees.includes(newAssigneeName.trim())) {
      const updatedAssignees = [...availableAssignees, newAssigneeName.trim()];
      setAvailableAssignees(updatedAssignees);
      setEditedTask({ ...editedTask, assignee: newAssigneeName.trim() });
      setNewAssigneeName('');
      setShowAddAssignee(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl tracking-tight">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Task Title</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={3}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          {/* Status, Priority, Assignee Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Status</label>
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Priority</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-1">
                <User className="w-3 h-3" />
                Assignee
              </label>
              <div className="relative">
                <select
                  value={editedTask.assignee || ''}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setShowAddAssignee(true);
                    } else {
                      setEditedTask({ ...editedTask, assignee: e.target.value });
                    }
                  }}
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Unassigned</option>
                  {availableAssignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                  <option value="__add_new__">+ Add New Assignee</option>
                </select>
                
                {showAddAssignee && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 z-10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAssigneeName}
                        onChange={(e) => setNewAssigneeName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddAssignee();
                          }
                          if (e.key === 'Escape') {
                            setShowAddAssignee(false);
                            setNewAssigneeName('');
                          }
                        }}
                        placeholder="Enter name"
                        className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddAssignee}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-sm transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due Date
            </label>
            <input
              type="date"
              value={editedTask.dueDate || ''}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Linked Artifacts */}
          <div>
            <label className="block text-sm text-zinc-400 mb-3 flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Linked Design Artifacts
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableArtifacts.map((artifact) => (
                <button
                  key={artifact}
                  type="button"
                  onClick={() => toggleArtifact(artifact)}
                  className={`
                    px-3 py-2 rounded-lg text-sm text-left transition-all
                    ${editedTask.linkedArtifacts.includes(artifact)
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {artifact}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}