"use client";

import { useEffect, useState } from "react";
import { MapPin, X, Navigation } from "lucide-react";
import { Listing } from "@/data/mock-data";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

interface ListingMapProps {
    listings: Listing[];
}

// Dinamik import ile Leaflet'i client-side only yükle
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="relative w-full h-[700px] rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-muted-foreground">Harita yükleniyor...</div>
        </div>
    ),
});

export function ListingMap({ listings }: ListingMapProps) {
    return <MapWithNoSSR listings={listings} />;
}
