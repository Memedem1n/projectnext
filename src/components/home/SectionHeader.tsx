import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    href?: string;
    description?: string;
}

export function SectionHeader({ title, href, description }: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-6 px-4 md:px-0">
            <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
                {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {href && (
                <Link
                    href={href}
                    className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                    Tümünü Gör
                    <ChevronRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}
