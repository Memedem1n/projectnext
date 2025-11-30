'use client';

import { useState } from 'react';
import { VerificationCard } from './VerificationCard';
import { PhoneVerificationModal } from './PhoneVerificationModal';
import { IdentityVerificationForm } from './IdentityVerificationForm';
import { CorporateVerificationForm } from './CorporateVerificationForm';
import { Smartphone, FileText, Building2 } from 'lucide-react';

interface VerificationContainerProps {
    user: any;
}

export function VerificationContainer({ user }: VerificationContainerProps) {
    const [showPhoneModal, setShowPhoneModal] = useState(false);
    const [showIdentityModal, setShowIdentityModal] = useState(false);
    const [showCorporateModal, setShowCorporateModal] = useState(false);

    const isCorporate = user.role === 'CORPORATE' || user.role === 'DEALER';

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Phone Verification */}
                <VerificationCard
                    icon={Smartphone}
                    title="Telefon Doğrulama"
                    description="İlan verebilmek ve mesajlaşabilmek için telefon numaranızı doğrulayın."
                    status={user.phoneVerified ? 'VERIFIED' : 'NOT_STARTED'}
                    buttonText="Numaramı Doğrula"
                    onClick={() => setShowPhoneModal(true)}
                />

                {/* Identity Verification */}
                <VerificationCard
                    icon={FileText}
                    title="Kimlik Doğrulama"
                    description="TC Kimlik numaranız ve kimlik fotoğrafınız ile 'Onaylı Hesap' rozeti kazanın."
                    status={user.identityVerificationStatus as any}
                    buttonText="Kimliğimi Doğrula"
                    onClick={() => setShowIdentityModal(true)}
                />

                {/* Corporate Verification */}
                <VerificationCard
                    icon={Building2}
                    title="Kurumsal Üyelik"
                    description={isCorporate
                        ? "Vergi levhanızı ve şirket evraklarınızı yükleyerek kurumsal mağaza özelliklerinden yararlanın."
                        : "Sadece kurumsal üyeler (Galeri/Bayi) bu doğrulamayı yapabilir."
                    }
                    status={user.corporateVerificationStatus as any}
                    buttonText={isCorporate ? "Başvuru Yap" : "Sadece Kurumsal Üyeler"}
                    onClick={() => setShowCorporateModal(true)}
                    disabled={!isCorporate || user.corporateVerificationStatus === 'PENDING' || user.corporateVerificationStatus === 'VERIFIED'}
                />
            </div>

            <PhoneVerificationModal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                currentPhone={user.phone}
            />

            <IdentityVerificationForm
                isOpen={showIdentityModal}
                onClose={() => setShowIdentityModal(false)}
            />

            <CorporateVerificationForm
                isOpen={showCorporateModal}
                onClose={() => setShowCorporateModal(false)}
            />
        </>
    );
}
