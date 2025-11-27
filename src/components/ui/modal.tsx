"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export function Modal({ isOpen, onClose, children, className, showCloseButton = true }: ModalProps) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isMounted) return null;
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div className={cn(
                "relative w-full max-w-lg transform rounded-2xl bg-black/80 border border-white/10 p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200",
                className
            )}>
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Kapat</span>
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}
