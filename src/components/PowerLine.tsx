import React from 'react';
import type { PowerLineData, ToolMode } from '../types/grid';
import { VOLTAGE_CONFIG } from '../types/grid';

export interface PowerLineProps {
  line: PowerLineData;
  start: { x: number; y: number };
  end: { x: number; y: number };
  isPowerOn: boolean;
  isSelected: boolean;
  activeTool: ToolMode;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PowerLine: React.FC<PowerLineProps> = ({
  line,
  start,
  end,
  isPowerOn,
  isSelected,
  activeTool,
  onSelect,
  onDelete,
}) => {
  const cfg = VOLTAGE_CONFIG[line.voltage];
  const lineColor = isPowerOn ? cfg.color : '#64748b';
  const isDeleteMode = activeTool === 'delete' || activeTool === 'delete-line';

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleteMode) {
      onDelete(line.id);
    } else if (activeTool === 'select') {
      onSelect(line.id);
    }
  };

  return (
    <g
      data-interactive="true"
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (activeTool === 'select') {
          onSelect(line.id);
        }
      }}
      className={`group ${isDeleteMode || activeTool === 'select' ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {isSelected && (
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#38bdf8"
          strokeWidth={cfg.strokeWidth + 8}
          strokeLinecap="round"
          opacity="0.35"
        />
      )}

      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="transparent"
        strokeWidth={cfg.strokeWidth + 4}
        strokeLinecap="round"
        className={isDeleteMode ? 'transition-colors group-hover:stroke-red-500/70' : ''}
      />

      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={lineColor}
        strokeWidth={cfg.strokeWidth}
        strokeDasharray={cfg.dashArray}
        strokeLinecap="round"
        className="transition-colors"
      />

      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="rgba(0, 0, 0, 0.001)"
        strokeWidth="20"
        strokeLinecap="round"
        style={{ pointerEvents: 'stroke' }}
      />

      <g transform={`translate(${midX}, ${midY})`} pointerEvents="none">
        <rect
          x="-24"
          y="-10"
          width="48"
          height="20"
          rx="10"
          fill="#0f172a"
          stroke={lineColor}
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="3.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9"
          fontWeight="700"
        >
          {cfg.voltageText}
        </text>
      </g>
    </g>
  );
};
