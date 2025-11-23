
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

async function comprehensiveCheck() {
    console.log('========================================')
    console.log('COMPREHENSIVE PROJECT ERROR CHECK')
    console.log('========================================\n')

    let errorCount = 0
    let warningCount = 0

    // 1. Environment Variables
    console.log('1. ENVIRONMENT VARIABLES CHECK')
    console.log('------------------------------')
    const requiredEnvVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
    ]

    requiredEnvVars.forEach(varName => {
        if (env[varName]) {
            console.log(`   ✓ ${varName}: Present`)
        } else {
            console.log(`   ✗ ${varName}: MISSING`)
            errorCount++
        }
    })
    console.log()

    // 2. Database Connection
    console.log('2. DATABASE CONNECTION CHECK')
    console.log('----------------------------')
    try {
        const { data, error } = await supabase.from('users').select('count').single()
        if (error && error.code !== 'PGRST116') {
            console.log(`   ✗ Database connection: ${error.message}`)
            errorCount++
        } else {
            console.log('   ✓ Database connection: OK')
        }
    } catch (e) {
        console.log(`   ✗ Database connection: ${e.message}`)
        errorCount++
    }
    console.log()

    // 3. Tables Check
    console.log('3. DATABASE TABLES CHECK')
    console.log('------------------------')
    const requiredTables = [
        'users', 'creators', 'posts', 'subscriptions',
        'messages', 'stories', 'notifications', 'moderation_logs'
    ]

    for (const table of requiredTables) {
        try {
            const { error } = await supabase.from(table).select('id').limit(1)
            if (error) {
                console.log(`   ✗ Table '${table}': ${error.message}`)
                errorCount++
            } else {
                console.log(`   ✓ Table '${table}': Exists`)
            }
        } catch (e) {
            console.log(`   ✗ Table '${table}': ${e.message}`)
            errorCount++
        }
    }
    console.log()

    // 4. Critical Columns Check
    console.log('4. CRITICAL COLUMNS CHECK')
    console.log('-------------------------')
    try {
        // Check posts.caption
        const { error: captionError } = await supabase
            .from('posts')
            .select('caption')
            .limit(1)

        if (captionError) {
            console.log(`   ✗ posts.caption: ${captionError.message}`)
            errorCount++
        } else {
            console.log('   ✓ posts.caption: Exists')
        }

        // Check users.full_name
        const { error: fullNameError } = await supabase
            .from('users')
            .select('full_name')
            .limit(1)

        if (fullNameError) {
            console.log(`   ✗ users.full_name: ${fullNameError.message}`)
            errorCount++
        } else {
            console.log('   ✓ users.full_name: Exists')
        }

        // Check creators.user_id
        const { error: userIdError } = await supabase
            .from('creators')
            .select('user_id')
            .limit(1)

        if (userIdError) {
            console.log(`   ✗ creators.user_id: ${userIdError.message}`)
            errorCount++
        } else {
            console.log('   ✓ creators.user_id: Exists')
        }
    } catch (e) {
        console.log(`   ✗ Column check failed: ${e.message}`)
        errorCount++
    }
    console.log()

    // 5. RLS Policies Check
    console.log('5. RLS POLICIES CHECK')
    console.log('---------------------')
    try {
        // Try to query as anonymous
        const anonClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

        const { data: posts, error: postsError } = await anonClient
            .from('posts')
            .select('*')
            .limit(1)

        if (postsError && postsError.code !== 'PGRST116') {
            console.log(`   ! Warning: Posts RLS may block anonymous: ${postsError.message}`)
            warningCount++
        } else {
            console.log('   ✓ Posts RLS: Configured')
        }
    } catch (e) {
        console.log(`   ! Warning: RLS check failed: ${e.message}`)
        warningCount++
    }
    console.log()

    // 6. Storage Buckets
    console.log('6. STORAGE BUCKETS CHECK')
    console.log('------------------------')
    const requiredBuckets = ['creator-content', 'stories-content', 'messages-media']

    try {
        const { data: buckets, error } = await supabase.storage.listBuckets()
        if (error) {
            console.log(`   ✗ Bucket list failed: ${error.message}`)
            errorCount++
        } else {
            requiredBuckets.forEach(bucketName => {
                if (buckets.find(b => b.name === bucketName)) {
                    console.log(`   ✓ Bucket '${bucketName}': Exists`)
                } else {
                    console.log(`   ✗ Bucket '${bucketName}': MISSING`)
                    errorCount++
                }
            })
        }
    } catch (e) {
        console.log(`   ✗ Bucket check failed: ${e.message}`)
        errorCount++
    }
    console.log()

    // 7. User Trigger Check
    console.log('7. USER CREATION TRIGGER CHECK')
    console.log('------------------------------')
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) {
        console.log(`   ✗ Cannot list users: ${listError.message}`)
        errorCount++
    } else if (users.length > 0) {
        const testUser = users[0]
        const { data: publicUser, error: publicError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', testUser.id)
            .maybeSingle()

        if (publicError) {
            console.log(`   ✗ Trigger check failed: ${publicError.message}`)
            errorCount++
        } else if (!publicUser) {
            console.log(`   ! Warning: User ${testUser.email} not in public.users table`)
            warningCount++
        } else {
            console.log('   ✓ User creation trigger: Working')
        }
    } else {
        console.log('   ! No users to test trigger')
        warningCount++
    }
    console.log()

    // Summary
    console.log('========================================')
    console.log('SUMMARY')
    console.log('========================================')
    console.log(`Errors: ${errorCount}`)
    console.log(`Warnings: ${warningCount}`)

    if (errorCount === 0 && warningCount === 0) {
        console.log('\n✓ ALL CHECKS PASSED! Your project is ready.')
    } else if (errorCount === 0) {
        console.log('\n✓ No critical errors, but some warnings to review.')
    } else {
        console.log('\n✗ Critical errors detected. Please fix them.')
    }
    console.log('========================================\n')
}

comprehensiveCheck()
