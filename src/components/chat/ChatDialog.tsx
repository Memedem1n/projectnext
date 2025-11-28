'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendMessage } from '@/lib/actions/chat';
import { useRouter } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';

interface ChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    listingId: string;
    sellerName: string;
}

export function ChatDialog({ isOpen, onClose, listingId, sellerName }: ChatDialogProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        setError('');

        try {
            const result = await sendMessage(listingId, message);

            if (result.error) {
                setError(result.error);
            } else {
                setMessage('');
                onClose();
                // Optional: Redirect to full chat or show success toast
                // router.push('/messages'); 
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Satıcıya Mesaj Gönder</h2>
                    <p className="text-sm text-muted-foreground">
                        {sellerName} adlı satıcıya mesajınız iletilsin.
                    </p>
                </div>

                <div className="space-y-2">
                    <textarea
                        className="w-full min-h-[120px] p-3 rounded-md bg-white/5 border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none resize-none transition-all"
                        placeholder="Mesajınızı buraya yazın..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSending}
                    />
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isSending}>
                        İptal
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || isSending}
                        className="bg-brand-gold hover:bg-brand-gold/90 text-black font-medium"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Gönderiliyor
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Gönder
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
