'use client';

import { User, Shield, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsTabsProps {
    activeTab: 'profile' | 'security' | 'notifications';
    onTabChange: (tab: 'profile' | 'security' | 'notifications') => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
    const tabs = [
        { id: 'profile', label: 'Profil Bilgileri', icon: User },
        { id: 'security', label: 'Güvenlik', icon: Shield },
        { id: 'notifications', label: 'Bildirimler', icon: Bell },
    ] as const;

    return (
        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl mb-8">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                            isActive
                                ? "bg-brand-gold text-[#1c1917] shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
