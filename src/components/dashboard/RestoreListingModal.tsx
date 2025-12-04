'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { ListingPackages, PackageType } from '@/components/listing/ListingPackages'

interface RestoreListingModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (packageType: string) => Promise<void>
    isRestoring: boolean
}

export default function RestoreListingModal({ isOpen, onClose, onConfirm, isRestoring }: RestoreListingModalProps) {
    const [selectedPackage, setSelectedPackage] = useState<PackageType>('standard')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            İlanı Yayına Al
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            İlanınızı tekrar yayına almak için lütfen bir paket seçiniz.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <ListingPackages
                        selectedPackage={selectedPackage}
                        onChange={setSelectedPackage}
                        isFreeEligible={false} // Restores are usually paid or standard
                    />
                </div>

                <div className="sticky bottom-0 p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isRestoring}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={() => onConfirm(selectedPackage)}
                        disabled={isRestoring}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                İşleniyor...
                            </>
                        ) : (
                            'Yayına Al ve Öde'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
