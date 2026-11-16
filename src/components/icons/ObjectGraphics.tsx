import React from 'react';
import type { MapObjectType } from '../../types/grid';

interface GraphicProps {
  size?: number;
  className?: string;
  inMap?: boolean;
}


export function WoodenPoleGraphic({ size = 48, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="32" cy="56" rx="14" ry="4" fill="rgba(15,23,42,0.22)" />
      )}

      <path
        d="M30 56 L31 16 L33 16 L34 56 Z"
        fill="#854d0e"
        stroke="#713f12"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <line x1="32" y1="18" x2="32" y2="54" stroke="#a16207" strokeWidth="0.8" />

      <rect
        x="16"
        y="18"
        width="32"
        height="3.5"
        rx="1"
        fill="#a16207"
        stroke="#713f12"
        strokeWidth="1"
      />

      <line x1="24" y1="22" x2="31" y2="28" stroke="#713f12" strokeWidth="1.2" />
      <line x1="40" y1="22" x2="33" y2="28" stroke="#713f12" strokeWidth="1.2" />

      <polygon points="30,16 32,13 34,16" fill="#64748b" stroke="#475569" strokeWidth="0.8" />

      <ellipse cx="18" cy="18" rx="2.5" ry="1.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
      <rect x="17" y="15" width="2" height="3" fill="#cbd5e1" />
      <circle cx="18" cy="14" r="1.5" fill="#38bdf8" />
      <ellipse cx="32" cy="15" rx="2.5" ry="1.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
      <rect x="31" y="12" width="2" height="3" fill="#cbd5e1" />
      <circle cx="32" cy="11" r="1.5" fill="#38bdf8" />

      <ellipse cx="46" cy="18" rx="2.5" ry="1.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
      <rect x="45" y="15" width="2" height="3" fill="#cbd5e1" />
      <circle cx="46" cy="14" r="1.5" fill="#38bdf8" />

      <ellipse cx="32" cy="56" rx="4" ry="1.5" fill="#451a03" />
    </svg>
  );
}


export function ConcretePoleGraphic({ size = 48, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="32" cy="57" rx="15" ry="4.5" fill="rgba(15,23,42,0.22)" />
      )}

      <path
        d="M29.5 57 L31 14 L33 14 L34.5 57 Z"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      <path d="M32 14 L34.5 57 L33 57 L31 14 Z" fill="#64748b" opacity="0.35" />

      <polygon
        points="14,17 50,17 48,20 16,20"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1"
      />

      <line x1="22" y1="20" x2="31.5" y2="27" stroke="#334155" strokeWidth="1.2" />
      <line x1="42" y1="20" x2="32.5" y2="27" stroke="#334155" strokeWidth="1.2" />

      <line x1="32" y1="14" x2="32" y2="10" stroke="#334155" strokeWidth="1.5" />

      <circle cx="16" cy="22" r="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <circle cx="16" cy="25" r="1.5" fill="#bae6fd" />

      <circle cx="48" cy="22" r="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <circle cx="48" cy="25" r="1.5" fill="#bae6fd" />

      <circle cx="32" cy="9" r="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />

      <rect x="29" y="52" width="6" height="5" rx="1" fill="#64748b" stroke="#475569" strokeWidth="1" />
    </svg>
  );
}


export function MetalPoleGraphic({ size = 56, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="32" cy="58" rx="18" ry="5" fill="rgba(15,23,42,0.25)" />
      )}

      <path
        d="M21 58 L29 20 L35 20 L43 58"
        stroke="#1e293b"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M29 20 L31 7 L33 7 L35 20"
        stroke="#1e293b"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <line x1="23.5" y1="46" x2="40.5" y2="46" stroke="#334155" strokeWidth="1.2" />
      <line x1="26" y1="34" x2="38" y2="34" stroke="#334155" strokeWidth="1.2" />
      <line x1="28.5" y1="24" x2="35.5" y2="24" stroke="#334155" strokeWidth="1.2" />

      <line x1="21.5" y1="58" x2="40.5" y2="46" stroke="#475569" strokeWidth="1" />
      <line x1="42.5" y1="58" x2="23.5" y2="46" stroke="#475569" strokeWidth="1" />

      <line x1="23.5" y1="46" x2="38" y2="34" stroke="#475569" strokeWidth="0.9" />
      <line x1="40.5" y1="46" x2="26" y2="34" stroke="#475569" strokeWidth="0.9" />

      <line x1="26" y1="34" x2="35.5" y2="24" stroke="#475569" strokeWidth="0.8" />
      <line x1="38" y1="34" x2="28.5" y2="24" stroke="#475569" strokeWidth="0.8" />

      <polygon
        points="10,24 54,24 49,27 15,27"
        fill="#334155"
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      <polygon
        points="16,14 48,14 44,16.5 20,16.5"
        fill="#334155"
        stroke="#0f172a"
        strokeWidth="1"
      />

      <line x1="32" y1="7" x2="32" y2="3" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="32" cy="3" r="1.5" fill="#38bdf8" />


      <line x1="12" y1="27" x2="12" y2="33" stroke="#0284c7" strokeWidth="1.5" />
      <circle cx="12" cy="34" r="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />

      <line x1="52" y1="27" x2="52" y2="33" stroke="#0284c7" strokeWidth="1.5" />
      <circle cx="52" cy="34" r="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
  
      <line x1="18" y1="16.5" x2="18" y2="21" stroke="#0284c7" strokeWidth="1.2" />
      <circle cx="18" cy="22" r="1.7" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
  
      <line x1="46" y1="16.5" x2="46" y2="21" stroke="#0284c7" strokeWidth="1.2" />
      <circle cx="46" cy="22" r="1.7" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />


      <rect x="19" y="56.5" width="4" height="2.5" rx="0.5" fill="#475569" />
      <rect x="41" y="56.5" width="4" height="2.5" rx="0.5" fill="#475569" />
    </svg>
  );
}


export function TransformerGraphic({ size = 52, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="32" cy="55" rx="22" ry="7" fill="rgba(15,23,42,0.25)" />
      )}

      <rect
        x="12"
        y="46"
        width="40"
        height="9"
        rx="2"
        fill="#64748b"
        stroke="#475569"
        strokeWidth="1.2"
      />

      <rect
        x="16"
        y="28"
        width="32"
        height="22"
        rx="2"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1.5"
      />

      <polygon
        points="14,28 18,23 46,23 50,28"
        fill="#64748b"
        stroke="#334155"
        strokeWidth="1.2"
      />

      <rect x="11" y="32" width="5" height="14" rx="1" fill="#334155" />
      <line x1="12" y1="35" x2="15" y2="35" stroke="#64748b" strokeWidth="0.8" />
      <line x1="12" y1="39" x2="15" y2="39" stroke="#64748b" strokeWidth="0.8" />
      <line x1="12" y1="43" x2="15" y2="43" stroke="#64748b" strokeWidth="0.8" />

      <rect x="48" y="32" width="5" height="14" rx="1" fill="#334155" />
      <line x1="49" y1="35" x2="52" y2="35" stroke="#64748b" strokeWidth="0.8" />
      <line x1="49" y1="39" x2="52" y2="39" stroke="#64748b" strokeWidth="0.8" />
      <line x1="49" y1="43" x2="52" y2="43" stroke="#64748b" strokeWidth="0.8" />


      <rect x="22" y="16" width="3" height="7" rx="1" fill="#94a3b8" stroke="#334155" strokeWidth="0.8" />
      <circle cx="23.5" cy="15" r="2" fill="#38bdf8" />

      <rect x="30.5" y="14" width="3" height="9" rx="1" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="32" cy="13" r="2.2" fill="#38bdf8" />

      <rect x="39" y="16" width="3" height="7" rx="1" fill="#94a3b8" stroke="#334155" strokeWidth="0.8" />
      <circle cx="40.5" cy="15" r="2" fill="#38bdf8" />


      <polygon
        points="32,32 39,43 25,43"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="1"
      />
      <polygon
        points="32.5,34.5 30,38.5 32.5,38.5 31.5,42 34.5,37.5 32,37.5"
        fill="#0f172a"
      />
    </svg>
  );
}


export function HouseGraphic({ size = 52, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="33" cy="54" rx="24" ry="7" fill="rgba(15,23,42,0.22)" />
      )}

      <rect x="42" y="16" width="5" height="11" rx="0.5" fill="#b91c1c" stroke="#991b1b" strokeWidth="1" />
      <rect x="41" y="15" width="7" height="2" rx="0.5" fill="#7f1d1d" />


      <polygon
        points="14,35 34,22 54,35 52,53 16,53"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.2"
      />
      <polygon points="34,22 54,35 52,53 34,53" fill="#e2e8f0" opacity="0.6" />

      <polygon
        points="10,36 34,19 58,36 54,39 34,24 14,39"
        fill="#ef4444"
        stroke="#b91c1c"
        strokeWidth="1.2"
      />
      <line x1="20" y1="31" x2="34" y2="21" stroke="#dc2626" strokeWidth="1" />
      <line x1="48" y1="31" x2="34" y2="21" stroke="#991b1b" strokeWidth="1" />

      <circle cx="34" cy="29" r="2.5" fill="#38bdf8" stroke="#cbd5e1" strokeWidth="0.8" />

      <rect x="31" y="42" width="6" height="11" rx="1" fill="#92400e" stroke="#78350f" strokeWidth="1" />
      <circle cx="35.5" cy="47.5" r="0.6" fill="#fef08a" />

      <rect x="20" y="40" width="7" height="7" rx="1" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
      <line x1="23.5" y1="40" x2="23.5" y2="47" stroke="#0284c7" strokeWidth="0.8" />
      <line x1="20" y1="43.5" x2="27" y2="43.5" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="41" y="40" width="7" height="7" rx="1" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
      <line x1="44.5" y1="40" x2="44.5" y2="47" stroke="#0284c7" strokeWidth="0.8" />
      <line x1="41" y1="43.5" x2="48" y2="43.5" stroke="#0284c7" strokeWidth="0.8" />
    </svg>
  );
}


export function FactoryGraphic({ size = 56, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="32" cy="55" rx="26" ry="7" fill="rgba(15,23,42,0.22)" />
      )}

      <rect x="16" y="14" width="4" height="12" fill="#64748b" stroke="#334155" strokeWidth="1" />
      <rect x="15" y="13" width="6" height="2" fill="#475569" />
      <rect x="24" y="17" width="3.5" height="9" fill="#64748b" stroke="#334155" strokeWidth="1" />
      <rect x="23" y="16" width="5.5" height="1.5" fill="#475569" />


      <polygon
        points="10,32 30,22 54,28 54,53 10,53"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />

      <polygon points="30,22 54,28 54,53 30,53" fill="#cbd5e1" opacity="0.6" />


      <polygon
        points="8,33 30,20 56,27 54,30 30,23 8,35"
        fill="#475569"
        stroke="#1e293b"
        strokeWidth="1"
      />
      <line x1="16" y1="30" x2="30" y2="23" stroke="#64748b" strokeWidth="1" />
      <line x1="24" y1="26" x2="30" y2="23" stroke="#64748b" strokeWidth="1" />


      <rect x="16" y="38" width="12" height="15" fill="#334155" stroke="#1e293b" strokeWidth="1" />
      <line x1="16" y1="41" x2="28" y2="41" stroke="#475569" strokeWidth="0.8" />
      <line x1="16" y1="44" x2="28" y2="44" stroke="#475569" strokeWidth="0.8" />
      <line x1="16" y1="47" x2="28" y2="47" stroke="#475569" strokeWidth="0.8" />
      <line x1="16" y1="50" x2="28" y2="50" stroke="#475569" strokeWidth="0.8" />


      <rect x="34" y="34" width="6" height="5" rx="0.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="43" y="35.5" width="6" height="5" rx="0.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="34" y="43" width="6" height="5" rx="0.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      <rect x="43" y="44.5" width="6" height="5" rx="0.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
    </svg>
  );
}


export function TreeGraphic({ size = 48, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      {inMap && (
        <ellipse cx="33" cy="54" rx="16" ry="6" fill="rgba(15,23,42,0.24)" />
      )}
      <path
        d="M30 54 L30 38 L34 38 L34 54 Z"
        fill="#78350f"
        stroke="#451a03"
        strokeWidth="1.2"
      />
      <path d="M29 54 L27 56" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M35 54 L37 56" stroke="#451a03" strokeWidth="1.2" strokeLinecap="round" />

      <circle cx="32" cy="33" r="18" fill="#15803d" stroke="#14532d" strokeWidth="1.2" />
      <circle cx="23" cy="35" r="12" fill="#166534" />
      <circle cx="41" cy="35" r="12" fill="#166534" />

      <circle cx="32" cy="28" r="15" fill="#16a34a" />
      <circle cx="24" cy="29" r="10" fill="#22c55e" />
      <circle cx="40" cy="29" r="10" fill="#15803d" />

      <circle cx="30" cy="21" r="12" fill="#22c55e" />
      <circle cx="28" cy="18" r="7" fill="#4ade80" />
      <circle cx="35" cy="21" r="8" fill="#16a34a" />

      <ellipse cx="26" cy="17" rx="3.5" ry="2" fill="#86efac" opacity="0.75" />
    </svg>
  );
}


export function RoadGraphic({ size = 48, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {inMap && (
        <rect x="8" y="10" width="48" height="46" rx="6" fill="rgba(15,23,42,0.15)" />
      )}
      <rect
        x="10"
        y="8"
        width="44"
        height="48"
        rx="5"
        fill="#a8a29e"
        stroke="#78716c"
        strokeWidth="1"
      />
      <rect
        x="14"
        y="8"
        width="36"
        height="48"
        rx="2"
        fill="#475569"
        stroke="#334155"
        strokeWidth="1.2"
      />
      <line x1="16" y1="8" x2="16" y2="56" stroke="#f8fafc" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="48" y1="8" x2="48" y2="56" stroke="#f8fafc" strokeWidth="1" strokeOpacity="0.7" />

      <line
        x1="32"
        y1="10"
        x2="32"
        y2="54"
        stroke="#fef08a"
        strokeWidth="2"
        strokeDasharray="8 6"
        strokeLinecap="round"
      />
    </svg>
  );
}



export function PondGraphic({ size = 48, className, inMap = false }: GraphicProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {inMap && (
        <path
          d="M10 32 C8 19, 25 9, 43 13 C58 17, 58 35, 52 46 C45 56, 25 58, 14 50 C6 44, 12 38, 10 32 Z"
          fill="rgba(15,23,42,0.2)"
        />
      )}
      <path
        d="M12 30 C10 18, 26 10, 42 14 C56 18, 56 34, 50 44 C44 54, 26 56, 16 48 C8 42, 14 36, 12 30 Z"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      <path
        d="M14 30 C12 20, 26 13, 40 16 C52 20, 52 33, 47 42 C42 51, 26 53, 18 45 C11 40, 15 35, 14 30 Z"
        fill="#7dd3fc"
      />
      <path
        d="M18 31 C17 23, 28 17, 38 20 C47 23, 47 32, 43 39 C39 46, 27 48, 21 42 C16 38, 19 35, 18 31 Z"
        fill="#0284c7"
      />
      <path
        d="M24 26 Q29 24 34 26"
        stroke="#bae6fd"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M28 32 Q34 30 40 32"
        stroke="#bae6fd"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M20 36 Q25 34 30 36"
        stroke="#bae6fd"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="23" cy="28" r="2" fill="#22c55e" />
      <circle cx="23" cy="28" r="0.8" fill="#f43f5e" />
    </svg>
  );
}


export const ObjectGraphic: React.FC<
  GraphicProps & { type: MapObjectType }
> = ({ type, size = 40, className, inMap = false }) => {
  switch (type) {
    case 'wooden-pole':
      return <WoodenPoleGraphic size={size} className={className} inMap={inMap} />;
    case 'concrete-pole':
      return <ConcretePoleGraphic size={size} className={className} inMap={inMap} />;
    case 'metal-pole':
      return <MetalPoleGraphic size={size} className={className} inMap={inMap} />;
    case 'transformer':
      return <TransformerGraphic size={size} className={className} inMap={inMap} />;
    case 'house':
      return <HouseGraphic size={size} className={className} inMap={inMap} />;
    case 'factory':
      return <FactoryGraphic size={size} className={className} inMap={inMap} />;
    case 'tree':
      return <TreeGraphic size={size} className={className} inMap={inMap} />;
    case 'road':
      return <RoadGraphic size={size} className={className} inMap={inMap} />;
    case 'pond':
      return <PondGraphic size={size} className={className} inMap={inMap} />;
  }
};


export function getObjectAnchorOffset(type: MapObjectType): { x: number; y: number } {
  switch (type) {
    case 'wooden-pole':
      return { x: 0, y: -14 };
    case 'concrete-pole':
      return { x: 0, y: -14 };
    case 'metal-pole':
      return { x: 0, y: -8 };
    case 'transformer':
      return { x: 0, y: -16 };
    default:
      return { x: 0, y: 0 };
  }
}
