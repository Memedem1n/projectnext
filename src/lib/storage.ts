'use server'

import { supabaseAdmin } from './supabase'
import { randomUUID } from 'crypto'

/**
 * Upload listing images to Supabase Storage
 * @param files - Array of File objects to upload
 * @returns Array of public URLs for the uploaded images
 */
export async function uploadListingImages(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
        const urls: string[] = []

        for (const file of files) {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${randomUUID()}.${fileExt}`
            const filePath = `listings/${fileName}`

            // Convert File to Buffer
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Upload to Supabase Storage
            const { data, error } = await supabaseAdmin.storage
                .from('listings')
                .upload(filePath, buffer, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('Upload error:', error)
                return { success: false, error: `Failed to upload ${file.name}: ${error.message}` }
            }

            // Get public URL
            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('listings')
                .getPublicUrl(filePath)

            urls.push(publicUrl)
        }

        return { success: true, urls }
    } catch (error) {
        console.error('Upload error:', error)
        return { success: false, error: 'Unexpected error during upload' }
    }
}

/**
 * Delete listing image from Supabase Storage
 * @param url - Public URL of the image to delete
 */
export async function deleteListingImage(url: string): Promise<{ success: boolean; error?: string }> {
    try {
        // Extract file path from URL
        const urlParts = url.split('/storage/v1/object/public/listings/')
        if (urlParts.length < 2) {
            return { success: false, error: 'Invalid image URL' }
        }

        const filePath = `listings/${urlParts[1]}`

        const { error } = await supabaseAdmin.storage
            .from('listings')
            .remove([filePath])

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Delete error:', error)
        return { success: false, error: 'Unexpected error during deletion' }
    }
}
