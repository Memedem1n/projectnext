import { getUserFavorites, getUserFavoriteLists } from "@/lib/actions/favorites";
import { FavoritesClient } from "@/components/dashboard/FavoritesClient";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
    const [favoritesResult, listsResult] = await Promise.all([
        getUserFavorites(),
        getUserFavoriteLists()
    ]);

    if (!favoritesResult.success || !listsResult.success) {
        // If error is auth related, redirect. Otherwise show error or empty.
        // For simplicity, if failed, we assume auth issue or just redirect to login for now.
        // Ideally check error message.
        if (favoritesResult.error === "Oturum açmanız gerekiyor.") {
            redirect("/login");
        }
    }

    return (
        <FavoritesClient
            initialFavorites={favoritesResult.data || []}
            initialLists={listsResult.data || []}
        />
    );
}
