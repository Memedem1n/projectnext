import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '../actions/chat';
import { prisma } from '../prisma';
import { getSession } from '../session';

// Mock dependencies
vi.mock('../prisma', () => ({
    prisma: {
        listing: {
            findUnique: vi.fn(),
        },
        conversation: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        message: {
            create: vi.fn(),
        },
    },
}));

vi.mock('../session', () => ({
    getSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('sendMessage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error if not authenticated', async () => {
        (getSession as any).mockResolvedValue(null);

        const result = await sendMessage('listing-1', 'Hello');
        expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return error if listing not found', async () => {
        (getSession as any).mockResolvedValue({ userId: 'user-1' });
        (prisma.listing.findUnique as any).mockResolvedValue(null);

        const result = await sendMessage('listing-1', 'Hello');
        expect(result).toEqual({ error: 'Listing not found' });
    });

    it('should return error if messaging own listing', async () => {
        (getSession as any).mockResolvedValue({ userId: 'user-1' });
        (prisma.listing.findUnique as any).mockResolvedValue({ userId: 'user-1' });

        const result = await sendMessage('listing-1', 'Hello');
        expect(result).toEqual({ error: 'Cannot message your own listing' });
    });

    it('should create conversation and message if valid', async () => {
        (getSession as any).mockResolvedValue({ userId: 'buyer-1' });
        (prisma.listing.findUnique as any).mockResolvedValue({ userId: 'seller-1' });
        (prisma.conversation.findUnique as any).mockResolvedValue(null);
        (prisma.conversation.create as any).mockResolvedValue({ id: 'conv-1' });
        (prisma.message.create as any).mockResolvedValue({ id: 'msg-1' });

        const result = await sendMessage('listing-1', 'Hello');

        expect(prisma.conversation.create).toHaveBeenCalled();
        expect(prisma.message.create).toHaveBeenCalledWith({
            data: {
                conversationId: 'conv-1',
                senderId: 'buyer-1',
                content: 'Hello',
            },
        });
        expect(result).toEqual({ success: true, conversationId: 'conv-1' });
    });
});
