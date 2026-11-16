import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import type { MapObjectData, PowerLineData, ToolMode, MapObjectType } from '../types/grid';
import { ObjectGraphic } from './icons';

export interface GridWorkspaceProps {
  objects: MapObjectData[];
  powerLines?: PowerLineData[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  onPlaceObject: (x: number, y: number) => void;
  onMoveObject?: (id: string, x: number, y: number) => void;
  activeTool: ToolMode;
  placingType: MapObjectType | null;
}

export const GridWorkspace: React.FC<GridWorkspaceProps> = ({
  objects,
  selectedObjectId,
  onSelectObject,
  onPlaceObject,
  onMoveObject,
  activeTool,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; objX: number; objY: number }>({
    mouseX: 0,
    mouseY: 0,
    objX: 0,
    objY: 0,
  });

  const getSvgCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;
      return {
        x: (screenX - pan.x) / zoom,
        y: (screenY - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.3), 3.0);

    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 1 || (e.button === 0 && (activeTool === 'select' || e.altKey))) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
      return;
    }

    if (draggingId && onMoveObject) {
      const dx = (e.clientX - dragStartRef.current.mouseX) / zoom;
      const dy = (e.clientY - dragStartRef.current.mouseY) / zoom;
      const nextX = Math.round(dragStartRef.current.objX + dx);
      const nextY = Math.round(dragStartRef.current.objY + dy);
      onMoveObject(draggingId, nextX, nextY);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) return;
    const coords = getSvgCoordinates(e.clientX, e.clientY);

    if (activeTool === 'place') {
      onPlaceObject(Math.round(coords.x), Math.round(coords.y));
      return;
    }

    if (activeTool === 'select') {
      onSelectObject(null);
    }
  };

  const handleObjectMouseDown = (
    e: React.MouseEvent,
    obj: MapObjectData
  ) => {
    e.stopPropagation();
    if (activeTool === 'select') {
      onSelectObject(obj.id);
      setDraggingId(obj.id);
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        objX: obj.x,
        objY: obj.y,
      };
    } else if (activeTool === 'delete' || activeTool === 'delete-object') {
      onSelectObject(obj.id);
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
      setDraggingId(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none bg-[#487532]"
    >
      <div className="absolute left-4 top-4 z-20 flex flex-col rounded-xl border border-slate-700/60 bg-[#0f172a]/90 backdrop-blur shadow-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z * 1.2, 3))}
          className="flex h-9 w-9 items-center justify-center text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
          title="Наблизити"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-px w-full bg-slate-700/50" />
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z / 1.2, 0.3))}
          className="flex h-9 w-9 items-center justify-center text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
          title="Віддалити"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="h-px w-full bg-slate-700/50" />
        <button
          type="button"
          onClick={resetView}
          className="flex h-9 w-9 items-center justify-center text-slate-300 hover:bg-slate-700/60 hover:text-white transition-colors"
          title="Центрувати"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-slate-700/50 bg-[#0f172a]/80 px-2.5 py-1 text-[11px] font-mono text-slate-300 shadow-md backdrop-blur">
        <span>{Math.round(zoom * 100)}%</span>
      </div>

      <svg
        ref={svgRef}
        className={`h-full w-full ${
          isPanning
            ? 'cursor-grabbing'
            : activeTool === 'place'
            ? 'cursor-crosshair'
            : activeTool === 'select'
            ? 'cursor-grab'
            : 'cursor-default'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
      >
        <defs>
          <pattern
            id="mapGridSmall"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.75"
            />
          </pattern>
          <pattern
            id="mapGridLarge"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100" height="100" fill="url(#mapGridSmall)" />
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <rect
            x="-10000"
            y="-10000"
            width="20000"
            height="20000"
            fill="#568a3c"
          />

          <path
            d="M -300 -100 Q 200 -300 600 -150 T 1200 -200 Q 1500 100 1800 200"
            fill="none"
            stroke="#45702d"
            strokeWidth="320"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M -200 400 Q 400 300 800 550 T 1600 500"
            fill="none"
            stroke="#45702d"
            strokeWidth="260"
            strokeLinecap="round"
            opacity="0.35"
          />

          <path
            d="M 200 -400 Q 300 100 600 200 T 1000 600 Q 1200 800 1500 1100"
            fill="none"
            stroke="#538239"
            strokeWidth="60"
            strokeLinecap="round"
            opacity="0.6"
          />

          <rect
            x="-10000"
            y="-10000"
            width="20000"
            height="20000"
            fill="url(#mapGridLarge)"
          />

          <circle cx="0" cy="0" r="4" fill="#facc15" />

          {objects.map((obj) => {
            const isSelected = selectedObjectId === obj.id;
            return (
              <g
                key={obj.id}
                transform={`translate(${obj.x}, ${obj.y})`}
                onMouseDown={(e) => handleObjectMouseDown(e, obj)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <g>
                    <rect
                      x="-28"
                      y="-28"
                      width="56"
                      height="56"
                      rx="8"
                      fill="rgba(56, 189, 248, 0.15)"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                    />
                    <path
                      d="M -32 -20 L -32 -32 L -20 -32"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 -32 L 32 -32 L 32 -20"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M -32 20 L -32 32 L -20 32"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 32 L 32 32 L 32 20"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                <g transform="translate(-24, -24)">
                  <ObjectGraphic type={obj.type} size={48} inMap={true} />
                </g>

                <text
                  x="0"
                  y="34"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="600"
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)',
                  }}
                  pointerEvents="none"
                >
                  {obj.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-4 left-4 z-20 h-28 w-44 rounded-xl border border-slate-700/70 bg-[#0f172a]/90 backdrop-blur shadow-2xl overflow-hidden p-1.5 flex flex-col">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1 flex items-center justify-between">
          <span>Міні-карта</span>
          <span className="text-slate-500 font-mono text-[9px]">{objects.length} об.</span>
        </div>
        <div className="relative flex-1 rounded-lg bg-[#446d2c] border border-slate-800 overflow-hidden">
          <svg className="h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
            <rect width="1000" height="600" fill="#446d2c" />
            <path
              d="M 0 300 Q 500 100 1000 400"
              fill="none"
              stroke="#385b24"
              strokeWidth="80"
              opacity="0.4"
            />
            {objects.map((obj) => (
              <circle
                key={obj.id}
                cx={(obj.x + 500) % 1000}
                cy={(obj.y + 300) % 600}
                r="7"
                fill={obj.category === 'electrical' ? '#38bdf8' : '#facc15'}
                stroke="#0f172a"
                strokeWidth="2"
              />
            ))}
            <rect
              x={Math.max(0, Math.min(800, ((-pan.x / zoom + 500) % 1000) - 60))}
              y={Math.max(0, Math.min(480, ((-pan.y / zoom + 300) % 600) - 40))}
              width={Math.min(200, Math.max(50, 160 / zoom))}
              height={Math.min(120, Math.max(30, 100 / zoom))}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2"
              rx="4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
