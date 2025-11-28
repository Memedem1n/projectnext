import { cache } from "react";
import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth-edge";

export const getSession = cache(async () => {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
});
