
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

const NEW_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweXFqcWRta2F0eHZ3YWNra2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzg2MjEwMiwiZXhwIjoyMDc5NDM4MTAyfQ.pgO1Eb436uI4MM08g9FBNXqQhZvswJ4YkY_mPjdaRJM';

try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const env = {};
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            env[key] = value;
        }
    });

    // Update or Add Service Role Key
    env['SUPABASE_SERVICE_ROLE_KEY'] = NEW_SERVICE_ROLE_KEY;

    // Ensure other keys exist (if we can infer them or if they were there)
    // If VITE_SUPABASE_URL was missing, we might want to add it, but we'll rely on what was read.

    const newContent = Object.entries(env)
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');

    fs.writeFileSync(envPath, newContent);
    console.log('Successfully updated .env with new Service Role Key.');

} catch (error) {
    console.error('Error updating .env:', error);
    process.exit(1);
}
