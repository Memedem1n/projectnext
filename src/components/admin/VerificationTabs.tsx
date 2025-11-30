'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { ShieldCheck, Building2, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { verifyUserIdentity, rejectUserIdentity, verifyCorporate, rejectCorporate } from '@/lib/actions/admin-actions';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

interface VerificationTabsProps {
    identityRequests: User[];
    corporateRequests: User[];
}

export function VerificationTabs({ identityRequests, corporateRequests }: VerificationTabsProps) {
    const [activeTab, setActiveTab] = useState<'IDENTITY' | 'CORPORATE'>('IDENTITY');

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('IDENTITY')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'IDENTITY'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Kimlik Doğrulama
                    <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs text-white">
                        {identityRequests.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('CORPORATE')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'CORPORATE'
                            ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/50'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    Kurumsal Üyelik
                    <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs text-white">
                        {corporateRequests.length}
                    </span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'IDENTITY' ? (
                    identityRequests.length === 0 ? (
                        <EmptyState message="Bekleyen kimlik doğrulama talebi yok." />
                    ) : (
                        identityRequests.map(user => (
                            <IdentityRequestCard key={user.id} user={user} />
                        ))
                    )
                ) : (
                    corporateRequests.length === 0 ? (
                        <EmptyState message="Bekleyen kurumsal üyelik talebi yok." />
                    ) : (
                        corporateRequests.map(user => (
                            <CorporateRequestCard key={user.id} user={user} />
                        ))
                    )
                )}
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-12 text-center">
            <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{message}</p>
        </div>
    );
}

function IdentityRequestCard({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);

    async function handleVerify() {
        if (!confirm('Bu kimliği onaylıyor musunuz?')) return;
        setLoading(true);
        try {
            await verifyUserIdentity(user.id);
            toast.success('Kimlik onaylandı');
        } catch (e) {
            toast.error('Hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    async function handleReject() {
        if (!confirm('Bu kimliği reddediyor musunuz?')) return;
        setLoading(true);
        try {
            await rejectUserIdentity(user.id);
            toast.success('Kimlik reddedildi');
        } catch (e) {
            toast.error('Hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="font-bold text-white text-lg">{user.name}</div>
                        <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-400">
                        <div>TC Kimlik No: <span className="text-white">{user.tcIdentityNo}</span></div>
                        <div>Telefon: <span className="text-white">{user.phone}</span></div>
                        <div>Kayıt Tarihi: <span className="text-white">{formatDate(user.createdAt)}</span></div>
                    </div>

                    {user.identityDoc && (
                        <div className="pt-4">
                            <Link href={user.identityDoc} target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                                <FileText className="w-4 h-4" />
                                Kimlik Belgesini Görüntüle
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-2">
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Onayla
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <XCircle className="w-4 h-4" />
                        Reddet
                    </button>
                </div>
            </div>
        </div>
    );
}

function CorporateRequestCard({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);

    async function handleVerify() {
        if (!confirm('Bu kurumsal üyeliği onaylıyor musunuz?')) return;
        setLoading(true);
        try {
            await verifyCorporate(user.id);
            toast.success('Kurumsal üyelik onaylandı');
        } catch (e) {
            toast.error('Hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    async function handleReject() {
        if (!confirm('Bu kurumsal üyeliği reddediyor musunuz?')) return;
        setLoading(true);
        try {
            await rejectCorporate(user.id);
            toast.success('Kurumsal üyelik reddedildi');
        } catch (e) {
            toast.error('Hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="font-bold text-white text-lg">{user.name}</div>
                        <span className="text-sm text-gray-500">{user.email}</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                            {user.role}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-400 bg-white/5 p-4 rounded-lg">
                        <div>Vergi No: <span className="text-white">{user.taxNumber}</span></div>
                        <div>Vergi Dairesi: <span className="text-white">{user.taxOffice}</span></div>
                        <div>Sicil No: <span className="text-white">{user.companyRegistryNo || '-'}</span></div>
                        <div>Telefon: <span className="text-white">{user.phone}</span></div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        {user.taxPlateDoc && (
                            <Link href={user.taxPlateDoc} target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                                <FileText className="w-4 h-4" />
                                Vergi Levhası
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        )}
                        {user.companyEstablishmentDoc && (
                            <Link href={user.companyEstablishmentDoc} target="_blank" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                                <FileText className="w-4 h-4" />
                                Kuruluş Evrakları
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Onayla
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <XCircle className="w-4 h-4" />
                        Reddet
                    </button>
                </div>
            </div>
        </div>
    );
}
