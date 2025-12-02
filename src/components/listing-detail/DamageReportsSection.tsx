"use client";

import { FileText, Check, AlertCircle, FileCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CarDamageSelector } from "@/components/listing/CarDamageSelector";

interface DamageReportsSectionProps {
    damageReports: Array<{
        part: string;
        status: string;
        description?: string | null;
    }>;
    tramer?: string | null;
}

export function DamageReportsSection({ damageReports, tramer }: DamageReportsSectionProps) {
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

    const hasDamage = damageReports && damageReports.length > 0;

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
                    <div className="flex-1">
                        <CarDamageSelector
                            readOnly={true}
                            initialDamage={damageRecord}
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
                                {tramer ? `${tramer} TL` : "Hasar Kaydı Yok"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Sorgulama Tarihi: {new Date().toLocaleDateString('tr-TR')}
                            </p>
                        </div>

                        {/* Expert Report Status */}
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-brand-gold" />
                                Eksper Raporu
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <Check className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="font-medium">Rapor Mevcut</div>
                                    <div className="text-xs text-muted-foreground">Kurumsal ekspertiz raporu eklidir.</div>
                                </div>
                            </div>
                            <button className="mt-4 w-full py-2 text-sm font-medium text-brand-gold border border-brand-gold/20 rounded-lg hover:bg-brand-gold/10 transition-colors">
                                Raporu Görüntüle
                            </button>
                        </div>

                        {/* Damage Summary Text */}
                        {hasDamage ? (
                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="font-medium text-sm">Hasar Özeti</span>
                                </div>
                                <ul className="space-y-1">
                                    {damageReports.map((report, idx) => (
                                        <li key={idx} className="text-xs text-muted-foreground flex justify-between">
                                            <span>{report.part}</span> // Note: Ideally map part ID to Label here if needed
                                            <span className="text-white">{report.status}</span>
                                        </li>
                                    ))}
                                </ul>
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
