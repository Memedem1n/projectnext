"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface DopingBorderProps {
    children: React.ReactNode;
    isActive?: boolean;
    variant?: "standard" | "gold" | "premium";
    className?: string;
}

export function DopingBorder({ children, isActive, variant = "standard", className }: DopingBorderProps) {
    // Standard variant just returns the children with the class
    if (!isActive || variant === "standard") {
        return <div className={cn("h-full relative", className)}>{children}</div>;
    }

    const isPremium = variant === "premium"; // Premium: Static Gold Border + Periodic Shine
    const isGold = variant === "gold";       // Gold: Static Gold Border only

    return (
        <div className={cn(
            "relative group rounded-[12px] h-full transition-all duration-300",
            // Static Gold Border for both Premium and Gold
            "p-[1px] bg-yellow-500",
            className
        )}>

            {/* Inner Content Wrapper */}
            <div className="relative h-full w-full overflow-hidden rounded-[11px] bg-card">
                {/* Periodic Shine Effect - ONLY for Premium (Behind Content) */}
                {isPremium && (
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[11px]">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-300/80 via-yellow-500/60 to-transparent animate-shine-pass" />
                    </div>
                )}

                {/* Content (On Top) */}
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
