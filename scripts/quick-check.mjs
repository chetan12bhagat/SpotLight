
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
    process.exit(1)
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function quickCheck() {
    console.log('QUICK ERROR CHECK')
    console.log('=================\n')

    const errors = []
    const warnings = []

    // 1. Test database connection
    try {
        const { error } = await supabase.from('users').select('id').limit(1)
        if (error && error.code !== 'PGRST116') {
            errors.push(`Database connection: ${error.message}`)
        } else {
            console.log('✓ Database connection OK')
        }
    } catch (e) {
        errors.push(`Database connection: ${e.message}`)
    }

    // 2. Check critical columns
    try {
        const { error: captionError } = await supabase.from('posts').select('caption').limit(1)
        if (captionError) {
            errors.push(`posts.caption missing: ${captionError.message}`)
        } else {
            console.log('✓ posts.caption exists')
        }
    } catch (e) {
        errors.push(`posts.caption check: ${e.message}`)
    }

    try {
        const { error: fullNameError } = await supabase.from('users').select('full_name').limit(1)
        if (fullNameError) {
            errors.push(`users.full_name missing: ${fullNameError.message}`)
        } else {
            console.log('✓ users.full_name exists')
        }
    } catch (e) {
        errors.push(`users.full_name check: ${e.message}`)
    }

    // 3. Check user creation trigger
    const { data: { users } } = await supabase.auth.admin.listUsers()
    if (users.length > 0) {
        const testUser = users[0]
        const { data: publicUser } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', testUser.id)
            .maybeSingle()

        if (!publicUser) {
            warnings.push(`User ${testUser.email} not in public.users (trigger issue?)`)
        } else {
            console.log('✓ User trigger working')
        }
    }

    console.log('\n=================')
    console.log(`Errors: ${errors.length}`)
    console.log(`Warnings: ${warnings.length}`)

    if (errors.length > 0) {
        console.log('\nERRORS:')
        errors.forEach(e => console.log(`  ✗ ${e}`))
    }

    if (warnings.length > 0) {
        console.log('\nWARNINGS:')
        warnings.forEach(w => console.log(`  ! ${w}`))
    }

    if (errors.length === 0 && warnings.length === 0) {
        console.log('\n✓ ALL CHECKS PASSED!')
    }
}

quickCheck()
