
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function TestImagesPage() {
    const listings = await prisma.listing.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { images: true }
    });

    return (
        <div className="p-10 text-white space-y-8">
            <h1>Debug Listings Data</h1>
            {listings.map(l => (
                <div key={l.id} className="border p-4 rounded">
                    <h2>{l.title}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3>DB Data:</h3>
                            <pre className="text-xs bg-black/50 p-2 overflow-auto">
                                {JSON.stringify({
                                    id: l.id,
                                    km: l.km,
                                    year: l.year,
                                    fuel: l.fuel,
                                    gear: l.gear,
                                    price: l.price,
                                    images: l.images.length
                                }, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h3>Images:</h3>
                            <div className="flex gap-2">
                                {l.images.map(img => (
                                    <img key={img.id} src={img.url} className="w-20 h-20 object-cover" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
