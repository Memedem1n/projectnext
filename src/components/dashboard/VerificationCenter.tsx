"use client";

import { useState } from "react";
import { BadgeCheck, Phone, ShieldCheck, Upload, AlertCircle, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { sendPhoneOTP, verifyPhoneOTP, requestBadge, uploadIdentityDocument } from "@/lib/actions/verification";
import { useRouter } from "next/navigation";

interface VerificationCenterProps {
    user: {
        id: string;
        phone: string | null;
        phoneVerified: boolean;
        identityVerified: boolean;
        tcIdentityNo: string | null;
        badges: { type: string }[];
        identityVerification: any;
        badgeRequests: any[];
    };
}

export function VerificationCenter({ user }: VerificationCenterProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    // Phone State
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");

    // Identity State
    const [tcNo, setTcNo] = useState(user.tcIdentityNo || "");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSendOTP = async () => {
        setLoading(true);
        setMessage(null);
        const result = await sendPhoneOTP(user.phone || "") as any;
        if (result.success) {
            setOtpSent(true);
            setMessage({ type: "success", text: result.message || "Kod gönderildi." });
        } else {
            setMessage({ type: "error", text: result.error || "Hata oluştu." });
        }
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        setMessage(null);
        const result = await verifyPhoneOTP(user.phone || "", otpCode, user.id) as any;
        if (result.success) {
            setMessage({ type: "success", text: result.message || "Telefon doğrulandı." });
            router.refresh();
        } else {
            setMessage({ type: "error", text: result.error || "Hata oluştu." });
        }
        setLoading(false);
    };

    const handleIdentityUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !tcNo) return;

        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("userId", user.id);
        formData.append("tcIdentityNo", tcNo);
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("birthYear", birthYear);
        formData.append("file", file);

        const result = await uploadIdentityDocument(formData) as any;

        if (result.success) {
            setMessage({ type: "success", text: result.message || "Belge yüklendi." });
            router.refresh();
        } else {
            setMessage({ type: "error", text: result.error || "Hata oluştu." });
        }
        setLoading(false);
    };

    const isVerifiedDealer = user.badges?.some((b: any) => b.type === "DEALER_VERIFIED");
    const identityStatus = user.identityVerification?.status; // PENDING, APPROVED, REJECTED
    const badgeRequestStatus = user.badgeRequests?.[0]?.status; // Assuming latest request

    return (
        <div className="space-y-6">
            {/* Status Message */}
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    }`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {/* Verified Seller Badge Status */}
            <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <BadgeCheck className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Onaylı Satıcı Rozeti</h2>
                        <p className="text-sm text-muted-foreground">
                            Güvenilir satıcı olduğunuzu kanıtlayın.
                        </p>
                    </div>
                </div>

                {isVerifiedDealer ? (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <BadgeCheck className="w-8 h-8 text-black" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-yellow-500">Onaylı Satıcı</h3>
                            <p className="text-yellow-200/80 text-sm">
                                Tebrikler! Hesabınız doğrulanmış satıcı statüsündedir.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className={`w-2 h-2 rounded-full ${user.phoneVerified ? "bg-green-500" : "bg-gray-600"}`} />
                            <span className={`text-sm ${user.phoneVerified ? "text-white" : "text-muted-foreground"}`}>
                                Telefon Doğrulaması
                            </span>
                            {user.phoneVerified && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className={`w-2 h-2 rounded-full ${identityStatus === "APPROVED" ? "bg-green-500" : "bg-gray-600"}`} />
                            <span className={`text-sm ${identityStatus === "APPROVED" ? "text-white" : "text-muted-foreground"}`}>
                                Kimlik Doğrulaması
                            </span>
                            {identityStatus === "APPROVED" && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
                        </div>

                        {badgeRequestStatus === "PENDING" && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3 text-blue-400">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm">Rozet talebiniz inceleniyor.</span>
                            </div>
                        )}

                        {badgeRequestStatus === "REJECTED" && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                                <XCircle className="w-5 h-5" />
                                <span className="text-sm">Rozet talebiniz reddedildi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.</span>
                            </div>
                        )}

                        {!badgeRequestStatus && user.phoneVerified && identityStatus === "APPROVED" && (
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3 text-blue-400">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm">Tüm doğrulamalar tamamlandı. Rozet talebiniz otomatik olarak oluşturulacaktır.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Verification */}
                <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.phoneVerified ? "bg-green-500/20 text-green-500" : "bg-white/5 text-muted-foreground"
                            }`}>
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold">Telefon Doğrulama</h3>
                            <p className="text-xs text-muted-foreground">SMS ile doğrulama kodu gönderilir</p>
                        </div>
                        {user.phoneVerified && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                    </div>

                    {!user.phoneVerified ? (
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg text-sm font-mono">
                                {user.phone || "Telefon numarası yok"}
                            </div>

                            {!otpSent ? (
                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                                >
                                    {loading ? "Gönderiliyor..." : "Doğrulama Kodu Gönder"}
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="SMS Kodu (6 haneli)"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-center tracking-widest"
                                        maxLength={6}
                                    />
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || otpCode.length !== 6}
                                        className="w-full py-2 bg-brand-gold text-primary-foreground rounded-lg transition-colors text-sm font-medium"
                                    >
                                        {loading ? "Doğrulanıyor..." : "Onayla"}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="text-sm text-green-500 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Telefon numaranız doğrulanmıştır.
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg text-sm font-mono text-muted-foreground">
                                {user.phone}
                            </div>
                        </div>
                    )}
                </div>

                {/* Identity Verification */}
                <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${identityStatus === "APPROVED" ? "bg-green-500/20 text-green-500" : "bg-white/5 text-muted-foreground"
                            }`}>
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold">Kimlik Doğrulama</h3>
                            <p className="text-xs text-muted-foreground">TC Kimlik ve Belge Yükleme</p>
                        </div>
                        {identityStatus === "APPROVED" && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                    </div>

                    {identityStatus === "APPROVED" ? (
                        <div className="space-y-3">
                            <div className="text-sm text-green-500 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Kimlik bilgileriniz doğrulanmıştır.
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg text-sm font-mono text-muted-foreground">
                                TC No: {user.tcIdentityNo ? `${user.tcIdentityNo.substring(0, 2)}*******${user.tcIdentityNo.substring(9)}` : "***"}
                            </div>
                        </div>
                    ) : identityStatus === "PENDING" ? (
                        <div className="text-sm text-yellow-500 flex items-center gap-2 bg-yellow-500/10 p-3 rounded-lg">
                            <Clock className="w-4 h-4" />
                            Kimlik bilgileriniz yönetici onayı bekliyor.
                        </div>
                    ) : (
                        <form onSubmit={handleIdentityUpload} className="space-y-3">
                            {identityStatus === "REJECTED" && (
                                <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
                                    Red Nedeni: {user.identityVerification?.rejectionReason}
                                </div>
                            )}

                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">TC Kimlik No</label>
                                <input
                                    type="text"
                                    value={tcNo}
                                    onChange={(e) => setTcNo(e.target.value)}
                                    placeholder="11 haneli TC No"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                    maxLength={11}
                                    disabled={loading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Ad</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Adınız"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Soyad</label>
                                    <input
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        placeholder="Soyadınız"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Doğum Yılı</label>
                                <input
                                    type="number"
                                    value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}
                                    placeholder="örn: 1990"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Kimlik Fotoğrafı</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="id-file"
                                        accept="image/*"
                                        disabled={loading}
                                    />
                                    <label
                                        htmlFor="id-file"
                                        className="w-full flex items-center justify-center gap-2 px-3 py-8 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
                                    >
                                        <Upload className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {file ? file.name : "Dosya Seç veya Sürükle"}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !tcNo || !name || !surname || !birthYear || !file}
                                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Yükleniyor...</span>
                                    </div>
                                ) : (
                                    "Gönder"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
