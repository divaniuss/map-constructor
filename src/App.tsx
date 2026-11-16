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
} from './types/grid';
import { Toolbar } from './components/Toolbar';
import { ObjectLibrary } from './components/ObjectLibrary';

export function App() {

  const [activeTool, setActiveTool] = useState<ToolMode>('select');
  const [placingType, setPlacingType] = useState<MapObjectType | null>(null);
  const [lineVoltage, setLineVoltage] = useState<PowerLineVoltage>('high');
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  const handleSelectTool = (tool: ToolMode) => {
    setActiveTool(tool);
    if (tool !== 'place') {
      setPlacingType(null);
    }
  };

  const handleSelectObject = (type: MapObjectType) => {
    setPlacingType(type);
    setActiveTool('place');
  };

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
            <span className="font-semibold text-slate-200">0</span>
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
            />

            <div className="h-px bg-slate-800/80" />

            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">
              Об`єкти для розміщення
            </div>

            <ObjectLibrary
              selectedType={placingType}
              onSelectObject={handleSelectObject}
              activeTool={activeTool}
            />
          </div>
        </aside>

        {/* Робоче поле карти */}
        <main className="relative flex-1 overflow-hidden bg-[#5d9443] p-2">
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-700/60 bg-[#6ea84f]/80 text-sm text-white/90 shadow-inner">
            <span className="font-semibold">Робоча карта (GridWorkspace)</span>
            <span className="text-xs text-white/70 mt-1">
              Активний інструмент: <strong className="text-amber-300">{activeTool}</strong>
              {activeTool === 'place' && placingType && (
                <> (об&apos;єкт: <strong className="text-blue-200">{placingType}</strong>)</>
              )}
            </span>
          </div>
        </main>

        {/* Інформація про вибраний об'єкт */}
        <aside className="flex w-72 shrink-0 flex-col border-l border-slate-800 bg-[#0f172a] p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Інформація про об&apos;єкт</span>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Оберіть об&apos;єкт на карті
          </p>
        </aside>
      </div>

      {/* Статистика мережі*/}
      <footer className="flex h-11 shrink-0 items-center justify-between border-t border-slate-800 bg-[#0f172a] px-4 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-amber-400">
            Статистика мережі:
          </span>
          <span>0 опор</span>
          <span>0 ліній</span>
          <span>0.0 км</span>
          <span>0 трансформаторів</span>
        </div>
        <span className="text-slate-500">
          {activeTool === 'select' && 'Режим вибору: натисніть на об’єкт або лінію'}
          {activeTool === 'place' && 'Режим розміщення: натисніть на карту'}
          {activeTool === 'line' && 'Режим ЛЕП: оберіть послідовно дві опори'}
          {activeTool.startsWith('delete') && 'Режим видалення: натисніть для видалення'}
        </span>
      </footer>
    </div>
  );
}

export default App;
