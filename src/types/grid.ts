export type ObjectCategory = 'electrical' | 'terrain';

export type PoleType = 'wooden-pole' | 'concrete-pole' | 'metal-pole';
export type ElectricalType = PoleType | 'transformer';
export type TerrainType = 'house' | 'factory' | 'tree' | 'road' | 'pond';
export type MapObjectType = ElectricalType | TerrainType;

export type PowerLineVoltage = 'low' | 'medium' | 'high';

export type ToolMode =
  | 'select'
  | 'place'
  | 'line'
  | 'delete-object'
  | 'delete-line';

export interface MapObjectData {
  id: string;
  type: MapObjectType;
  category: ObjectCategory;
  name: string;
  x: number;
  y: number;
}

export interface PowerLineData {
  id: string;
  voltage: PowerLineVoltage;
  startPoleId: string;
  endPoleId: string;
}

export interface LibraryItem {
  type: MapObjectType;
  category: ObjectCategory;
  name: string;
  shortName: string;
  description: string;
  heightMeters?: number;
}

export const POLE_TYPES: readonly PoleType[] = [
  'wooden-pole',
  'concrete-pole',
  'metal-pole',
];

export function isPoleType(type: MapObjectType): type is PoleType {
  return (
    type === 'wooden-pole' ||
    type === 'concrete-pole' ||
    type === 'metal-pole'
  );
}

export function isElectricalType(type: MapObjectType): type is ElectricalType {
  return isPoleType(type) || type === 'transformer';
}

export const VOLTAGE_CONFIG: Record<
  PowerLineVoltage,
  {
    label: string;
    shortLabel: string;
    voltageText: string;
    color: string;
    glowColor: string;
    strokeWidth: number;
    dashArray?: string;
  }
> = {
  low: {
    label: 'Низьковольтна (0.4 кВ)',
    shortLabel: 'Низьковольтна',
    voltageText: '0.4 кВ',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    strokeWidth: 3,
  },
  medium: {
    label: 'Середньовольтна (10 кВ)',
    shortLabel: 'Середньовольтна',
    voltageText: '10 кВ',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    strokeWidth: 4,
  },
  high: {
    label: 'Високовольтна (110 кВ)',
    shortLabel: 'Високовольтна',
    voltageText: '110 кВ',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.55)',
    strokeWidth: 5,
    dashArray: '14 4',
  },
};

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    type: 'wooden-pole',
    category: 'electrical',
    name: "Дерев'яна електрична опора",
    shortName: "Дерев'яна опора",
    description: 'Опора ЛЕП 0.4–10 кВ',
    heightMeters: 11,
  },
  {
    type: 'concrete-pole',
    category: 'electrical',
    name: 'Бетонна електрична опора',
    shortName: 'Бетонна опора',
    description: 'Залізобетонна опора 10–35 кВ',
    heightMeters: 16,
  },
  {
    type: 'metal-pole',
    category: 'electrical',
    name: 'Металева електрична опора',
    shortName: 'Металева опора',
    description: 'Решітчаста опора 110–220 кВ',
    heightMeters: 35,
  },
  {
    type: 'transformer',
    category: 'electrical',
    name: 'Трансформатор',
    shortName: 'Трансформатор',
    description: 'Трансформаторна підстанція',
  },
  {
    type: 'house',
    category: 'terrain',
    name: 'Житловий будинок',
    shortName: 'Будинок',
    description: 'Приватний житловий сектор',
  },
  {
    type: 'factory',
    category: 'terrain',
    name: 'Промислова будівля',
    shortName: 'Пром. будівля',
    description: 'Виробничий цех або склад',
  },
  {
    type: 'tree',
    category: 'terrain',
    name: 'Дерево',
    shortName: 'Дерево',
    description: 'Зелені насадження',
  },
  {
    type: 'road',
    category: 'terrain',
    name: 'Дорога',
    shortName: 'Дорога',
    description: 'Асфальтована автодорога',
  },
  {
    type: 'pond',
    category: 'terrain',
    name: 'Водойма',
    shortName: 'Водойма',
    description: 'Озеро або річка',
  },
];

export function getLibraryItem(type: MapObjectType): LibraryItem {
  return LIBRARY_ITEMS.find((item) => item.type === type) ?? LIBRARY_ITEMS[0];
}
пше 