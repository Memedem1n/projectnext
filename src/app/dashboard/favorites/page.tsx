import { getUserFavorites } from "@/lib/actions/favorites";
import { FavoritesClient } from "@/components/dashboard/FavoritesClient";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
    const favoritesResult = await getUserFavorites();

    if (!favoritesResult.success) {
        if (favoritesResult.error === "Oturum açmanız gerekiyor.") {
            redirect("/login");
        }
    }

    return (
        <FavoritesClient
            initialFavorites={favoritesResult.data || []}
        />
    );
}
