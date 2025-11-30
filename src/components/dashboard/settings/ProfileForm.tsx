'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/lib/actions/settings';
import { User } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormProps {
    user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Lütfen bir resim dosyası seçin');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setAvatarUrl(data.url);
                toast.success('Fotoğraf yüklendi');
            } else {
                toast.error('Yükleme başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        // Ensure avatar URL is included
        if (avatarUrl) {
            formData.set('avatar', avatarUrl);
        }

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                toast.success('Profil güncellendi');
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
        <form action={handleSubmit} className="space-y-6 max-w-2xl">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 relative group">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-10 h-10 text-gray-400" />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-medium text-white mb-1">Profil Fotoğrafı</h3>
                    <p className="text-sm text-gray-400 mb-3">JPG, GIF veya PNG. Maksimum 5MB.</p>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                        </Button>
                        {avatarUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => setAvatarUrl('')}
                            >
                                Kaldır
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Ad Soyad</label>
                    <input
                        name="name"
                        defaultValue={user.name || ''}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="Adınız Soyadınız"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Telefon</label>
                    <input
                        name="phone"
                        defaultValue={user.phone || ''}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="05XX XXX XX XX"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Hakkımda (Bio)</label>
                <textarea
                    name="bio"
                    defaultValue={user.bio || ''}
                    rows={4}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    placeholder="Kendinizden veya mağazanızdan bahsedin..."
                />
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                >
                    {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Button>
            </div>
        </form>
    );
}
