
import { searchCategories } from '@/lib/actions/categories';

async function main() {
    const queries = ['gt', 'audi', 'emlak', 'kiralık'];

    for (const query of queries) {
        console.log(`\n--- Searching for: "${query}" ---`);
        const result = await searchCategories(query);

        if (result.success && result.data) {
            console.log(`Found ${result.data.length} results:`);
            result.data.forEach((item: any) => {
                console.log(`- Title: ${item.title}`);
                console.log(`  Subtitle: ${item.subtitle}`);
                console.log(`  URL: ${item.url}`);
            });
        } else {
            console.error('Search failed:', result.error);
        }
    }
}

main();
