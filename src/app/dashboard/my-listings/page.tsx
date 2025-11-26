import { getUserListings } from "@/lib/actions/dashboard";
import { MyListingsClient } from "@/components/dashboard/MyListingsClient";
import { redirect } from "next/navigation";

export default async function MyListingsPage() {
    const result = await getUserListings();

    if (!result.success) {
        redirect("/login");
    }

    return <MyListingsClient listings={result.data || []} />;
}
