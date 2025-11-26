import { Download, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpertReportCardProps {
    expertiseReport?: string | null;
    isExpertiseVerified?: boolean;
}

export function ExpertReportCard({ expertiseReport, isExpertiseVerified }: ExpertReportCardProps) {
    if (!expertiseReport) {
        return null;
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-brand-gold" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">Ekspertiz Raporu</h3>
                        {isExpertiseVerified && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Doğrulanmış
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                        Bu araç için profesyonel ekspertiz raporu mevcuttur. Raporun tamamını indirebilirsiniz.
                    </p>

                    <a
                        href={expertiseReport}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold/90 text-primary-foreground">
                            <Download className="w-4 h-4 mr-2" />
                            Raporu İndir
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
