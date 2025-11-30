'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Smartphone, Lock } from 'lucide-react';
import { sendPhoneOtp, verifyPhoneOtp } from '@/lib/actions/verification';
import { toast } from 'sonner';

interface PhoneVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPhone?: string;
}

export function PhoneVerificationModal({ isOpen, onClose, currentPhone }: PhoneVerificationModalProps) {
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [phone, setPhone] = useState(currentPhone || '');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setStep('PHONE');
            setPhone(currentPhone || '');
            setOtp('');
        }
    }, [isOpen, currentPhone]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    if (!isOpen) return null;

    async function handleSendOtp() {
        if (phone.length < 10) {
            toast.error('Geçerli bir telefon numarası giriniz');
            return;
        }

        setIsLoading(true);
        try {
            const result = await sendPhoneOtp(phone);
            if (result.success) {
                setStep('OTP');
                setCountdown(60);
                toast.success('Doğrulama kodu gönderildi');
            } else {
                toast.error(result.error || 'Kod gönderilemedi');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleVerify() {
        if (otp.length !== 6) {
            toast.error('6 haneli kodu giriniz');
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyPhoneOtp(phone, otp);
            if (result.success) {
                toast.success('Telefon numarası doğrulandı');
                onClose();
            } else {
                toast.error(result.error || 'Doğrulama başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1c1c1c] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-brand-gold" />
                        Telefon Doğrulama
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {step === 'PHONE' ? (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-400">
                                İlan verebilmek ve güvenli alışveriş yapabilmek için telefon numaranızı doğrulamanız gerekmektedir.
                            </p>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Telefon Numarası</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="05XX XXX XX XX"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                                />
                            </div>
                            <Button
                                onClick={handleSendOtp}
                                disabled={isLoading || phone.length < 10}
                                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                            >
                                {isLoading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-lg p-4 text-center">
                                <p className="text-sm text-brand-gold mb-1">Kod Gönderildi</p>
                                <p className="font-mono font-bold text-white text-lg">{phone}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Doğrulama Kodu</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        placeholder="123456"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors tracking-widest font-mono"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleVerify}
                                disabled={isLoading || otp.length !== 6}
                                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-[#1c1917] font-bold"
                            >
                                {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Tamamla'}
                            </Button>

                            <div className="text-center">
                                <button
                                    onClick={handleSendOtp}
                                    disabled={countdown > 0 || isLoading}
                                    className="text-xs text-gray-400 hover:text-white disabled:opacity-50"
                                >
                                    {countdown > 0 ? `Tekrar göndermek için ${countdown}sn bekleyin` : 'Kodu Tekrar Gönder'}
                                </button>
                            </div>

                            <button
                                onClick={() => setStep('PHONE')}
                                className="w-full text-xs text-gray-500 hover:text-gray-300 mt-2"
                            >
                                Farklı bir numara gir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
