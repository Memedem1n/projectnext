"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FilterSliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    formatValue?: (value: number) => string;
    unit?: string;
}

export function FilterSlider({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    formatValue,
    unit = "",
}: FilterSliderProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleMinChange = (newMin: number) => {
        const clampedMin = Math.max(min, Math.min(newMin, localValue[1]));
        const newValue: [number, number] = [clampedMin, localValue[1]];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleMaxChange = (newMax: number) => {
        const clampedMax = Math.min(max, Math.max(newMax, localValue[0]));
        const newValue: [number, number] = [localValue[0], clampedMax];
        setLocalValue(newValue);
        onChange(newValue);
    };

    const formatDisplay = (val: number) => {
        if (formatValue) return formatValue(val);
        return val.toLocaleString('tr-TR');
    };

    const minPercent = ((localValue[0] - min) / (max - min)) * 100;
    const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{label}</label>

            {/* Range Display */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDisplay(localValue[0])} {unit}</span>
                <span className="text-primary">-</span>
                <span>{formatDisplay(localValue[1])} {unit}</span>
            </div>

            {/* Slider Track */}
            <div className="relative h-2">
                {/* Background track */}
                <div className="absolute inset-0 bg-white/10 rounded-full" />

                {/* Active range */}
                <div
                    className="absolute h-full bg-primary rounded-full transition-all"
                    style={{
                        left: `${minPercent}%`,
                        right: `${100 - maxPercent}%`,
                    }}
                />

                {/* Min handle */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue[0]}
                    onChange={(e) => handleMinChange(Number(e.target.value))}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />

                {/* Max handle */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={localValue[1]}
                    onChange={(e) => handleMaxChange(Number(e.target.value))}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                />
            </div>

            {/* Number Inputs */}
            <div className="grid grid-cols-2 gap-2">
                <input
                    type="number"
                    value={localValue[0]}
                    onChange={(e) => handleMinChange(Number(e.target.value))}
                    className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="Min"
                />
                <input
                    type="number"
                    value={localValue[1]}
                    onChange={(e) => handleMaxChange(Number(e.target.value))}
                    className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="Max"
                />
            </div>
        </div>
    );
}
