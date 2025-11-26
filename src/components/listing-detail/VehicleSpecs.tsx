import { Calendar, Gauge, Droplets, Settings2, Car, Palette, ShieldCheck, RefreshCw } from "lucide-react";

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
    const items = [
        { icon: Calendar, label: "Yıl", value: specs.year },
        { icon: Gauge, label: "Kilometre", value: `${specs.km} km` },
        { icon: Droplets, label: "Yakıt", value: specs.fuel },
        { icon: Settings2, label: "Vites", value: specs.gear },
        { icon: Car, label: "Kasa Tipi", value: specs.caseType },
        { icon: Palette, label: "Renk", value: specs.color },
        { icon: ShieldCheck, label: "Garanti", value: specs.warranty ? "Var" : "Yok", highlight: specs.warranty },
        { icon: RefreshCw, label: "Takas", value: specs.exchange ? "Uygun" : "Uygun Değil", highlight: specs.exchange },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className={`font-medium ${item.highlight ? "text-primary" : ""}`}>
                            {item.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
