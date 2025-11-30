'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { changePassword } from '@/lib/actions/settings';
import { sendPasswordChangeOtp } from '@/lib/actions/auth-otp';
import { toast } from 'sonner';
import { ShieldCheck, KeyRound, Lock } from 'lucide-react';

export function SecurityForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    async function handleSendOtp() {
        setIsLoading(true);
        try {
            const result = await sendPasswordChangeOtp();
            if (result.success) {
                setOtpSent(true);
                toast.success('Doğrulama kodu e-posta adresinize gönderildi');
                // Start countdown
                setCountdown(60);
                const timer = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                toast.error(result.error || 'Kod gönderilemedi');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await changePassword(null, formData);
            if (result.success) {
                toast.success('Şifreniz başarıyla değiştirildi');
                const form = document.getElementById('security-form') as HTMLFormElement;
                form?.reset();
                setOtpSent(false);
            } else {
                toast.error(result.error || 'Şifre değiştirilemedi');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form id="security-form" action={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="bg-brand-gold/10 border border-brand-gold/20 p-4 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-brand-gold/20 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                    <h3 className="font-medium text-brand-gold mb-1">Hesap Güvenliği</h3>
                    <p className="text-sm text-brand-gold/80">
                        Şifrenizi değiştirmek için önce e-posta adresinize gönderilecek doğrulama kodunu girmelisiniz.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mevcut Şifre</label>
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="password"
                            name="currentPassword"
                            required
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Yeni Şifre</label>
                        <input
                            type="password"
                            name="newPassword"
                            required
                            minLength={6}
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            minLength={6}
                            className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* OTP Section */}
                <div className="pt-4 border-t border-white/10">
                    {!otpSent ? (
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isLoading}
                            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        >
                            {isLoading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                        </Button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-gold">Doğrulama Kodu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
                                    <input
                                        type="text"
                                        name="otp"
                                        required
                                        maxLength={6}
                                        className="w-full bg-brand-gold/10 border border-brand-gold/30 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-gold/30"
                                        placeholder="123456"
                                    />
                                </div>
                                <p className="text-xs text-gray-400">
                                    E-posta adresinize gönderilen 6 haneli kodu giriniz.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                            >
                                {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={countdown > 0 || isLoading}
                                    className="text-xs text-gray-400 hover:text-white disabled:opacity-50"
                                >
                                    {countdown > 0 ? `Tekrar göndermek için ${countdown}sn bekleyin` : 'Kodu Tekrar Gönder'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
