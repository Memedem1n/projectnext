"use server";

import { XMLParser } from "fast-xml-parser";

interface NVIVerificationParams {
    tcno: string;
    name: string;
    surname: string;
    birthYear: number;
}

export async function verifyTCWithNVI({ tcno, name, surname, birthYear }: NVIVerificationParams): Promise<{ success: boolean; message?: string }> {
    try {
        const soapBody = `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
      <TCKimlikNo>${tcno}</TCKimlikNo>
      <Ad>${name.toUpperCase()}</Ad>
      <Soyad>${surname.toUpperCase()}</Soyad>
      <DogumYili>${birthYear}</DogumYili>
    </TCKimlikNoDogrula>
  </soap:Body>
</soap:Envelope>`;

        const response = await fetch("https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx", {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": '"http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula"',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            body: soapBody
        });

        // console.log("NVI Status:", response.status, response.statusText);

        const text = await response.text();
        // console.log("NVI Raw Response:", text);

        const parser = new XMLParser({
            removeNSPrefix: true,
            ignoreAttributes: true
        });
        const result = parser.parse(text);

        // Parse SOAP response with simplified structure (namespaces removed)
        // Envelope -> Body -> TCKimlikNoDogrulaResponse -> TCKimlikNoDogrulaResult
        const body = result?.Envelope?.Body;
        if (!body) {
            console.error("NVI Invalid Response Structure:", JSON.stringify(result));
            // If we can't parse it, it might be an error page or service down
            throw new Error("Invalid response structure");
        }

        const verificationResult = body?.TCKimlikNoDogrulaResponse?.TCKimlikNoDogrulaResult;

        const isValid = verificationResult === true || verificationResult === "true";

        if (isValid) {
            return { success: true };
        } else {
            return { success: false, message: "TC Kimlik bilgileri doğrulanamadı. Lütfen bilgilerinizi kontrol ediniz." };
        }

    } catch (error) {
        console.error("NVI Verification Error:", error);

        // Fallback for Development: If service is down/blocked, allow verification to proceed
        // This ensures the user can test the registration flow even if NVI is inaccessible
        if (process.env.NODE_ENV === "development") {
            console.log("⚠️ NVI Service unreachable. Falling back to MOCK SUCCESS for development.");
            return { success: true };
        }

        return { success: false, message: "Doğrulama servisine erişilemedi." };
    }
}
