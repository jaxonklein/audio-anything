const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

// Extract project ref from URL (rgyksenggjxamrfddvlm from https://rgyksenggjxamrfddvlm.supabase.co)
const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
const connectionString = `postgresql://postgres:${supabasePassword || '[pooler]'}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function applySchema() {
  const schemaPath = path.join(__dirname, '../supabase/migrations/20260215000000_initial_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  console.log('Applying database schema...');
  console.log(`Schema length: ${schema.length} characters`);
  console.log(`Project ref: ${projectRef}`);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Execute the schema SQL
    const result = await client.query(schema);

    console.log('✅ Schema applied successfully!');
    console.log('Result:', result);
  } catch (err) {
    console.error('❌ Error applying schema:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applySchema();
