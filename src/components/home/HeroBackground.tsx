"use client";

import dynamic from "next/dynamic";

// Dynamically import floating icons component (client-side only)
const FloatingCategoryIcons = dynamic(
    () => import("./Hero3DBackground").then((mod) => ({ default: mod.FloatingCategoryIcons })),
    { ssr: false }
);

export function HeroBackground() {
    return <FloatingCategoryIcons />;
}
