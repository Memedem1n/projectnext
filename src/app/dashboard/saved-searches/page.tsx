import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SavedFiltersTab } from "@/components/account/SavedFiltersTab";

export default async function SavedSearchesPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Kaydedilen Aramalar</h1>
                <p className="text-white/60">Favori arama kriterlerinize hızlıca ulaşın.</p>
            </div>

            <SavedFiltersTab />
        </div>
    );
}
