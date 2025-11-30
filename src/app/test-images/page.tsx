
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function TestImagesPage() {
    const listing = await prisma.listing.findFirst({
        where: { title: 'dsadsadsa' },
        include: { images: true }
    });

    return (
        <div className="p-10 text-white">
            <h1>Debug Images</h1>
            <pre>{JSON.stringify(listing, null, 2)}</pre>
            {listing?.images.map(img => (
                <div key={img.id}>
                    <img src={img.url} alt="Test" style={{ maxWidth: 300 }} />
                    <p>{img.url}</p>
                </div>
            ))}
        </div>
    );
}
