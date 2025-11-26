import { ShieldAlert, AlertTriangle, Info } from "lucide-react";

export function SafetyTips() {
    return (
        <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-orange-500">
                <ShieldAlert className="w-5 h-5" />
                Güvenlik İpuçları
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2 items-start">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                    <span>Tanımadığınız kişilere kesinlikle para göndermeyin.</span>
                </li>
                <li className="flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <span>Kapora veya ön ödeme taleplerine karşı dikkatli olun.</span>
                </li>
                <li className="flex gap-2 items-start">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                    <span>Ürünü teslim alıp kontrol etmeden onay vermeyin.</span>
                </li>
                <li className="flex gap-2 items-start">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                    <span>Kişisel ve finansal bilgilerinizi paylaşmayın.</span>
                </li>
            </ul>
        </div>
    );
}
