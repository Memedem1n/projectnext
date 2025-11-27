import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env manually
const envFiles = ['.env', '.env.local', '.env.development']
console.log('CWD:', process.cwd())

envFiles.forEach(file => {
    const envPath = path.resolve(process.cwd(), file)
    if (fs.existsSync(envPath)) {
        console.log('Loading env from:', file)
        const envConfig = fs.readFileSync(envPath, 'utf8')
        envConfig.split('\n').forEach(line => {
            const parts = line.split('=')
            if (parts.length >= 2) {
                const key = parts[0].trim()
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '')
                if (key && !key.startsWith('#')) {
                    process.env[key] = value
                }
            }
        })
    }
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or keys')
    process.exit(1)
}

console.log('Testing connection to:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    try {
        console.log('--- Database Test ---')
        // Test 1: Simple Select
        const { count, error } = await supabase.from('listings').select('*', { count: 'exact', head: true })

        if (error) {
            console.error('Database Error:', error.message)
            console.error('Details:', error)
        } else {
            console.log('Database Connection: OK')
            console.log('Listings Count:', count)
        }

        console.log('\n--- Storage Test ---')
        // Test 2: Storage List
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
        if (bucketError) {
            console.error('Storage Error:', bucketError.message)
            console.error('Details:', bucketError)
        } else {
            console.log('Storage Connection: OK')
            console.log('Buckets:', buckets?.map(b => b.name))
        }

    } catch (e: any) {
        console.error('Exception:', e.message || e)
        if (e.cause) console.error('Cause:', e.cause)
    }
}

test()
