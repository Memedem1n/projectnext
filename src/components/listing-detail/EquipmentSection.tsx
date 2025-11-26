import { Package, Check } from "lucide-react";
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

    const categoryLabels: Record<string, string> = {
        'Safety': 'Güvenlik',
        'Interior': 'İç Donanım',
        'Exterior': 'Dış Donanım',
        'Multimedia': 'Multimedya'
    };

    return (
        <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-white/10 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-gold" />
                Donanım Özellikleri
            </h2>

            <div className="space-y-6">
                {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold text-brand-gold mb-3">
                            {categoryLabels[category] || category} ({items.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
