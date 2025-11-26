"use client";

import { useState } from "react";
import { EQUIPMENT_DATA } from "@/data/vehicle-data";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentSelectorProps {
    selectedEquipment: string[];
    onChange: (equipment: string[]) => void;
}

export function EquipmentSelector({ selectedEquipment, onChange }: EquipmentSelectorProps) {
    const [openSections, setOpenSections] = useState<string[]>(["safety"]);

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleItem = (item: string) => {
        const newSelection = selectedEquipment.includes(item)
            ? selectedEquipment.filter(i => i !== item)
            : [...selectedEquipment, item];
        onChange(newSelection);
    };

    return (
        <div className="space-y-4">
            {EQUIPMENT_DATA.map((section) => (
                <div key={section.id} className="glass-card border-white/5 overflow-hidden">
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg">{section.title}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground">
                                {section.items.filter(i => selectedEquipment.includes(i)).length} seçili
                            </span>
                        </div>
                        <ChevronDown className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform duration-300",
                            openSections.includes(section.id) && "rotate-180"
                        )} />
                    </button>

                    <div className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        openSections.includes(section.id) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                        <div className="overflow-hidden">
                            <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {section.items.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => toggleItem(item)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border text-sm transition-all text-left group",
                                            selectedEquipment.includes(item)
                                                ? "bg-brand-gold/10 border-brand-gold/30 text-brand-gold"
                                                : "bg-white/5 border-transparent hover:border-white/10 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                                            selectedEquipment.includes(item)
                                                ? "bg-brand-gold border-brand-gold text-primary-foreground"
                                                : "border-white/20 group-hover:border-white/40"
                                        )}>
                                            {selectedEquipment.includes(item) && <Check className="w-3 h-3" />}
                                        </div>
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
