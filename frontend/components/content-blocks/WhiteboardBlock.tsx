import { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Square, Circle, Trash2 } from 'lucide-react';

interface WhiteboardElement {
  type: 'path' | 'rect' | 'circle';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
}

interface WhiteboardContent {
  elements: WhiteboardElement[];
}

interface WhiteboardBlockProps {
  content: WhiteboardContent;
  onChange: (content: WhiteboardContent) => void;
}

export function WhiteboardBlock({ content, onChange }: WhiteboardBlockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rect' | 'circle'>('pen');
  const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null);
  const [elements, setElements] = useState<WhiteboardElement[]>(content.elements || []);

  useEffect(() => {
    redrawCanvas();
  }, [elements]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      if (element.type === 'path' && element.points) {
        ctx.beginPath();
        for (let i = 0; i < element.points.length; i += 2) {
          if (i === 0) {
            ctx.moveTo(element.points[i], element.points[i + 1]);
          } else {
            ctx.lineTo(element.points[i], element.points[i + 1]);
          }
        }
        ctx.stroke();
      } else if (element.type === 'rect' && element.x !== undefined && element.y !== undefined) {
        ctx.strokeRect(element.x, element.y, element.width || 0, element.height || 0);
      } else if (element.type === 'circle' && element.x !== undefined && element.y !== undefined) {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius || 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentElement({
        type: 'path',
        points: [x, y],
        color: tool === 'eraser' ? '#0a0a0a' : '#a78bfa'
      });
    } else if (tool === 'rect') {
      setCurrentElement({
        type: 'rect',
        x,
        y,
        width: 0,
        height: 0,
        color: '#a78bfa'
      });
    } else if (tool === 'circle') {
      setCurrentElement({
        type: 'circle',
        x,
        y,
        radius: 0,
        color: '#a78bfa'
      });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), x, y]
      });
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = currentElement.color;
        ctx.lineWidth = tool === 'eraser' ? 10 : 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        const points = currentElement.points || [];
        ctx.moveTo(points[points.length - 2] || x, points[points.length - 1] || y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    } else if (tool === 'rect' && currentElement.x !== undefined && currentElement.y !== undefined) {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x,
        height: y - currentElement.y
      });
      redrawCanvas();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#a78bfa';
        ctx.strokeRect(currentElement.x, currentElement.y, x - currentElement.x, y - currentElement.y);
      }
    } else if (tool === 'circle' && currentElement.x !== undefined && currentElement.y !== undefined) {
      const radius = Math.sqrt(Math.pow(x - currentElement.x, 2) + Math.pow(y - currentElement.y, 2));
      setCurrentElement({
        ...currentElement,
        radius
      });
      redrawCanvas();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#a78bfa';
        ctx.beginPath();
        ctx.arc(currentElement.x, currentElement.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (currentElement) {
      const newElements = [...elements, currentElement];
      setElements(newElements);
      onChange({ elements: newElements });
    }
    setIsDrawing(false);
    setCurrentElement(null);
  };

  const clearCanvas = () => {
    setElements([]);
    onChange({ elements: [] });
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-700/50 rounded-lg overflow-hidden">
      <div className="p-3 bg-zinc-800/30 border-b border-zinc-700/50 flex items-center justify-between">
        <span className="text-sm text-zinc-400">Whiteboard</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 rounded transition-colors ${tool === 'pen' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-zinc-700/50'}`}
          >
            <Pen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded transition-colors ${tool === 'eraser' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-zinc-700/50'}`}
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-1.5 rounded transition-colors ${tool === 'rect' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-zinc-700/50'}`}
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-1.5 rounded transition-colors ${tool === 'circle' ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-zinc-700/50'}`}
          >
            <Circle className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-700" />
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full border border-zinc-700/50 rounded-lg bg-zinc-950 cursor-crosshair"
        />
      </div>
    </div>
  );
}
