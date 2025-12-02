"use client";

import React from "react";

interface PageBackgroundProps {
    children?: React.ReactNode;
}

export function PageBackground({ children }: PageBackgroundProps) {
    return (
        <>
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: `
                        linear-gradient(135deg, 
                            #1c1917 0%,
                            #292524 20%,
                            #44403c 40%,
                            #292524 60%,
                            #1c1917 80%,
                            #0c0a09 100%
                        )
                    `,
                }}
            >
                {/* Radial accent gradients for depth */}
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        background: `
                            radial-gradient(ellipse at 20% 20%, rgba(254, 204, 128, 0.08) 0%, transparent 50%),
                            radial-gradient(ellipse at 80% 80%, rgba(254, 204, 128, 0.05) 0%, transparent 50%)
                        `,
                    }}
                />

                {/* Fine grain texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
                    }}
                />
            </div>
            {children}
        </>
    );
}
