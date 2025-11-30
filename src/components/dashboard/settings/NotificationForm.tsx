'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { updateNotifications } from '@/lib/actions/settings';
import { toast } from 'sonner';
import { Mail, BellRing } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface NotificationFormProps {
    preferences: any;
}

export function NotificationForm({ preferences }: NotificationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        messages: preferences?.messages ?? true,
        updates: preferences?.updates ?? true,
        marketing: preferences?.marketing ?? false,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    async function handleSubmit() {
        setIsLoading(true);
        try {
            const result = await updateNotifications(settings);
            if (result.success) {
                toast.success('Bildirim tercihleri güncellendi');
            } else {
                toast.error(result.error || 'Güncelleme başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Mail className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                    <h3 className="font-medium text-white mb-1">E-posta Bildirimleri</h3>
                    <p className="text-sm text-gray-400">
                        Hangi durumlarda e-posta almak istediğinizi buradan yönetebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="space-y-4 bg-[#1c1c1c] border border-white/10 rounded-xl divide-y divide-white/10">
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Yeni Mesajlar</h4>
                        <p className="text-sm text-gray-400">İlanlarınız için yeni bir mesaj geldiğinde</p>
                    </div>
                    <Switch
                        checked={settings.messages}
                        onCheckedChange={() => handleToggle('messages')}
                    />
                </div>

                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">İlan Durum Güncellemeleri</h4>
                        <p className="text-sm text-gray-400">İlanınız onaylandığında veya reddedildiğinde</p>
                    </div>
                    <Switch
                        checked={settings.updates}
                        onCheckedChange={() => handleToggle('updates')}
                    />
                </div>

                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Kampanya ve Duyurular</h4>
                        <p className="text-sm text-gray-400">Yeni özellikler ve fırsatlardan haberdar olun</p>
                    </div>
                    <Switch
                        checked={settings.marketing}
                        onCheckedChange={() => handleToggle('marketing')}
                    />
                </div>
            </div>

            <div className="pt-4">
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                >
                    {isLoading ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
                </Button>
            </div>
        </div>
    );
}
