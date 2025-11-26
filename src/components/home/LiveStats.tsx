import { getSiteStats } from "@/lib/actions/stats";
import { Users, FileText, ShoppingBag, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export async function LiveStats() {
    const statsResult = await getSiteStats();
    const statsData = statsResult.success && statsResult.data
        ? statsResult.data
        : {
            activeUsers: 0,
            totalListings: 0,
            newListingsToday: 0,
            soldToday: 0
        };

    const stats = [
        {
            label: "Aktif Kullanıcı",
            value: statsData.activeUsers.toLocaleString(),
            icon: Users,
            color: "text-brand-gold"
        },
        {
            label: "Toplam İlan",
            value: statsData.totalListings.toLocaleString(),
            icon: FileText,
            color: "text-brand-gold"
        },
        {
            label: "Bugün Eklenen",
            value: statsData.newListingsToday.toLocaleString(),
            icon: Activity,
            color: "text-brand-gold"
        },
        {
            label: "Bugün Satılan",
            value: statsData.soldToday.toLocaleString(),
            icon: ShoppingBag,
            color: "text-brand-gold"
        }
    ];

    return (
        <section className="py-6 container mx-auto px-4">
            <div className="glass-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/10">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="flex items-center justify-center gap-3 px-2 first:pl-0 last:pr-0">
                            <div className="p-2 rounded-lg bg-brand-gold/10">
                                <Icon className={cn("w-4 h-4", stat.color)} />
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-bold leading-none text-foreground">{stat.value}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
