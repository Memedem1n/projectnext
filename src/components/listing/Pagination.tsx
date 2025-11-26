"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    className?: string;
}

export function Pagination({ currentPage, totalPages, baseUrl, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    // Generate page numbers to show (max 7 pages visible)
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, current and nearby pages with ellipsis
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pages = getPageNumbers();
    const buildUrl = (page: number) => `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}`;

    return (
        <div className={cn("flex items-center justify-center gap-1.5 mt-8", className)}>
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={buildUrl(currentPage - 1)}
                    className="glass-card px-3 py-2 text-sm hover:bg-brand-gold/10 transition-colors flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Önceki</span>
                </Link>
            ) : (
                <button
                    disabled
                    className="glass-card px-3 py-2 text-sm opacity-50 cursor-not-allowed flex items-center gap-1"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Önceki</span>
                </button>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 py-2 text-sm text-muted-foreground"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === currentPage;

                    return (
                        <Link
                            key={pageNum}
                            href={buildUrl(pageNum)}
                            className={cn(
                                "glass-card min-w-[40px] px-3 py-2 text-sm text-center transition-all",
                                isActive
                                    ? "bg-brand-gold text-black font-bold shadow-lg shadow-brand-gold/20 scale-110"
                                    : "hover:bg-white/10"
                            )}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={buildUrl(currentPage + 1)}
                    className="glass-card px-3 py-2 text-sm hover:bg-brand-gold/10 transition-colors flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Sonraki</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <button
                    disabled
                    className="glass-card px-3 py-2 text-sm opacity-50 cursor-not-allowed flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Sonraki</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
