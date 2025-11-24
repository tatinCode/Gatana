import { useState } from 'react';
import { LayoutGrid, Table2, Calendar, Clock, Users, Layers } from 'lucide-react';
import { KanbanView } from './KanbanView';
import { TableView } from './TableView';
import { CalendarView } from './CalendarView';
import { TimelineView } from './TimelineView';
import { AssigneeView } from './AssigneeView';
import { DesignDefinitionsView } from './DesignDefinitionsView';

export type ViewType = 'kanban' | 'table' | 'calendar' | 'timeline' | 'assignee' | 'definitions';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  linkedArtifacts: string[];
  dueDate?: string;
  createdAt: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design main character animations',
    description: 'Create idle, walk, run, and jump animations',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Alex Chen',
    linkedArtifacts: ['Characters', 'Set Dressing'],
    dueDate: '2025-12-01',
    createdAt: '2025-11-20'
  },
  {
    id: '2',
    title: 'Implement combat system',
    description: 'Build core combat mechanics',
    status: 'todo',
    priority: 'high',
    assignee: 'Jordan Park',
    linkedArtifacts: ['Engineering', 'Game Core'],
    dueDate: '2025-12-05',
    createdAt: '2025-11-21'
  },
  {
    id: '3',
    title: 'Create level 1 layout',
    description: 'Design the first playable level',
    status: 'review',
    priority: 'medium',
    assignee: 'Sam Rivera',
    linkedArtifacts: ['Level Design'],
    dueDate: '2025-11-28',
    createdAt: '2025-11-18'
  },
  {
    id: '4',
    title: 'Compose main theme music',
    description: 'Create the main menu and gameplay theme',
    status: 'todo',
    priority: 'medium',
    assignee: 'Riley Morgan',
    linkedArtifacts: ['Music & SFX'],
    dueDate: '2025-12-10',
    createdAt: '2025-11-22'
  },
  {
    id: '5',
    title: 'UI mockups for inventory system',
    description: 'Design inventory interface',
    status: 'done',
    priority: 'high',
    assignee: 'Alex Chen',
    linkedArtifacts: ['UI/UX Design', 'Features'],
    dueDate: '2025-11-25',
    createdAt: '2025-11-15'
  }
];

export function ProjectBoard() {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const views = [
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
    { id: 'table', label: 'Table', icon: Table2 },
    { id: 'definitions', label: 'Design Definitions', icon: Layers },
    { id: 'assignee', label: 'Assignees', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-zinc-900 to-black">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/20 backdrop-blur-sm">
        <div className="px-6 py-4">
          <h2 className="text-lg mb-3 tracking-tight">Project Board</h2>
          
          {/* View Tabs */}
          <div className="flex gap-2 flex-wrap">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id as ViewType)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all
                    ${currentView === view.id 
                      ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30' 
                      : 'bg-zinc-800/40 text-zinc-400 hover:bg-zinc-800/60'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'kanban' && <KanbanView tasks={tasks} setTasks={setTasks} />}
        {currentView === 'table' && <TableView tasks={tasks} setTasks={setTasks} />}
        {currentView === 'calendar' && <CalendarView tasks={tasks} setTasks={setTasks} />}
        {currentView === 'timeline' && <TimelineView tasks={tasks} setTasks={setTasks} />}
        {currentView === 'assignee' && <AssigneeView tasks={tasks} setTasks={setTasks} />}
        {currentView === 'definitions' && <DesignDefinitionsView tasks={tasks} setTasks={setTasks} />}
      </div>
    </div>
  );
}
