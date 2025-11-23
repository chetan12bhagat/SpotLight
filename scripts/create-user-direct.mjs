
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env')

// Read existing .env to get URL
let env = {}
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

const supabaseUrl = env.VITE_SUPABASE_URL
// HARDCODED KEY FROM DASHBOARD
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXFqcWRta2F0eHZ3YWNra2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg2MjEwMiwiZXhwIjoyMDc5NDM4MTAyfQ.pgO1Eb436uI4MM08g9FBNXqQhZvswJ4YkY_mPjdaRJM'

if (!supabaseUrl) {
    console.error('Missing Supabase URL.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createTestUser() {
    const email = 'component_tester@example.com'
    const password = 'password123'

    console.log(`Creating user ${email}...`)

    // Check if user exists
    const { data: listData } = await supabase.auth.admin.listUsers()
    const existing = listData.users.find(u => u.email === email)

    if (existing) {
        console.log('User already exists:', existing.id)
        // Confirm email just in case
        if (!existing.email_confirmed_at) {
            await supabase.auth.admin.updateUserById(existing.id, { email_confirm: true })
            console.log('Confirmed email for existing user.')
        }
        return
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Component Tester' }
    })

    if (error) {
        console.error('Error creating user:', error)
    } else {
        console.log('User created successfully:', data.user.id)
    }
}

createTestUser()
