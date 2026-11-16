import { useState } from 'react';
import {
  Zap,
  Wrench,
  Save,
  FolderOpen,
  Power,
} from 'lucide-react';
import type {
  ToolMode,
  MapObjectType,
  PowerLineVoltage,
  MapObjectData,
} from './types/grid';
import { getLibraryItem, isPoleType } from './types/grid';
import { Toolbar } from './components/Toolbar';
import { ObjectLibrary } from './components/ObjectLibrary';
import { GridWorkspace } from './components/GridWorkspace';

export function App() {
  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [placingType, setPlacingType] = useState<MapObjectType | null>(null);
  const [lineVoltage, setLineVoltage] = useState<PowerLineVoltage>('high');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  const [objects, setObjects] = useState<MapObjectData[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const poleCount = objects.filter((o) => isPoleType(o.type)).length;
  const transformerCount = objects.filter((o) => o.type === 'transformer').length;

  const handleSelectTool = (tool: ToolMode) => {
    setActiveTool(tool);
    if (tool !== 'place') {
      setPlacingType(null);
    }
  };

  const handleSelectObjectFromLibrary = (type: MapObjectType) => {
    setPlacingType(type);
    setActiveTool('place');
  };

  const generateObjectId = (type: MapObjectType): string => {
    const prefix = isPoleType(type) ? 'OP' : type === 'transformer' ? 'TR' : 'TER';
    const sameTypeCount = objects.filter((o) => o.type === type).length + 1;
    return `#${prefix}-${String(sameTypeCount).padStart(3, '0')}`;
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
  };

  const handleSelectObjectOnMap = (id: string | null) => {
    if (activeTool === 'delete' || activeTool === 'delete-object') {
      if (id) {
        setObjects((prev) => prev.filter((o) => o.id !== id));
        if (selectedObjectId === id) {
          setSelectedObjectId(null);
        }
      }
      return;
    }
    setSelectedObjectId(id);
  };

  const handleMoveObject = (id: string, x: number, y: number) => {
    setObjects((prev) =>
      prev.map((o) => (o.id === id ? { ...o, x, y } : o))
    );
  };

  const handleDeleteSelected = () => {
    if (selectedObjectId) {
      setObjects((prev) => prev.filter((o) => o.id !== selectedObjectId));
      setSelectedObjectId(null);
    }
  };

  const selectedObject = objects.find((o) => o.id === selectedObjectId);

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
            <span className="font-semibold text-slate-200">0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Довжина:</span>
            <span className="font-semibold text-slate-200">0.0 км</span>
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
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title="Зберегти мережу"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Зберегти</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            title="Завантажити мережу"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Завантажити</span>
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
              hasSelection={!!selectedObjectId}
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
            selectedObjectId={selectedObjectId}
            onSelectObject={handleSelectObjectOnMap}
            onPlaceObject={handlePlaceObject}
            onMoveObject={handleMoveObject}
            activeTool={activeTool}
            placingType={placingType}
          />
        </main>

        <aside className="flex w-72 shrink-0 flex-col border-l border-slate-800 bg-[#0f172a] p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            <span>Інформація про об&apos;єкт</span>
          </div>
          {selectedObject ? (
            <div className="mt-4 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/50">
                <span className="text-slate-400">ID:</span>
                <span className="font-mono font-semibold text-sky-400">{selectedObject.id}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/50">
                <span className="text-slate-400">Назва:</span>
                <span className="font-semibold text-slate-200">{selectedObject.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/50">
                <span className="text-slate-400">Координати:</span>
                <span className="font-mono text-slate-200">({selectedObject.x}, {selectedObject.y})</span>
              </div>
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="mt-2 rounded-lg border border-red-500/40 bg-red-500/10 py-2 font-medium text-red-400 hover:bg-red-500 hover:text-white transition-colors"
              >
                Видалити об&apos;єкт
              </button>
            </div>
          ) : (
            <p className="mt-6 text-center text-sm text-slate-500">
              Оберіть об&apos;єкт на карті
            </p>
          )}
        </aside>
      </div>

      <footer className="flex h-11 shrink-0 items-center justify-between border-t border-slate-800 bg-[#0f172a] px-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-amber-400">
            Статистика мережі:
          </span>
          <span>{poleCount} опор</span>
          <span>0 ліній</span>
          <span>0.0 км</span>
          <span>{transformerCount} трансформатор</span>
        </div>
        <span className="text-slate-500">
          {activeTool === 'select' && 'Режим вибору: натисніть на об’єкт для переміщення'}
          {activeTool === 'place' && 'Режим розміщення: натисніть на карту щоб поставити'}
          {activeTool === 'line' && 'Режим ЛЕП: оберіть послідовно дві опори'}
          {activeTool.startsWith('delete') && 'Режим видалення: натисніть на об’єкт для видалення'}
        </span>
      </footer>
    </div>
  );
}

export default App;
