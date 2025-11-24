import { useState } from 'react';
import type { Task } from './ProjectBoard';
import { TaskModal } from './TaskModal';
import { Layers } from 'lucide-react';

interface DesignDefinitionsViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const designCategories = [
  { id: 'game-core', name: 'Game Core', icon: '🎯' },
  { id: 'features', name: 'Features', icon: '⚡' },
  { id: 'level-design', name: 'Level Design', icon: '🗺️' },
  { id: 'narrative', name: 'Narrative & World Building', icon: '📖' },
  { id: 'characters', name: 'Characters', icon: '👤' },
  { id: 'set-dressing', name: 'Set Dressing', icon: '🎨' },
  { id: 'ui-ux', name: 'UI/UX Design', icon: '💎' },
  { id: 'music-sfx', name: 'Music & SFX', icon: '🎵' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'technical', name: 'Technical Specs', icon: '📋' },
  { id: 'business', name: 'Business & Marketing', icon: '📊' },
];

export function DesignDefinitionsView({ tasks, setTasks }: DesignDefinitionsViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(null);
  };

  // Group tasks by design artifacts
  const tasksByArtifact = designCategories.map(category => {
    const relatedTasks = tasks.filter(task => 
      task.linkedArtifacts.some(artifact => 
        artifact.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
      )
    );
    return { category, tasks: relatedTasks };
  });

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
      <div className="h-full overflow-auto p-6">
        <h3 className="text-2xl tracking-tight mb-6">Tasks by Design Definition</h3>

        <div className="space-y-6">
          {tasksByArtifact.map(({ category, tasks: categoryTasks }) => (
            <div key={category.id} className="bg-zinc-900/40 border border-zinc-700/50 rounded-xl overflow-hidden">
              {/* Category Header */}
              <div className="p-4 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h4 className="tracking-tight">{category.name}</h4>
                    <p className="text-sm text-zinc-500">{categoryTasks.length} linked task{categoryTasks.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Layers className="w-5 h-5 text-purple-400" />
              </div>

              {/* Tasks */}
              {categoryTasks.length > 0 ? (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/60 hover:border-zinc-600/50 transition-all cursor-pointer"
                    >
                      <h5 className="text-sm mb-2">{task.title}</h5>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.priority === 'high' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                            High Priority
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-zinc-500 flex items-center justify-between">
                        {task.assignee && <span>{task.assignee.split(' ')[0]}</span>}
                        {task.dueDate && (
                          <span>
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-zinc-500">
                  No tasks linked to this design definition
                </div>
              )}
            </div>
          ))}
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
