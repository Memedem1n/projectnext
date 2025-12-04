'use server'

import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

/**
 * Upload listing images to Local Storage
 * @param formData - FormData containing 'files'
 * @returns Array of public URLs for the uploaded images
 */
export async function uploadListingImages(formData: FormData): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
        const files = formData.getAll('files') as File[]
        const urls: string[] = []
        console.log(`[Upload] Starting upload for ${files.length} files`);

        const uploadDir = path.join(process.cwd(), 'public/uploads/listings')

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true })
        } catch (error) {
            // Ignore if exists
        }

        for (const file of files) {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${randomUUID()}.${fileExt}`
            const filePath = path.join(uploadDir, fileName)

            // Convert File to Buffer
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            console.log(`[Upload] Uploading ${fileName} (${file.size} bytes) to ${filePath}`);

            // Write to filesystem
            await writeFile(filePath, buffer)

            const publicUrl = `/uploads/listings/${fileName}`
            urls.push(publicUrl)

            console.log(`[Upload] Success: ${publicUrl}`);
        }

        return { success: true, urls }
    } catch (error) {
        console.error('Upload error:', error)
        return { success: false, error: 'Unexpected error during upload' }
    }
}

/**
 * Delete listing image from Local Storage
 * @param url - Public URL of the image to delete
 */
export async function deleteListingImage(url: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Extract filename from URL
        // URL format: /uploads/listings/filename.ext
        const fileName = url.split('/uploads/listings/').pop()

        if (!fileName || url === fileName) {
            // Handle cases where URL might be external or invalid
            if (url.startsWith('http')) return { success: true } // Skip external URLs
            return { success: false, error: 'Invalid image URL' }
        }

        const filePath = path.join(process.cwd(), 'public/uploads/listings', fileName)

        try {
            await unlink(filePath)
            return { success: true }
        } catch (error) {
            console.error('Delete error:', error)
            // If file doesn't exist, consider it success
            return { success: true }
        }
    } catch (error) {
        console.error('Delete error:', error)
        return { success: false, error: 'Unexpected error during deletion' }
    }
}
