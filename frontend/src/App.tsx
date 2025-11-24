import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DesignDocument } from './components/DesignDocument';
import { ProjectBoard } from './components/ProjectBoard';
import { Rocket, LayoutGrid, FileText } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'board' | 'document'>('board');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-black/40 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Rocket className="w-6 h-6 text-cyan-400" />
                <h1 className="text-xl tracking-tight">Project Nexus</h1>
              </div>
              
              {/* View Toggle */}
              <div className="flex gap-2 border-l border-zinc-700 pl-6">
                <button
                  onClick={() => setCurrentView('board')}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    currentView === 'board'
                      ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30'
                      : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Project Board
                </button>
                <button
                  onClick={() => setCurrentView('document')}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    currentView === 'document'
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30'
                      : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Document View
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm">
                Share
              </button>
              <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors text-sm">
                Publish
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-73px)]">
          <DesignDocument 
            selectedPageId={selectedPageId}
            setSelectedPageId={setSelectedPageId}
            onPageClick={() => setCurrentView('document')}
          />
          
          {currentView === 'board' ? (
            <div className="flex-1">
              <ProjectBoard />
            </div>
          ) : null}
        </div>
      </div>
    </DndProvider>
  );
}