import { getConversations } from "@/lib/actions/chat";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/chat/ConversationList";

export default async function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session?.id) {
        redirect("/login");
    }

    const conversations = await getConversations();

    return (
        <div className="h-[calc(100vh-140px)] min-h-[600px] glass-card rounded-2xl overflow-hidden flex">
            {/* Sidebar - Conversation List */}
            <div className="w-[320px] border-r border-white/10 flex flex-col bg-white/5">
                <div className="p-4 border-b border-white/10">
                    <h2 className="font-semibold">Mesajlar</h2>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ConversationList
                        conversations={conversations}
                        currentUserId={session.id}
                    />
                </div>
            </div>

            {/* Main Content - Chat Window */}
            <div className="flex-1 flex flex-col bg-background/50">
                {children}
            </div>
        </div>
    );
}
