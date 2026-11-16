import React from 'react';
import type { RoadData, ToolMode } from '../types/grid';

export interface RoadProps {
  road: RoadData;
  isSelected: boolean;
  activeTool: ToolMode;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Road: React.FC<RoadProps> = ({
  road,
  isSelected,
  activeTool,
  onSelect,
  onDelete,
}) => {
  const isDeleteMode = activeTool === 'delete' || activeTool === 'delete-line';
  const midX = (road.startX + road.endX) / 2;
  const midY = (road.startY + road.endY) / 2;
  const lengthM = Math.round(
    Math.hypot(road.endX - road.startX, road.endY - road.startY)
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleteMode) {
      onDelete(road.id);
    } else if (activeTool === 'select') {
      onSelect(road.id);
    }
  };

  return (
    <g
      data-interactive="true"
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (activeTool === 'select') {
          onSelect(road.id);
        }
      }}
      className={`group ${isDeleteMode || activeTool === 'select' ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {isSelected && (
        <line
          x1={road.startX}
          y1={road.startY}
          x2={road.endX}
          y2={road.endY}
          stroke="#38bdf8"
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.35"
        />
      )}

      <line
        x1={road.startX}
        y1={road.startY}
        x2={road.endX}
        y2={road.endY}
        stroke="transparent"
        strokeWidth="30"
        strokeLinecap="round"
        className={isDeleteMode ? 'transition-colors group-hover:stroke-red-500/70' : ''}
      />

      <line
        x1={road.startX}
        y1={road.startY}
        x2={road.endX}
        y2={road.endY}
        stroke="#1e293b"
        strokeWidth="28"
        strokeLinecap="round"
      />

      <line
        x1={road.startX}
        y1={road.startY}
        x2={road.endX}
        y2={road.endY}
        stroke="#334155"
        strokeWidth="24"
        strokeLinecap="round"
      />

      <line
        x1={road.startX}
        y1={road.startY}
        x2={road.endX}
        y2={road.endY}
        stroke="#f8fafc"
        strokeWidth="2"
        strokeDasharray="10 8"
        strokeLinecap="butt"
        opacity="0.9"
      />

      <line
        x1={road.startX}
        y1={road.startY}
        x2={road.endX}
        y2={road.endY}
        stroke="rgba(0, 0, 0, 0.001)"
        strokeWidth="34"
        strokeLinecap="round"
        style={{ pointerEvents: 'stroke' }}
      />

      {isSelected && (
        <g transform={`translate(${midX}, ${midY})`} pointerEvents="none">
          <rect
            x="-28"
            y="-10"
            width="56"
            height="20"
            rx="6"
            fill="#0f172a"
            stroke="#38bdf8"
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
            {lengthM} м
          </text>
        </g>
      )}
    </g>
  );
};
