"use client";

import { FileText, Check, AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarDamageSelector } from "@/components/listing/CarDamageSelector";

interface DamageReportsSectionProps {
    damageReports: Array<{
        part: string;
        status: string;
        description?: string | null;
    }>;
    tramer?: string | null;
    plate?: string | null;
    plateNationality?: string | null;
}

const PART_LABELS: Record<string, string> = {
    hood: "Motor Kaputu",
    roof: "Tavan",
    trunk: "Bagaj Kapağı",
    lf_fender: "Sol Ön Çamurluk",
    lf_door: "Sol Ön Kapı",
    lr_door: "Sol Arka Kapı",
    lr_fender: "Sol Arka Çamurluk",
    rf_fender: "Sağ Ön Çamurluk",
    rf_door: "Sağ Ön Kapı",
    rr_door: "Sağ Arka Kapı",
    rr_fender: "Sağ Arka Çamurluk",
    f_bumper: "Ön Tampon",
    r_bumper: "Arka Tampon"
};

const STATUS_LABELS: Record<string, string> = {
    original: "Orijinal",
    local_paint: "Lokal Boyalı",
    painted: "Boyalı",
    changed: "Değişen"
};

const STATUS_COLORS: Record<string, string> = {
    original: "text-gray-400",
    local_paint: "text-orange-500",
    painted: "text-blue-500",
    changed: "text-red-500"
};

export function DamageReportsSection({ damageReports, tramer, plate, plateNationality }: DamageReportsSectionProps) {
    // Transform array to record for selector
    const damageRecord: Record<string, any> = {};
    if (damageReports) {
        damageReports.forEach(report => {
            damageRecord[report.part] = {
                status: report.status,
                description: report.description
            };
        });
    }

    const hasDamage = damageReports && damageReports.some(r => r.status !== 'original');
    const damagedParts = damageReports?.filter(r => r.status !== 'original') || [];

    return (
        <div className="space-y-6">
            {/* Visual Damage Selector */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-gold" />
                    Ekspertiz ve Hasar Durumu
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Visual Map */}
                    <div className="flex-1 min-h-[300px] flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                        <CarDamageSelector
                            readOnly={true}
                            initialDamage={damageRecord}
                            plate={plate}
                            plateNationality={plateNationality}
                        />
                    </div>

                    {/* Summary & Reports */}
                    <div className="lg:w-1/3 space-y-6">
                        {/* Tramer Record */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-brand-gold" />
                                Tramer Kaydı
                            </h3>
                            <div className="text-2xl font-bold text-white mb-1">
                                {!tramer ? "Bilinmiyor" : (tramer === "0" || tramer === "Yok" ? "Hasar Kaydı Yok" : `${tramer} TL`)}
                            </div>
                        </div>

                        {/* Damage Summary Text */}
                        {hasDamage ? (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-white mb-4 pb-2 border-b border-white/10">
                                    <AlertCircle className="w-4 h-4 text-brand-gold" />
                                    <span className="font-medium text-sm">Hasar Özeti</span>
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {damagedParts.map((report, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            <span className="text-muted-foreground text-left flex-1">{PART_LABELS[report.part] || report.part}</span>
                                            <span className={cn("font-medium text-right", STATUS_COLORS[report.status])}>
                                                {STATUS_LABELS[report.status] || report.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-green-500">Değişen veya boyalı parça bulunmamaktadır.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
