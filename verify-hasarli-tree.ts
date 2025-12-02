
import { getVehicleCategories } from './src/lib/actions/vehicle-categories';

async function main() {
    console.log("Verifying Category Tree Logic...");

    // 1. Check Hasarlı Araçlar (Should be empty)
    console.log("\nChecking 'hasarli-araclar'...");
    const hasarli = await getVehicleCategories(['vasita', 'hasarli-araclar']);
    console.log(`Hasarlı Araçlar Count: ${hasarli.length}`);
    if (hasarli.length === 0) {
        console.log("PASS: Hasarlı Araçlar is empty.");
    } else {
        console.error("FAIL: Hasarlı Araçlar has items!", hasarli[0]);
    }

    // 2. Check Otomobil (Should have brands)
    console.log("\nChecking 'otomobil'...");
    const otomobil = await getVehicleCategories(['vasita', 'otomobil']);
    console.log(`Otomobil Count: ${otomobil.length}`);
    if (otomobil.length > 0) {
        console.log("PASS: Otomobil has brands.");
    } else {
        console.error("FAIL: Otomobil is empty!");
    }
}

main()
    .catch(e => console.error(e));
