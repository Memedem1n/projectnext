'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import { submitIdentityVerification } from '@/lib/actions/verification';
import { toast } from 'sonner';

interface IdentityVerificationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function IdentityVerificationForm({ isOpen, onClose }: IdentityVerificationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [docUrl, setDocUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

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
                setDocUrl(data.url);
                toast.success('Belge yüklendi');
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
        if (!docUrl) {
            toast.error('Lütfen kimlik fotoğrafınızı yükleyin');
            return;
        }

        setIsLoading(true);
        // Append docUrl to formData
        formData.append('docUrl', docUrl);

        try {
            const result = await submitIdentityVerification(formData);
            if (result.success) {
                toast.success('Kimlik doğrulama başvurunuz alındı');
                onClose();
            } else {
                toast.error(result.error || 'Başvuru gönderilemedi');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-gold" />
                        Kimlik Doğrulama
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
                        Kimlik bilgileriniz yasal zorunluluklar gereği 6698 sayılı KVKK kapsamında güvenle saklanmaktadır.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">TC Kimlik Numarası</label>
                        <input
                            name="tcNo"
                            required
                            maxLength={11}
                            minLength={11}
                            placeholder="11 haneli TC No"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Kimlik Fotoğrafı (Ön Yüz)</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-brand-gold/50 hover:bg-white/5 transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            {docUrl ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <p className="text-green-400 font-medium">Belge Yüklendi</p>
                                    <p className="text-xs text-gray-500">Değiştirmek için tıklayın</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-gold transition-colors" />
                                    </div>
                                    <p className="text-gray-300 font-medium">Fotoğraf Yükle</p>
                                    <p className="text-xs text-gray-500">JPG, PNG veya PDF (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                        {uploading && <p className="text-xs text-brand-gold animate-pulse">Yükleniyor...</p>}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || uploading || !docUrl}
                        className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                    >
                        {isLoading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
