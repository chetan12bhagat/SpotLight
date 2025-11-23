
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qpyqjqdmkatxvwackkau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXFqcWRta2F0eHZ3YWNra2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NjIxMDIsImV4cCI6MjA3OTQzODEwMn0.OVUiYNqKvdDTDfey2n3qkT8HM0yZ5P1P1QXjlM8o4Xg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCaption() {
    console.log('Checking for caption column...')

    const { data, error } = await supabase
        .from('posts')
        .select('caption')
        .limit(1)

    if (error) {
        console.error('Error selecting caption:', error)
    } else {
        console.log('Successfully selected caption.')
    }
}

checkCaption()
