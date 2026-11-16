import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import type { MapObjectData, PowerLineData, ToolMode, MapObjectType, PowerLineVoltage } from '../types/grid';
import { isElectricalType, VOLTAGE_CONFIG } from '../types/grid';
import { ObjectGraphic } from './icons';
import { PowerLine } from './PowerLine';

export interface GridWorkspaceProps {
  objects: MapObjectData[];
  powerLines: PowerLineData[];
  selectedObjectId: string | null;
  selectedLineId?: string | null;
  onSelectObject: (id: string | null) => void;
  onSelectLine?: (id: string | null) => void;
  onPlaceObject: (x: number, y: number) => void;
  onMoveObject?: (id: string, x: number, y: number) => void;
  onCreateLine?: (startPoleId: string, endPoleId: string, voltage: PowerLineVoltage) => void;
  onDeleteLine?: (id: string) => void;
  connectingPoleId?: string | null;
  onConnectingPoleChange?: (id: string | null) => void;
  activeTool: ToolMode;
  placingType: MapObjectType | null;
  lineVoltage: PowerLineVoltage;
  isPowerOn: boolean;
  centerTarget?: { x: number; y: number } | null;
}

export const GridWorkspace: React.FC<GridWorkspaceProps> = ({
  objects,
  powerLines,
  selectedObjectId,
  selectedLineId,
  onSelectObject,
  onSelectLine,
  onPlaceObject,
  onMoveObject,
  onCreateLine,
  onDeleteLine,
  connectingPoleId,
  onConnectingPoleChange,
  activeTool,
  lineVoltage,
  isPowerOn,
  centerTarget,
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

  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 1000,
    height: 600,
  });

  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);

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

    if (activeTool === 'line' && connectingPoleId) {
      const coords = getSvgCoordinates(e.clientX, e.clientY);
      setCursorCoords({
        x: Math.round(coords.x),
        y: Math.round(coords.y),
      });
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
    const target = e.target as Element | null;
    if (target?.closest?.('[data-interactive="true"]')) {
      return;
    }
    const coords = getSvgCoordinates(e.clientX, e.clientY);

    if (activeTool === 'line') {
      onConnectingPoleChange?.(null);
      return;
    }

    if (activeTool === 'place') {
      onPlaceObject(Math.round(coords.x), Math.round(coords.y));
      return;
    }

    if (activeTool === 'select') {
      onSelectObject(null);
      onSelectLine?.(null);
    }
  };

  const handleObjectMouseDown = (
    e: React.MouseEvent,
    obj: MapObjectData
  ) => {
    if (activeTool === 'place') {
      return;
    }
    e.stopPropagation();

    if (activeTool === 'line') {
      if (!isElectricalType(obj.type)) {
        return;
      }
      if (!connectingPoleId) {
        onConnectingPoleChange?.(obj.id);
      } else {
        if (connectingPoleId !== obj.id) {
          onCreateLine?.(connectingPoleId, obj.id, lineVoltage);
        }
        onConnectingPoleChange?.(null);
      }
      return;
    }

    if (activeTool === 'select') {
      onSelectObject(obj.id);
      onSelectLine?.(null);
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onConnectingPoleChange?.(null);
        onSelectObject(null);
        onSelectLine?.(null);
      }
    };

    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setViewportSize({ width: rect.width, height: rect.height });
        }
      }
    };

    updateSize();
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateSize);
    };
  }, [onConnectingPoleChange, onSelectObject, onSelectLine]);

  useEffect(() => {
    if (centerTarget && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const nextPanX = rect.width / 2 - centerTarget.x * zoom;
      const nextPanY = rect.height / 2 - centerTarget.y * zoom;
      setPan({ x: nextPanX, y: nextPanY });
    }
  }, [centerTarget, zoom]);

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

          {powerLines.map((line) => {
            const start = objects.find((o) => o.id === line.startPoleId);
            const end = objects.find((o) => o.id === line.endPoleId);
            if (!start || !end) return null;
            return (
              <PowerLine
                key={line.id}
                line={line}
                start={start}
                end={end}
                isPowerOn={isPowerOn}
                isSelected={selectedLineId === line.id}
                activeTool={activeTool}
                onSelect={(id) => {
                  onSelectLine?.(id);
                  onSelectObject(null);
                }}
                onDelete={(id) => onDeleteLine?.(id)}
              />
            );
          })}

          {activeTool === 'line' && connectingPoleId && cursorCoords && (() => {
            const startObj = objects.find((o) => o.id === connectingPoleId);
            if (!startObj) return null;
            const cfg = VOLTAGE_CONFIG[lineVoltage];
            const distMeters = Math.round(
              Math.hypot(cursorCoords.x - startObj.x, cursorCoords.y - startObj.y)
            );
            const midX = (startObj.x + cursorCoords.x) / 2;
            const midY = (startObj.y + cursorCoords.y) / 2;

            return (
              <g pointerEvents="none">
                <line
                  x1={startObj.x}
                  y1={startObj.y}
                  x2={cursorCoords.x}
                  y2={cursorCoords.y}
                  stroke={cfg.color}
                  strokeWidth={cfg.strokeWidth}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <circle
                  cx={cursorCoords.x}
                  cy={cursorCoords.y}
                  r="5"
                  fill={cfg.color}
                />
                <g transform={`translate(${midX}, ${midY - 14})`}>
                  <rect
                    x="-28"
                    y="-10"
                    width="56"
                    height="20"
                    rx="6"
                    fill="#0f172a"
                    stroke={cfg.color}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="700"
                  >
                    {distMeters} м
                  </text>
                </g>
              </g>
            );
          })()}

          {objects.map((obj) => {
            const isSelected = selectedObjectId === obj.id;
            const isConnectingStart = connectingPoleId === obj.id;
            const isElectrical = isElectricalType(obj.type);

            let cursorClass = 'cursor-default';
            if (activeTool === 'delete' || activeTool === 'delete-object') {
              cursorClass = 'cursor-pointer';
            } else if (activeTool === 'select') {
              cursorClass = 'cursor-move';
            } else if (activeTool === 'line') {
              cursorClass = isElectrical ? 'cursor-pointer' : 'cursor-not-allowed';
            }

            return (
              <g
                key={obj.id}
                data-interactive="true"
                data-object-id={obj.id}
                transform={`translate(${obj.x}, ${obj.y})`}
                onMouseDown={(e) => handleObjectMouseDown(e, obj)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTool === 'select') {
                    onSelectObject(obj.id);
                    onSelectLine?.(null);
                  }
                }}
                className={cursorClass}
              >
                <rect
                  data-interactive="true"
                  x="-28"
                  y="-28"
                  width="56"
                  height="56"
                  rx="8"
                  fill="rgba(0, 0, 0, 0.001)"
                  stroke="transparent"
                  strokeWidth="1.5"
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTool === 'select') {
                      onSelectObject(obj.id);
                      onSelectLine?.(null);
                    }
                  }}
                  onMouseDown={(e) => handleObjectMouseDown(e, obj)}
                  className={`transition-colors duration-150 ${
                    activeTool === 'delete' || activeTool === 'delete-object'
                      ? 'hover:fill-red-500/20 hover:stroke-red-500/70'
                      : activeTool === 'line'
                      ? isElectrical
                        ? 'hover:fill-amber-400/15 hover:stroke-amber-400/80'
                        : ''
                      : isSelected
                      ? ''
                      : 'hover:fill-sky-400/10 hover:stroke-sky-400/40'
                  }`}
                />
                <rect
                  data-interactive="true"
                  x="-36"
                  y="22"
                  width="72"
                  height="18"
                  rx="4"
                  fill="rgba(0, 0, 0, 0.001)"
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTool === 'select') {
                      onSelectObject(obj.id);
                      onSelectLine?.(null);
                    }
                  }}
                  onMouseDown={(e) => handleObjectMouseDown(e, obj)}
                />

                {isConnectingStart && (
                  <circle
                    cx="0"
                    cy="0"
                    r="34"
                    fill="none"
                    stroke={VOLTAGE_CONFIG[lineVoltage].color}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {isSelected && (
                  <g pointerEvents="none">
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

                <g transform="translate(-24, -24)" pointerEvents="none">
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
          <span className="text-slate-500 font-mono text-[9px]">{objects.length} об. · {powerLines.length} лін.</span>
        </div>
        <div className="relative flex-1 rounded-lg bg-[#446d2c] border border-slate-800 overflow-hidden">
          {(() => {
            const worldMinX = objects.length > 0 ? Math.min(-1200, ...objects.map((o) => o.x - 300)) : -1200;
            const worldMaxX = objects.length > 0 ? Math.max(1200, ...objects.map((o) => o.x + 300)) : 1200;
            const worldMinY = objects.length > 0 ? Math.min(-700, ...objects.map((o) => o.y - 300)) : -700;
            const worldMaxY = objects.length > 0 ? Math.max(700, ...objects.map((o) => o.y + 300)) : 700;
            const worldW = worldMaxX - worldMinX;
            const worldH = worldMaxY - worldMinY;

            const viewX = -pan.x / zoom;
            const viewY = -pan.y / zoom;
            const viewW = viewportSize.width / zoom;
            const viewH = viewportSize.height / zoom;

            const rectW = Math.max(worldW * 0.08, Math.min(viewW, worldW));
            const rectH = Math.max(worldH * 0.08, Math.min(viewH, worldH));
            const rectX = Math.max(worldMinX, Math.min(worldMaxX - rectW, viewX));
            const rectY = Math.max(worldMinY, Math.min(worldMaxY - rectH, viewY));

            return (
              <svg
                className="h-full w-full"
                viewBox={`${worldMinX} ${worldMinY} ${worldW} ${worldH}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <rect x={worldMinX} y={worldMinY} width={worldW} height={worldH} fill="#446d2c" />
                <path
                  d={`M ${worldMinX} 0 Q 0 ${worldMinY / 2} ${worldMaxX} ${worldMaxY / 3}`}
                  fill="none"
                  stroke="#385b24"
                  strokeWidth={worldW * 0.06}
                  opacity="0.4"
                />
                {powerLines.map((line) => {
                  const p1 = objects.find((o) => o.id === line.startPoleId);
                  const p2 = objects.find((o) => o.id === line.endPoleId);
                  if (!p1 || !p2) return null;
                  const cfg = VOLTAGE_CONFIG[line.voltage];
                  return (
                    <line
                      key={line.id}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isPowerOn ? cfg.color : '#64748b'}
                      strokeWidth={worldW * 0.0035}
                      strokeDasharray={line.voltage === 'high' ? '6 2' : undefined}
                      opacity="0.85"
                    />
                  );
                })}
                {objects.map((obj) => (
                  <circle
                    key={obj.id}
                    cx={obj.x}
                    cy={obj.y}
                    r={worldW * 0.014}
                    fill={obj.category === 'electrical' ? '#38bdf8' : '#facc15'}
                    stroke="#0f172a"
                    strokeWidth={worldW * 0.004}
                  />
                ))}
                <rect
                  x={rectX}
                  y={rectY}
                  width={rectW}
                  height={rectH}
                  fill="rgba(56, 189, 248, 0.2)"
                  stroke="#38bdf8"
                  strokeWidth={worldW * 0.005}
                  rx={worldW * 0.008}
                />
              </svg>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
