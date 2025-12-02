import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const EUROTAX_CSV_PATH = path.join(process.cwd(), 'prisma', 'data', 'eurotax-vehicles.csv');

interface EurotaxRecord {
    full_path: string;
    path_1: string; // Type (Otomobil)
    path_2: string; // Year
    path_3: string; // Brand
    path_4: string; // Series
    path_5: string; // Fuel
    path_6: string; // Case Type
    path_7: string; // Gear
    path_8: string; // Submodel
    path_9: string; // Version
    Yakıt: string;
    "Üretim Yılları": string;
    "Alt Model": string;
    "Motor Hacmi": string;
    "Kasa Tipi": string;
    "Motor Gücü": string;
    Vites: string;
}

let cachedData: EurotaxRecord[] | null = null;

function getEurotaxData(): EurotaxRecord[] {
    if (cachedData) return cachedData;

    try {
        const fileContent = fs.readFileSync(EUROTAX_CSV_PATH, 'utf-8');
        cachedData = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        return cachedData || [];
    } catch (error) {
        console.error("Error reading Eurotax CSV:", error);
        return [];
    }
}

export function findEurotaxData(listing: {
    brand?: string | null;
    year?: number | null;
    fuel?: string | null;
    gear?: string | null;
    caseType?: string | null;
    model?: string | null;
}) {
    const data = getEurotaxData();
    if (!data.length) return null;

    const brand = listing.brand?.toLowerCase();
    const year = listing.year?.toString();
    const fuel = listing.fuel?.toLowerCase();
    const gear = listing.gear?.toLowerCase();
    const caseType = listing.caseType?.toLowerCase();
    const model = listing.model?.toLowerCase();

    // Filter by strict matches first
    let matches = data.filter(record => {
        if (brand && record.path_3.toLowerCase() !== brand) return false;
        if (year && record.path_2 !== year) return false;
        // Fuzzy match for fuel (e.g. "Dizel" vs "Dizel") - usually exact but case insensitive
        if (fuel && !record.path_5.toLowerCase().includes(fuel)) return false;
        if (gear && !record.path_7.toLowerCase().includes(gear)) return false;
        if (caseType && !record.path_6.toLowerCase().includes(caseType)) return false;
        return true;
    });

    if (matches.length === 0) return null;

    // If we have matches, try to find the best one based on model/series
    if (model) {
        // Score matches based on how much of the model string appears in path_4, path_8, path_9
        const scoredMatches = matches.map(record => {
            let score = 0;
            const fullString = `${record.path_4} ${record.path_8} ${record.path_9}`.toLowerCase();

            // Simple token matching
            const modelTokens = model.split(' ');
            for (const token of modelTokens) {
                if (fullString.includes(token)) score++;
            }

            return { record, score };
        });

        scoredMatches.sort((a, b) => b.score - a.score);
        if (scoredMatches.length > 0 && scoredMatches[0].score > 0) {
            return scoredMatches[0].record;
        }
    }

    // Default to the first match if no model match or no model provided
    return matches[0];
}
