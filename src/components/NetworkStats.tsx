import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Layers,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Info,
} from 'lucide-react';
import type {
  MapObjectData,
  PowerLineData,
  ToolMode,
} from '../types/grid';
import { isPoleType } from '../types/grid';

export interface NetworkStatsProps {
  objects: MapObjectData[];
  powerLines: PowerLineData[];
  activeTool: ToolMode;
  totalLengthKm: string;
  calculateLineLength: (line: PowerLineData) => number;
}

export const NetworkStats: React.FC<NetworkStatsProps> = ({
  objects,
  powerLines,
  activeTool,
  totalLengthKm,
  calculateLineLength,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const metalPoles = objects.filter((o) => o.type === 'metal-pole').length;
  const concretePoles = objects.filter((o) => o.type === 'concrete-pole').length;
  const woodenPoles = objects.filter((o) => o.type === 'wooden-pole').length;
  const totalPoles = metalPoles + concretePoles + woodenPoles;
  const transformers = objects.filter((o) => o.type === 'transformer').length;

  const highVoltageLines = powerLines.filter((l) => l.voltage === 'high');
  const mediumVoltageLines = powerLines.filter((l) => l.voltage === 'medium');
  const lowVoltageLines = powerLines.filter((l) => l.voltage === 'low');

  const highVoltageKm = (
    highVoltageLines.reduce((acc, l) => acc + calculateLineLength(l), 0) / 1000
  ).toFixed(2);
  const mediumVoltageKm = (
    mediumVoltageLines.reduce((acc, l) => acc + calculateLineLength(l), 0) / 1000
  ).toFixed(2);
  const lowVoltageKm = (
    lowVoltageLines.reduce((acc, l) => acc + calculateLineLength(l), 0) / 1000
  ).toFixed(2);

  const disconnectedPoles = objects.filter((o) => {
    if (!isPoleType(o.type) && o.type !== 'transformer') return false;
    return !powerLines.some((l) => l.startPoleId === o.id || l.endPoleId === o.id);
  });

  const toolHints: Record<ToolMode, string> = {
    select: 'Режим вибору: клікніть для виділення та перетягування',
    place: 'Режим розміщення: клікніть на карті для додавання',
    line: 'Режим ЛЕП: оберіть послідовно дві опори для з`єднання',
    delete: 'Режим видалення: клікніть по об`єкту або лінії',
    'delete-object': 'Режим видалення: тільки об`єкти',
    'delete-line': 'Режим видалення: тільки лінії',
  };

  return (
    <footer className="relative flex flex-col border-t border-slate-800 bg-[#0f172a] text-xs text-slate-400 select-none">
      {isExpanded && (
        <div className="absolute bottom-full left-0 right-0 border-t border-slate-800 bg-[#0b1120]/95 backdrop-blur-md p-4 shadow-2xl z-30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs border-b border-slate-800 pb-2">
                <Layers className="h-4 w-4 text-sky-400" />
                <span>Опори та підстанції</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Металеві (110–220 кВ):</span>
                  <span className="font-mono font-medium text-slate-200">{metalPoles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Бетонні (10–35 кВ):</span>
                  <span className="font-mono font-medium text-slate-200">{concretePoles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Дерев`яні (0.4–10 кВ):</span>
                  <span className="font-mono font-medium text-slate-200">{woodenPoles}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Трансформатори:</span>
                  <span className="font-mono font-medium text-amber-400">{transformers}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs border-b border-slate-800 pb-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Розподіл за напругою</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    110 кВ:
                  </span>
                  <span className="font-mono text-slate-200">
                    {highVoltageLines.length} лін. · {highVoltageKm} км
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    10 кВ:
                  </span>
                  <span className="font-mono text-slate-200">
                    {mediumVoltageLines.length} лін. · {mediumVoltageKm} км
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    0.4 кВ:
                  </span>
                  <span className="font-mono text-slate-200">
                    {lowVoltageLines.length} лін. · {lowVoltageKm} км
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs border-b border-slate-800 pb-2">
                <Info className="h-4 w-4 text-purple-400" />
                <span>Діагностика мережі</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                {disconnectedPoles.length > 0 ? (
                  <div className="flex items-start gap-2 text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>
                      Виявлено <strong>{disconnectedPoles.length}</strong> ізольованих опор без підключених ліній
                    </span>
                  </div>
                ) : totalPoles > 0 ? (
                  <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                    <Zap className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Усі опори успішно підключені до мережі</span>
                  </div>
                ) : (
                  <span className="text-slate-500 block p-1">
                    Мережа порожня. Розмістіть опори та з`єднайте їх лініями.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-11 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Статистика мережі</span>
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </button>
          <span>{totalPoles} опор</span>
          <span>{powerLines.length} ліній</span>
          <span>{totalLengthKm} км</span>
          <span>{transformers} трансформатор</span>
          {disconnectedPoles.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <AlertTriangle className="h-3 w-3" />
              {disconnectedPoles.length} без ліній
            </span>
          )}
        </div>

        <span className="text-slate-500 hidden md:block">
          {toolHints[activeTool]}
        </span>
      </div>
    </footer>
  );
};
