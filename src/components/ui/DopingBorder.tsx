"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface DopingBorderProps {
    children: React.ReactNode;
    isActive?: boolean;
    className?: string;
}

export function DopingBorder({ children, isActive, className }: DopingBorderProps) {
    if (!isActive) return <>{children}</>;

    return (
        <div className={cn("relative group rounded-xl p-[2px] overflow-hidden", className)}>
            {/* Animated Shiny Silver Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-white to-gray-300 animate-shimmer bg-[length:200%_100%]" />

            {/* Inner Content Wrapper (to hide the gradient behind content) */}
            <div className="relative bg-card rounded-[10px] h-full w-full">
                {children}
            </div>

            {/* Optional: Corner Badge or Glow Effect */}
            <div className="absolute -top-1 -right-1 w-20 h-20 bg-white/30 blur-xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
