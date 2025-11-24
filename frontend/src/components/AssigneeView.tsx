import { useState } from 'react';
import type { Task } from './ProjectBoard';
import { TaskModal } from './TaskModal';
import { User } from 'lucide-react';

interface AssigneeViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export function AssigneeView({ tasks, setTasks }: AssigneeViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(null);
  };

  // Group tasks by assignee
  const tasksByAssignee = tasks.reduce((acc, task) => {
    const assignee = task.assignee || 'Unassigned';
    if (!acc[assignee]) {
      acc[assignee] = [];
    }
    acc[assignee].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog': return 'bg-zinc-700/50 text-zinc-300';
      case 'todo': return 'bg-blue-500/20 text-blue-300';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-300';
      case 'review': return 'bg-purple-500/20 text-purple-300';
      case 'done': return 'bg-green-500/20 text-green-300';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
    }
  };

  const assigneeColors = [
    'from-cyan-500/20 to-blue-500/20',
    'from-purple-500/20 to-pink-500/20',
    'from-green-500/20 to-emerald-500/20',
    'from-orange-500/20 to-red-500/20',
    'from-indigo-500/20 to-violet-500/20',
  ];

  return (
    <>
      <div className="h-full overflow-auto p-6">
        <h3 className="text-2xl tracking-tight mb-6">Tasks by Assignee</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tasksByAssignee).map(([assignee, assigneeTasks], index) => {
            const completedTasks = assigneeTasks.filter(t => t.status === 'done').length;
            const totalTasks = assigneeTasks.length;
            const completionRate = Math.round((completedTasks / totalTasks) * 100);

            return (
              <div key={assignee} className="flex flex-col">
                {/* Assignee Header */}
                <div className={`p-4 rounded-t-lg bg-gradient-to-br ${assigneeColors[index % assigneeColors.length]} border border-zinc-700/50 border-b-0`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate">{assignee}</h4>
                      <p className="text-sm text-zinc-400">{totalTasks} task{totalTasks !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>Completion</span>
                      <span>{completionRate}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-700/50 rounded-b-lg p-3 space-y-2">
                  {assigneeTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5 className="text-sm flex-1">{task.title}</h5>
                        <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-zinc-500">
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
