'use client';

import { useState } from 'react';
import { SettingsTabs } from './SettingsTabs';
import { ProfileForm } from './ProfileForm';
import { SecurityForm } from './SecurityForm';
import { NotificationForm } from './NotificationForm';

interface SettingsContainerProps {
    user: any;
}

export function SettingsContainer({ user }: SettingsContainerProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

    return (
        <div>
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">Profil Bilgileri</h2>
                            <p className="text-gray-400">Kişisel bilgilerinizi ve profil görünümünüzü güncelleyin.</p>
                        </div>
                        <ProfileForm user={user} />
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">Güvenlik Ayarları</h2>
                            <p className="text-gray-400">Şifrenizi ve hesap güvenliğinizi yönetin.</p>
                        </div>
                        <SecurityForm />
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">Bildirim Tercihleri</h2>
                            <p className="text-gray-400">Hangi konularda bildirim almak istediğinizi seçin.</p>
                        </div>
                        <NotificationForm preferences={user.notificationPreferences} />
                    </div>
                )}
            </div>
        </div>
    );
}
