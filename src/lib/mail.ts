import { Resend } from "resend";

export const sendVerificationEmail = async (email: string, token: string) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn("RESEND_API_KEY is missing. Email sending skipped.");
        return;
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Sahibinden.next - Doğrulama Kodu",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Doğrulama Kodunuz</h1>
                <p>Sahibinden.next hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
                <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000;">${token}</span>
                </div>
                <p>Bu kod 15 dakika süreyle geçerlidir.</p>
                <p style="color: #666; font-size: 12px;">Bu kodu siz talep etmediyseniz, lütfen dikkate almayınız.</p>
            </div>
        `
    });
};
