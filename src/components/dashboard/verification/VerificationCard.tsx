import { LucideIcon, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VerificationCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    status: "NOT_STARTED" | "PENDING" | "VERIFIED" | "REJECTED";
    buttonText?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function VerificationCard({
    icon: Icon,
    title,
    description,
    status,
    buttonText = "Doğrula",
    onClick,
    disabled
}: VerificationCardProps) {
    const statusConfig = {
        NOT_STARTED: { label: "Doğrulanmadı", color: "text-gray-400", bg: "bg-gray-500/10", icon: AlertCircle },
        PENDING: { label: "İnceleniyor", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Clock },
        VERIFIED: { label: "Doğrulandı", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle },
        REJECTED: { label: "Reddedildi", color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle },
    };

    const currentStatus = statusConfig[status] || statusConfig.NOT_STARTED;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand-gold/10 rounded-lg">
                    <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5", currentStatus.bg, currentStatus.color)}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {currentStatus.label}
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">{description}</p>

            {status === "NOT_STARTED" || status === "REJECTED" ? (
                <Button
                    onClick={onClick}
                    disabled={disabled}
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                >
                    {buttonText}
                </Button>
            ) : (
                <div className="w-full py-2 text-center text-sm text-gray-500 border border-white/5 rounded-lg bg-white/5 cursor-not-allowed">
                    İşlem Yapılamaz
                </div>
            )}
        </div>
    );
}
