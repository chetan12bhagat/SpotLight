
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpyqjqdmkatxvwackkau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXFqcWRta2F0eHZ3YWNra2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjIxMDIsImV4cCI6MjA3OTQzODEwMn0.OVUiYNqKvdDTDfey2n3qkT8HM0yZ5P1P1QXjlM8o4Xg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyData() {
    console.log('Verifying backend data...')

    // 1. Check for the post (using caption)
    const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('*')
        .ilike('caption', '%Test post content%')

    if (postError) {
        console.error('Error fetching posts:', postError)
    } else {
        console.log(`Found ${posts.length} posts matching "Test post content":`)
        posts.forEach(p => console.log(`- Post ID: ${p.id}, Caption: ${p.caption}`))
    }

    // 2. Check for users (just list them to ensure table access)
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(5)

    if (userError) {
        console.error('Error fetching users:', userError)
    } else {
        console.log(`Found ${users.length} users:`)
        users.forEach(u => console.log(`- User ID: ${u.id}, Username: ${u.username}`))
    }
}

verifyData()
