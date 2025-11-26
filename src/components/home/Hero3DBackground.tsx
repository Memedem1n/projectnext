"use client";

import { useEffect, useState, useRef } from "react";
import {
    Car, Home, Smartphone, Sofa, Shirt, Dog, Laptop, Watch, Camera,
    Gamepad, Wrench, Hammer, Book, Briefcase, Tractor, Ship, Zap,
    Baby, Building2, Truck, Bike, Fish, Package
} from "lucide-react";

const allIcons = [
    { icon: Car, label: "Otomobil" },
    { icon: Building2, label: "İş Yeri" },
    { icon: Home, label: "Konut" },
    { icon: Truck, label: "Ticari" },
    { icon: Bike, label: "Motosiklet" },
    { icon: Ship, label: "Deniz" },
    { icon: Zap, label: "Elektrikli" },
    { icon: Wrench, label: "Ekipman" },
    { icon: Laptop, label: "Bilgisayar" },
    { icon: Smartphone, label: "Telefon" },
    { icon: Camera, label: "Fotoğraf" },
    { icon: Sofa, label: "Mobilya" },
    { icon: Shirt, label: "Giyim" },
    { icon: Watch, label: "Saat" },
    { icon: Baby, label: "Bebek" },
    { icon: Tractor, label: "Tarım" },
    { icon: Hammer, label: "Tadilat" },
    { icon: Package, label: "Nakliye" },
    { icon: Book, label: "Eğitim" },
    { icon: Briefcase, label: "İş" },
    { icon: Dog, label: "Hayvan" },
    { icon: Fish, label: "Akvary um" },
];

interface FloatingIcon {
    id: number;
    icon: any;
    label: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

const MAX_ICONS = 10;
const ICON_SIZE = 70;

export function FloatingCategoryIcons() {
    const [icons, setIcons] = useState<FloatingIcon[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const nextIconIndexRef = useRef(0);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const maxIcons = isMobile ? 3 : MAX_ICONS;
        const iconSize = isMobile ? 24 : ICON_SIZE;

        const initialIcons: FloatingIcon[] = [];
        for (let i = 0; i < maxIcons; i++) {
            const iconData = allIcons[i % allIcons.length];
            initialIcons.push({
                id: i,
                ...iconData,
                x: Math.random() * (window.innerWidth - iconSize),
                y: Math.random() * (window.innerHeight - iconSize),
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: iconSize,
            });
        }
        setIcons(initialIcons);
        nextIconIndexRef.current = maxIcons;
    }, []);

    useEffect(() => {
        if (icons.length === 0) return;

        const animate = () => {
            setIcons(prevIcons => {
                const newIcons = prevIcons.map(icon => {
                    let { x, y, vx, vy } = icon;
                    x += vx;
                    y += vy;

                    if (x <= 0 || x >= window.innerWidth - icon.size) {
                        vx = -vx;
                        x = Math.max(0, Math.min(window.innerWidth - icon.size, x));
                    }
                    if (y <= 0 || y >= window.innerHeight - icon.size) {
                        vy = -vy;
                        y = Math.max(0, Math.min(window.innerHeight - icon.size, y));
                    }

                    return { ...icon, x, y, vx, vy };
                });

                for (let i = 0; i < newIcons.length; i++) {
                    for (let j = i + 1; j < newIcons.length; j++) {
                        const icon1 = newIcons[i];
                        const icon2 = newIcons[j];
                        const dx = icon2.x - icon1.x;
                        const dy = icon2.y - icon1.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < icon1.size) {
                            const tempVx = icon1.vx;
                            const tempVy = icon1.vy;
                            newIcons[i].vx = icon2.vx;
                            newIcons[i].vy = icon2.vy;
                            newIcons[j].vx = tempVx;
                            newIcons[j].vy = tempVy;

                            const overlap = icon1.size - distance;
                            const angle = Math.atan2(dy, dx);
                            newIcons[i].x -= Math.cos(angle) * overlap / 2;
                            newIcons[i].y -= Math.sin(angle) * overlap / 2;
                            newIcons[j].x += Math.cos(angle) * overlap / 2;
                            newIcons[j].y += Math.sin(angle) * overlap / 2;
                        }
                    }
                }

                return newIcons.map(icon => {
                    const offScreen = icon.x < -200 || icon.x > window.innerWidth + 200 ||
                        icon.y < -200 || icon.y > window.innerHeight + 200;

                    if (offScreen) {
                        const newIconData = allIcons[nextIconIndexRef.current % allIcons.length];
                        nextIconIndexRef.current++;

                        const edge = Math.floor(Math.random() * 4);
                        let newX, newY;
                        switch (edge) {
                            case 0: newX = Math.random() * window.innerWidth; newY = -ICON_SIZE; break;
                            case 1: newX = window.innerWidth; newY = Math.random() * window.innerHeight; break;
                            case 2: newX = Math.random() * window.innerWidth; newY = window.innerHeight; break;
                            default: newX = -ICON_SIZE; newY = Math.random() * window.innerHeight;
                        }

                        return {
                            ...icon,
                            ...newIconData,
                            id: nextIconIndexRef.current,
                            x: newX,
                            y: newY,
                            vx: (Math.random() - 0.5) * 0.8,
                            vy: (Math.random() - 0.5) * 0.8,
                        };
                    }
                    return icon;
                });
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [icons.length]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            {icons.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.id}
                        className="absolute"
                        style={{
                            left: `${item.x}px`,
                            top: `${item.y}px`,
                            transform: 'translate3d(0, 0, 0)',
                        }}
                    >
                        <div className="bg-brand-gold/5 backdrop-blur-sm border border-brand-gold/20 rounded-xl p-5 shadow-lg">
                            <Icon className="w-14 h-14 text-brand-gold/70" strokeWidth={1.5} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
