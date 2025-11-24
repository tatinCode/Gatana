import { useState } from 'react';
import type { Task } from './ProjectBoard';
import { TaskModal } from './TaskModal';
import { Trash2, Link2 } from 'lucide-react';

interface TableViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export function TableView({ tasks, setTasks }: TableViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog': return 'bg-zinc-700/50 text-zinc-300';
      case 'todo': return 'bg-blue-500/20 text-blue-300';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-300';
      case 'review': return 'bg-purple-500/20 text-purple-300';
      case 'done': return 'bg-green-500/20 text-green-300';
    }
  };

  return (
    <>
      <div className="h-full overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Task</th>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Status</th>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Priority</th>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Assignee</th>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Linked Artifacts</th>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Due Date</th>
              <th className="text-left px-6 py-4 text-sm text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr 
                key={task.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/20 cursor-pointer transition-colors group"
                onClick={() => setSelectedTask(task)}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{task.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-md ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {task.assignee || '-'}
                </td>
                <td className="px-6 py-4">
                  {task.linkedArtifacts.length > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-purple-300">
                      <Link2 className="w-3 h-3" />
                      <span>{task.linkedArtifacts.length} artifact{task.linkedArtifacts.length !== 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  {task.dueDate 
                    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '-'
                  }
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
        />
      )}
    </>
  );
}
