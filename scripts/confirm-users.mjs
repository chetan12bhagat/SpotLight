
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
            const value = parts.slice(1).join('=').trim()
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
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function confirmUsers() {
    console.log('Listing users...')
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    console.log(`Found ${listData.users.length} users.`)

    const targetEmails = ['finaltest@example.com', 'debug_test@example.com', 'test@example.com']

    for (const user of listData.users) {
        console.log(`User: ${user.email}, Confirmed: ${user.email_confirmed_at}`)

        if (targetEmails.includes(user.email) && !user.email_confirmed_at) {
            console.log(`Confirming user ${user.email} (${user.id})...`)
            const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
                email_confirm: true
            })

            if (error) {
                console.error('Error confirming user:', error)
            } else {
                console.log('User confirmed successfully.')
            }
        }
    }
}

confirmUsers()
