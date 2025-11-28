'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { User, MessageCircle } from 'lucide-react';

interface Conversation {
    id: string;
    listing: {
        title: string;
        images: { url: string }[];
    };
    buyer: { name: string | null; avatar: string | null };
    seller: { name: string | null; avatar: string | null };
    messages: {
        content: string;
        createdAt: Date;
        isRead: boolean;
        senderId: string;
    }[];
    buyerId: string;
    sellerId: string;
}

interface ConversationListProps {
    conversations: Conversation[];
    currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
    const pathname = usePathname();

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mb-4 opacity-20" />
                <p>Henüz mesajınız yok.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto space-y-2 p-2">
            {conversations.map((conversation) => {
                const otherUser = conversation.buyerId === currentUserId ? conversation.seller : conversation.buyer;
                const lastMessage = conversation.messages[0];
                const isActive = pathname === `/dashboard/messages/${conversation.id}`;
                const hasUnread = lastMessage && !lastMessage.isRead && lastMessage.senderId !== currentUserId;

                return (
                    <Link
                        key={conversation.id}
                        href={`/dashboard/messages/${conversation.id}`}
                        className={cn(
                            "flex items-start gap-3 p-3 rounded-xl transition-all",
                            isActive
                                ? "bg-brand-gold/10 border border-brand-gold/20"
                                : "hover:bg-white/5 border border-transparent"
                        )}
                    >
                        {/* Avatar / Listing Image */}
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                {conversation.listing.images[0] ? (
                                    <img
                                        src={conversation.listing.images[0].url}
                                        alt={conversation.listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            {hasUnread && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-gold rounded-full border-2 border-background" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={cn("font-medium truncate text-sm", hasUnread && "text-brand-gold")}>
                                    {otherUser.name || "Kullanıcı"}
                                </h4>
                                {lastMessage && (
                                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                                        {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false, locale: tr })}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground truncate mb-1">
                                {conversation.listing.title}
                            </p>

                            <p className={cn(
                                "text-xs truncate",
                                hasUnread ? "text-foreground font-medium" : "text-muted-foreground/70"
                            )}>
                                {lastMessage ? (
                                    <>
                                        {lastMessage.senderId === currentUserId && "Siz: "}
                                        {lastMessage.content}
                                    </>
                                ) : (
                                    "Mesaj yok"
                                )}
                            </p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
