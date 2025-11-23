
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env')

console.log('Reading .env from:', envPath)
let env = {}

try {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
        const parts = line.split('=')
        if (parts.length >= 2) {
            const key = parts[0].trim()
            const value = parts.slice(1).join('=').trim() // Handle values with =
            env[key] = value
        }
    })
} catch (e) {
    console.error('Error reading .env:', e)
    process.exit(1)
}

const supabaseUrl = env.VITE_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase environment variables.')
    console.log('Available keys:', Object.keys(env))
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createTestUser() {
    const email = 'verified_tester@example.com'
    const password = 'password123'

    console.log(`Creating user ${email}...`)

    // Check if user exists first to avoid error
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    const existingUser = listData.users.find(u => u.email === email)
    if (existingUser) {
        console.log('User already exists:', existingUser.id)
        return
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'Verified Tester',
            username: 'verified_tester'
        }
    })

    if (error) {
        console.error('Error creating user:', error)
    } else {
        console.log('User created successfully:', data.user.id)
    }
}

createTestUser()
