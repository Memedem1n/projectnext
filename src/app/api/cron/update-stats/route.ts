import { NextResponse } from "next/server";
import { recomputeStats } from "@/lib/actions/stats";

export async function GET(request: Request) {
    // Verify cron secret (Vercel Cron sends this header)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await recomputeStats();

    if (result.success) {
        return NextResponse.json({ success: true, message: result.message });
    } else {
        return NextResponse.json({ error: result.error }, { status: 500 });
    }
}
