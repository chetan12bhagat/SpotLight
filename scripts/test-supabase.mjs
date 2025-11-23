import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpyqjqdmkatxvwackkau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXFqcWRta2F0eHZ3YWNra2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjIxMDIsImV4cCI6MjA3OTQzODEwMn0.OVUiYNqKvdDTDfey2n3qkT8HM0yZ5P1P1QXjlM8o4Xg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    console.log('Testing connection...')

    // Try to sign up a new user
    const email = `test-${Date.now()}@example.com`
    const password = 'password123'

    console.log(`Attempting to sign up ${email}...`)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Test User'
            }
        }
    })

    if (error) {
        console.error('Signup error:', error)
    } else {
        console.log('Signup successful!', data.user?.email)

        // Check if profile was created (might take a moment for trigger)
        console.log('Checking public.users table...')
        // Wait a bit
        await new Promise(r => setTimeout(r, 2000))

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', data.user.id)
            .single()

        if (userError) {
            console.error('Error fetching user profile:', userError)
        } else {
            console.log('User profile found:', userData)
        }
    }
}

test()
