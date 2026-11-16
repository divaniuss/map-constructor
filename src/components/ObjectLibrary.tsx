import React from 'react';
import { ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import type { MapObjectType, ToolMode } from '../types/grid';
import { ObjectGraphic } from './icons';

export interface ObjectLibraryProps {
  selectedType: MapObjectType | null;
  onSelectObject: (type: MapObjectType) => void;
  activeTool: ToolMode;
}

interface GroupConfig {
  id: string;
  title: string;
  items: {
    type: MapObjectType;
    name: string;
    sublabel?: string;
  }[];
}

export const ObjectLibrary: React.FC<ObjectLibraryProps> = ({
  selectedType,
  onSelectObject,
  activeTool,
}) => {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    poles: true,
    buildings: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isPlacing = activeTool === 'place';

  const groups: GroupConfig[] = [
    {
      id: 'poles',
      title: 'Опора',
      items: [
        { type: 'metal-pole', name: 'Металева', sublabel: '110–220 кВ' },
        { type: 'concrete-pole', name: 'Бетонна', sublabel: '10–35 кВ' },
        { type: 'wooden-pole', name: "Дерев'яна", sublabel: '0.4–10 кВ' },
      ],
    },
    {
      id: 'buildings',
      title: 'Будинок / Споруди',
      items: [
        { type: 'house', name: 'Житловий будинок', sublabel: 'Котедж' },
        { type: 'factory', name: 'Пром. будівля', sublabel: 'Цех / склад' },
      ],
    },
  ];

  const singleItems: { type: MapObjectType; name: string; sublabel?: string }[] = [
    { type: 'transformer', name: 'Трансформатор', sublabel: 'Підстанція' },
    { type: 'tree', name: 'Дерево', sublabel: 'Зелені насадження' },
    { type: 'road', name: 'Дорога', sublabel: 'Асфальт' },
    { type: 'pond', name: 'Водойма', sublabel: 'Озеро' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        {groups.map((group) => {
          const isOpen = !!openGroups[group.id];
          const hasSelectedInGroup =
            isPlacing && group.items.some((item) => item.type === selectedType);

          return (
            <div key={group.id} className="mb-2 flex flex-col">
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  hasSelectedInGroup
                    ? 'border border-blue-500/50 bg-blue-500/15 text-blue-100'
                    : 'border border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                    <ObjectGraphic
                      type={group.items[0].type}
                      size={24}
                      className="transition-transform group-hover:scale-110"
                    />
                  </div>
                  <span>{group.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="mt-1.5 flex flex-col gap-1 pl-3 pr-1 py-1 border-l-2 border-slate-800">
                  {group.items.map((item) => {
                    const isSelected = isPlacing && selectedType === item.type;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => onSelectObject(item.type)}
                        className={`group/item flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all ${
                          isSelected
                            ? 'border border-blue-500/50 bg-blue-500/20 font-medium text-blue-100'
                            : 'border border-transparent hover:border-slate-700 bg-slate-800/30 hover:bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900/80">
                            <ObjectGraphic
                              type={item.type}
                              size={22}
                              className="transition-transform group-hover/item:scale-110"
                            />
                          </div>
                          <div className="flex flex-col text-left">
                            <span>{item.name}</span>
                            {item.sublabel && (
                              <span className="text-[10px] text-slate-400">
                                {item.sublabel}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400/80" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1.5">
        {singleItems.map((item) => {
          const isSelected = isPlacing && selectedType === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectObject(item.type)}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isSelected
                  ? 'border border-blue-500/50 bg-blue-500/15 text-blue-100'
                  : 'border border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
              title={`Розмістити: ${item.name}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                  <ObjectGraphic
                    type={item.type}
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span>{item.name}</span>
                  {item.sublabel && (
                    <span className="text-[10px] text-slate-400">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>
              {isSelected && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400/80" />
              )}
            </button>
          );
        })}
      </div>

      {isPlacing && selectedType && (
        <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-2.5 text-xs text-blue-200">
          <MapPin className="h-4 w-4 shrink-0 text-blue-400 animate-bounce" />
          <span>Клікніть на карту, щоб поставити об`єкт</span>
        </div>
      )}
    </div>
  );
};
