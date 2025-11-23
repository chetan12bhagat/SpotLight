#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env')

// Load environment variables
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

console.log('╔════════════════════════════════════════════════════════════════╗')
console.log('║           SPOTLIGHT - FINAL ERROR CHECK REPORT                 ║')
console.log('╚════════════════════════════════════════════════════════════════╝\n')

let totalErrors = 0
let totalWarnings = 0
const errors = []
const warnings = []

// Test 1: Environment Variables
console.log('📋 ENVIRONMENT VARIABLES')
console.log('─────────────────────────')
const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
requiredVars.forEach(v => {
    if (env[v]) {
        console.log(`   ✅ ${v}`)
    } else {
        console.log(`   ❌ ${v} - MISSING`)
        errors.push(`Missing environment variable: ${v}`)
        totalErrors++
    }
})

// Test 2: Database Connection
console.log('\n🗄️  DATABASE CONNECTION')
console.log('─────────────────────────')
try {
    const { error } = await supabase.from('users').select('id').limit(1)
    if (error && error.code !== 'PGRST116') {
        console.log(`   ❌ Connection failed: ${error.message}`)
        errors.push(`Database connection: ${error.message}`)
        totalErrors++
    } else {
        console.log('   ✅ Connected successfully')
    }
} catch (e) {
    console.log(`   ❌ Connection failed: ${e.message}`)
    errors.push(`Database connection: ${e.message}`)
    totalErrors++
}

// Test 3: Critical Tables
console.log('\n📊 DATABASE TABLES')
console.log('─────────────────────────')
const tables = ['users', 'creators', 'posts', 'subscriptions', 'messages', 'notifications']
for (const table of tables) {
    try {
        const { error } = await supabase.from(table).select('id').limit(1)
        if (error) {
            console.log(`   ❌ ${table} - ${error.message}`)
            errors.push(`Table ${table}: ${error.message}`)
            totalErrors++
        } else {
            console.log(`   ✅ ${table}`)
        }
    } catch (e) {
        console.log(`   ❌ ${table} - ${e.message}`)
        errors.push(`Table ${table}: ${e.message}`)
        totalErrors++
    }
}

// Test 4: Critical Columns
console.log('\n🔍 CRITICAL COLUMNS')
console.log('─────────────────────────')
const columnTests = [
    { table: 'posts', column: 'caption' },
    { table: 'users', column: 'full_name' },
    { table: 'users', column: 'auth_id' },
    { table: 'creators', column: 'user_id' },
]

for (const test of columnTests) {
    try {
        const { error } = await supabase.from(test.table).select(test.column).limit(1)
        if (error) {
            console.log(`   ❌ ${test.table}.${test.column} - ${error.message}`)
            errors.push(`Column ${test.table}.${test.column}: ${error.message}`)
            totalErrors++
        } else {
            console.log(`   ✅ ${test.table}.${test.column}`)
        }
    } catch (e) {
        console.log(`   ❌ ${test.table}.${test.column} - ${e.message}`)
        errors.push(`Column ${test.table}.${test.column}: ${e.message}`)
        totalErrors++
    }
}

// Test 5: Auth Users
console.log('\n👥 AUTH USERS')
console.log('─────────────────────────')
try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) {
        console.log(`   ❌ Cannot list users: ${error.message}`)
        errors.push(`List users: ${error.message}`)
        totalErrors++
    } else {
        console.log(`   ✅ Found ${users.length} auth users`)

        if (users.length > 0) {
            const testUser = users[0]
            const { data: publicUser } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', testUser.id)
                .maybeSingle()

            if (!publicUser) {
                console.log(`   ⚠️  User ${testUser.email} not synced to public.users`)
                warnings.push(`User ${testUser.email} not in public.users table`)
                totalWarnings++
            } else {
                console.log(`   ✅ User trigger working correctly`)
            }
        }
    }
} catch (e) {
    console.log(`   ❌ ${e.message}`)
    errors.push(`Auth users check: ${e.message}`)
    totalErrors++
}

// Summary
console.log('\n╔════════════════════════════════════════════════════════════════╗')
console.log('║                         SUMMARY                                ║')
console.log('╚════════════════════════════════════════════════════════════════╝\n')
console.log(`   ❌ Errors: ${totalErrors}`)
console.log(`   ⚠️  Warnings: ${totalWarnings}`)

if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n🎉 ALL CHECKS PASSED! Your project is ready to go!')
} else {
    if (errors.length > 0) {
        console.log('\n❌ ERRORS FOUND:')
        errors.forEach(e => console.log(`   • ${e}`))
    }
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:')
        warnings.forEach(w => console.log(`   • ${w}`))
    }
}

console.log('\n')
process.exit(totalErrors > 0 ? 1 : 0)
