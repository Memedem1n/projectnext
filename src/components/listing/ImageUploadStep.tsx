"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X, Star, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadStepProps {
    images: File[];
    onChange: (files: File[]) => void;
    maxImages?: number;
}

export function ImageUploadStep({ images, onChange, maxImages = 20 }: ImageUploadStepProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (newFiles: File[]) => {
        setError("");

        // Filter only image files
        const imageFiles = newFiles.filter(file => file.type.startsWith("image/"));

        if (imageFiles.length !== newFiles.length) {
            setError("Sadece resim dosyaları yükleyebilirsiniz.");
        }

        // Check size (max 5MB per image)
        const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError("Her resim maksimum 5MB olabilir.");
            return;
        }

        // Check total count
        const totalImages = images.length + imageFiles.length;
        if (totalImages > maxImages) {
            setError(`Maksimum ${maxImages} resim yükleyebilirsiniz.`);
            return;
        }

        onChange([...images, ...imageFiles]);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [removed] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, removed);
        onChange(newImages);
    };

    const setCoverImage = (index: number) => {
        if (index === 0) return;
        moveImage(index, 0);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Upload Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group",
                    isDragging
                        ? "border-brand-gold bg-brand-gold/10 scale-[1.02]"
                        : "border-white/20 hover:border-brand-gold/50 hover:bg-white/5"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center transition-all",
                        isDragging ? "bg-brand-gold/20" : "bg-white/10 group-hover:bg-brand-gold/10"
                    )}>
                        <Upload className={cn(
                            "w-10 h-10 transition-colors",
                            isDragging ? "text-brand-gold" : "text-muted-foreground group-hover:text-brand-gold"
                        )} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-2">
                            {isDragging ? "Bırakın..." : "Fotoğraf Yükleyin"}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Dosyaları buraya sürükleyin veya <span className="text-brand-gold font-medium">tıklayın</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Maksimum {maxImages} adet, her biri 5MB'a kadar
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-brand-gold" />
                            Yüklenen Fotoğraflar ({images.length}/{maxImages})
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            * İlk fotoğraf kapak resmi olacaktır
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className={cn(
                                    "relative group rounded-2xl overflow-hidden border-2 transition-all",
                                    index === 0
                                        ? "border-brand-gold ring-4 ring-brand-gold/20"
                                        : "border-white/10 hover:border-white/30"
                                )}
                            >
                                {/* Image Preview */}
                                <div className="aspect-square bg-black/20 relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                                            <span className="text-xs text-white font-medium truncate">
                                                {file.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cover Badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-brand-gold text-primary-foreground px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                                            <Star className="w-3 h-3 fill-current" />
                                            Kapak
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {index !== 0 && (
                                            <button
                                                onClick={() => setCoverImage(index)}
                                                className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-black flex items-center justify-center transition-colors shadow-lg"
                                                title="Kapak resmi yap"
                                            >
                                                <Star className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center transition-colors shadow-lg"
                                            title="Sil"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Image Number */}
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Card */}
            {images.length === 0 && (
                <div className="glass-card p-6 border-brand-gold/20">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-brand-gold" />
                        İpuçları
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• İlanınız için en az 3-5 fotoğraf eklemenizi öneririz</li>
                        <li>• İlk fotoğraf ilanınızın kapak resmi olacaktır</li>
                        <li>• Fotoğraflar aydınlık ve net olmalıdır</li>
                        <li>• Aracınızın tüm açılarını gösterin</li>
                        <li>• İç mekan, motor ve bagaj fotoğrafları ekleyin</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
