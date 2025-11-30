'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Building2, CheckCircle, FileText } from 'lucide-react';
import { submitCorporateVerification } from '@/lib/actions/verification';
import { toast } from 'sonner';

interface CorporateVerificationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CorporateVerificationForm({ isOpen, onClose }: CorporateVerificationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [docs, setDocs] = useState({
        taxPlateDoc: '',
        companyEstablishmentDoc: ''
    });

    const taxPlateRef = useRef<HTMLInputElement>(null);
    const establishmentRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, key: 'taxPlateDoc' | 'companyEstablishmentDoc') {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        setUploading(key);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setDocs(prev => ({ ...prev, [key]: data.url }));
                toast.success('Belge yüklendi');
            } else {
                toast.error('Yükleme başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setUploading(null);
        }
    }

    async function handleSubmit(formData: FormData) {
        if (!docs.taxPlateDoc || !docs.companyEstablishmentDoc) {
            toast.error('Lütfen tüm belgeleri yükleyin');
            return;
        }

        setIsLoading(true);
        formData.append('taxPlateDoc', docs.taxPlateDoc);
        formData.append('companyEstablishmentDoc', docs.companyEstablishmentDoc);

        try {
            const result = await submitCorporateVerification(formData);
            if (result.success) {
                toast.success('Kurumsal üyelik başvurunuz alındı');
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
            <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1c1c1c] z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-brand-gold" />
                        Kurumsal Üyelik Başvurusu
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm text-blue-200">
                        Kurumsal üyelik başvurunuz incelendikten sonra onaylanacaktır. Lütfen şirket bilgilerinizi eksiksiz giriniz.
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Vergi Numarası</label>
                            <input
                                name="taxNumber"
                                required
                                placeholder="10 haneli Vergi No"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Vergi Dairesi</label>
                            <input
                                name="taxOffice"
                                required
                                placeholder="Vergi Dairesi Adı"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Şirket Sicil Numarası</label>
                        <input
                            name="companyRegistryNo"
                            required
                            placeholder="Ticaret Sicil No"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Tax Plate Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Vergi Levhası</label>
                            <div
                                onClick={() => taxPlateRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-brand-gold/50 hover:bg-white/5 transition-all cursor-pointer group h-40 flex flex-col items-center justify-center"
                            >
                                <input
                                    type="file"
                                    ref={taxPlateRef}
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, 'taxPlateDoc')}
                                />

                                {docs.taxPlateDoc ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <p className="text-green-400 text-sm font-medium">Yüklendi</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-brand-gold transition-colors" />
                                        </div>
                                        <p className="text-gray-300 text-sm font-medium">Dosya Seç</p>
                                    </div>
                                )}
                            </div>
                            {uploading === 'taxPlateDoc' && <p className="text-xs text-brand-gold animate-pulse">Yükleniyor...</p>}
                        </div>

                        {/* Establishment Doc Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Kuruluş Evrakları (Sicil Gazetesi)</label>
                            <div
                                onClick={() => establishmentRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-brand-gold/50 hover:bg-white/5 transition-all cursor-pointer group h-40 flex flex-col items-center justify-center"
                            >
                                <input
                                    type="file"
                                    ref={establishmentRef}
                                    className="hidden"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileChange(e, 'companyEstablishmentDoc')}
                                />

                                {docs.companyEstablishmentDoc ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <p className="text-green-400 text-sm font-medium">Yüklendi</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-brand-gold transition-colors" />
                                        </div>
                                        <p className="text-gray-300 text-sm font-medium">Dosya Seç</p>
                                    </div>
                                )}
                            </div>
                            {uploading === 'companyEstablishmentDoc' && <p className="text-xs text-brand-gold animate-pulse">Yükleniyor...</p>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || uploading !== null || !docs.taxPlateDoc || !docs.companyEstablishmentDoc}
                        className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                    >
                        {isLoading ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
