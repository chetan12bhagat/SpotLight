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

async function addFullNameColumn() {
    console.log('Adding full_name column to users table...')

    const { data, error } = await supabase.rpc('exec_sql', {
        sql: `
            ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name text;
            
            -- Update trigger to populate full_name
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS trigger AS $$
            BEGIN
              INSERT INTO public.users (auth_id, email, username, full_name)
              VALUES (
                NEW.id, 
                NEW.email, 
                NEW.raw_user_meta_data->>'username',
                NEW.raw_user_meta_data->>'full_name'
              );
              RETURN NEW;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
    })

    if (error) {
        console.error('Migration failed:', error)
        console.log('\nPlease run this SQL manually in Supabase SQL Editor:')
        console.log('------------------------------------------------------')
        console.log('ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name text;')
        console.log('')
        console.log('CREATE OR REPLACE FUNCTION public.handle_new_user()')
        console.log('RETURNS trigger AS $$')
        console.log('BEGIN')
        console.log('  INSERT INTO public.users (auth_id, email, username, full_name)')
        console.log('  VALUES (')
        console.log('    NEW.id,')
        console.log('    NEW.email,')
        console.log("    NEW.raw_user_meta_data->>'username',")
        console.log("    NEW.raw_user_meta_data->>'full_name'")
        console.log('  );')
        console.log('  RETURN NEW;')
        console.log('END;')
        console.log('$$ LANGUAGE plpgsql SECURITY DEFINER;')
        console.log('------------------------------------------------------')
    } else {
        console.log('✓ Migration completed successfully!')
    }
}

addFullNameColumn()
