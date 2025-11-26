import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Skeleton */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-32" />
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-24" />
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-24 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-1 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>

                        {/* Filters Bar */}
                        <Skeleton className="h-16 w-full rounded-xl" />

                        {/* Listings Grid */}
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex gap-4 p-4 border rounded-xl">
                                    <Skeleton className="w-32 h-24 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-6 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-1/2" />
                                        <div className="flex gap-2 pt-2">
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-16" />
                                            <Skeleton className="h-5 w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
