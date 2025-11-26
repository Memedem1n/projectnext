import { FileText, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DamageReportsSectionProps {
    damageReports: Array<{
        part: string;
        status: string;
        description?: string | null;
    }>;
}

export function DamageReportsSection({ damageReports }: DamageReportsSectionProps) {
    if (!damageReports || damageReports.length === 0) {
        return (
            <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-white/10 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-gold" />
                    Hasar Kayıtları
                </h2>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Check className="w-12 h-12 text-green-500 mb-3" />
                    <p className="text-lg font-medium mb-1">Hasar Kaydı Bulunmuyor</p>
                    <p className="text-sm text-muted-foreground">Bu araç hasarsız olarak kayıtlıdır</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'original':
            case 'orijinal':
                return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'painted':
            case 'boyalı':
            case 'local paint':
            case 'lokal boya':
                return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'changed':
            case 'değişen':
                return 'text-red-500 bg-red-500/10 border-red-500/20';
            default:
                return 'text-muted-foreground bg-white/5 border-white/10';
        }
    };

    const translateStatus = (status: string) => {
        const statusMap: Record<string, string> = {
            'original': 'Orijinal',
            'painted': 'Boyalı',
            'local paint': 'Lokal Boya',
            'changed': 'Değişen'
        };
        return statusMap[status.toLowerCase()] || status;
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-gold" />
                    Hasar Kayıtları
                </h2>
                <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">{damageReports.length} kayıt bulundu</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {damageReports.map((report, index) => (
                    <div
                        key={index}
                        className={cn(
                            "p-4 rounded-xl border transition-all hover:scale-105",
                            getStatusColor(report.status)
                        )}
                    >
                        <div className="font-medium text-sm mb-1">{report.part}</div>
                        <div className="text-xs font-semibold mb-2">{translateStatus(report.status)}</div>
                        {report.description && (
                            <p className="text-xs opacity-80 line-clamp-2">{report.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
