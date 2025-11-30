import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { SettingsContainer } from '@/components/dashboard/settings/SettingsContainer';

import fs from 'fs';

export default async function SettingsPage() {
    console.log('SettingsPage rendering...');
    const session = await getSession();

    fs.appendFileSync('debug_log.txt', `SettingsPage session: ${JSON.stringify(session)}\n`);

    if (!session?.id) {
        fs.appendFileSync('debug_log.txt', `SettingsPage: No session ID, redirecting to login\n`);
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.id },
    });

    fs.appendFileSync('debug_log.txt', `SettingsPage user found: ${!!user}\n`);

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Ayarlar</h1>
                <p className="text-gray-400">Hesap tercihlerinizi ve kişisel bilgilerinizi yönetin.</p>
            </div>

            <SettingsContainer user={user} />
        </div>
    );
}
