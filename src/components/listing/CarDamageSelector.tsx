"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Edit2, MessageSquare, X } from "lucide-react";


type DamageType = "original" | "local_paint" | "painted" | "changed";

interface PartStatus {
    id: string;
    name: string;
    status: DamageType;
    description?: string;
}

const damageColors: Record<DamageType, string> = {
    original: "fill-white/5 stroke-white/10 hover:fill-white/10",
    local_paint: "fill-orange-500/40 stroke-orange-500 hover:fill-orange-500/50",
    painted: "fill-blue-500/40 stroke-blue-500 hover:fill-blue-500/50",
    changed: "fill-red-500/40 stroke-red-500 hover:fill-red-500/50",
};

const damageOptions: { id: DamageType; label: string; color: string }[] = [
    { id: "original", label: "Orijinal", color: "bg-gray-500" },
    { id: "local_paint", label: "Lokal Boyalı", color: "bg-orange-500" },
    { id: "painted", label: "Boyalı", color: "bg-blue-500" },
    { id: "changed", label: "Değişen", color: "bg-red-500" },
];

// Exploded View SVG Paths
const carParts = [
    // Center Body (Top View)
    { id: "hood", name: "Motor Kaputu", label: "KPT", labelPos: { x: 140, y: 85 }, d: "M100 60 L180 60 L170 110 L110 110 Z" },
    { id: "roof", name: "Tavan", label: "TVN", labelPos: { x: 140, y: 150 }, d: "M110 110 L170 110 L170 190 L110 190 Z" },
    { id: "trunk", name: "Bagaj Kapağı", label: "BGJ", labelPos: { x: 140, y: 215 }, d: "M110 190 L170 190 L180 240 L100 240 Z" },

    // Left Side (Flanked Left)
    { id: "lf_fender", name: "Sol Ön Çamurluk", label: "SÖÇ", labelPos: { x: 72, y: 85 }, d: "M95 60 L50 70 L50 105 L95 105 Z" },
    { id: "lf_door", name: "Sol Ön Kapı", label: "SÖK", labelPos: { x: 72, y: 129 }, d: "M95 110 L50 110 L50 148 L95 148 Z" },
    { id: "lr_door", name: "Sol Arka Kapı", label: "SAK", labelPos: { x: 72, y: 171 }, d: "M95 152 L50 152 L50 190 L95 190 Z" },
    { id: "lr_fender", name: "Sol Arka Çamurluk", label: "SAÇ", labelPos: { x: 72, y: 215 }, d: "M95 195 L50 195 L50 230 L95 240 Z" },

    // Right Side (Flanked Right)
    { id: "rf_fender", name: "Sağ Ön Çamurluk", label: "SÖÇ", labelPos: { x: 208, y: 85 }, d: "M185 60 L230 70 L230 105 L185 105 Z" },
    { id: "rf_door", name: "Sağ Ön Kapı", label: "SÖK", labelPos: { x: 208, y: 129 }, d: "M185 110 L230 110 L230 148 L185 148 Z" },
    { id: "rr_door", name: "Sağ Arka Kapı", label: "SAK", labelPos: { x: 208, y: 171 }, d: "M185 152 L230 152 L230 190 L185 190 Z" },
    { id: "rr_fender", name: "Sağ Arka Çamurluk", label: "SAÇ", labelPos: { x: 208, y: 215 }, d: "M185 195 L230 195 L230 230 L185 240 Z" },

    // Bumpers (Top/Bottom)
    { id: "f_bumper", name: "Ön Tampon", label: "ÖN T", labelPos: { x: 140, y: 45 }, d: "M100 55 L180 55 L180 35 C180 35 140 25 100 35 Z" },
    { id: "r_bumper", name: "Arka Tampon", label: "ARK T", labelPos: { x: 140, y: 255 }, d: "M100 245 L180 245 L180 265 C180 265 140 275 100 265 Z" },
];

export function CarDamageSelector({
    readOnly = false,
    initialDamage = {},
    onChange
}: {
    readOnly?: boolean;
    initialDamage?: Record<string, any>;
    onChange?: (report: Record<string, any>) => void;
}) {
    const [parts, setParts] = useState<Record<string, any>>(initialDamage);
    const [isClean, setIsClean] = useState(false);
    const [activeCommentPart, setActiveCommentPart] = useState<string | null>(null);
    const [hoveredPart, setHoveredPart] = useState<string | null>(null);

    useEffect(() => {
        if (isClean) {
            const cleanReport: Record<string, any> = {};
            carParts.forEach(part => {
                cleanReport[part.id] = { status: "original" };
            });
            setParts(cleanReport);
            onChange?.(cleanReport);
        }
    }, [isClean]);

    const handleStatusChange = (partId: string, status: DamageType) => {
        if (readOnly || isClean) return;

        const currentPart = parts[partId] || {};
        const newParts = {
            ...parts,
            [partId]: { ...currentPart, status }
        };
        setParts(newParts);
        onChange?.(newParts);
    };

    const handleDescriptionChange = (partId: string, description: string) => {
        if (readOnly || isClean) return;

        const currentPart = parts[partId] || { status: "original" };
        const newParts = {
            ...parts,
            [partId]: { ...currentPart, description }
        };
        setParts(newParts);
        onChange?.(newParts);
    };

    const handleCleanToggle = (checked: boolean) => {
        setIsClean(checked);
        if (!checked) {
            setParts(initialDamage);
        }
    };

    const cycleDamageStatus = (partId: string) => {
        if (readOnly || isClean) return;

        const currentStatus = parts[partId]?.status || "original";
        const currentIndex = damageOptions.findIndex(opt => opt.id === currentStatus);
        const nextIndex = (currentIndex + 1) % damageOptions.length;
        handleStatusChange(partId, damageOptions[nextIndex].id);
    };

    return (
        <div className="space-y-8">
            {/* Legend */}
            <div className="flex flex-wrap gap-6 items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10">
                {damageOptions.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2">
                        <div className={cn("w-4 h-4 rounded shadow-sm", opt.color)} />
                        <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                ))}
            </div>

            <div className={cn("flex flex-col gap-12", !readOnly && "lg:flex-row")}>
                {/* Visual Diagram (Exploded View) */}
                <div className={cn(
                    "flex-1 flex items-center justify-center min-h-[500px] bg-white/5 rounded-2xl border border-white/10 relative p-8",
                    readOnly ? "max-w-2xl mx-auto w-full" : ""
                )}>
                    <div className="absolute inset-0 bg-brand-gold/5 blur-3xl rounded-full pointer-events-none" />

                    <svg width="300" height="300" viewBox="0 0 280 300" className="drop-shadow-2xl relative z-10 w-full h-full max-w-[400px]">
                        {/* Wheels (Visual Only) */}
                        <circle cx="50" cy="85" r="18" className="fill-black/40" />
                        <circle cx="230" cy="85" r="18" className="fill-black/40" />
                        <circle cx="50" cy="215" r="18" className="fill-black/40" />
                        <circle cx="230" cy="215" r="18" className="fill-black/40" />

                        {carParts.map((part) => (
                            <g
                                key={part.id}
                                onClick={() => cycleDamageStatus(part.id)}
                                onMouseEnter={() => readOnly && setHoveredPart(part.id)}
                                onMouseLeave={() => readOnly && setHoveredPart(null)}
                                className={cn("group", !readOnly && "cursor-pointer")}
                            >
                                <path
                                    d={part.d}
                                    className={cn(
                                        "stroke-[1.5px] transition-all duration-300",
                                        damageColors[(parts[part.id]?.status as DamageType) || "original"]
                                    )}
                                />
                                <text
                                    x={part.labelPos.x}
                                    y={part.labelPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="fill-white/70 text-[8px] font-bold pointer-events-none select-none"
                                >
                                    {part.label}
                                </text>
                            </g>
                        ))}
                    </svg>

                    {/* Read-Only Tooltip */}
                    {readOnly && hoveredPart && (
                        (() => {
                            const part = carParts.find(p => p.id === hoveredPart);
                            const status = parts[hoveredPart!]?.status || "original";
                            const statusLabel = damageOptions.find(o => o.id === status)?.label;
                            const description = parts[hoveredPart!]?.description;

                            if (!part) return null;

                            // Calculate position based on labelPos
                            const left = `${(part.labelPos.x / 280) * 100}%`;
                            const top = `${(part.labelPos.y / 300) * 100}%`;

                            return (
                                <div
                                    style={{ left, top }}
                                    className="absolute z-50 transform -translate-x-1/2 -translate-y-full mt-[-20px] pointer-events-none animate-in fade-in zoom-in duration-200"
                                >
                                    <div className="bg-gray-900/95 backdrop-blur-md border border-white/10 text-white text-xs rounded-lg shadow-xl p-3 min-w-[150px]">
                                        <div className="font-bold mb-1 text-sm">{part.name}</div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className={cn("w-2 h-2 rounded-full", damageOptions.find(o => o.id === status)?.color)} />
                                            <span className="font-medium text-gray-200">{statusLabel}</span>
                                        </div>
                                        {description && (
                                            <div className="text-gray-400 italic border-t border-white/10 pt-1 mt-1">
                                                "{description}"
                                            </div>
                                        )}
                                    </div>
                                    {/* Arrow */}
                                    <div className="w-3 h-3 bg-gray-900/95 border-r border-b border-white/10 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5"></div>
                                </div>
                            );
                        })()
                    )}

                    {!readOnly && (
                        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                            * Parçaların üzerine tıklayarak durumu değiştirebilirsiniz.
                        </div>
                    )}
                </div>

                {/* List Selection - Only visible in edit mode */}
                {!readOnly && (
                    <div className="flex-1 space-y-1">
                        <div className="grid grid-cols-[1fr_repeat(4,minmax(35px,1fr))_35px] gap-2 text-xs text-muted-foreground font-medium mb-4 px-4 text-center">
                            <div className="text-left">Parça</div>
                            <div>Orj.</div>
                            <div>Lokal</div>
                            <div>Boyalı</div>
                            <div>Değ.</div>
                            <div>Not</div>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {carParts.map((part) => {
                                const partData = parts[part.id] || { status: "original" };
                                const hasDescription = !!partData.description;

                                return (
                                    <div key={part.id} className="flex flex-col gap-2 bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-colors hover:border-white/10">
                                        <div className="grid grid-cols-[1fr_repeat(4,minmax(35px,1fr))_35px] gap-2 items-center px-4 py-3">
                                            <div className="font-medium text-sm">{part.name}</div>

                                            {damageOptions.map((opt) => (
                                                <div key={opt.id} className="flex justify-center">
                                                    <button
                                                        onClick={() => handleStatusChange(part.id, opt.id)}
                                                        disabled={readOnly || isClean}
                                                        className={cn(
                                                            "w-4 h-4 rounded-full border transition-all",
                                                            partData.status === opt.id
                                                                ? cn(opt.color, "border-transparent scale-125 shadow-lg shadow-current/20")
                                                                : "border-white/20 hover:border-white/50",
                                                            (readOnly || isClean) && "opacity-50 cursor-not-allowed"
                                                        )}
                                                    />
                                                </div>
                                            ))}

                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => setActiveCommentPart(activeCommentPart === part.id ? null : part.id)}
                                                    className={cn(
                                                        "transition-colors",
                                                        hasDescription ? "text-brand-gold" : "text-muted-foreground hover:text-brand-gold"
                                                    )}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Comment Section */}
                                        {activeCommentPart === part.id && (
                                            <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                                                <div className="relative">
                                                    <textarea
                                                        value={partData.description || ""}
                                                        onChange={(e) => handleDescriptionChange(part.id, e.target.value)}
                                                        placeholder={`${part.name} için hasar detayı ekleyin (opsiyonel)...`}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-brand-gold focus:ring-0 min-h-[80px]"
                                                    />
                                                    <button
                                                        onClick={() => setActiveCommentPart(null)}
                                                        className="absolute top-2 right-2 text-muted-foreground hover:text-white"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/10">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={cn(
                                    "w-6 h-6 rounded-md border border-white/20 flex items-center justify-center transition-colors",
                                    isClean ? "bg-brand-gold border-brand-gold" : "bg-white/5 group-hover:border-brand-gold/50"
                                )}>
                                    {isClean && <Check className="w-4 h-4 text-primary-foreground" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isClean}
                                    onChange={(e) => handleCleanToggle(e.target.checked)}
                                />
                                <span className="font-medium">Aracımın boyanan ya da değişen parçası yok.</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
