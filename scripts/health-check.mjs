
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env')

const env = {}
try {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
        const parts = line.split('=')
        if (parts.length >= 2) {
            const key = parts[0].trim()
            const value = parts.slice(1).join('=').trim()
            env[key] = value
        }
    })
} catch (e) {
    console.error('Error reading .env:', e)
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkHealth() {
    console.log('--- Health Check ---')

    // 1. Check Users
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) {
        console.error('FAIL: Could not list users.', usersError.message)
    } else {
        console.log(`PASS: Found ${users.length} users in Auth.`)
    }

    // 2. Check Public Users Table
    const { count: publicUsersCount, error: publicUsersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    if (publicUsersError) {
        console.error('FAIL: Could not query public.users.', publicUsersError.message)
    } else {
        console.log(`PASS: Found ${publicUsersCount} users in public.users.`)
    }

    // 3. Check Creators
    const { count: creatorsCount, error: creatorsError } = await supabase
        .from('creators')
        .select('*', { count: 'exact', head: true })

    if (creatorsError) {
        console.error('FAIL: Could not query creators.', creatorsError.message)
    } else {
        console.log(`PASS: Found ${creatorsCount} creators.`)
    }

    // 4. Check Specific User
    const testUserEmail = 'component_tester@example.com'
    const testUser = users?.find(u => u.email === testUserEmail)
    if (testUser) {
        console.log(`PASS: Test user ${testUserEmail} exists (ID: ${testUser.id}).`)

        // Check if they have a creator profile
        const { data: creatorProfile } = await supabase
            .from('creators')
            .select('*')
            .eq('id', testUser.id) // Assuming id matches auth_id based on schema
            .single()

        if (creatorProfile) {
            console.log(`PASS: Test user has creator profile.`)
        } else {
            console.warn(`WARN: Test user does NOT have a creator profile.`)
        }
    } else {
        console.warn(`WARN: Test user ${testUserEmail} not found.`)
    }

    console.log('--- End Health Check ---')
}

checkHealth()
