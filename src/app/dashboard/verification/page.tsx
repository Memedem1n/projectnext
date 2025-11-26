import { getSession } from "@/lib/auth-edge";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Hesap Doğrulama</h1>
            <p className="text-gray-400">Bu özellik henüz geliştirme aşamasındadır.</p>
        </div>
    );
}
