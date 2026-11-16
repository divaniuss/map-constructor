import { useState } from 'react';
import {
  Zap,
  Wrench,
  Power,
  RotateCcw,
} from 'lucide-react';
import type {
  ToolMode,
  MapObjectType,
  PowerLineVoltage,
  MapObjectData,
  PowerLineData,
} from './types/grid';
import { getLibraryItem, isPoleType } from './types/grid';
import { Toolbar } from './components/Toolbar';
import { ObjectLibrary } from './components/ObjectLibrary';
import { GridWorkspace } from './components/GridWorkspace';
import { ObjectProperties } from './components/ObjectProperties';
import { NetworkStats } from './components/NetworkStats';

export function App() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [placingType, setPlacingType] = useState<MapObjectType | null>(null);
  const [lineVoltage, setLineVoltage] = useState<PowerLineVoltage>('high');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  const [objects, setObjects] = useState<MapObjectData[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [powerLines, setPowerLines] = useState<PowerLineData[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [connectingPoleId, setConnectingPoleId] = useState<string | null>(null);

  const poleCount = objects.filter((o) => isPoleType(o.type)).length;

  const calculateLineLength = (line: PowerLineData): number => {
    const p1 = objects.find((o) => o.id === line.startPoleId);
    const p2 = objects.find((o) => o.id === line.endPoleId);
    if (!p1 || !p2) return 0;
    return Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y));
  };

  const totalLengthMeters = powerLines.reduce((acc, line) => acc + calculateLineLength(line), 0);
  const totalLengthKm = (totalLengthMeters / 1000).toFixed(2);

  const handleSelectTool = (tool: ToolMode) => {
    setActiveTool(tool);
    if (tool !== 'place') {
      setPlacingType(null);
    }
    if (tool !== 'line') {
      setConnectingPoleId(null);
    }
  };

  const handleSelectObjectFromLibrary = (type: MapObjectType) => {
    setPlacingType(type);
    setActiveTool('place');
  };

  const generateObjectId = (type: MapObjectType): string => {
    const prefix = isPoleType(type) ? 'OP' : type === 'transformer' ? 'TR' : 'TER';
    const existingNums = objects
      .filter((o) => o.id.startsWith(`#${prefix}-`))
      .map((o) => parseInt(o.id.replace(`#${prefix}-`, ''), 10))
      .filter((n) => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    return `#${prefix}-${String(nextNum).padStart(3, '0')}`;
  };

  const handlePlaceObject = (x: number, y: number) => {
    if (!placingType) return;
    const item = getLibraryItem(placingType);
    const newObj: MapObjectData = {
      id: generateObjectId(placingType),
      type: placingType,
      category: item.category,
      name: item.shortName,
      x,
      y,
    };
    setObjects((prev) => [...prev, newObj]);
    setSelectedObjectId(newObj.id);
    setSelectedLineId(null);
  };

  const handleSelectObjectOnMap = (id: string | null) => {
    if (activeTool === 'delete' || activeTool === 'delete-object') {
      if (id) {
        setObjects((prev) => prev.filter((o) => o.id !== id));
        setPowerLines((prev) => prev.filter((l) => l.startPoleId !== id && l.endPoleId !== id));
        if (selectedObjectId === id) {
          setSelectedObjectId(null);
        }
        if (connectingPoleId === id) {
          setConnectingPoleId(null);
        }
      }
      return;
    }
    setSelectedObjectId(id);
    if (id) {
      setSelectedLineId(null);
    }
  };

  const [centerTarget, setCenterTarget] = useState<{ x: number; y: number } | null>(null);

  const handleCenterOn = (x: number, y: number) => {
    setCenterTarget({ x, y });
  };

  const handleUpdateObject = (id: string, updates: Partial<MapObjectData>) => {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  };

  const handleUpdateLineVoltage = (id: string, voltage: PowerLineVoltage) => {
    setPowerLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, voltage } : l))
    );
  };

  const handleClearAll = () => {
    setObjects([]);
    setPowerLines([]);
    setSelectedObjectId(null);
    setSelectedLineId(null);
    setConnectingPoleId(null);
  };

  const handleMoveObject = (id: string, x: number, y: number) => {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? { ...o, x, y } : o))
    );
  };

  const handleCreateLine = (
    startPoleId: string,
    endPoleId: string,
    voltage: PowerLineVoltage
  ) => {
    const exists = powerLines.some(
      (l) =>
        (l.startPoleId === startPoleId && l.endPoleId === endPoleId) ||
        (l.startPoleId === endPoleId && l.endPoleId === startPoleId)
    );
    if (exists) return;

    const existingLineNums = powerLines
      .map((l) => parseInt(l.id.replace('#LINE-', ''), 10))
      .filter((n) => !isNaN(n));
    const nextLineNum = existingLineNums.length > 0 ? Math.max(...existingLineNums) + 1 : 1;

    const newLine: PowerLineData = {
      id: `#LINE-${String(nextLineNum).padStart(3, '0')}`,
      voltage,
      startPoleId,
      endPoleId,
    };
    setPowerLines((prev) => [...prev, newLine]);
    setSelectedLineId(newLine.id);
    setSelectedObjectId(null);
  };

  const handleDeleteLine = (id: string) => {
    setPowerLines((prev) => prev.filter((l) => l.id !== id));
    if (selectedLineId === id) {
      setSelectedLineId(null);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedObjectId) {
      const idToDelete = selectedObjectId;
      setObjects((prev) => prev.filter((o) => o.id !== idToDelete));
      setPowerLines((prev) => prev.filter((l) => l.startPoleId !== idToDelete && l.endPoleId !== idToDelete));
      setSelectedObjectId(null);
    } else if (selectedLineId) {
      setPowerLines((prev) => prev.filter((l) => l.id !== selectedLineId));
      setSelectedLineId(null);
    }
  };

  const selectedObject = objects.find((o) => o.id === selectedObjectId);
  const selectedLine = powerLines.find((l) => l.id === selectedLineId);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#0b1120] text-slate-200 select-none">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0f172a] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
            <Zap className="h-5 w-5 fill-amber-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            PowerGrid
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-sm text-slate-400">Редактор електромережі</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Опор:</span>
            <span className="font-semibold text-slate-200">{poleCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Ліній:</span>
            <span className="font-semibold text-slate-200">{powerLines.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Довжина:</span>
            <span className="font-semibold text-slate-200">{totalLengthKm} км</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 px-3 py-1.5 text-xs border border-slate-700/50">
            <Power
              className={`h-3.5 w-3.5 ${
                isPowerOn ? 'text-emerald-400' : 'text-slate-500'
              }`}
            />
            <span className="text-slate-400">Струм:</span>
            <button
              type="button"
              onClick={() => setIsPowerOn((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isPowerOn ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isPowerOn ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            title="Очистити всю карту"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Очистити</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0f172a] overflow-hidden">
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-slate-800 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Wrench className="h-4 w-4 text-slate-500" />
            <span>Інструменти</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <Toolbar
              activeTool={activeTool}
              onSelectTool={handleSelectTool}
              lineVoltage={lineVoltage}
              onSelectVoltage={setLineVoltage}
              lineStartPoleId={connectingPoleId}
              hasSelection={!!selectedObjectId || !!selectedLineId}
              onDeleteSelected={handleDeleteSelected}
            />

            <div className="h-px bg-slate-800/80" />

            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">
              Об`єкти для розміщення
            </div>

            <ObjectLibrary
              selectedType={placingType}
              onSelectObject={handleSelectObjectFromLibrary}
              activeTool={activeTool}
            />
          </div>
        </aside>

        <main className="relative flex-1 overflow-hidden bg-[#487532]">
          <GridWorkspace
            objects={objects}
            powerLines={powerLines}
            selectedObjectId={selectedObjectId}
            selectedLineId={selectedLineId}
            onSelectObject={handleSelectObjectOnMap}
            onSelectLine={(id) => {
              setSelectedLineId(id);
              if (id) {
                setSelectedObjectId(null);
              }
            }}
            onPlaceObject={handlePlaceObject}
            onMoveObject={handleMoveObject}
            onCreateLine={handleCreateLine}
            onDeleteLine={handleDeleteLine}
            connectingPoleId={connectingPoleId}
            onConnectingPoleChange={setConnectingPoleId}
            activeTool={activeTool}
            placingType={placingType}
            lineVoltage={lineVoltage}
            isPowerOn={isPowerOn}
            centerTarget={centerTarget}
          />
        </main>

        <aside className="flex w-72 shrink-0 flex-col border-l border-slate-800 bg-[#0f172a] p-4">
          <ObjectProperties
            selectedObject={selectedObject ?? null}
            selectedLine={selectedLine ?? null}
            objects={objects}
            powerLines={powerLines}
            onSelectObject={handleSelectObjectOnMap}
            onSelectLine={(id) => {
              setSelectedLineId(id);
              if (id) {
                setSelectedObjectId(null);
              }
            }}
            onUpdateObject={handleUpdateObject}
            onUpdateLineVoltage={handleUpdateLineVoltage}
            onDeleteObject={(id) => {
              setObjects((prev) => prev.filter((o) => o.id !== id));
              setPowerLines((prev) => prev.filter((l) => l.startPoleId !== id && l.endPoleId !== id));
              if (selectedObjectId === id) setSelectedObjectId(null);
              if (connectingPoleId === id) setConnectingPoleId(null);
            }}
            onDeleteLine={handleDeleteLine}
            onCenterOn={handleCenterOn}
            calculateLineLength={calculateLineLength}
          />
        </aside>
      </div>

      <NetworkStats
        objects={objects}
        powerLines={powerLines}
        activeTool={activeTool}
        totalLengthKm={totalLengthKm}
        calculateLineLength={calculateLineLength}
      />
    </div>
  );
}

export default App;
