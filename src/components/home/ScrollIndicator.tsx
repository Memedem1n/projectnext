"use client";

export function ScrollIndicator() {
    const handleClick = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    return (
        <div
            onClick={handleClick}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce cursor-pointer hover:scale-110 transition-transform"
        >
            <span className="text-base font-semibold text-primary drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">Keşfet</span>
            <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
