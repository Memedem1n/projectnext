import { getMessages } from "@/lib/actions/chat";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function DashboardConversationPage({ params }: PageProps) {
    const { id } = await params;
    const session = await getSession();

    if (!session?.id) {
        redirect("/login");
    }

    // Fetch conversation details
    const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
            listing: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    images: {
                        where: { isCover: true },
                        take: 1,
                        select: { url: true }
                    }
                }
            },
            buyer: {
                select: { id: true, name: true, avatar: true }
            },
            seller: {
                select: { id: true, name: true, avatar: true }
            }
        }
    });

    if (!conversation) {
        notFound();
    }

    // Verify participation
    if (conversation.buyerId !== session.id && conversation.sellerId !== session.id) {
        redirect("/dashboard/messages");
    }

    const messages = await getMessages(id);
    const otherUser = conversation.buyerId === session.id ? conversation.seller : conversation.buyer;

    return (
        <div className="h-full flex flex-col">
            {/* Listing Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                    {conversation.listing.images[0] ? (
                        <img
                            src={conversation.listing.images[0].url}
                            alt={conversation.listing.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-white/10" />
                    )}
                </div>
                <div>
                    <h3 className="font-medium">{conversation.listing.title}</h3>
                    <p className="text-brand-gold font-bold text-sm">
                        {conversation.listing.price.toLocaleString('tr-TR')} TL
                    </p>
                </div>
            </div>

            {/* Chat Window - Adjusted for Dashboard */}
            <div className="flex-1 overflow-hidden">
                <ChatWindow
                    conversationId={id}
                    initialMessages={messages}
                    currentUserId={session.id}
                    otherUser={otherUser}
                    listingId={conversation.listing.id}
                />
            </div>
        </div>
    );
}
