'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { RotateCcw, X, Wand2 } from 'lucide-react';

export type DamageStatus = 'original' | 'painted' | 'local' | 'changed' | 'any' | 'not_changed';

export interface DamageZoneMap {
    [zoneId: string]: DamageStatus;
}

interface VehicleDamageZoneSelectorProps {
    value: DamageZoneMap;
    onChange: (value: DamageZoneMap) => void;
}

const DAMAGE_ZONES = [
    { id: 'front-bumper', name: 'Ön Tampon', label: 'ÖN T', path: 'M100 55 L180 55 L180 35 C180 35 140 25 100 35 Z', textX: 140, textY: 45 },
    { id: 'hood', name: 'Kaput', label: 'KPT', path: 'M100 60 L180 60 L170 110 L110 110 Z', textX: 140, textY: 85 },
    { id: 'roof', name: 'Tavan', label: 'TVN', path: 'M110 110 L170 110 L170 190 L110 190 Z', textX: 140, textY: 150 },
    { id: 'trunk', name: 'Bagaj', label: 'BGJ', path: 'M110 190 L170 190 L180 240 L100 240 Z', textX: 140, textY: 215 },
    { id: 'rear-bumper', name: 'Arka Tampon', label: 'ARK T', path: 'M100 245 L180 245 L180 265 C180 265 140 275 100 265 Z', textX: 140, textY: 255 },
    { id: 'front-left-fender', name: 'Ön Sol Çamurluk', label: 'SÖÇ', path: 'M95 60 L50 70 L50 105 L95 105 Z', textX: 72, textY: 85 },
    { id: 'front-left-door', name: 'Ön Sol Kapı', label: 'SÖK', path: 'M95 110 L50 110 L50 148 L95 148 Z', textX: 72, textY: 129 },
    { id: 'rear-left-door', name: 'Arka Sol Kapı', label: 'SAK', path: 'M95 152 L50 152 L50 190 L95 190 Z', textX: 72, textY: 171 },
    { id: 'rear-left-fender', name: 'Arka Sol Çamurluk', label: 'SAÇ', path: 'M95 195 L50 195 L50 230 L95 240 Z', textX: 72, textY: 215 },
    { id: 'front-right-fender', name: 'Ön Sağ Çamurluk', label: 'SÖÇ', path: 'M185 60 L230 70 L230 105 L185 105 Z', textX: 208, textY: 85 },
    { id: 'front-right-door', name: 'Ön Sağ Kapı', label: 'SÖK', path: 'M185 110 L230 110 L230 148 L185 148 Z', textX: 208, textY: 129 },
    { id: 'rear-right-door', name: 'Arka Sağ Kapı', label: 'SAK', path: 'M185 152 L230 152 L230 190 L185 190 Z', textX: 208, textY: 171 },
    { id: 'rear-right-fender', name: 'Arka Sağ Çamurluk', label: 'SAÇ', path: 'M185 195 L230 195 L230 230 L185 240 Z', textX: 208, textY: 215 },
];

const STATUS_OPTIONS = [
    { id: 'original', label: 'Hatasız', color: 'bg-green-500', text: 'text-green-500' },
    { id: 'local', label: 'Lokal', color: 'bg-yellow-500', text: 'text-yellow-500' },
    { id: 'painted', label: 'Boyalı', color: 'bg-orange-500', text: 'text-orange-500' },
    { id: 'changed', label: 'Değişen', color: 'bg-red-500', text: 'text-red-500' },
    { id: 'not_changed', label: 'Değişensiz', color: 'bg-blue-500', text: 'text-blue-500' },
    { id: 'any', label: 'Farketmez', color: 'bg-slate-400', text: 'text-slate-400' },
] as const;

export function VehicleDamageZoneSelector({ value, onChange }: VehicleDamageZoneSelectorProps) {
    const [hoveredZone, setHoveredZone] = useState<string | null>(null);
    const [activeMenuZone, setActiveMenuZone] = useState<string | null>(null);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const quickActionsRef = useRef<HTMLDivElement>(null);

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuZone(null);
            }
            if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
                setShowQuickActions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleZoneClick = (zoneId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuZone(zoneId);
        setShowQuickActions(false);
    };

    const handleStatusSelect = (status: DamageStatus) => {
        if (!activeMenuZone) return;

        const newMap = { ...value };
        if (status === 'original') {
            delete newMap[activeMenuZone];
        } else {
            newMap[activeMenuZone] = status;
        }
        onChange(newMap);
        setActiveMenuZone(null);
    };

    const handleReset = () => {
        onChange({});
        setActiveMenuZone(null);
        setShowQuickActions(false);
    };

    const handleBulkAction = (status: DamageStatus) => {
        if (status === 'original') {
            onChange({});
        } else {
            const newMap: DamageZoneMap = {};
            DAMAGE_ZONES.forEach(zone => {
                newMap[zone.id] = status;
            });
            onChange(newMap);
        }
        setShowQuickActions(false);
    };

    const getZoneStyle = (zoneId: string) => {
        const status = value[zoneId] || 'original';
        const isHovered = hoveredZone === zoneId;
        const isActive = activeMenuZone === zoneId;

        let fill = '#22c55e'; // original (green)
        let stroke = '#16a34a';

        if (status === 'painted') {
            fill = '#fb923c'; // orange
            stroke = '#f97316';
        } else if (status === 'local') {
            fill = '#facc15'; // yellow (local paint)
            stroke = '#eab308';
        } else if (status === 'changed') {
            fill = '#ef4444'; // red
            stroke = '#dc2626';
        } else if (status === 'any') {
            fill = '#94a3b8'; // slate-400 (gray)
            stroke = '#64748b';
        } else if (status === 'not_changed') {
            fill = '#3b82f6'; // blue-500
            stroke = '#2563eb';
        }

        // Active menu effect (highlight)
        if (isActive) {
            return {
                fill: fill,
                stroke: '#ffffff',
                fillOpacity: 1,
                strokeOpacity: 1,
                strokeWidth: 2
            };
        }

        // Hover effect
        if (isHovered) {
            return {
                fill: fill,
                stroke: stroke,
                fillOpacity: 0.9,
                strokeOpacity: 1,
                strokeWidth: 1.5
            };
        }

        return {
            fill: fill,
            stroke: stroke,
            fillOpacity: 0.7,
            strokeOpacity: 0.9,
            strokeWidth: 1.5
        };
    };

    const activeZoneData = DAMAGE_ZONES.find(z => z.id === activeMenuZone);

    return (
        <div className="space-y-3">
            <div className="relative glass-card border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] rounded-lg p-3 min-h-[320px] flex items-center justify-center">

                {/* Top Controls */}
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                    {/* Quick Actions Button */}
                    <div className="relative" ref={quickActionsRef}>
                        <button
                            onClick={() => setShowQuickActions(!showQuickActions)}
                            className={cn(
                                "p-1.5 rounded-full transition-colors",
                                showQuickActions ? "bg-brand-gold text-black" : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
                            )}
                            title="Hızlı İşlemler"
                        >
                            <Wand2 className="w-3 h-3" />
                        </button>

                        {/* Quick Actions Menu */}
                        {showQuickActions && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl p-1 z-30 animate-in fade-in slide-in-from-top-2">
                                <div className="text-[10px] font-semibold text-muted-foreground px-2 py-1 border-b border-white/5 mb-1">
                                    Tümünü Ayarla
                                </div>
                                <button onClick={() => handleBulkAction('original')} className="w-full text-left px-2 py-1.5 text-[10px] text-green-500 hover:bg-white/5 rounded flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Hatasız Yap
                                </button>
                                <button onClick={() => handleBulkAction('not_changed')} className="w-full text-left px-2 py-1.5 text-[10px] text-blue-500 hover:bg-white/5 rounded flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Değişensiz Yap
                                </button>
                                <button onClick={() => handleBulkAction('any')} className="w-full text-left px-2 py-1.5 text-[10px] text-slate-400 hover:bg-white/5 rounded flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Farketmez Yap
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                        title="Sıfırla"
                    >
                        <RotateCcw className="w-3 h-3" />
                    </button>
                </div>

                {/* Car Diagram */}
                <svg width="100%" height="100%" viewBox="0 0 280 300" className="drop-shadow-2xl relative z-10 w-full h-full max-w-[400px] mx-auto">
                    {/* Wheels */}
                    <circle cx="50" cy="85" r="18" className="fill-black/40" />
                    <circle cx="230" cy="85" r="18" className="fill-black/40" />
                    <circle cx="50" cy="215" r="18" className="fill-black/40" />
                    <circle cx="230" cy="215" r="18" className="fill-black/40" />

                    {DAMAGE_ZONES.map((zone) => {
                        const style = getZoneStyle(zone.id);
                        return (
                            <g
                                key={zone.id}
                                className="group cursor-pointer"
                                onMouseEnter={() => setHoveredZone(zone.id)}
                                onMouseLeave={() => setHoveredZone(null)}
                                onClick={(e) => handleZoneClick(zone.id, e)}
                            >
                                <path
                                    d={zone.path}
                                    fill={style.fill}
                                    fillOpacity={style.fillOpacity}
                                    stroke={style.stroke}
                                    strokeWidth={style.strokeWidth}
                                    strokeOpacity={style.strokeOpacity}
                                    className="transition-all duration-200"
                                />
                                <text
                                    x={zone.textX}
                                    y={zone.textY}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-white/90 text-[8px] font-bold pointer-events-none select-none drop-shadow-md"
                                >
                                    {zone.label}
                                </text>
                            </g>
                        );
                    })}

                    {hoveredZone && !activeMenuZone && (
                        <>
                            <rect x="65" y="5" width="150" height="22" rx="4" fill="#1e293b" opacity="0.95" />
                            <text x="140" y="18" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600">
                                {DAMAGE_ZONES.find(z => z.id === hoveredZone)?.name}
                            </text>
                        </>
                    )}
                </svg>

                {/* Context Menu Popover */}
                {activeMenuZone && activeZoneData && (
                    <div
                        ref={menuRef}
                        className="absolute z-30 bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl p-2 w-32 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)' // Center in container for simplicity on mobile/small screens
                        }}
                    >
                        <div className="flex items-center justify-between px-1 mb-1 border-b border-white/10 pb-1">
                            <span className="text-[10px] font-bold text-white truncate">{activeZoneData.name}</span>
                            <button onClick={() => setActiveMenuZone(null)} className="text-white/50 hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleStatusSelect(option.id as DamageStatus)}
                                className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 rounded text-[10px] transition-colors w-full text-left",
                                    value[activeMenuZone] === option.id || (option.id === 'original' && !value[activeMenuZone])
                                        ? "bg-white/10 text-white font-medium"
                                        : "hover:bg-white/5 text-muted-foreground hover:text-white"
                                )}
                            >
                                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", option.color)} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground/60 italic text-center">
                👆 Parçaya tıklayıp durumunu seçin veya 🪄 ile toplu işlem yapın
            </p>
        </div>
    );
}
