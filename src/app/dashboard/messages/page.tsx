import { MessageCircle } from "lucide-react";

export default function DashboardMessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">Bir sohbet seçin</h3>
            <p className="text-sm max-w-xs text-center">
                Mesajlaşmaya başlamak için sol taraftaki listeden bir sohbet seçin.
            </p>
        </div>
    );
}
