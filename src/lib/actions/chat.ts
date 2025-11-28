'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function sendMessage(listingId: string, content: string, conversationId?: string) {
    const session = await getSession();

    if (!session?.id) {
        return { error: 'Unauthorized' };
    }

    // If conversationId is provided, we are replying
    if (conversationId) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { buyerId: true, sellerId: true }
        });

        if (!conversation) {
            return { error: 'Conversation not found' };
        }

        // Verify participation
        if (conversation.buyerId !== session.id && conversation.sellerId !== session.id) {
            return { error: 'Unauthorized' };
        }

        try {
            await prisma.message.create({
                data: {
                    conversationId,
                    senderId: session.id,
                    content
                }
            });

            // Update conversation timestamp
            await prisma.conversation.update({
                where: { id: conversationId },
                data: { updatedAt: new Date() }
            });

            revalidatePath('/dashboard/messages');
            revalidatePath(`/dashboard/messages/${conversationId}`);
            return { success: true, conversationId };
        } catch (error) {
            console.error('Failed to send reply:', error);
            return { error: 'Failed to send message' };
        }
    }

    // New conversation logic (Buyer contacting Seller)
    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { userId: true }
    });

    if (!listing) {
        return { error: 'Listing not found' };
    }

    // Don't allow messaging yourself
    if (listing.userId === session.id) {
        return { error: 'Cannot message your own listing' };
    }

    try {
        // Find or create conversation
        let conversation = await prisma.conversation.findUnique({
            where: {
                listingId_buyerId_sellerId: {
                    listingId,
                    buyerId: session.id,
                    sellerId: listing.userId
                }
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    listingId,
                    buyerId: session.id,
                    sellerId: listing.userId
                }
            });
        }

        // Create message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: session.id,
                content
            }
        });

        revalidatePath('/dashboard/messages');
        revalidatePath(`/listings/${listingId}`);
        return { success: true, conversationId: conversation.id };
    } catch (error) {
        console.error('Failed to send message:', error);
        return { error: 'Failed to send message' };
    }
}

export async function getConversations() {
    const session = await getSession();
    if (!session?.id) {
        return [];
    }

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { buyerId: session.id },
                    { sellerId: session.id }
                ]
            },
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
                    select: { name: true, avatar: true }
                },
                seller: {
                    select: { name: true, avatar: true }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return conversations;
    } catch (error) {
        console.error('Failed to get conversations:', error);
        return [];
    }
}

export async function getMessages(conversationId: string) {
    const session = await getSession();
    if (!session?.id) {
        return [];
    }

    try {
        // Verify participation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { buyerId: true, sellerId: true }
        });

        if (!conversation || (conversation.buyerId !== session.id && conversation.sellerId !== session.id)) {
            return [];
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' }
        });

        return messages;
    } catch (error) {
        console.error('Failed to get messages:', error);
        return [];
    }
}

export async function markAsRead(conversationId: string) {
    const session = await getSession();
    if (!session?.id) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.message.updateMany({
            where: {
                conversationId,
                NOT: { senderId: session.id },
                isRead: false
            },
            data: { isRead: true }
        });

        revalidatePath('/messages');
        return { success: true };
    } catch (error) {
        console.error('Failed to mark as read:', error);
        return { error: 'Failed to mark as read' };
    }
}
