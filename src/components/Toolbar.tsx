import React from 'react';
import {
  MousePointer2,
  Zap,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { ToolMode, PowerLineVoltage } from '../types/grid';
import { VOLTAGE_CONFIG } from '../types/grid';

export interface ToolbarProps {
  activeTool: ToolMode;
  onSelectTool: (mode: ToolMode) => void;
  lineVoltage: PowerLineVoltage;
  onSelectVoltage: (voltage: PowerLineVoltage) => void;
  lineStartPoleId?: string | null;
  hasSelection?: boolean;
  onDeleteSelected?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onSelectTool,
  lineVoltage,
  onSelectVoltage,
  lineStartPoleId,
  hasSelection = false,
  onDeleteSelected,
}) => {
  const [isLineMenuOpen, setIsLineMenuOpen] = React.useState<boolean>(true);
  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = React.useState<boolean>(false);

  const isSelectActive = activeTool === 'select';
  const isLineActive = activeTool === 'line';
  const isDeleteActive =
    activeTool === 'delete' ||
    activeTool === 'delete-object' ||
    activeTool === 'delete-line';

  return (
    <div className="flex flex-col gap-2">

      <button
        type="button"
        onClick={() => onSelectTool('select')}
        className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
          isSelectActive
            ? 'border-2 border-blue-500 bg-blue-600/20 text-white shadow-lg'
            : 'border border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
        }`}
        title="Вибір об`єктів та переміщення по карті"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              isSelectActive
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
            }`}
          >
            <MousePointer2 className="h-4 w-4" />
          </div>
          <span>Вибір</span>
        </div>
        {isSelectActive && (
          <span className="flex h-2 w-2 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
        )}
      </button>

      <div className="flex flex-col">
        <div
          className={`flex items-center justify-between rounded-xl transition-all ${
            isLineActive
              ? 'border-2 border-amber-500/80 bg-amber-500/15 text-white'
              : 'border border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelectTool('line')}
            className="flex flex-1 items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-left"
            title="Прокласти лінію електропередач між опорами"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isLineActive
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-amber-400 group-hover:text-amber-300'
              }`}
            >
              <Zap className="h-4 w-4 fill-current" />
            </div>
            <div className="flex flex-col">
              <span>Лінія</span>
              <span className="text-[10px] text-slate-400">
                {VOLTAGE_CONFIG[lineVoltage].voltageText}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsLineMenuOpen((prev) => !prev)}
            className="mr-2 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
            title="Вибрати клас напруги"
          >
            {isLineMenuOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {isLineMenuOpen && (
          <div className="mt-1.5 flex flex-col gap-1 pl-4 pr-1 py-1 border-l-2 border-slate-800">
            {(['low', 'medium', 'high'] as PowerLineVoltage[]).map((v) => {
              const cfg = VOLTAGE_CONFIG[v];
              const isSelected = lineVoltage === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    onSelectVoltage(v);
                    if (activeTool !== 'line') {
                      onSelectTool('line');
                    }
                  }}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isSelected
                      ? 'bg-slate-800 font-semibold text-white'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <span>{cfg.shortLabel}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {cfg.voltageText}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isLineActive && lineStartPoleId && (
          <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-300 border border-amber-500/20">
            <Sparkles className="h-3.5 w-3.5 shrink-0 animate-pulse text-amber-400" />
            <span>Оберіть другу опору для з&apos;єднання</span>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div
          className={`flex items-center justify-between rounded-xl transition-all ${
            isDeleteActive
              ? 'border-2 border-red-500 bg-red-600/20 text-red-200 shadow-lg'
              : 'border border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelectTool('delete')}
            className="flex flex-1 items-center gap-3 px-3.5 py-2.5 text-sm font-medium text-left"
            title="Клікніть на будь-який об`єкт або лінію на карті, щоб видалити його"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isDeleteActive
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-800 text-red-400 group-hover:text-red-300'
              }`}
            >
              <Trash2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span>Видалити</span>
              <span className="text-[10px] text-slate-400">
                {activeTool === 'delete-object'
                  ? 'Тільки об`єкти'
                  : activeTool === 'delete-line'
                  ? 'Тільки лінії'
                  : 'Об`єкти та лінії'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteMenuOpen((prev) => !prev)}
            className="mr-2 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
            title="Підрежими видалення"
          >
            {isDeleteMenuOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {isDeleteMenuOpen && (
          <div className="mt-1.5 flex flex-col gap-1 pl-4 pr-1 py-1 border-l-2 border-slate-800">
            <button
              type="button"
              onClick={() => onSelectTool('delete')}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                activeTool === 'delete'
                  ? 'bg-red-500/20 text-red-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <span>Усе підряд</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTool('delete-object')}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                activeTool === 'delete-object'
                  ? 'bg-red-500/20 text-red-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <span>Тільки об&apos;єкти</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTool('delete-line')}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                activeTool === 'delete-line'
                  ? 'bg-red-500/20 text-red-300 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <span>Тільки лінії</span>
            </button>
          </div>
        )}

        {hasSelection && onDeleteSelected && (
          <button
            type="button"
            onClick={onDeleteSelected}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Видалити вибране</span>
          </button>
        )}
      </div>
    </div>
  );
};
