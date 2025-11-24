import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import type { Task } from './ProjectBoard';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { NewTaskModal } from './NewTaskModal';

interface KanbanViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const ItemType = 'TASK';

interface ColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onDrop: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  count: number;
}

function Column({ title, status, tasks, onDrop, onTaskClick, onDeleteTask, count }: ColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemType,
    drop: (item: { id: string }) => {
      onDrop(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getColumnColor = () => {
    switch (status) {
      case 'backlog': return 'border-zinc-700';
      case 'todo': return 'border-blue-500/30';
      case 'in-progress': return 'border-yellow-500/30';
      case 'review': return 'border-purple-500/30';
      case 'done': return 'border-green-500/30';
      default: return 'border-zinc-700';
    }
  };

  return (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-zinc-300">{title}</h3>
          <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        <button className="p-1 rounded hover:bg-zinc-800/50 transition-colors">
          <Plus className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
      
      <div
        ref={(node: HTMLDivElement | null) =>
          (drop as unknown as (node: HTMLDivElement | null) => void)(node)
        }
        className={`
          flex-1 rounded-lg border-2 border-dashed p-2 space-y-2 min-h-[400px] transition-all
          ${getColumnColor()}
          ${isOver && canDrop ? 'bg-cyan-500/10 border-cyan-500' : 'bg-zinc-900/20'}
        `}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export function KanbanView({ tasks, setTasks }: KanbanViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const columns: { title: string; status: Task['status'] }[] = [
    { title: 'Backlog', status: 'backlog' },
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Review', status: 'review' },
    { title: 'Done', status: 'done' }
  ];

  const handleDrop = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(null);
  };

  const handleCreateTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks([...tasks, task]);
    setShowNewTaskModal(false);
  };

  return (
    <>
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 p-6 h-full">
          {/* Add New Task Button */}
          <div className="flex flex-col min-w-[280px] max-w-[280px]">
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="mb-3 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors text-cyan-300 flex items-center justify-center gap-2 border border-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>

          {columns.map((column) => {
            const columnTasks = tasks.filter(task => task.status === column.status);
            return (
              <Column
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={columnTasks}
                onDrop={handleDrop}
                onTaskClick={setSelectedTask}
                onDeleteTask={handleDeleteTask}
                count={columnTasks.length}
              />
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

      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </>
  );
}