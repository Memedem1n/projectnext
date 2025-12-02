import { Package, Check, Shield, Armchair, Car, Radio, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipmentSectionProps {
    equipment: Array<{
        equipment: {
            name: string;
            category: string;
        };
    }>;
}

export function EquipmentSection({ equipment }: EquipmentSectionProps) {
    if (!equipment || equipment.length === 0) {
        return null;
    }

    // Group equipment by category
    const grouped = equipment.reduce((acc, item) => {
        const category = item.equipment.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item.equipment.name);
        return acc;
    }, {} as Record<string, string[]>);

    const categoryConfig: Record<string, { label: string; icon: React.ReactNode }> = {
        'Safety': { label: 'Güvenlik', icon: <Shield className="w-4 h-4" /> },
        'Interior': { label: 'İç Donanım', icon: <Armchair className="w-4 h-4" /> },
        'Exterior': { label: 'Dış Donanım', icon: <Car className="w-4 h-4" /> },
        'Multimedia': { label: 'Multimedya', icon: <Radio className="w-4 h-4" /> }
    };

    return (
        <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-gold" />
                Donanım Özellikleri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(grouped).map(([category, items]) => {
                    const config = categoryConfig[category] || { label: category, icon: <Layers className="w-4 h-4" /> };

                    return (
                        <div key={category} className="space-y-3">
                            <div className="flex items-center gap-2 text-brand-gold font-medium pb-2 border-b border-white/5">
                                {config.icon}
                                <span>{config.label}</span>
                                <span className="text-xs text-muted-foreground ml-auto bg-white/5 px-2 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                    >
                                        <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span className="leading-tight">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
