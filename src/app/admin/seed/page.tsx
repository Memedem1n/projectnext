'use client';

import { useState, useEffect } from 'react';
import { getAllCategories } from '@/lib/actions/categories';
import { createListing } from '@/lib/actions/listings';
import { getRandomLocation, getRandomEmlakData, getRandomVehicleData, generateListingTitle } from '@/lib/seeder-utils';
import { createTestUserAndLogin } from '@/lib/actions/admin-auth';

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        // Load categories on mount
        getAllCategories().then(res => {
            if (res.success && res.data) {
                setCategories(res.data);
            }
        });
    }, []);

    const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

    const handleLogin = async () => {
        addLog('Creating test user and logging in...');
        const res = await createTestUserAndLogin();
        if (res.success) {
            addLog('✅ Logged in successfully.');
        } else {
            addLog('❌ Login failed.');
        }
    };

    const startSeeding = async () => {
        setStatus('Seeding...');
        setLogs([]);
        setProgress(0);

        // Filter for leaf categories (no children)
        const leafCategories = categories.filter(c => c.children.length === 0);
        const total = leafCategories.length;

        addLog(`Found ${total} sub-categories.`);

        for (let i = 0; i < total; i++) {
            const cat = leafCategories[i];
            addLog(`Creating listing for: ${cat.name} (${cat.slug})...`);

            try {
                const location = getRandomLocation();
                let specificData = {};

                const isVasita = cat.slug.includes('otomobil') || cat.slug.includes('motosiklet') || cat.slug.includes('arazi');

                if (isVasita) {
                    specificData = getRandomVehicleData();
                } else {
                    specificData = getRandomEmlakData();
                }

                const title = generateListingTitle(cat.name, specificData);
                const price = Math.floor(Math.random() * 10000000) + 100000;

                const listingData = {
                    title,
                    description: `Bu otomatik oluşturulmuş bir test ilanıdır. ${cat.name} kategorisinde yer almaktadır. Detaylı özellikler aşağıdadır.`,
                    price,
                    categoryId: cat.id,
                    ...location,
                    ...specificData,
                    images: [
                        { url: "https://picsum.photos/800/600", order: 0 },
                        { url: "https://picsum.photos/800/600", order: 1 },
                        { url: "https://picsum.photos/800/600", order: 2 }
                    ]
                };

                const result = await createListing(listingData);

                if (result.success) {
                    addLog(`✅ Created: ${title}`);
                } else {
                    addLog(`❌ Failed: ${result.error}`);
                }

            } catch (e) {
                addLog(`❌ Error: ${e}`);
            }

            setProgress(Math.round(((i + 1) / total) * 100));
        }

        setStatus('Completed');
        addLog('Seeding finished.');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Database Seeder</h1>

            <div className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-muted-foreground">Total Categories: {categories.length}</p>
                        <p className="text-muted-foreground">Leaf Categories: {categories.filter(c => c.children.length === 0).length}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLogin}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
                        >
                            Login as Test User
                        </button>
                        <button
                            onClick={startSeeding}
                            disabled={status === 'Seeding...'}
                            className="bg-brand-gold text-black px-4 py-2 rounded font-medium disabled:opacity-50"
                        >
                            {status === 'Seeding...' ? 'Seeding...' : 'Start Seeding'}
                        </button>
                    </div>
                </div>

                {status === 'Seeding...' && (
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-4">
                        <div
                            className="bg-brand-gold h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs">
                {logs.map((log, i) => (
                    <div key={i} className="mb-1 border-b border-white/5 pb-1 last:border-0">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
