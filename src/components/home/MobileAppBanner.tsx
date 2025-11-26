import { Smartphone, Download } from "lucide-react";

export function MobileAppBanner() {
    return (
        <section className="py-12 bg-primary/5">
            <div className="container mx-auto px-4 md:px-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Smartphone className="w-4 h-4" />
                            Mobil Uygulama
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Sparse Ride Cebinizde!
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            Mobil uygulamamızı indirin, ilanları daha hızlı inceleyin, anlık bildirimler alın ve fırsatları kaçırmayın.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-black/80 transition-colors">
                                <Download className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-medium opacity-80">Download on the</div>
                                    <div className="text-sm font-bold leading-none">App Store</div>
                                </div>
                            </button>
                            <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-black/80 transition-colors">
                                <Download className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-medium opacity-80">Get it on</div>
                                    <div className="text-sm font-bold leading-none">Google Play</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center md:justify-end relative">
                        {/* Mock Phone UI - simplified */}
                        <div className="w-64 h-[500px] bg-black rounded-[3rem] border-8 border-black shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                            <div className="w-full h-full bg-white flex items-center justify-center text-black">
                                <span className="font-bold text-2xl text-primary">Sparse Ride App</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
