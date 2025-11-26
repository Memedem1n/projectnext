// NVI Service Test Script
// Uses native fetch (Node.js 18+)

async function testNVIService() {
    // Test with known valid TC data (public test data from NVI documentation)
    const testData = {
        tcno: "12345678901", // Sample TC (will fail validation but tests connectivity)
        name: "TEST",
        surname: "USER",
        birthYear: 1990
    };

    const soapBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
      <TCKimlikNo>${testData.tcno}</TCKimlikNo>
      <Ad>${testData.name}</Ad>
      <Soyad>${testData.surname}</Soyad>
      <DogumYili>${testData.birthYear}</DogumYili>
    </TCKimlikNoDogrula>
  </soap:Body>
</soap:Envelope>`;

    console.log("🔍 Testing NVI Service Connection...");
    console.log("URL: https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx");
    console.log("---");

    try {
        const startTime = Date.now();
        const response = await fetch("https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx", {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": '"http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula"',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            body: soapBody,
            timeout: 10000 // 10 second timeout
        });

        const elapsed = Date.now() - startTime;
        const text = await response.text();

        console.log(`✅ STATUS: ${response.status} ${response.statusText}`);
        console.log(`⏱️  RESPONSE TIME: ${elapsed}ms`);
        console.log("---");
        console.log("RESPONSE BODY:");
        console.log(text.substring(0, 500)); // First 500 chars
        console.log("---");

        if (response.status === 200) {
            console.log("✅ NVI service is REACHABLE");
            if (text.includes("false")) {
                console.log("ℹ️  TC validation returned 'false' (expected for test data)");
            }
        } else {
            console.log("⚠️  NVI service returned non-200 status");
        }

    } catch (error) {
        console.error("❌ ERROR:");
        console.error(error.message);
        console.log("---");
        console.log("⚠️  NVI service is UNREACHABLE or BLOCKED");
        console.log("Possible reasons:");
        console.log("  1. Firewall/Corporate network blocking");
        console.log("  2. Service temporarily down");
        console.log("  3. SSL/Certificate issues");
    }
}

testNVIService();
