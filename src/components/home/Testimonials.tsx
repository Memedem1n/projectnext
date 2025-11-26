import { TESTIMONIALS } from "@/data/homepage-data";
import { Quote } from "lucide-react";
import Image from "next/image";

export function Testimonials() {
    return (
        <section className="py-12">
            <div className="container mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Kullanıcı Yorumları</h2>
                    <p className="text-muted-foreground">Binlerce mutlu kullanıcımızdan bazıları</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
                    {TESTIMONIALS.map((item) => (
                        <div key={item.id} className="glass-card p-6 relative">
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground">{item.role}</p>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                "{item.content}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
