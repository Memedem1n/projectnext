import { Listing } from "./mock-data";

// Memoize mock data generation to prevent recreation on every import
let cachedListings: Listing[] | null = null;

export function getMockListings(): Listing[] {
    if (cachedListings) {
        return cachedListings;
    }

    // Import lazily to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { generateMockListings } = require('./mock-data');
    cachedListings = generateMockListings(10);
    return cachedListings as Listing[];
}

// Singleton access
export const MOCK_LISTINGS = getMockListings();
