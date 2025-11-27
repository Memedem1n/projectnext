"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function createVehicleFeedback(data: {
    type: "ERROR_REPORT" | "MISSING_VEHICLE";
    brand?: string;
    model?: string;
    year?: number;
    details: string;
}) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");

        if (!sessionCookie) {
            return { success: false, error: "Oturum açmanız gerekiyor." };
        }

        const session = await decrypt(sessionCookie.value);
        const userId = session?.userId as string;

        if (!userId) {
            return { success: false, error: "Kullanıcı doğrulanamadı." };
        }

        // @ts-ignore - Prisma client might not be updated yet
        await prisma.vehicleFeedback.create({
            data: {
                userId,
                type: data.type,
                brand: data.brand,
                model: data.model,
                year: data.year,
                details: data.details,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error creating feedback:", error);
        return { success: false, error: "Bir hata oluştu." };
    }
}
