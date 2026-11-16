import React, { useState } from 'react';
import {
  Trash2,
  Crosshair,
  Zap,
  Layers,
  MapPin,
  Tag,
  Activity,
  ArrowRight,
} from 'lucide-react';
import type {
  MapObjectData,
  PowerLineData,
  PowerLineVoltage,
} from '../types/grid';
import { VOLTAGE_CONFIG, getLibraryItem, isPoleType } from '../types/grid';
import { ObjectGraphic } from './icons';

interface ObjectEditorProps {
  selectedObject: MapObjectData;
  objects: MapObjectData[];
  connectedLines: PowerLineData[];
  onSelectLine: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<MapObjectData>) => void;
  onDeleteObject: (id: string) => void;
  onCenterOn?: (x: number, y: number) => void;
  calculateLineLength: (line: PowerLineData) => number;
}

const ObjectEditor: React.FC<ObjectEditorProps> = ({
  selectedObject,
  objects,
  connectedLines,
  onSelectLine,
  onUpdateObject,
  onDeleteObject,
  onCenterOn,
  calculateLineLength,
}) => {
  const [nameInput, setNameInput] = useState(selectedObject.name);
  const [prevName, setPrevName] = useState(selectedObject.name);

  if (selectedObject.name !== prevName) {
    setPrevName(selectedObject.name);
    setNameInput(selectedObject.name);
  }

  const handleNameBlur = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== selectedObject.name) {
      onUpdateObject(selectedObject.id, { name: trimmed });
    } else {
      setNameInput(selectedObject.name);
    }
  };

  const libraryItem = getLibraryItem(selectedObject.type);

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800">
          <ObjectGraphic type={selectedObject.type} size={30} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-slate-100 truncate">
            {libraryItem?.name ?? selectedObject.name}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Layers className="h-3 w-3 text-slate-500" />
            {selectedObject.category === 'electrical' ? 'Електромережа' : 'Місцевість'}
            {isPoleType(selectedObject.type) && ' · Опора'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
            <Tag className="h-3.5 w-3.5 text-slate-500" />
            Назва об`єкта
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
            className="w-full rounded-lg border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 outline-none transition-colors focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            placeholder="Введіть назву..."
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            Координати на карті (м)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center rounded-lg border border-slate-700/60 bg-slate-900/80 px-2.5 py-1.5">
              <span className="text-[11px] font-mono text-slate-500 mr-2">X:</span>
              <input
                type="number"
                value={selectedObject.x}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) onUpdateObject(selectedObject.id, { x: val });
                }}
                className="w-full bg-transparent text-xs font-mono text-slate-200 outline-none"
              />
            </div>
            <div className="flex items-center rounded-lg border border-slate-700/60 bg-slate-900/80 px-2.5 py-1.5">
              <span className="text-[11px] font-mono text-slate-500 mr-2">Y:</span>
              <input
                type="number"
                value={selectedObject.y}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) onUpdateObject(selectedObject.id, { y: val });
                }}
                className="w-full bg-transparent text-xs font-mono text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {libraryItem?.description && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2.5 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-slate-500 block mb-0.5">Опис:</span>
            {libraryItem.description}
          </div>
        )}

        {selectedObject.category === 'electrical' && (
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Підключені лінії ({connectedLines.length})
              </span>
            </div>

            {connectedLines.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-800 p-3 text-center text-[11px] text-slate-500">
                Немає підключених ліній
              </div>
            ) : (
              <div className="space-y-1.5">
                {connectedLines.map((line) => {
                  const otherPoleId =
                    line.startPoleId === selectedObject.id
                      ? line.endPoleId
                      : line.startPoleId;
                  const otherPole = objects.find((o) => o.id === otherPoleId);
                  const cfg = VOLTAGE_CONFIG[line.voltage];
                  const lengthM = calculateLineLength(line);

                  return (
                    <button
                      key={line.id}
                      type="button"
                      onClick={() => onSelectLine(line.id)}
                      className="group flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-left transition-colors hover:border-slate-700 hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: cfg.color }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono text-xs font-medium text-slate-300 group-hover:text-white truncate">
                            {line.id}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                            до {otherPole ? otherPole.name : otherPoleId}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-amber-400 shrink-0">
                        {lengthM} м
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col gap-2">
        {onCenterOn && (
          <button
            type="button"
            onClick={() => onCenterOn(selectedObject.x, selectedObject.y)}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/80 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <Crosshair className="h-3.5 w-3.5 text-sky-400" />
            <span>Центрувати на карті</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onDeleteObject(selectedObject.id)}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500 hover:text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Видалити об`єкт</span>
        </button>
      </div>
    </>
  );
};

export interface ObjectPropertiesProps {
  selectedObject: MapObjectData | null;
  selectedLine: PowerLineData | null;
  objects: MapObjectData[];
  powerLines: PowerLineData[];
  onSelectObject: (id: string | null) => void;
  onSelectLine: (id: string | null) => void;
  onUpdateObject: (id: string, updates: Partial<MapObjectData>) => void;
  onUpdateLineVoltage: (id: string, voltage: PowerLineVoltage) => void;
  onDeleteObject: (id: string) => void;
  onDeleteLine: (id: string) => void;
  onCenterOn?: (x: number, y: number) => void;
  calculateLineLength: (line: PowerLineData) => number;
}

export const ObjectProperties: React.FC<ObjectPropertiesProps> = ({
  selectedObject,
  selectedLine,
  objects,
  powerLines,
  onSelectObject,
  onSelectLine,
  onUpdateObject,
  onUpdateLineVoltage,
  onDeleteObject,
  onDeleteLine,
  onCenterOn,
  calculateLineLength,
}) => {
  const connectedLines = selectedObject
    ? powerLines.filter(
        (l) => l.startPoleId === selectedObject.id || l.endPoleId === selectedObject.id
      )
    : [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {selectedObject ? 'Властивості об`єкта' : selectedLine ? 'Властивості лінії' : 'Властивості'}
        </span>
        {(selectedObject || selectedLine) && (
          <span className="font-mono text-[11px] font-bold text-sky-400">
            {selectedObject ? selectedObject.id : selectedLine?.id}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {selectedObject && (
          <ObjectEditor
            key={selectedObject.id}
            selectedObject={selectedObject}
            objects={objects}
            connectedLines={connectedLines}
            onSelectLine={onSelectLine}
            onUpdateObject={onUpdateObject}
            onDeleteObject={onDeleteObject}
            onCenterOn={onCenterOn}
            calculateLineLength={calculateLineLength}
          />
        )}

        {selectedLine && (() => {
          const cfg = VOLTAGE_CONFIG[selectedLine.voltage];
          const startPole = objects.find((o) => o.id === selectedLine.startPoleId);
          const endPole = objects.find((o) => o.id === selectedLine.endPoleId);
          const lengthM = calculateLineLength(selectedLine);

          return (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
                    style={{
                      borderColor: `${cfg.color}40`,
                      backgroundColor: `${cfg.color}15`,
                    }}
                  >
                    <Zap className="h-5 w-5" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-100 block">
                      {cfg.label}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {selectedLine.id}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-2">
                  <Activity className="h-3.5 w-3.5 text-slate-500" />
                  Клас напруги
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['low', 'medium', 'high'] as PowerLineVoltage[]).map((v) => {
                    const c = VOLTAGE_CONFIG[v];
                    const isCurrent = selectedLine.voltage === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onUpdateLineVoltage(selectedLine.id, v)}
                        className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                          isCurrent
                            ? 'border-sky-500 bg-sky-500/15 text-white ring-1 ring-sky-500/50'
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span
                          className="h-2 w-2 rounded-full mb-1"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-[11px] font-bold">{c.voltageText}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Довжина лінії:</span>
                  <span className="font-mono font-semibold text-amber-400 text-sm">
                    {lengthM} м
                  </span>
                </div>
                <div className="h-px w-full bg-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Початкова опора:</span>
                  <button
                    type="button"
                    onClick={() => onSelectObject(selectedLine.startPoleId)}
                    className="font-mono text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>{startPole ? startPole.name : selectedLine.startPoleId}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Кінцева опора:</span>
                  <button
                    type="button"
                    onClick={() => onSelectObject(selectedLine.endPoleId)}
                    className="font-mono text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>{endPole ? endPole.name : selectedLine.endPoleId}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {startPole && endPole && onCenterOn && (
                  <button
                    type="button"
                    onClick={() =>
                      onCenterOn((startPole.x + endPole.x) / 2, (startPole.y + endPole.y) / 2)
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/80 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    <Crosshair className="h-3.5 w-3.5 text-sky-400" />
                    <span>Центрувати на лінії</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteLine(selectedLine.id)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Видалити лінію</span>
                </button>
              </div>
            </div>
          );
        })()}

        {!selectedObject && !selectedLine && (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/60 border border-slate-700/50 text-slate-500 mb-3">
              <Layers className="h-6 w-6" />
            </div>
            <p className="text-xs font-medium text-slate-300">
              Нічого не обрано
            </p>
            <p className="mt-1 text-[11px] text-slate-500 max-w-[180px]">
              Оберіть опору, споруду або лінію на карті для перегляду та редагування
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
