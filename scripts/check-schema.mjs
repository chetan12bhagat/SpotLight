
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpyqjqdmkatxvwackkau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXFqcWRta2F0eHZ3YWNra2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjIxMDIsImV4cCI6MjA3OTQzODEwMn0.OVUiYNqKvdDTDfey2n3qkT8HM0yZ5P1P1QXjlM8o4Xg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
    console.log('Checking schema...')

    // Check posts columns
    // We can't query information_schema easily with supabase-js client unless we use rpc or just try to select specific columns.
    // I'll try to select 'content' from posts.
    const { data: posts, error: postError } = await supabase
        .from('posts')
        .select('content')
        .limit(1)

    if (postError) {
        console.error('Error selecting content from posts:', postError)
    } else {
        console.log('Successfully selected content from posts.')
    }

    // Check users columns
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('full_name')
        .limit(1)

    if (userError) {
        console.error('Error selecting full_name from users:', userError)
    } else {
        console.log('Successfully selected full_name from users.')
    }
}

checkSchema()
