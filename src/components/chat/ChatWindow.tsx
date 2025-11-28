'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { sendMessage, markAsRead } from '@/lib/actions/chat';
import { Loader2, Send, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    isRead: boolean;
}

interface ChatWindowProps {
    conversationId: string;
    initialMessages: Message[];
    currentUserId: string;
    otherUser: {
        name: string | null;
        avatar: string | null;
    };
    listingId: string;
}

export function ChatWindow({ conversationId, initialMessages, currentUserId, otherUser, listingId }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        // Mark as read on mount
        markAsRead(conversationId);
    }, [conversationId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage('');
        setIsSending(true);

        // Optimistic update
        const optimisticMessage: Message = {
            id: 'optimistic-' + Date.now(),
            content,
            senderId: currentUserId,
            createdAt: new Date(),
            isRead: false
        };

        setMessages((prev) => [...prev, optimisticMessage]);

        try {
            const result = await sendMessage(listingId, content, conversationId);
            if (result.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold">{otherUser.name || "Kullanıcı"}</h3>
                    <p className="text-xs text-muted-foreground">Çevrimdışı</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        Henüz mesaj yok. İlk mesajı siz gönderin!
                    </div>
                ) : (
                    messages.map((message) => {
                        const isMe = message.senderId === currentUserId;
                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex w-full",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                    isMe
                                        ? "bg-brand-gold text-black rounded-tr-none"
                                        : "bg-white/10 text-foreground rounded-tl-none"
                                )}>
                                    <p>{message.content}</p>
                                    <div className={cn(
                                        "text-[10px] mt-1 text-right",
                                        isMe ? "text-black/60" : "text-muted-foreground"
                                    )}>
                                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: tr })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Bir mesaj yazın..."
                        className="flex-1 min-h-[44px] max-h-[120px] p-3 rounded-md bg-black/20 border border-white/10 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none resize-none transition-all text-sm"
                        disabled={isSending}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="h-[44px] w-[44px] bg-brand-gold hover:bg-brand-gold/90 text-black shrink-0"
                    >
                        {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
