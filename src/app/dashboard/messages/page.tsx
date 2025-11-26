"use client";

import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_CHATS = [
    {
        id: "1",
        user: "Ahmet Yılmaz",
        avatar: "A",
        lastMessage: "Araç hala satılık mı?",
        time: "10:30",
        unread: 2,
        online: true,
    },
    {
        id: "2",
        user: "Mehmet Demir",
        avatar: "M",
        lastMessage: "Fiyatta pazarlık payı var mı?",
        time: "Dün",
        unread: 0,
        online: false,
    },
    {
        id: "3",
        user: "Ayşe Kaya",
        avatar: "A",
        lastMessage: "Takas düşünür müsünüz?",
        time: "Pzt",
        unread: 0,
        online: false,
    },
];

const MOCK_MESSAGES = [
    { id: 1, sender: "other", text: "Merhaba, ilanınızla ilgileniyorum.", time: "10:00" },
    { id: 2, sender: "me", text: "Merhaba, buyurun nasıl yardımcı olabilirim?", time: "10:05" },
    { id: 3, sender: "other", text: "Araç hala satılık mı?", time: "10:30" },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<string | null>("1");

    return (
        <div className="h-[calc(100vh-140px)] flex rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {/* Chat List */}
            <div className="w-80 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="font-bold text-lg mb-4">Mesajlar</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Mesajlarda ara..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-primary focus:ring-0"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {MOCK_CHATS.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                                selectedChat === chat.id ? "bg-primary/10" : "hover:bg-white/5"
                            )}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-lg">
                                    {chat.avatar}
                                </div>
                                {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a1a1a]" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold truncate">{chat.user}</span>
                                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            {selectedChat ? (
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                A
                            </div>
                            <div>
                                <div className="font-bold">Ahmet Yılmaz</div>
                                <div className="text-xs text-green-500 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Çevrimiçi
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                                <Video className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
                        {MOCK_MESSAGES.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[70%]",
                                    msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm",
                                    msg.sender === "me"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-white/10 text-white rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                                <span className="text-xs text-muted-foreground mt-1 px-1">
                                    {msg.time}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Bir mesaj yazın..."
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-primary focus:ring-0"
                            />
                            <button className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <p>Bir sohbet seçin</p>
                </div>
            )}
        </div>
    );
}
