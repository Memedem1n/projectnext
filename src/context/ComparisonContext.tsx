"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Listing } from "@/data/mock-data";

interface ComparisonContextType {
    selectedListings: Listing[];
    addToCompare: (listing: Listing) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [selectedListings, setSelectedListings] = useState<Listing[]>([]);

    const addToCompare = (listing: Listing) => {
        if (selectedListings.length >= 3) {
            alert("En fazla 3 araç karşılaştırabilirsiniz!");
            return;
        }
        if (selectedListings.find(l => l.id === listing.id)) return;
        setSelectedListings([...selectedListings, listing]);
    };

    const removeFromCompare = (id: string) => {
        setSelectedListings(selectedListings.filter(l => l.id !== id));
    };

    const clearCompare = () => {
        setSelectedListings([]);
    };

    const isInCompare = (id: string) => {
        return selectedListings.some(l => l.id === id);
    };

    return (
        <ComparisonContext.Provider value={{ selectedListings, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error("useComparison must be used within a ComparisonProvider");
    }
    return context;
}
