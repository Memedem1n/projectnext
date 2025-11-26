import { Calendar, Gauge, Fuel, Settings, Car, Palette, ShieldCheck, RefreshCw } from "lucide-react";

interface VehicleSpecsProps {
    specs: {
        year: string;
        km: string;
        fuel: string;
        gear: string;
        caseType: string;
        color: string;
        warranty: boolean;
        exchange: boolean;
    };
}

export function VehicleSpecs({ specs }: VehicleSpecsProps) {
    const specItems = [
        { icon: Calendar, label: "Yıl", value: specs.year },
        { icon: Gauge, label: "Kilometre", value: `${specs.km} km` },
        { icon: Fuel, label: "Yakıt", value: specs.fuel },
        { icon: Settings, label: "Vites", value: specs.gear },
        { icon: Car, label: "Kasa Tipi", value: specs.caseType },
        { icon: Palette, label: "Renk", value: specs.color },
        { icon: ShieldCheck, label: "Garanti", value: specs.warranty ? "Var" : "Yok" },
        { icon: RefreshCw, label: "Takas", value: specs.exchange ? "Evet" : "Hayır" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </div>
                        <div className="font-semibold text-lg">{item.value}</div>
                    </div>
                );
            })}
        </div>
    );
}
