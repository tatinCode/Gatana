import { useState } from 'react';
import type { Task } from './ProjectBoard';
import { TaskModal } from './TaskModal';

interface TimelineViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export function TimelineView({ tasks, setTasks }: TimelineViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(null);
  };

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'backlog': return 'bg-zinc-700';
      case 'todo': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'review': return 'bg-purple-500';
      case 'done': return 'bg-green-500';
    }
  };

  const calculateProgress = (task: Task) => {
    const statusProgress = {
      'backlog': 0,
      'todo': 25,
      'in-progress': 50,
      'review': 75,
      'done': 100
    };
    return statusProgress[task.status];
  };

  return (
    <>
      <div className="h-full overflow-auto p-6">
        <h3 className="text-2xl tracking-tight mb-6">Project Timeline</h3>

        <div className="space-y-6">
          {sortedTasks.map((task, index) => {
            const progress = calculateProgress(task);
            
            return (
              <div key={task.id} className="relative">
                {/* Timeline Line */}
                {index < sortedTasks.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-full bg-zinc-800" />
                )}

                {/* Task Card */}
                <div className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className={`w-8 h-8 rounded-full ${getStatusColor(task.status)} flex-shrink-0 z-10 flex items-center justify-center`}>
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>

                  {/* Task Content */}
                  <div
                    onClick={() => setSelectedTask(task)}
                    className="flex-1 bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4 hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-zinc-400">{task.description}</p>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className="text-sm text-zinc-400 ml-4">
                          {new Date(task.dueDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStatusColor(task.status)} transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Status:</span>
                        <span className="text-zinc-300">{task.status.replace('-', ' ')}</span>
                      </div>
                      {task.assignee && (
                        <>
                          <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Assignee:</span>
                            <span className="text-zinc-300">{task.assignee}</span>
                          </div>
                        </>
                      )}
                      {task.linkedArtifacts.length > 0 && (
                        <>
                          <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">Artifacts:</span>
                            <span className="text-purple-300">{task.linkedArtifacts.length}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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
